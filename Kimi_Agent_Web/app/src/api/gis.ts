/**
 * GIS地理信息API服务
 * 
 * 说明：当前使用模拟数据，实际部署时需要：
 * 1. 安装MySQL连接库：npm install mysql2
 * 2. 创建Node.js后端服务器
 * 3. 替换以下模拟函数为真实数据库查询
 */

// 地理区域接口定义
export interface GeoRegion {
  id: number;
  region_name: string;
  dynasty: string;
  latitude: number;
  longitude: number;
  crops: string[];
  techniques: string[];
  related_documents: string[];
  description?: string;
  created_at: string;
}

// 农作物分布接口
export interface CropDistribution {
  crop_name: string;
  regions: string[];
  dynasties: string[];
  count: number;
}

// 农业技术接口
export interface AgriculturalTechnique {
  technique_name: string;
  regions: string[];
  description: string;
  related_documents: string[];
}

/**
 * 获取所有地理区域
 * 实际实现：从MySQL数据库查询geo_data表
 */
export async function getAllRegions(): Promise<GeoRegion[]> {
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 获取单个区域详情
 * 实际实现：从MySQL数据库查询geo_data表
 */
export async function getRegionById(id: number): Promise<GeoRegion | null> {
  // eslint-disable-next-line no-console
  console.log('Fetching region by id:', id);
  
  // TODO: 替换为真实API调用
  return null;
}

/**
 * 按朝代筛选区域
 * 实际实现：从MySQL数据库查询geo_data表
 */
export async function getRegionsByDynasty(dynasty: string): Promise<GeoRegion[]> {
  // eslint-disable-next-line no-console
  console.log('Fetching regions by dynasty:', dynasty);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 按农作物筛选区域
 * 实际实现：从MySQL数据库查询geo_data表
 */
export async function getRegionsByCrop(crop: string): Promise<GeoRegion[]> {
  // eslint-disable-next-line no-console
  console.log('Fetching regions by crop:', crop);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 按农业技术筛选区域
 * 实际实现：从MySQL数据库查询geo_data表
 */
export async function getRegionsByTechnique(technique: string): Promise<GeoRegion[]> {
  // eslint-disable-next-line no-console
  console.log('Fetching regions by technique:', technique);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 获取所有农作物列表
 * 实际实现：从MySQL数据库查询geo_data表并聚合
 */
export async function getAllCrops(): Promise<string[]> {
  // TODO: 替换为真实API调用
  return [
    '水稻', '小麦', '高粱', '大豆',
    '棉花', '桑蚕', '茶叶', '甘蔗',
    '荔枝', '柑橘', '粟', '麻',
  ];
}

/**
 * 获取所有农业技术列表
 * 实际实现：从MySQL数据库查询geo_data表并聚合
 */
export async function getAllTechniques(): Promise<string[]> {
  // TODO: 替换为真实API调用
  return [
    '双季稻', '圩田', '轮作', '灌溉',
    '梯田', '水利', '基塘农业', '井渠',
    '代田', '垸田', '围湖造田',
  ];
}

/**
 * 获取农作物分布统计
 * 实际实现：从MySQL数据库查询geo_data表并聚合
 */
export async function getCropDistribution(): Promise<CropDistribution[]> {
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 获取技术分布统计
 * 实际实现：从MySQL数据库查询geo_data表并聚合
 */
export async function getTechniqueDistribution(): Promise<AgriculturalTechnique[]> {
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 搜索区域
 * 实际实现：从MySQL数据库查询geo_data表
 */
export async function searchRegions(keyword: string): Promise<GeoRegion[]> {
  // eslint-disable-next-line no-console
  console.log('Searching regions with keyword:', keyword);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 添加新区域（管理员功能）
 * 实际实现：向MySQL数据库geo_data表插入数据
 */
export async function addRegion(region: Omit<GeoRegion, 'id' | 'created_at'>): Promise<GeoRegion> {
  // eslint-disable-next-line no-console
  console.log('Adding new region:', region);
  
  // TODO: 替换为真实API调用
  throw new Error('Not implemented');
}

/**
 * 更新区域信息（管理员功能）
 * 实际实现：更新MySQL数据库geo_data表
 */
export async function updateRegion(
  id: number,
  region: Partial<Omit<GeoRegion, 'id' | 'created_at'>>
): Promise<GeoRegion> {
  // eslint-disable-next-line no-console
  console.log('Updating region:', id, region);
  
  // TODO: 替换为真实API调用
  throw new Error('Not implemented');
}

/**
 * 删除区域（管理员功能）
 * 实际实现：从MySQL数据库geo_data表删除数据
 */
export async function deleteRegion(id: number): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('Deleting region:', id);
  
  // TODO: 替换为真实API调用
  throw new Error('Not implemented');
}

/**
 * 获取区域内的文献列表
 * 实际实现：关联查询documents表
 */
export async function getRegionDocuments(regionId: number): Promise<any[]> {
  // eslint-disable-next-line no-console
  console.log('Fetching documents for region:', regionId);
  
  // TODO: 替换为真实API调用
  return [];
}

/**
 * 获取GIS统计数据
 */
export async function getGISStatistics(): Promise<{
  totalRegions: number;
  totalCrops: number;
  totalTechniques: number;
  dynastyDistribution: Record<string, number>;
}> {
  // TODO: 替换为真实API调用
  return {
    totalRegions: 6,
    totalCrops: 12,
    totalTechniques: 11,
    dynastyDistribution: {
      '明代': 3,
      '清代': 3,
    },
  };
}

export default {
  getAllRegions,
  getRegionById,
  getRegionsByDynasty,
  getRegionsByCrop,
  getRegionsByTechnique,
  getAllCrops,
  getAllTechniques,
  getCropDistribution,
  getTechniqueDistribution,
  searchRegions,
  addRegion,
  updateRegion,
  deleteRegion,
  getRegionDocuments,
  getGISStatistics,
};
