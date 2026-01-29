/**
 * 文档数据API服务
 * 
 * 说明：当前使用模拟数据，实际部署时需要：
 * 1. 安装MySQL连接库：npm install mysql2
 * 2. 创建Node.js后端服务器
 * 3. 替换以下模拟函数为真实数据库查询
 */

// 文档接口定义
export interface Document {
  id: number;
  title: string;
  author: string;
  dynasty: string;
  category: string;
  description: string;
  content?: string;
  cover_image: string;
  file_path: string;
  file_size: number;
  file_format: string;
  pages: number;
  downloads: number;
  views: number;
  created_at: string;
  updated_at: string;
}

// 搜索参数接口
export interface SearchParams {
  keyword?: string;
  category?: string;
  dynasty?: string;
  page?: number;
  limit?: number;
}

/**
 * 获取文档列表
 * 实际实现：从MySQL数据库查询documents表
 */
export async function getDocuments(params: SearchParams = {}): Promise<{
  data: Document[];
  total: number;
  page: number;
  limit: number;
}> {
  // eslint-disable-next-line no-console
  console.log('Fetching documents with params:', params);
  
  // TODO: 替换为真实API调用
  return {
    data: [],
    total: 0,
    page: params.page || 1,
    limit: params.limit || 20,
  };
}

/**
 * 获取单个文档详情
 * 实际实现：从MySQL数据库查询documents表
 */
export async function getDocumentById(id: number): Promise<Document | null> {
  // eslint-disable-next-line no-console
  console.log('Fetching document by id:', id);
  
  // TODO: 替换为真实API调用
  return null;
}

/**
 * 搜索文档
 * 实际实现：使用MySQL全文搜索或LIKE查询
 */
export async function searchDocuments(keyword: string): Promise<Document[]> {
  // eslint-disable-next-line no-console
  console.log('Searching documents with keyword:', keyword);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 下载文档
 * 实际实现：
 * 1. 增加downloads计数
 * 2. 记录下载日志
 * 3. 返回文件流
 */
export async function downloadDocument(id: number): Promise<Blob> {
  // eslint-disable-next-line no-console
  console.log('Downloading document with id:', id);
  
  // TODO: 替换为真实API调用
  return new Blob();
}

/**
 * 获取文档分类列表
 */
export async function getCategories(): Promise<string[]> {
  // TODO: 替换为真实API调用
  return [
    '农业技术',
    '农业政书',
    '农业博物',
    '蚕桑技术',
    '农业官书',
    '水利灌溉',
    '畜牧养殖',
  ];
}

/**
 * 获取朝代列表
 */
export async function getDynasties(): Promise<string[]> {
  // TODO: 替换为真实API调用
  return ['明代', '清代', '元代', '北魏'];
}

/**
 * 增加浏览次数
 */
export async function incrementViews(id: number): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('Incrementing views for document:', id);
  
  // TODO: 替换为真实API调用
}

/**
 * 获取热门文档
 */
export async function getPopularDocuments(limit: number = 6): Promise<Document[]> {
  // eslint-disable-next-line no-console
  console.log('Fetching popular documents, limit:', limit);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 获取最新文档
 */
export async function getRecentDocuments(limit: number = 6): Promise<Document[]> {
  // eslint-disable-next-line no-console
  console.log('Fetching recent documents, limit:', limit);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 获取统计数据
 */
export async function getStatistics(): Promise<{
  totalDocuments: number;
  totalDownloads: number;
  totalViews: number;
}> {
  // TODO: 替换为真实API调用
  return {
    totalDocuments: 703,
    totalDownloads: 0,
    totalViews: 0,
  };
}

export default {
  getDocuments,
  getDocumentById,
  searchDocuments,
  downloadDocument,
  getCategories,
  getDynasties,
  incrementViews,
  getPopularDocuments,
  getRecentDocuments,
  getStatistics,
};
