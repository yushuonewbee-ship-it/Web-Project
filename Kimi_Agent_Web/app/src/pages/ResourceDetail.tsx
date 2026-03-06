import { useParams, Link } from 'react-router-dom';
import { apiBase } from '../lib/apiBase';
import { useEffect, useState } from 'react';
import { Download, Share2, BookOpen, Calendar, User, FileText } from 'lucide-react';

interface ResourceDetailData {
  id?: number;
  title: string;
  author: string;
  dynasty: string;
  category: string;
  description: string;
  cover: string;
  pages: number;
  downloads: number;
  views: number;
  fileSize: string;
  format: string;
  content?: string;
  toc?: string[];
}

// 默认占位数据，在后端未返回或出错时使用
const fallbackResource: ResourceDetailData = {
  title: '加载中…',
  author: '',
  dynasty: '',
  category: '',
  description: '正在从数据库获取文献信息，如长时间没有加载，请检查后端服务或数据库连接。',
  cover: '/resource-1.jpg',
  pages: 0,
  downloads: 0,
  views: 0,
  fileSize: '',
  format: '',
  content: '',
  toc: [],
};

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || '1', 10);

  const [resource, setResource] = useState<ResourceDetailData>(fallbackResource);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/api/documents/${resourceId}`);
        if (!res.ok) {
          throw new Error('获取文献详情失败');
        }
        const data = await res.json();

        // 按照后端字段与前端展示字段做一次映射/兼容
        const mapped: ResourceDetailData = {
          id: data.id,
          title: data.title,
          author: data.author,
          dynasty: data.dynasty,
          category: data.category,
          description: data.description,
          cover: data.cover_image || '/resource-1.jpg',
          pages: data.pages ?? 0,
          downloads: data.downloads ?? 0,
          views: data.views ?? 0,
          fileSize: data.file_size ? `${data.file_size} MB` : '',
          format: data.file_format || 'PDF',
          content: data.content_summary || '',
          toc: [], // 如有目录字段，可在此补充映射
        };

        setResource(mapped);
      } catch (err) {
        console.error(err);
        setError('文献详情暂时无法从数据库获取，当前为占位内容');
        setResource(fallbackResource);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [resourceId]);

  return (
    <main className="min-h-screen bg-mq-paper pt-24">
      <div className="mq-container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-mq-gray mb-6">
          <Link to="/" className="hover:text-mq-red transition-colors">首页</Link>
          <span>/</span>
          <Link to="/database" className="hover:text-mq-red transition-colors">数据库</Link>
          <span>/</span>
          <span className="text-mq-ink">{resource.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cover & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-mq overflow-hidden sticky top-24">
              {/* Cover */}
              <div className="aspect-[4/3] relative">
                <img
                  src={resource.cover}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-mq-red text-white text-sm rounded-full">
                    {resource.category}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-center gap-2
                                 bg-mq-red text-white py-3 rounded-xl
                                 transition-all duration-300 hover:bg-mq-red-dark">
                  <BookOpen className="w-5 h-5" />
                  <span>在线阅读</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2
                                 border-2 border-mq-red text-mq-red py-3 rounded-xl
                                 transition-all duration-300 hover:bg-mq-red hover:text-white">
                  <Download className="w-5 h-5" />
                  <span>下载 PDF</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2
                                 border border-mq-border text-mq-gray py-3 rounded-xl
                                 transition-all duration-300 hover:border-mq-red hover:text-mq-red">
                  <Share2 className="w-5 h-5" />
                  <span>分享</span>
                </button>
              </div>

              {/* Stats */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-mq-red">{resource.views}</div>
                    <div className="text-xs text-mq-gray">浏览</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-mq-red">{resource.downloads}</div>
                    <div className="text-xs text-mq-gray">下载</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-mq-red">{resource.pages}</div>
                    <div className="text-xs text-mq-gray">页数</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-mq p-8">
              <h1 className="text-3xl font-bold text-mq-ink mb-4">
                {resource.title}
                {loading && <span className="ml-3 text-sm text-mq-gray">（加载中）</span>}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-mq-gray">
                  <User className="w-4 h-4" />
                  <span>{resource.author}</span>
                </div>
                <div className="flex items-center gap-2 text-mq-gray">
                  <Calendar className="w-4 h-4" />
                  <span>{resource.dynasty}</span>
                </div>
                <div className="flex items-center gap-2 text-mq-gray">
                  <FileText className="w-4 h-4" />
                  <span>{resource.format} · {resource.fileSize}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-mq p-8">
              <h2 className="text-xl font-bold text-mq-ink mb-4">简介</h2>
              <p className="text-mq-gray leading-relaxed">{resource.description}</p>
              {resource.content && (
                <p className="text-mq-gray leading-relaxed mt-4">{resource.content}</p>
              )}
            </div>

            {/* Table of Contents */}
            <div className="bg-white rounded-xl shadow-mq p-8">
              <h2 className="text-xl font-bold text-mq-ink mb-4">目录</h2>
              {resource.toc && resource.toc.length > 0 ? (
                <ul className="space-y-2">
                  {resource.toc.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg
                               hover:bg-mq-paper transition-colors cursor-pointer"
                    >
                      <span className="w-6 h-6 bg-mq-red/10 text-mq-red rounded
                                     flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-mq-gray">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-mq-gray">该文献暂无详细目录数据。</p>
              )}
            </div>

            {/* Citation */}
            <div className="bg-mq-paper rounded-xl p-8 border border-mq-border">
              <h2 className="text-xl font-bold text-mq-ink mb-4">引用格式</h2>
              <div className="bg-white rounded-lg p-4 font-mono text-sm text-mq-gray">
                {resource.author}.《{resource.title}》[M]. {resource.dynasty}.
                明清农业数据库, 2024.
              </div>
              <button className="mt-3 text-mq-red text-sm hover:underline">
                复制引用格式
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
