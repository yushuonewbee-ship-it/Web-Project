import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Map as MapIcon, Layers, Filter, Info, Search, X, ChevronRight, BarChart3, Palette } from 'lucide-react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Feature, Geometry, Position } from 'geojson';
import proj4 from 'proj4';
import { getFieldLabel } from '../config/fieldLabels';
import { apiBase } from '../lib/apiBase';

// 修复 Leaflet 默认图标问题
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// 定义投影：Xian_1980_GK_Zone_19 (你的 shp 文件使用的投影)
const XIAN_1980_GK_ZONE_19 = '+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=krass +units=m +no_defs';
const WGS84 = '+proj=longlat +datum=WGS84 +no_defs';

// 颜色渐变配置：8 个色阶，相邻色阶色彩敏感度大、易区分
const COLOR_SCALES = {
  red: ['#fff5f0', '#fec4b0', '#fc8d59', '#ef4a2a', '#d73027', '#b31b1b', '#8b0000', '#4d0000'],
  blue: ['#f0f9ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#0c4a6e'],
  green: ['#f0fdf4', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'],
  purple: ['#faf5ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7c3aed', '#5b21b6'],
  orange: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#9a3412'],
};

type ColorScaleName = keyof typeof COLOR_SCALES;

// 坐标转换函数：从 Xian_1980_GK_Zone_19 转换到 WGS84
function transformCoordinate(coord: number[]): number[] {
  try {
    const [x, y] = coord;
    if (Math.abs(x) > 180 || Math.abs(y) > 90) {
      const [lng, lat] = proj4(XIAN_1980_GK_ZONE_19, WGS84, [x, y]);
      return [lng, lat];
    }
    return coord;
  } catch (e) {
    console.error('坐标转换失败:', e, coord);
    return coord;
  }
}

// 转换整个 GeoJSON 的坐标
function transformGeoJSON(geojson: FeatureCollection): FeatureCollection {
  const transformedFeatures = geojson.features.map((feature: Feature) => {
    const geometry = feature.geometry as Geometry;
    let transformedGeometry: Geometry;

    if (geometry.type === 'Polygon') {
      transformedGeometry = {
        ...geometry,
        coordinates: geometry.coordinates.map((ring: Position[]) =>
          ring.map((coord: Position) => transformCoordinate(coord as number[]) as Position)
        ),
      };
    } else if (geometry.type === 'MultiPolygon') {
      transformedGeometry = {
        ...geometry,
        coordinates: geometry.coordinates.map((polygon: Position[][]) =>
          polygon.map((ring: Position[]) =>
            ring.map((coord: Position) => transformCoordinate(coord as number[]) as Position)
          )
        ),
      };
    } else if (geometry.type === 'Point') {
      transformedGeometry = {
        ...geometry,
        coordinates: transformCoordinate(geometry.coordinates as number[]) as Position,
      };
    } else if (geometry.type === 'LineString') {
      transformedGeometry = {
        ...geometry,
        coordinates: (geometry.coordinates as Position[]).map((coord: Position) =>
          transformCoordinate(coord as number[]) as Position
        ),
      };
    } else {
      transformedGeometry = geometry;
    }

    return {
      ...feature,
      geometry: transformedGeometry,
    };
  });

  return {
    ...geojson,
    features: transformedFeatures as Feature[],
  };
}

// 根据分位数断点获取颜色（quantile 分段，确保每个色阶区间内数据量大致均匀）
function getColorForValue(
  value: number | null | undefined,
  breaks: number[],
  colorScale: string[]
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '#cccccc';
  }
  for (let i = 0; i < breaks.length - 1; i++) {
    if (value <= breaks[i + 1]) return colorScale[Math.min(i, colorScale.length - 1)];
  }
  return colorScale[colorScale.length - 1];
}

// 计算分位数断点：将排序后的数据均分为 n 段
function computeQuantileBreaks(values: number[], n: number): number[] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const breaks: number[] = [sorted[0]];
  for (let i = 1; i <= n; i++) {
    const idx = Math.min(Math.floor((i / n) * sorted.length), sorted.length - 1);
    breaks.push(sorted[idx]);
  }
  return breaks;
}

export default function GIS() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  
  // 数据可视化相关状态
  const [numericFields, setNumericFields] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState<string>('');
  const [colorScaleName, setColorScaleName] = useState<ColorScaleName>('red');
  const [mergeStats, setMergeStats] = useState<{ matched: number; total: number } | null>(null);

  // 获取可用的数值字段
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(`${apiBase}/api/gis/fields`);
        if (response.ok) {
          const data = await response.json();
          setNumericFields(data.numericFields || []);
          console.log('API返回的数值字段:', data.numericFields);
          console.log('所有字段:', data.allFields);
          // 检查 Solow residual 相关字段
          const solowFields = (data.allFields || []).filter((f: string) => 
            f.toLowerCase().includes('solow') || f.toLowerCase().includes('residual')
          );
          if (solowFields.length > 0) {
            console.log('找到 Solow residual 相关字段:', solowFields);
          }
        }
      } catch (err) {
        console.error('获取字段列表失败:', err);
      }
    };
    fetchFields();
  }, []);

  // 从后端加载 merge 后的数据
  useEffect(() => {
    const fetchMergedData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('开始加载 merge 后的 GIS 数据...');
        const response = await fetch(`${apiBase}/api/gis/merged`);
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('收到非 JSON 响应:', text.substring(0, 200));
          throw new Error('服务器返回了非 JSON 格式的响应。请确保后端服务器正在运行。');
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: '未知错误' }));
          throw new Error(errorData.message || '加载地图数据失败');
        }
        
        const data = await response.json();
        if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          console.log('开始转换投影坐标...');
          const transformedData = transformGeoJSON(data);
          console.log('投影转换完成，要素数量:', transformedData.features.length);
          setGeoJsonData(transformedData);

          // 从合并数据中收集所有 db_ 字段
          const dbKeys = new Set<string>();
          transformedData.features.forEach((f: Feature) => {
            const props = (f.properties as Record<string, unknown>) || {};
            Object.keys(props).forEach((k) => {
              if (k.startsWith('db_')) dbKeys.add(k.slice(3));
            });
          });
          
          // 合并 API 返回的数值字段和从数据中发现的字段（确保完整性）
          const allFields = Array.from(dbKeys).sort((a, b) => a.localeCompare(b));
          
          // 如果 API 返回了 numericFields，优先使用；否则使用从数据推导的
          // 同时保留从数据中发现的字段，避免遗漏
          setNumericFields(prev => {
            const combined = new Set([...prev, ...allFields]);
            return Array.from(combined).sort((a, b) => a.localeCompare(b));
          });
          
          // 保存 merge 统计信息
          if (data._meta) {
            setMergeStats({
              matched: data._meta.matchedFeatures,
              total: data._meta.totalFeatures,
            });
          }
        } else {
          throw new Error('返回的数据格式不正确');
        }
      } catch (err) {
        console.error('Error loading merged data:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : '加载地图数据失败。请确保后端服务器正在运行（npm run server）';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMergedData();
    setIsVisible(true);
  }, []);

  // 根据当前字段的数据分布计算分位数断点
  const quantileBreaks = useMemo(() => {
    if (!geoJsonData || !selectedField) return [] as number[];

    const values: number[] = [];
    geoJsonData.features.forEach((feature: Feature) => {
      const props = feature.properties as Record<string, unknown>;
      const value = props?.[`db_${selectedField}`];
      if (value !== null && value !== undefined && !isNaN(Number(value))) {
        values.push(Number(value));
      }
    });

    const colorScale = COLOR_SCALES[colorScaleName];
    return computeQuantileBreaks(values, colorScale.length);
  }, [geoJsonData, selectedField, colorScaleName]);

  const minValue = quantileBreaks.length > 0 ? quantileBreaks[0] : 0;
  const maxValue = quantileBreaks.length > 0 ? quantileBreaks[quantileBreaks.length - 1] : 100;

  // GeoJSON 样式函数（支持颜色渐变）
  const getGeoJsonStyle = useCallback((feature: Feature) => {
    const isSelected = selectedFeature?.properties === feature.properties;
    const props = feature.properties as Record<string, any>;
    
    let fillColor = '#c9a86c'; // 默认颜色
    
    if (selectedField && quantileBreaks.length > 0) {
      const value = props?.[`db_${selectedField}`];
      const colorScale = COLOR_SCALES[colorScaleName];
      fillColor = getColorForValue(
        value !== undefined ? Number(value) : null,
        quantileBreaks,
        colorScale
      );
    }

    return {
      fillColor: isSelected ? '#8c1f1f' : fillColor,
      fillOpacity: 0.7,
      color: isSelected ? '#8c1f1f' : '#333',
      weight: isSelected ? 3 : 1,
      opacity: 0.8,
    };
  }, [selectedFeature, selectedField, quantileBreaks, colorScaleName]);

  // GeoJSON 事件处理
  const onEachFeature = useCallback((feature: Feature, layer: L.Layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.9,
          weight: 2,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(getGeoJsonStyle(feature));
      },
      click: () => {
        setSelectedFeature(feature);
      },
    });

    // 添加弹出窗口
    if (feature.properties) {
      const props = feature.properties as Record<string, any>;
      const name = props.NAME || props.name || props.NAME_CH || '未知地区';
      let popupContent = `<strong>${name}</strong>`;
      
      // 如果选择了字段，显示该字段的值
      if (selectedField) {
        const value = props[`db_${selectedField}`];
        if (value !== undefined && value !== null) {
          popupContent += `<br/>${getFieldLabel(selectedField)}: ${value}`;
        }
      }
      
      layer.bindPopup(popupContent, { 
        autoPan: false,  // 禁用自动平移
        closeButton: true 
      });
    }
  }, [getGeoJsonStyle, selectedField]);

  // 计算地图边界
  const bounds = useMemo((): L.LatLngBoundsExpression => {
    if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
      return [[20, 100], [50, 130]];
    }

    let minLat = Number.POSITIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;
    let minLng = Number.POSITIVE_INFINITY;
    let maxLng = Number.NEGATIVE_INFINITY;

    geoJsonData.features.forEach((feature: Feature) => {
      const processCoord = (coord: Position) => {
        const [lng, lat] = coord;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      };

      const geom = feature.geometry;
      if (geom.type === 'Polygon') {
        geom.coordinates[0].forEach((coord: Position) => processCoord(coord));
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((polygon: Position[][]) => {
          polygon[0].forEach((coord: Position) => processCoord(coord));
        });
      }
    });

    if (minLat === Number.POSITIVE_INFINITY) {
      return [[20, 100], [50, 130]];
    }

    return [[minLat, minLng], [maxLat, maxLng]];
  }, [geoJsonData]);

  // 地图边界调整组件 - 只在初始加载时执行一次
  function MapBounds({ mapBounds }: { mapBounds: L.LatLngBoundsExpression }) {
    const map = useMap();
    const hasFitted = useRef(false);
    
    useEffect(() => {
      if (mapBounds && map && !hasFitted.current) {
        try {
          map.fitBounds(mapBounds, { padding: [20, 20] });
          hasFitted.current = true;
        } catch (err) {
          console.error('调整地图边界失败:', err);
        }
      }
    }, [map, mapBounds]);
    return null;
  }

  // 过滤功能
  const filteredFeatures = geoJsonData?.features.filter((feature: Feature) => {
    if (!searchQuery) return true;
    const props = feature.properties as Record<string, unknown> | null;
    if (!props) return false;
    const searchableText = Object.values(props)
      .map((v) => String(v))
      .join(' ')
      .toLowerCase();
    return searchableText.includes(searchQuery.toLowerCase());
  });

  // 生成图例（基于分位数断点）
  const legendItems = useMemo(() => {
    if (!selectedField || quantileBreaks.length < 2) return [];

    const colorScale = COLOR_SCALES[colorScaleName];
    const items: { color: string; label: string }[] = [];
    for (let i = 0; i < quantileBreaks.length - 1 && i < colorScale.length; i++) {
      items.push({
        color: colorScale[i],
        label: `${quantileBreaks[i].toFixed(2)} - ${quantileBreaks[i + 1].toFixed(2)}`,
      });
    }
    return items;
  }, [selectedField, quantileBreaks, colorScaleName]);

  return (
    <main className="min-h-screen bg-mq-paper pt-20">
      {/* Header */}
      <section className="bg-white border-b border-mq-border py-4">
        <div className="mq-container">
          <div
            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4
                      transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
          >
            <div>
              <h1 className="text-2xl font-bold text-mq-ink flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-mq-red" />
                GIS地图可视化
              </h1>
              <p className="text-sm text-mq-gray mt-1">
                探索清代府级农业数据空间分布，支持多字段可视化
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mq-gray" />
                <input
                  type="text"
                  placeholder="搜索地区..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-mq-border text-sm
                           focus:outline-none focus:border-mq-red focus:ring-2 focus:ring-mq-red/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <div
          className={`bg-white border-r border-mq-border transition-all duration-300 flex flex-col
                    ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}
        >
          <div className="p-4 flex-1 overflow-y-auto">
            {/* 数据可视化选择器 */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-mq-ink mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                数据可视化
              </h3>
              
              {/* 字段选择 */}
              <div className="mb-3">
                <label className="block text-xs text-mq-gray mb-1">选择可视化字段</label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-mq-border text-sm
                           focus:outline-none focus:border-mq-red focus:ring-2 focus:ring-mq-red/20"
                >
                  <option value="">-- 选择字段 --</option>
                  {numericFields.map((field) => (
                    <option key={field} value={field}>
                      {getFieldLabel(field)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 颜色方案选择 */}
              <div className="mb-3">
                <label className="block text-xs text-mq-gray mb-1 flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  颜色方案
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(COLOR_SCALES) as ColorScaleName[]).map((name) => (
                    <button
                      key={name}
                      onClick={() => setColorScaleName(name)}
                      className={`px-3 py-1 rounded text-xs transition-all
                                ${colorScaleName === name 
                                  ? 'bg-mq-red text-white' 
                                  : 'bg-mq-paper text-mq-gray hover:bg-mq-border'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 数据统计 */}
              {mergeStats && (
                <div className="text-xs text-mq-gray bg-mq-paper rounded-lg p-2 mt-3">
                  <div>数据匹配: {mergeStats.matched} / {mergeStats.total}</div>
                  {selectedField && (
                    <div className="mt-1">
                      {getFieldLabel(selectedField)}: {minValue.toFixed(2)} ~ {maxValue.toFixed(2)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 图例 */}
            {selectedField && legendItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-mq-ink mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  图例 - {getFieldLabel(selectedField)}
                </h3>
                <div className="space-y-1">
                  {legendItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-5 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-mq-gray">{item.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-xs mt-2">
                    <span
                      className="w-5 h-4 rounded"
                      style={{ backgroundColor: '#cccccc' }}
                    />
                    <span className="text-mq-gray">无数据</span>
                  </div>
                </div>
              </div>
            )}

            {/* Feature List */}
            <div>
              <h3 className="text-sm font-semibold text-mq-ink mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                地区列表
              </h3>
              {loading ? (
                <div className="text-sm text-mq-gray">加载中...</div>
              ) : error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : filteredFeatures && filteredFeatures.length > 0 ? (
                <div className="space-y-2 max-h-[520px] overflow-y-auto">
                  {filteredFeatures.map((feature: Feature, index: number) => {
                    const props = feature.properties as Record<string, unknown> | null;
                    const name = (props?.NAME || props?.name || props?.NAME_CH || `地区 ${index + 1}`) as string;
                    const isSelected = selectedFeature?.properties === feature.properties;
                    const fieldValue = selectedField ? props?.[`db_${selectedField}`] : null;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedFeature(feature)}
                        className={`w-full text-left px-3 py-2 rounded-lg border
                                  transition-all duration-300 ${
                                    isSelected
                                      ? 'border-mq-red bg-mq-red/5'
                                      : 'border-mq-border hover:border-mq-red/50'
                                  }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-mq-ink text-sm">{name}</span>
                          <div className="flex items-center gap-2">
                            {fieldValue !== null && fieldValue !== undefined && (
                              <span className="text-xs text-mq-gray">{String(fieldValue)}</span>
                            )}
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-300 ${
                                isSelected ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <div className="text-xs text-mq-gray text-center py-2">
                    共 {filteredFeatures.length} 项
                  </div>
                </div>
              ) : (
                <div className="text-sm text-mq-gray">暂无数据</div>
              )}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-mq-paper">
          {/* Toggle Sidebar Button（置于地图缩放控件下方，避免重叠） */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-24 left-4 z-[1000] w-10 h-10 bg-white rounded-lg
                     shadow-md flex items-center justify-center
                     transition-all duration-300 hover:shadow-lg"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
          </button>

          {/* Map Visualization */}
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-mq-gray">加载地图数据中...</div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-600">{error}</div>
            </div>
          ) : geoJsonData ? (
            <MapContainer
              center={[35, 110]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
              scrollWheelZoom={true}
              doubleClickZoom={false}
              touchZoom={true}
            >
              {filteredFeatures && (
                <GeoJSON
                  key={`geojson-${selectedField}-${colorScaleName}`}
                  data={{ type: 'FeatureCollection', features: filteredFeatures } as FeatureCollection}
                  style={(feature) => feature ? getGeoJsonStyle(feature as Feature) : {}}
                  onEachFeature={(feature, layer) => onEachFeature(feature as Feature, layer)}
                />
              )}
              <MapBounds mapBounds={bounds} />
            </MapContainer>
          ) : null}

          {/* Feature Detail Panel */}
          {selectedFeature && (
            <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-mq-lg z-[1000]
                          animate-slide-in-right max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-mq-ink">
                      {(selectedFeature.properties as Record<string, any>)?.NAME ||
                        (selectedFeature.properties as Record<string, any>)?.name ||
                        (selectedFeature.properties as Record<string, any>)?.NAME_CH ||
                        '未知地区'}
                    </h3>
                    {(selectedFeature.properties as Record<string, any>)?._merged && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mt-1 inline-block">
                        已匹配数据库
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="p-1 hover:bg-mq-paper rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-mq-gray" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* 数据库字段 */}
                  <div>
                    <h4 className="text-sm font-semibold text-mq-ink mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      数据库数据
                    </h4>
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {Object.entries(selectedFeature.properties as Record<string, any>)
                        .filter(([key]) => key.startsWith('db_'))
                        .map(([key, value]) => (
                          <div key={key} className="text-sm flex justify-between">
                            <span className="text-mq-gray">{getFieldLabel(key.replace('db_', ''))}:</span>
                            <span className="text-mq-ink font-medium">{String(value ?? '-')}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 原始属性 */}
                  <div>
                    <h4 className="text-sm font-semibold text-mq-ink mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      地图属性
                    </h4>
                    <div className="space-y-1 max-h-[150px] overflow-y-auto">
                      {Object.entries(selectedFeature.properties as Record<string, any>)
                        .filter(([key]) => !key.startsWith('db_') && !key.startsWith('_'))
                        .slice(0, 10)
                        .map(([key, value]) => (
                          <div key={key} className="text-sm flex justify-between">
                            <span className="text-mq-gray">{key}:</span>
                            <span className="text-mq-ink">{String(value)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs text-mq-gray z-[1000]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
          <span>{error ? '地图加载失败' : '地图已加载'}</span>
        </div>
        <div className="mt-1 text-mq-gray/60">
          清代府级底图 | {geoJsonData?.features.length || 0} 个区域
          {mergeStats && ` | ${mergeStats.matched} 条数据匹配`}
        </div>
        {selectedField && (
          <div className="mt-1 text-mq-red">
            当前可视化: {getFieldLabel(selectedField)}
          </div>
        )}
      </div>
    </main>
  );
}
