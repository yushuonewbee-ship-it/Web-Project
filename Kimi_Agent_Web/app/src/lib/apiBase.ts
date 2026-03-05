/**
 * 后端 API 基地址
 * - 本地开发：不设置 VITE_API_URL，使用相对路径，由 Vite 代理到 localhost:4000
 * - 生产环境：在 Vercel 等平台设置 VITE_API_URL 为后端地址，如 https://xxx.onrender.com
 */
export const apiBase = import.meta.env.VITE_API_URL ?? '';
