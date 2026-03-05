import "dotenv/config";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as shp from "shpjs";

// 明清农业数据库 MySQL 连接配置（从环境变量读取，本地开发请创建 .env 文件，参考 .env.example）
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  database: process.env.MYSQL_DATABASE || "mingqing agricultural database",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  charset: "utf8mb4",
  connectionLimit: 10,
  // TiDB Cloud 等云数据库要求 SSL 连接；设置 MYSQL_SSL=true 启用
  ...(process.env.MYSQL_SSL === "true" ? { ssl: { rejectUnauthorized: true } } : {}),
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

const app = express();
const PORT = process.env.PORT || 4000;

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());

// 简单健康检查
app.get("/api/health", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok === 1 });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(500).json({ status: "error", message: "数据库连接失败" });
  }
});

// 获取文档列表，对应前端 Database 页面
app.get("/api/documents", async (_req, res) => {
  try {
    // 这里假设你的 MySQL 中有名为 documents 的表，并包含这些字段
    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        author,
        dynasty,
        publish_year,
        category,
        subcategory,
        description,
        cover_image    AS cover_image,
        file_path      AS file_path,
        file_size      AS file_size,
        file_format    AS file_format,
        pages,
        downloads,
        views,
        rating
      FROM documents
      ORDER BY id ASC
    `
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ message: "获取文档列表失败" });
  }
});

// 明代省级数据
app.get("/api/ming_province", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `ming_province`");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching ming_province:", err);
    res.status(500).json({ message: "获取明代省级数据失败" });
  }
});

// 清代省级数据
app.get("/api/qing_province", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `qing_province`");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching qing_province:", err);
    res.status(500).json({ message: "获取清代省级数据失败" });
  }
});

// 清代府级数据
app.get("/api/qing_prefecture", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `qing_prefecture`");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching qing_prefecture:", err);
    res.status(500).json({ message: "获取清代府级数据失败" });
  }
});

// 根据 ID 获取单条文档详情（供 ResourceDetail 使用）
app.get("/api/documents/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        author,
        dynasty,
        publish_year,
        category,
        subcategory,
        description,
        cover_image    AS cover_image,
        file_path      AS file_path,
        file_size      AS file_size,
        file_format    AS file_format,
        pages,
        downloads,
        views,
        rating
      FROM documents
      WHERE id = ?
    `,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "未找到该文献" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching document by id:", err);
    res.status(500).json({ message: "获取文献详情失败" });
  }
});

// 测试端点 - 验证 API 是否工作
app.get("/api/gis/test", (_req, res) => {
  res.json({ message: "GIS API 工作正常", timestamp: new Date().toISOString() });
});

// 获取 qing_prefecture 表的所有数值型字段（用于前端字段选择器）
app.get("/api/gis/fields", async (_req, res) => {
  try {
    // 获取表结构
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'qing_prefecture'
    `);
    
    // 筛选数值型字段（可用于可视化）
    const numericTypes = ['int', 'bigint', 'float', 'double', 'decimal', 'numeric', 'tinyint', 'smallint', 'mediumint'];
    const numericFields = columns
      .filter(col => numericTypes.some(t => col.DATA_TYPE.toLowerCase().includes(t)))
      .map(col => col.COLUMN_NAME);
    
    // 获取所有字段名
    const allFields = columns.map(col => col.COLUMN_NAME);
    
    res.json({
      numericFields,  // 可用于颜色渐变可视化的数值字段
      allFields,      // 所有字段
    });
  } catch (err) {
    console.error("Error fetching fields:", err);
    res.status(500).json({ message: "获取字段列表失败" });
  }
});

// 获取 merge 后的 GeoJSON 数据（shp + qing_prefecture 按 NAME_CH 合并）
app.get("/api/gis/merged", async (_req, res) => {
  try {
    const shpPath = join(__dirname, "十八省底图.shp");
    const dbfPath = join(__dirname, "十八省底图.dbf");

    // 检查文件是否存在
    if (!existsSync(shpPath)) {
      return res.status(404).json({
        message: "未找到 shp 文件",
        hint: `请确保 '十八省底图.shp' 文件在项目根目录下。`,
      });
    }

    // 读取 shp 文件
    const shpBuffer = readFileSync(shpPath);
    let dbfBuffer = null;
    if (existsSync(dbfPath)) {
      dbfBuffer = readFileSync(dbfPath);
    }

    // 解析 shp 文件
    let geoJson;
    if (dbfBuffer) {
      const geometries = shp.parseShp(shpBuffer);
      const attributes = shp.parseDbf(dbfBuffer);
      geoJson = {
        type: "FeatureCollection",
        features: geometries.map((geometry, index) => ({
          type: "Feature",
          geometry: geometry,
          properties: attributes[index] || { id: index + 1 },
        })),
      };
    } else {
      const geometries = shp.parseShp(shpBuffer);
      geoJson = {
        type: "FeatureCollection",
        features: geometries.map((geometry, index) => ({
          type: "Feature",
          geometry: geometry,
          properties: { id: index + 1 },
        })),
      };
    }

    // 从数据库获取 qing_prefecture 数据
    const [prefectureData] = await pool.query("SELECT * FROM `qing_prefecture`");
    
    // 创建 NAME_CH -> 数据 的映射
    const prefectureMap = new Map();
    prefectureData.forEach(row => {
      if (row.NAME_CH) {
        prefectureMap.set(row.NAME_CH, row);
      }
    });

    // Merge: 将数据库数据合并到 GeoJSON 的 properties 中
    const mergedFeatures = geoJson.features.map(feature => {
      const nameCH = feature.properties?.NAME_CH;
      const dbData = nameCH ? prefectureMap.get(nameCH) : null;
      
      return {
        ...feature,
        properties: {
          ...feature.properties,
          // 添加数据库字段（以 db_ 前缀区分）
          ...(dbData ? Object.fromEntries(
            Object.entries(dbData).map(([k, v]) => [`db_${k}`, v])
          ) : {}),
          // 标记是否成功匹配
          _merged: !!dbData,
        },
      };
    });

    // 统计匹配情况
    const matchedCount = mergedFeatures.filter(f => f.properties._merged).length;
    console.log(`GIS Merge: ${matchedCount}/${mergedFeatures.length} 个要素成功匹配数据库记录`);

    res.json({
      type: "FeatureCollection",
      features: mergedFeatures,
      _meta: {
        totalFeatures: mergedFeatures.length,
        matchedFeatures: matchedCount,
        unmatchedFeatures: mergedFeatures.length - matchedCount,
      },
    });
  } catch (err) {
    console.error("Error creating merged GeoJSON:", err);
    res.status(500).json({
      message: "创建合并数据失败",
      error: err.message,
    });
  }
});

// 获取 shp 文件并转换为 GeoJSON
app.get("/api/gis/shapefile", async (_req, res) => {
  try {
    const shpPath = join(__dirname, "十八省底图.shp");
    const shxPath = join(__dirname, "十八省底图.shx");
    const dbfPath = join(__dirname, "十八省底图.dbf");

    // 检查文件是否存在
    if (!existsSync(shpPath)) {
      return res.status(404).json({
        message: "未找到 shp 文件",
        hint: `请确保 '十八省底图.shp' 文件在项目根目录下。当前查找路径: ${shpPath}`,
      });
    }

    // 读取 shp 文件（必需）
    const shpBuffer = readFileSync(shpPath);
    
    // 尝试读取配套文件
    let shxBuffer = null;
    let dbfBuffer = null;
    
    if (existsSync(shxPath)) {
      shxBuffer = readFileSync(shxPath);
    } else {
      console.warn("警告: 未找到 .shx 文件，可能影响数据读取");
    }
    
    if (existsSync(dbfPath)) {
      dbfBuffer = readFileSync(dbfPath);
    } else {
      console.warn("警告: 未找到 .dbf 文件，属性信息可能不完整");
    }

    // 使用 shpjs 库解析
    // shpjs 可以直接处理 Buffer
    let geoJson;
    
    try {
      if (dbfBuffer) {
        // 如果有 dbf 文件，使用完整解析
        // shpjs.parseShp 和 shp.parseDbf 可以直接处理 Buffer
        const geometries = shp.parseShp(shpBuffer);
        const attributes = shp.parseDbf(dbfBuffer);
        
        // 合并几何和属性
        geoJson = {
          type: "FeatureCollection",
          features: geometries.map((geometry, index) => ({
            type: "Feature",
            geometry: geometry,
            properties: attributes[index] || { id: index + 1 },
          })),
        };
      } else {
        // 只有 shp 文件
        const geometries = shp.parseShp(shpBuffer);
        geoJson = {
          type: "FeatureCollection",
          features: geometries.map((geometry, index) => ({
            type: "Feature",
            geometry: geometry,
            properties: { id: index + 1 },
          })),
        };
      }
    } catch (parseError) {
      console.error("解析 shp 文件时出错:", parseError);
      console.error("错误堆栈:", parseError.stack);
      throw new Error(`解析 shp 文件失败: ${parseError.message}`);
    }

    // 确保返回正确的 GeoJSON 格式
    if (!geoJson || !geoJson.features || !Array.isArray(geoJson.features)) {
      throw new Error("解析 shp 文件失败，返回的数据格式不正确");
    }

    console.log(`成功解析 shp 文件，共 ${geoJson.features.length} 个要素`);
    res.json(geoJson);
  } catch (err) {
    console.error("Error reading shapefile:", err);
    // 如果读取失败，返回详细的错误信息
    res.status(500).json({
      message: "读取 shp 文件失败",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      hint: "请确保 shp 文件及其配套文件（.shx, .dbf）都在项目根目录下。",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


