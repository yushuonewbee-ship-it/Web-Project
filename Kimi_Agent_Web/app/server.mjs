import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

// 明清农业数据库 MySQL 连接配置（与 src/config/database.ts 保持一致）
const dbConfig = {
  host: "localhost",
  port: 3306,
  database: "mingqing agricultural database",
  user: "YuuShuo",
  password: "Lys20050220",
  charset: "utf8mb4",
  connectionLimit: 10,
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

const app = express();
const PORT = process.env.PORT || 4000;

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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


