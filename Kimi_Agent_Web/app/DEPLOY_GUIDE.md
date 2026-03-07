# 🚀 明清农业数据库 - 部署指南（TiDB Cloud + Render + Vercel）

## 📋 你的 TiDB Cloud 连接信息

| 配置项 | 值 |
|--------|-----|
| **Host** | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` |
| **Port** | `4000` |
| **Username** | `aKp6i8j624HvpKh.root` |
| **Password** | `7jwIjbd7Rc9Qnx0U` |
| **Database** | `mingqing agricultural database` |

---

## ⚠️ 重要：TiDB Cloud 网络配置

在部署之前，**必须先配置 TiDB Cloud 的 IP 白名单**：

1. 登录 [TiDB Cloud 控制台](https://tidbcloud.com)
2. 点击你的集群 → **Network** → **IP Access List**
3. 添加 `0.0.0.0/0`（允许所有 IP 访问）
   - 或者只添加 Render 的 IP 段（但更复杂）
4. 点击 **Save Changes**

> 如果不配置这一步，Render 服务器会被拒绝连接！

---

## 第一步：部署后端到 Render

### 1.1 登录 Render 并创建服务

1. 打开 [Render Dashboard](https://dashboard.render.com)
2. 点击 **New → Web Service**
3. 连接你的 GitHub 仓库

### 1.2 配置 Build 设置

| 配置项 | 值 |
|--------|-----|
| **Name** | `mingqing-api`（或你喜欢的名字） |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.mjs` |

### 1.3 添加环境变量

点击 **Environment** 标签，添加以下变量：

```
MYSQL_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
MYSQL_PORT=4000
MYSQL_DATABASE=mingqing agricultural database
MYSQL_USER=aKp6i8j624HvpKh.root
MYSQL_PASSWORD=7jwIjbd7Rc9Qnx0U
MYSQL_SSL=true
PORT=10000
NODE_ENV=production
```

> ⚠️ **注意**：`MYSQL_SSL=true` 是 TiDB Cloud 连接必需的！

### 1.4 部署并测试

1. 点击 **Create Web Service**
2. 等待部署完成（Build 和 Deploy 都变成 ✅）
3. 访问测试地址：`https://mingqing-api.onrender.com/api/health`

**成功响应**：
```json
{
  "status": "ok",
  "db": true
}
```

**如果失败**，会显示详细的错误信息，包括：
- 错误代码
- 当前使用的连接配置（密码会部分隐藏）
- SSL 是否启用

记下你的 Render 地址，例如：`https://mingqing-api.onrender.com`

---

## 第二步：部署前端到 Vercel

### 2.1 导入项目

1. 打开 [Vercel Dashboard](https://vercel.com)
2. 点击 **Add New → Project**
3. 导入同一个 GitHub 仓库

### 2.2 配置构建设置

| 配置项 | 值 |
|--------|-----|
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 2.3 添加环境变量

点击 **Environment Variables**，添加：

```
VITE_API_URL=https://mingqing-api.onrender.com
```

> ⚠️ **不要**在末尾加 `/`

### 2.4 部署

点击 **Deploy**，等待部署完成。

---

## 第三步：验证部署

### 3.1 测试后端 API

访问以下地址：

```
https://mingqing-api.onrender.com/api/health
https://mingqing-api.onrender.com/api/gis/test
https://mingqing-api.onrender.com/api/documents
```

### 3.2 测试前端页面

访问 Vercel 提供的域名，测试：
- 文献数据库页面
- GIS 地图页面
- 资源详情页面

---

## 🔧 故障排查

### 问题 1：数据库连接超时

**症状**：访问 `/api/health` 返回超时错误

**解决方法**：
1. 检查 TiDB Cloud 的 IP 白名单是否配置了 `0.0.0.0/0`
2. 检查环境变量 `MYSQL_SSL` 是否设置为 `true`
3. 检查 `MYSQL_HOST` 是否正确（应该是 `.tidb-cloud.com` 结尾）

### 问题 2：连接被拒绝

**症状**：错误代码 `ECONNREFUSED`

**解决方法**：
- 确认 Render 服务器的 IP 在 TiDB Cloud 白名单中
- 检查 `MYSQL_PORT` 是否为 `4000`（TiDB 默认端口）

### 问题 3：SSL 相关错误

**症状**：`SSL connection is required` 或 `unable to verify the first certificate`

**解决方法**：
- 确保设置了 `MYSQL_SSL=true`
- 我已经在代码中配置了 `rejectUnauthorized: true`，这是 TiDB Cloud 推荐的设置

### 问题 4：数据库不存在

**症状**：`Unknown database 'xxx'`

**解决方法**：
- 登录 TiDB Cloud 控制台，确认数据库 `mingqing agricultural database` 已创建
- 或者检查 `MYSQL_DATABASE` 环境变量是否正确

### 问题 5：shp 文件找不到（GIS 功能）

**症状**：GIS 地图显示空白或报错

**解决方法**：
- 确保 `十八省底图.shp` 和配套文件已提交到 Git
- 检查 Render 日志中是否显示文件读取成功

---

## 📁 项目文件结构确认

确保以下文件都在项目根目录（`Kimi_Agent_Web/app/`）：

```
Kimi_Agent_Web/app/
├── server.mjs          # 后端入口
├── package.json        # 依赖配置
├── vercel.json         # Vercel 配置
├── render.yaml         # Render 配置（可选）
├── .env.example        # 环境变量示例
├── .gitignore          # Git 忽略文件
├── 十八省底图.shp      # GIS 文件（必需）
├── 十八省底图.dbf      # GIS 属性文件
├── 十八省底图.shx      # GIS 索引文件
└── dist/               # 前端构建输出
```

---

## 🔄 更新部署后的代码

当你修改代码后：

1. **提交到 Git**：`git add . && git commit -m "xxx" && git push`
2. **Render 会自动重新部署**（约 1-2 分钟）
3. **Vercel 也会自动重新部署**

---

## 💡 优化建议

1. **数据库名称**：建议把 `mingqing agricultural database` 改为 `mingqing_agricultural_database`（用下划线代替空格），避免潜在问题
   - 登录 TiDB Cloud → SQL Editor → 执行：`CREATE DATABASE mingqing_agricultural_database;`
   - 然后导入数据到新数据库

2. **冷启动问题**：Render 免费版会在 15 分钟无访问后休眠，首次访问会比较慢（约 30 秒），这是正常现象

3. **监控日志**：定期查看 Render Dashboard 的 Logs 标签，监控是否有错误

---

## 📞 还需要帮助？

如果按以上步骤操作后还有问题，请提供：
1. Render 的完整错误日志（Dashboard → Logs）
2. 访问 `/api/health` 的返回结果
3. 浏览器控制台的错误信息
