# Stagewise 启用指南

## 什么是 Stagewise？

Stagewise 是 Cursor/Kimi 的一个开发工具，用于管理开发阶段和插件。

## 配置文件

项目根目录下的 `stagewise.json` 已配置：

```json
{
  "port": 3100,
  "appPort": 3000,
  "autoPlugins": true,
  "plugins": [],
  "repository": {
    "type": "git",
    "url": "https://github.com/loidthinhfbuir-lab/Web-Project.git",
    "branch": "main"
  },
  "github": {
    "owner": "loidthinhfbuir-lab",
    "repo": "Web-Project",
    "branch": "main"
  }
}
```

## 启用方法

### 方法 1：通过 Cursor 界面启用

1. 在 Cursor 中打开项目
2. 查看底部状态栏或侧边栏，寻找 "Stagewise" 或 "Plugins" 选项
3. 点击启用 Stagewise
4. 如果提示需要配置，确保 `stagewise.json` 文件存在且配置正确

### 方法 2：通过命令启动

在项目根目录运行：

```bash
# 启动前端（端口 3000）
npm run stagewise

# 启动后端服务器（端口 4000）
npm run stagewise:server
```

### 方法 3：检查 Cursor 设置

1. 打开 Cursor 设置（`Ctrl + ,` 或 `Cmd + ,`）
2. 搜索 "stagewise" 或 "plugins"
3. 确保 Stagewise 插件已启用

## 验证是否启用

1. 检查端口 3100 是否被占用（Stagewise 服务端口）
2. 检查端口 3000 是否被占用（应用端口）
3. 查看 Cursor 的开发者工具或日志，确认 Stagewise 是否已连接

## 故障排除

如果 Stagewise 无法启用：

1. **检查配置文件**：确保 `stagewise.json` 格式正确
2. **检查端口**：确保端口 3100 和 3000 未被其他程序占用
3. **检查 Git 连接**：确保 GitHub 仓库连接正常
4. **重启 Cursor**：有时需要重启 Cursor 才能加载新配置
5. **查看日志**：检查 Cursor 的开发者控制台是否有错误信息

## 相关链接

- GitHub 仓库：https://github.com/loidthinhfbuir-lab/Web-Project
- 分支：main


