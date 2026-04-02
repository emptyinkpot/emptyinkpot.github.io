# VSCode Claude Code 插件使用外部插件配置指南

## 核心知识点总结

### 1. Claude Code 配置架构

Claude Code 采用分层配置机制，支持多种配置源：

- **用户级配置**：`~/.claude/settings.json` - 全局个人偏好
- **项目级配置**：`.claude/settings.json` - 团队共享配置
- **本地配置**：`.claude/settings.local.json` - 项目个人覆盖配置

配置加载顺序：用户 → 项目 → 本地（后者覆盖前者）

### 2. 模型配置机制

当前配置使用的是 LongCat-Flash-Thinking-2601 模型，通过环境变量指定 API 端点：

```json
{
  "model": "LongCat-Flash-Thinking-2601",
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "ak_25P7PE0dT5O235q5VQ2Qq39a5pC8U",
    "ANTHROPIC_BASE_URL": "https://api.longcat.chat/anthropic",
    "ANTHROPIC_MODEL": "LongCat-Flash-Thinking-2601",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "6000"
  }
}
```

### 3. VSCode 插件识别机制

Claude Code 通过以下方式与 VSCode 集成：

1. **插件安装**：通过 VSCode 扩展市场安装 Claude Code 插件
2. **配置同步**：插件读取用户和项目级别的 settings.json 文件
3. **环境变量注入**：插件启动时会注入配置的环境变量
4. **模型连接**：通过配置的 API 端点和认证令牌连接 AI 服务

## 外部插件配置指南

### 1. 插件类型

Claude Code 支持多种外部插件：

- **Formatter 插件**：代码格式化工具
- **MCP 服务器**：Model Context Protocol 服务器
- **Agent 插件**：自定义代理工具
- **Hook 插件**：自动化脚本

### 2. 配置方法

#### 2.1 通过 settings.json 配置

在项目根目录创建 `.claude/settings.json` 文件：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "enabledPlugins": {
    "formatter@anthropic-tools": true,
    "mcp-server@claude-plugins-official": true
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["my-custom-server"]
}
```

#### 2.2 配置插件参数

```json
{
  "pluginConfigs": {
    "my-plugin@marketplace": {
      "options": {
        "formatOnSave": true,
        "typescript": {
          "target": "ES2020"
        }
      },
      "mcpServers": {
        "memory-server": {
          "command": "docker",
          "args": ["run", "-i", "mcp/memory"]
        }
      }
    }
  }
}
```

#### 2.3 配置 Hook 插件

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "prettier --write $FILE",
        "timeout": 30
      }]
    }]
  }
}
```

### 3. 插件市场配置

#### 3.1 添加自定义市场源

```json
{
  "extraKnownMarketplaces": {
    "my-company-marketplace": {
      "source": {
        "source": "github",
        "repo": "mycompany/claude-plugins",
        "path": ".claude-plugin/marketplace.json"
      },
      "autoUpdate": true
    }
  }
}
```

#### 3.2 企业环境配置

```json
{
  "strictKnownMarketplaces": [
    {
      "source": "hostPattern",
      "hostPattern": "^github\\.mycompany\\.com$"
    }
  ],
  "allowedMcpServers": [
    {
      "serverName": "company-mcp-server",
      "serverCommand": ["docker", "run", "company/mcp"]
    }
  ]
}
```

### 4. 权限配置

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Edit(.claude)",
      "Read",
      "Write(src/**/*.ts)"
    ],
    "deny": [
      "Bash(rm -rf:*)"
    ],
    "ask": [
      "Write(/etc/*)"
    ],
    "defaultMode": "default"
  }
}
```

### 5. 环境变量配置

```json
{
  "env": {
    "DEBUG": "true",
    "API_KEY": "${env:MY_API_KEY}",
    "CUSTOM_ENDPOINT": "https://api.example.com/v1"
  }
}
```

## 配置示例

### 完整项目配置示例

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "claude-sonnet-4-6",
  "effortLevel": "high",
  "language": "chinese",

  "enabledPlugins": {
    "formatter@anthropic-tools": true,
    "test-runner@claude-plugins-official": true
  },

  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; prettier --write \"$f\"; }",
        "timeout": 30,
        "statusMessage": "格式化代码..."
      }]
    }]
  },

  "permissions": {
    "allow": ["Bash(npm:*)", "Bash(git:*)", "Edit", "Read"],
    "deny": ["Bash(rm -rf:*)"],
    "defaultMode": "default"
  },

  "env": {
    "DEBUG": "true",
    "NODE_ENV": "development"
  }
}
```

## 故障排除

### 1. 配置不生效

- 检查 JSON 语法是否正确
- 确认配置文件位置是否正确
- 重启 VSCode 以重新加载配置

### 2. 插件无法加载

- 检查网络连接
- 验证插件名称和版本
- 查看 VSCode 输出面板中的错误信息

### 3. 权限问题

- 检查权限配置是否正确
- 确认用户是否有足够的权限
- 查看控制台日志获取详细信息

## 最佳实践

1. **版本控制**：将 `.claude/settings.json` 提交到版本控制，`.claude/settings.local.json` 添加到 `.gitignore`
2. **环境隔离**：使用本地配置存储敏感信息
3. **渐进式配置**：先配置核心功能，再添加高级特性
4. **文档记录**：在项目 README 中记录重要配置

## 参考资源

- [Claude Code 官方文档](https://docs.anthropic.com/claude-code)
- [插件开发指南](https://docs.anthropic.com/claude-code/plugins)
- [配置 Schema](https://json.schemastore.org/claude-code-settings.json)