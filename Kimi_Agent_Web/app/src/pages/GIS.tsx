import { useEffect, useState, useRef } from 'react';
import { Map, Layers, Filter, Info, Search, X, ChevronRight } from 'lucide-react';

// 模拟GIS数据 - 实际应用中将来自MySQL数据库
const mockMapData = {
  regions: [
    {
      id: 1,
      name: '江南地区',
      dynasty: '明代',
      crops: ['水稻', '棉花', '桑蚕'],
      techniques: ['双季稻', '圩田'],
      coordinates: { x: 70, y: 60 },
      documents: ['农政全书', '天工开物'],
    },
    {
      id: 2,
      name: '华北地区',
      dynasty: '清代',
      crops: ['小麦', '高粱', '大豆'],
      techniques: ['轮作', '灌溉'],
      coordinates: { x: 60, y: 35 },
      documents: ['授时通考', '齐民要术'],
    },
    {
      id: 3,
      name: '四川盆地',
      dynasty: '明代',
      crops: ['水稻', '茶叶', '甘蔗'],
      techniques: ['梯田', '水利'],
      coordinates: { x: 45, y: 55 },
      documents: ['蜀中广记'],
    },
    {
      id: 4,
      name: '岭南地区',
      dynasty: '清代',
      crops: ['水稻', '荔枝', '柑橘'],
      techniques: ['基塘农业'],
      coordinates: { x: 65, y: 80 },
      documents: ['广东新语'],
    },
    {
      id: 5,
      name: '关中平原',
      dynasty: '明代',
      crops: ['小麦', '粟', '棉花'],
      techniques: ['井渠', '代田'],
      coordinates: { x: 50, y: 45 },
      documents: ['关中胜迹图志'],
    },
    {
      id: 6,
      name: '湖广地区',
      dynasty: '清代',
      crops: ['水稻', '茶叶', '桐油'],
      techniques: ['垸田', '围湖造田'],
      coordinates: { x: 58, y: 58 },
      documents: ['湖广通志'],
    },
  ],
  rivers: [
    { name: '长江', path: 'M 20 65 Q 45 60 70 55' },
    { name: '黄河', path: 'M 25 30 Q 50 35 75 40' },
  ],
};

const categories = [
  { id: 'all', name: '全部', color: '#8c1f1f' },
  { id: 'crops', name: '农作物分布', color: '#c9a86c' },
  { id: 'techniques', name: '农业技术', color: '#4a7c59' },
  { id: 'documents', name: '文献分布', color: '#6b5b95' },
];

export default function GIS() {
  const [selectedRegion, setSelectedRegion] = useState<typeof mockMapData.regions[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filter regions based on search
  const filteredRegions = mockMapData.regions.filter((region) =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <Map className="w-6 h-6 text-mq-red" />
                GIS地图可视化
              </h1>
              <p className="text-sm text-mq-gray mt-1">
                探索明清时期农业地理分布，可视化展示农作物、技术与文献的空间分布
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
          className={`bg-white border-r border-mq-border transition-all duration-300
                    ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}
        >
          <div className="p-4 h-full overflow-y-auto">
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-mq-ink mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                图层选择
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                              transition-all duration-300 ${
                                selectedCategory === cat.id
                                  ? 'bg-mq-red text-white'
                                  : 'hover:bg-mq-paper text-mq-gray'
                              }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Region List */}
            <div>
              <h3 className="text-sm font-semibold text-mq-ink mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                地区列表
              </h3>
              <div className="space-y-2">
                {filteredRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`w-full text-left px-3 py-3 rounded-lg border
                              transition-all duration-300 ${
                                selectedRegion?.id === region.id
                                  ? 'border-mq-red bg-mq-red/5'
                                  : 'border-mq-border hover:border-mq-red/50'
                              }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-mq-ink">{region.name}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          selectedRegion?.id === region.id ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                    <div className="text-xs text-mq-gray mt-1">
                      {region.dynasty} · {region.crops.length}种作物
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-mq-paper" ref={mapRef}>
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-lg
                     shadow-md flex items-center justify-center
                     transition-all duration-300 hover:shadow-lg"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
          </button>

          {/* Map Visualization */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full max-w-4xl aspect-[4/3]">
              {/* Map Background */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.1))' }}
              >
                {/* China outline (simplified) */}
                <path
                  d="M 20 20 Q 40 15 60 20 Q 80 25 85 45 Q 90 65 80 80 Q 60 90 40 85 Q 20 80 15 60 Q 10 40 20 20 Z"
                  fill="#f5f0e8"
                  stroke="#d4d4d4"
                  strokeWidth="0.5"
                />

                {/* Rivers */}
                {mockMapData.rivers.map((river, index) => (
                  <path
                    key={index}
                    d={river.path}
                    fill="none"
                    stroke="#7eb8da"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                ))}

                {/* Region Markers */}
                {mockMapData.regions.map((region) => (
                  <g key={region.id}>
                    {/* Pulse animation circle */}
                    <circle
                      cx={region.coordinates.x}
                      cy={region.coordinates.y}
                      r="3"
                      fill={selectedRegion?.id === region.id ? '#8c1f1f' : '#c9a86c'}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedRegion(region)}
                    >
                      <animate
                        attributeName="r"
                        values="3;4;3"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Label */}
                    <text
                      x={region.coordinates.x}
                      y={region.coordinates.y - 5}
                      textAnchor="middle"
                      fontSize="3"
                      fill="#1a1a1a"
                      className="cursor-pointer"
                      onClick={() => setSelectedRegion(region)}
                    >
                      {region.name}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm
                            rounded-lg p-3 shadow-md">
                <h4 className="text-xs font-semibold text-mq-ink mb-2">图例</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mq-red" />
                    <span className="text-xs text-mq-gray">选中地区</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mq-gold" />
                    <span className="text-xs text-mq-gray">普通地区</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#7eb8da]" />
                    <span className="text-xs text-mq-gray">主要河流</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Region Detail Panel */}
          {selectedRegion && (
            <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-mq-lg
                          animate-slide-in-right">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-mq-ink">
                      {selectedRegion.name}
                    </h3>
                    <span className="text-sm text-mq-gold">{selectedRegion.dynasty}</span>
                  </div>
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className="p-1 hover:bg-mq-paper rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-mq-gray" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Crops */}
                  <div>
                    <h4 className="text-sm font-semibold text-mq-ink mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mq-red" />
                      主要农作物
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.crops.map((crop, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-mq-paper text-mq-gray text-xs rounded"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Techniques */}
                  <div>
                    <h4 className="text-sm font-semibold text-mq-ink mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59]" />
                      农业技术
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.techniques.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-mq-paper text-mq-gray text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-sm font-semibold text-mq-ink mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6b5b95]" />
                      相关文献
                    </h4>
                    <ul className="space-y-1">
                      {selectedRegion.documents.map((doc, index) => (
                        <li
                          key={index}
                          className="text-sm text-mq-gray flex items-center gap-2"
                        >
                          <Info className="w-3 h-3" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  <button className="w-full mt-4 py-2 bg-mq-red text-white rounded-lg
                                   transition-all duration-300 hover:bg-mq-red-dark">
                    查看详细资料
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Database Connection Info */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs text-mq-gray">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>数据库已连接</span>
        </div>
        <div className="mt-1 text-mq-gray/60">
          明清农业数据库 | localhost:3306
        </div>
      </div>
    </main>
  );
}
