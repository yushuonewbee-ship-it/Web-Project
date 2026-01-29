/**
 * 明清农业数据库 - MySQL数据库配置
 * 
 * 数据库名称：明清农业数据库
 * 主机：localhost
 * 数据架构：mingqing agricultural database
 * 用户名：YuuShuo
 * 访问密码：Lys20050220
 * 端口：3306
 * 数据下载文件保存路径：C:\Onedrive\Desktop\scholarship\大创\数据
 */

export const dbConfig = {
  host: 'localhost',
  port: 3306,
  database: 'mingqing agricultural database',
  user: 'YuuShuo',
  password: 'Lys20050220',
  charset: 'utf8mb4',
  connectionLimit: 10,
};

// 数据文件保存路径配置
export const fileConfig = {
  downloadPath: 'C:\\Onedrive\\Desktop\\scholarship\\大创\\数据',
  allowedFormats: ['pdf', 'jpg', 'png', 'txt', 'doc'],
  maxFileSize: 100 * 1024 * 1024, // 100MB
};

// 数据库表结构定义（参考）
export const dbSchema = {
  // 古籍文献表
  documents: {
    tableName: 'documents',
    columns: [
      { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
      { name: 'title', type: 'VARCHAR(255)', notNull: true },
      { name: 'author', type: 'VARCHAR(100)' },
      { name: 'dynasty', type: 'VARCHAR(50)' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'description', type: 'TEXT' },
      { name: 'content', type: 'LONGTEXT' },
      { name: 'cover_image', type: 'VARCHAR(255)' },
      { name: 'file_path', type: 'VARCHAR(500)' },
      { name: 'file_size', type: 'BIGINT' },
      { name: 'file_format', type: 'VARCHAR(20)' },
      { name: 'pages', type: 'INT' },
      { name: 'downloads', type: 'INT', default: 0 },
      { name: 'views', type: 'INT', default: 0 },
      { name: 'created_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ],
  },
  
  // 作者表
  authors: {
    tableName: 'authors',
    columns: [
      { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
      { name: 'name', type: 'VARCHAR(100)', notNull: true },
      { name: 'dynasty', type: 'VARCHAR(50)' },
      { name: 'biography', type: 'TEXT' },
      { name: 'research_field', type: 'VARCHAR(255)' },
      { name: 'publications', type: 'JSON' },
      { name: 'avatar', type: 'VARCHAR(255)' },
      { name: 'created_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
    ],
  },
  
  // 地理信息表（GIS数据）
  geoData: {
    tableName: 'geo_data',
    columns: [
      { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
      { name: 'region_name', type: 'VARCHAR(100)', notNull: true },
      { name: 'dynasty', type: 'VARCHAR(50)' },
      { name: 'latitude', type: 'DECIMAL(10, 8)' },
      { name: 'longitude', type: 'DECIMAL(11, 8)' },
      { name: 'crops', type: 'JSON' },
      { name: 'techniques', type: 'JSON' },
      { name: 'related_documents', type: 'JSON' },
      { name: 'description', type: 'TEXT' },
      { name: 'created_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
    ],
  },
  
  // 用户下载记录表
  downloads: {
    tableName: 'downloads',
    columns: [
      { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
      { name: 'document_id', type: 'INT', notNull: true },
      { name: 'user_ip', type: 'VARCHAR(45)' },
      { name: 'downloaded_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
    ],
  },
  
  // 浏览记录表
  views: {
    tableName: 'views',
    columns: [
      { name: 'id', type: 'INT', primaryKey: true, autoIncrement: true },
      { name: 'document_id', type: 'INT', notNull: true },
      { name: 'user_ip', type: 'VARCHAR(45)' },
      { name: 'viewed_at', type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' },
    ],
  },
};

// API端点配置
export const apiEndpoints = {
  // 文档相关
  documents: {
    list: '/api/documents',
    detail: '/api/documents/:id',
    search: '/api/documents/search',
    download: '/api/documents/:id/download',
    categories: '/api/documents/categories',
  },
  
  // 作者相关
  authors: {
    list: '/api/authors',
    detail: '/api/authors/:id',
  },
  
  // GIS相关
  gis: {
    regions: '/api/gis/regions',
    regionDetail: '/api/gis/regions/:id',
    crops: '/api/gis/crops',
    techniques: '/api/gis/techniques',
  },
  
  // 统计相关
  stats: {
    overview: '/api/stats/overview',
    popular: '/api/stats/popular',
    recent: '/api/stats/recent',
  },
};

export default dbConfig;
