import { useState, useEffect, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, ArrowDown, ArrowUp, FileSpreadsheet } from 'lucide-react';
import AdvancedFilter, { type FilterGroup, type FieldConfigItem } from '../components/AdvancedFilter';
import { operators, logicOperators } from '../data/mockDatabase';

type DatasetKey = 'ming_province' | 'qing_province' | 'qing_prefecture';

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

// 针对三张表分别配置可筛选字段
const datasetFieldConfig: Record<DatasetKey, FieldConfigItem[]> = {
  ming_province: [
    { key: '省份', label: '省份', type: 'text', filterable: true },
    { key: '1400年人口', label: '1400年人口', type: 'number', filterable: true },
    { key: '1580年人口', label: '1580年人口', type: 'number', filterable: true },
    { key: '1400年耕地面积', label: '1400年耕地面积', type: 'number', filterable: true },
    { key: '1580年耕地面积', label: '1580年耕地面积', type: 'number', filterable: true },
    { key: '1400年人均耕地面积', label: '1400年人均耕地面积', type: 'number', filterable: true },
    { key: '1580年人均耕地面积', label: '1580年人均耕地面积', type: 'number', filterable: true },
    { key: '亩产水平系数', label: '亩产水平系数', type: 'number', filterable: true },
    { key: '1400年人均农业净产值', label: '1400年人均农业净产值', type: 'number', filterable: true },
    { key: '1580年人均农业净产值', label: '1580年人均农业净产值', type: 'number', filterable: true },
  ],
  qing_province: [
    { key: '省份', label: '省份', type: 'text', filterable: true },
    { key: '1661年人口', label: '1661年人口', type: 'number', filterable: true },
    { key: '1685年人口', label: '1685年人口', type: 'number', filterable: true },
    { key: '1724年人口', label: '1724年人口', type: 'number', filterable: true },
    { key: '1766年人口', label: '1766年人口', type: 'number', filterable: true },
    { key: '1812年人口', label: '1812年人口', type: 'number', filterable: true },
    { key: '1850年人口', label: '1850年人口', type: 'number', filterable: true },
    { key: '1661年耕地面积', label: '1661年耕地面积', type: 'number', filterable: true },
    { key: '1685年耕地面积', label: '1685年耕地面积', type: 'number', filterable: true },
    { key: '1724年耕地面积', label: '1724年耕地面积', type: 'number', filterable: true },
    { key: '1766年耕地面积', label: '1766年耕地面积', type: 'number', filterable: true },
    { key: '1812年耕地面积', label: '1812年耕地面积', type: 'number', filterable: true },
    { key: '1850年耕地面积', label: '1850年耕地面积', type: 'number', filterable: true },
    { key: '1661年人均耕地面积', label: '1661年人均耕地面积', type: 'number', filterable: true },
    { key: '1685年人均耕地面积', label: '1685年人均耕地面积', type: 'number', filterable: true },
    { key: '1724年人均耕地面积', label: '1724年人均耕地面积', type: 'number', filterable: true },
    { key: '1766年人均耕地面积', label: '1766年人均耕地面积', type: 'number', filterable: true },
    { key: '1812年人均耕地面积', label: '1812年人均耕地面积', type: 'number', filterable: true },
    { key: '1850年人均耕地面积', label: '1850年人均耕地面积', type: 'number', filterable: true },
    { key: '1661年全省人均农业产值', label: '1661年全省人均农业产值', type: 'number', filterable: true },
    { key: '1685年全省人均农业产值', label: '1685年全省人均农业产值', type: 'number', filterable: true },
    { key: '1724年全省人均农业产值', label: '1724年全省人均农业产值', type: 'number', filterable: true },
    { key: '1766年全省人均农业产值', label: '1766年全省人均农业产值', type: 'number', filterable: true },
    { key: '1812年全省人均农业产值', label: '1812年全省人均农业产值', type: 'number', filterable: true },
    { key: '1850年全省人均农业产值', label: '1850年全省人均农业产值', type: 'number', filterable: true },
    { key: '1661年TFP(DEA)', label: '1661年TFP(DEA)', type: 'number', filterable: true },
    { key: '1685年TFP(DEA)', label: '1685年TFP(DEA)', type: 'number', filterable: true },
    { key: '1724年TFP(DEA)', label: '1724年TFP(DEA)', type: 'number', filterable: true },
    { key: '1766年TFP(DEA)', label: '1766年TFP(DEA)', type: 'number', filterable: true },
    { key: '1812年TFP（DEA）', label: '1812年TFP（DEA）', type: 'number', filterable: true },
    { key: '1850年TFP（DEA）', label: '1850年TFP（DEA）', type: 'number', filterable: true },
    { key: '1661年TFP(SFA)', label: '1661年TFP(SFA)', type: 'number', filterable: true },
    { key: '1685年TFP(SFA)', label: '1685年TFP(SFA)', type: 'number', filterable: true },
    { key: '1724年TFP(SFA)', label: '1724年TFP(SFA)', type: 'number', filterable: true },
    { key: '1766年TFP(SFA)', label: '1766年TFP(SFA)', type: 'number', filterable: true },
    { key: '1812年TFP(SFA)', label: '1812年TFP(SFA)', type: 'number', filterable: true },
    { key: '1850年TFP(SFA)', label: '1850年TFP(SFA)', type: 'number', filterable: true },
  ],
  qing_prefecture: [
    { key: 'NAME_CH', label: 'NAME_CH', type: 'text', filterable: true },
    { key: 'LEV1_CH', label: 'LEV1_CH', type: 'text', filterable: true },
    { key: 'TianMu', label: 'TianMu', type: 'number', filterable: true },
    { key: 'Pop1680', label: 'Pop1680', type: 'number', filterable: true },
    { key: 'POP1776', label: 'POP1776', type: 'number', filterable: true },
    { key: 'Pop1700', label: 'Pop1700', type: 'number', filterable: true },
    { key: 'TianMu_PP', label: 'TianMu_PP', type: 'number', filterable: true },
    { key: 'TianMu_PPxs', label: 'TianMu_PPxs', type: 'number', filterable: true },
    { key: 'Output', label: 'Output', type: 'number', filterable: true },
    { key: 'TYPE_CH', label: 'TYPE_CH', type: 'text', filterable: true },
    { key: 'DYN_CH', label: 'DYN_CH', type: 'text', filterable: true },
    { key: 'X_COORD', label: 'X_COORD', type: 'number', filterable: true },
    { key: 'Y_COORD', label: 'Y_COORD', type: 'number', filterable: true },
    { key: 'AREA', label: 'AREA', type: 'number', filterable: true },
    { key: 'Shape_Leng', label: 'Shape_Leng', type: 'number', filterable: true },
    { key: 'Shape_Area', label: 'Shape_Area', type: 'number', filterable: true },
    { key: 'Avg_pointi', label: 'Avg_pointi', type: 'number', filterable: true },
    { key: 'Avg_grid_c（土壤指数）', label: 'Avg_grid_c（土壤指数）', type: 'number', filterable: true },
    { key: 'Avg_grid_xs', label: 'Avg_grid_xs', type: 'number', filterable: true },
    { key: 'Solow residual', label: 'Solow residual', type: 'number', filterable: true },
    { key: 'TE_DEA', label: 'TE_DEA', type: 'number', filterable: true },
    { key: 'TE_SFA', label: 'TE_SFA', type: 'number', filterable: true },
  ],
};

export default function Database() {
  const [dataset, setDataset] = useState<DatasetKey>('ming_province');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 根据当前数据集从后端加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setRows([]);
      // 切换数据集时清空筛选条件和搜索
      setFilterGroups([]);
      setSearchQuery('');
      try {
        const res = await fetch(`/api/${dataset}`);
        if (!res.ok) {
          throw new Error('获取数据库数据失败');
        }
        const data = (await res.json()) as Record<string, any>[];
        setRows(data);
        setCurrentPage(1);
        setSelectedRows([]);
      } catch (err) {
        console.error(err);
        setError('后端数据库暂时无法访问，当前展示为空');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataset]);

  // 当前数据集的标题与说明
  const datasetMeta: Record<DatasetKey, { label: string; description: string; primaryField: string }> = {
    ming_province: {
      label: '明代省级数据（ming_province）',
      description: '包含明代各省在人口、耕地面积、人均产值等方面的统计数据。',
      primaryField: '省份',
    },
    qing_province: {
      label: '清代省级数据（qing_province）',
      description: '包含清代各省在不同年份的人口、耕地、亩产、TFP 等指标。',
      primaryField: '省份',
    },
    qing_prefecture: {
      label: '清代府级数据（qing_prefecture）',
      description: '包含清代府级行政区的耕地、人口、产出及自然条件指标。',
      primaryField: 'NAME_CH',
    },
  };

  // 动态列：根据第一行数据自动生成
  const columns = useMemo(() => {
    if (!rows.length) return [] as string[];
    return Object.keys(rows[0]);
  }, [rows]);

  // 确保每次 dataset 变化时都生成新的 fieldConfig 引用
  const currentFieldConfig = useMemo(() => {
    return datasetFieldConfig[dataset];
  }, [dataset]);

  // 单条记录应用高级筛选条件
  const applyFilter = (row: Record<string, any>, condition: FilterGroup['conditions'][0]): boolean => {
    const { field, operator, value } = condition;
    const rowValue = row[field];

    switch (operator) {
      case 'eq':
        return rowValue === value;
      case 'gt':
        return Number(rowValue) > Number(value);
      case 'gte':
        return Number(rowValue) >= Number(value);
      case 'lt':
        return Number(rowValue) < Number(value);
      case 'lte':
        return Number(rowValue) <= Number(value);
      case 'contains':
        return String(rowValue ?? '').toLowerCase().includes(String(value).toLowerCase());
      case 'startsWith':
        return String(rowValue ?? '').toLowerCase().startsWith(String(value).toLowerCase());
      case 'endsWith':
        return String(rowValue ?? '').toLowerCase().endsWith(String(value).toLowerCase());
      default:
        return true;
    }
  };

  // 搜索 + 高级筛选
  const filteredData = useMemo(() => {
    const primary = datasetMeta[dataset].primaryField;
    let data = [...rows];

    if (searchQuery && rows.length) {
      const q = searchQuery.toLowerCase();
      data = data.filter((row) => {
        const value = String(row[primary] ?? '').toLowerCase();
        return value.includes(q);
      });
    }

    // 高级筛选
    if (filterGroups.length > 0) {
      data = data.filter((row) =>
        filterGroups.every((group) => {
          if (group.conditions.length === 0) return true;
          if (group.conditions.every((c) => !c.field || !c.operator)) return true;

          const validConditions = group.conditions.filter(
            (c) => c.field && c.operator && c.value !== ''
          );

          if (validConditions.length === 0) return true;

          if (group.logic === 'AND') {
            return validConditions.every((condition) => applyFilter(row, condition));
          }
          return validConditions.some((condition) => applyFilter(row, condition));
        })
      );
    }

    if (sortConfig.key) {
      const key = sortConfig.key;
      data.sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortConfig.direction === 'asc' ? av - bv : bv - av;
        }
        const sa = String(av);
        const sb = String(bv);
        return sortConfig.direction === 'asc'
          ? sa.localeCompare(sb, 'zh-CN')
          : sb.localeCompare(sa, 'zh-CN');
      });
    }

    return data;
  }, [rows, searchQuery, sortConfig, dataset, datasetMeta]);

  // 分页
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-mq-red" />
    ) : (
      <ArrowDown className="w-4 h-4 text-mq-red" />
    );
  };

  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAllSelection = () => {
    const idsOnPage = paginatedData.map((_row, idx) => (currentPage - 1) * pageSize + idx);
    if (selectedRows.length === idsOnPage.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(idsOnPage);
    }
  };

  const exportCSV = () => {
    if (!filteredData.length || !columns.length) return;

    const indices =
      selectedRows.length > 0 ? selectedRows : filteredData.map((_r, idx) => idx);

    const header = columns.join(',');
    const lines = indices.map((i) => {
      const row = filteredData[i];
      return columns
        .map((col) => {
          const v = row[col];
          if (v == null) return '';
          const s = String(v).replace(/"/g, '""');
          // 简单处理逗号
          return `"${s}"`;
        })
        .join(',');
    });

    const csvContent = [header, ...lines].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dataset}_导出.csv`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-mq-paper pt-24">
      {/* Header */}
      <section className="relative py-8 bg-gradient-to-b from-mq-red/5 to-transparent">
        <div className="mq-container">
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-3xl font-bold text-mq-ink mb-2">明清农业统计数据库</h1>
            <p className="text-mq-gray">
              当前数据集：<span className="text-mq-red font-semibold">{datasetMeta[dataset].label}</span>
            </p>
            <p className="text-sm text-mq-gray mt-1">
              {datasetMeta[dataset].description}
            </p>
            <p className="text-sm text-mq-gray mt-1">
              共 <span className="text-mq-red font-semibold">{filteredData.length}</span> 条记录
            </p>
            {loading && (
              <p className="text-sm text-mq-gray mt-1">正在从 MySQL 数据库加载数据...</p>
            )}
            {error && !loading && (
              <p className="text-sm text-mq-red mt-1">{error}</p>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="sticky top-16 z-30 bg-mq-paper/95 backdrop-blur-md border-b border-mq-border py-4">
        <div className="mq-container">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mq-gray" />
              <input
                type="text"
                placeholder={`在 ${datasetMeta[dataset].primaryField} 中搜索...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-mq-border
                         focus:outline-none focus:border-mq-red focus:ring-2 focus:ring-mq-red/20
                         transition-all duration-300"
              />
            </div>

            {/* Dataset selector & Export */}
            <div className="flex gap-2">
              <div className="flex bg-white rounded-xl border border-mq-border p-1">
                <FileSpreadsheet className="w-5 h-5 text-mq-gray mx-2 my-auto" />
                <select
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value as DatasetKey)}
                  className="text-sm px-2 py-1 bg-transparent focus:outline-none"
                >
                  <option value="ming_province">明代省级（ming_province）</option>
                  <option value="qing_province">清代省级（qing_province）</option>
                  <option value="qing_prefecture">清代府级（qing_prefecture）</option>
                </select>
              </div>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-mq-red text-white rounded-xl flex items-center gap-2
                         transition-all duration-300 hover:bg-mq-red-dark"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">导出</span>
                {selectedRows.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {selectedRows.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-6">
        <div className="mq-container">
          {/* Advanced Filter */}
          <div className="mb-4">
            <AdvancedFilter
              key={dataset}
              onFilterChange={setFilterGroups}
              fieldConfig={currentFieldConfig}
              operators={operators}
              logicOperators={logicOperators}
            />
          </div>
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="text-sm text-mq-gray">
              显示 {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, filteredData.length)} 条，共{' '}
              {filteredData.length} 条结果
            </div>
            <div className="flex items-center gap-4">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-sm px-3 py-1.5 border border-mq-border rounded-lg bg-white focus:border-mq-red focus:outline-none"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
                <option value={100}>100条/页</option>
              </select>
            </div>
          </div>

          {/* Table View */}
            <div className="bg-white rounded-xl shadow-mq overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-mq-paper">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={
                            paginatedData.length > 0 &&
                            selectedRows.length === paginatedData.length
                          }
                          onChange={toggleAllSelection}
                          className="rounded border-mq-border text-mq-red focus:ring-mq-red"
                        />
                      </th>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-sm font-semibold text-mq-ink"
                        >
                          <button
                            onClick={() => handleSort(col)}
                            className="flex items-center gap-1 hover:text-mq-red transition-colors"
                          >
                            {col}
                            {getSortIcon(col)}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mq-border">
                    {paginatedData.map((row, idx) => {
                      const globalIndex = (currentPage - 1) * pageSize + idx;
                      return (
                      <tr
                        key={globalIndex}
                        className="hover:bg-mq-paper/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(globalIndex)}
                            onChange={() => toggleRowSelection(globalIndex)}
                            className="rounded border-mq-border text-mq-red focus:ring-mq-red"
                          />
                        </td>
                        {columns.map((col) => (
                          <td key={col} className="px-4 py-3 text-sm text-mq-gray whitespace-nowrap">
                            {row[col] != null ? String(row[col]) : ''}
                          </td>
                        ))}
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {paginatedData.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-mq-gray/50 text-lg">未找到匹配的记录</div>
                  <div className="text-mq-gray/40 text-sm mt-2">请调整筛选条件后重试</div>
                </div>
              )}
            </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-mq-border disabled:opacity-50 disabled:cursor-not-allowed
                         hover:border-mq-red hover:text-mq-red transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const diff = Math.abs(page - currentPage);
                  return diff <= 2 || page === 1 || page === totalPages;
                })
                .map((page, index, arr) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="px-2 text-mq-gray">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[40px] h-10 px-3 rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-mq-red text-white border-mq-red'
                          : 'border-mq-border hover:border-mq-red hover:text-mq-red'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-mq-border disabled:opacity-50 disabled:cursor-not-allowed
                         hover:border-mq-red hover:text-mq-red transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
