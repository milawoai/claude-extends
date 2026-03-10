# 贡献指南 / Contributing Guidelines

## 中文

### 如何贡献

1. **Fork 本仓库**
2. **创建新分支** (`git checkout -b feature/your-extension`)
3. **添加你的扩展工具**到 `extensions/` 目录
4. **编写文档**：在 `docs/` 目录中为你的工具创建文档
5. **添加示例**：在 `examples/` 目录中提供使用示例
6. **提交更改** (`git commit -m '添加新的扩展工具: your-extension'`)
7. **推送分支** (`git push origin feature/your-extension`)
8. **创建 Pull Request**

### 扩展工具规范

- 每个扩展工具应该有清晰的目录结构
- 必须包含 README.md 说明文件
- 代码应该有适当的注释
- 提供使用示例
- 如果有依赖，请在文档中明确说明

### 目录结构示例

```
extensions/
└── your-extension/
    ├── README.md           # 工具说明
    ├── src/               # 源代码
    ├── tests/             # 测试（如果有）
    └── requirements.txt   # 依赖（如果需要）
```

---

## English

### How to Contribute

1. **Fork this repository**
2. **Create a new branch** (`git checkout -b feature/your-extension`)
3. **Add your extension tool** to the `extensions/` directory
4. **Write documentation**: Create documentation for your tool in the `docs/` directory
5. **Add examples**: Provide usage examples in the `examples/` directory
6. **Commit your changes** (`git commit -m 'Add new extension tool: your-extension'`)
7. **Push to the branch** (`git push origin feature/your-extension`)
8. **Create a Pull Request**

### Extension Tool Standards

- Each extension tool should have a clear directory structure
- Must include a README.md file
- Code should have appropriate comments
- Provide usage examples
- If there are dependencies, clearly specify them in the documentation

### Example Directory Structure

```
extensions/
└── your-extension/
    ├── README.md           # Tool description
    ├── src/               # Source code
    ├── tests/             # Tests (if any)
    └── requirements.txt   # Dependencies (if needed)
```

## 代码规范 / Code Standards

- 保持代码整洁和可读性 / Keep code clean and readable
- 遵循相应语言的最佳实践 / Follow best practices for the respective language
- 添加必要的错误处理 / Add necessary error handling
- 编写清晰的文档和注释 / Write clear documentation and comments

## 问题反馈 / Issue Reporting

如果您发现问题或有改进建议，请创建 Issue。

**English:** If you find issues or have suggestions for improvement, please create an Issue.
