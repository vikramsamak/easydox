# Easydox

![npm](https://img.shields.io/npm/v/easydox)
![npm](https://img.shields.io/npm/dw/easydox)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/easydox)
![GitHub](https://img.shields.io/github/license/vikramsamak/easydox)
![GitHub stars](https://img.shields.io/github/stars/vikramsamak/easydox?style=social)

> ✨ **Easydox** - Automate your JavaScript/TypeScript project documentation effortlessly using your code comments, JSDoc, and AST magic.

---

## 🚀 What is Easydox?

**Easydox** is a powerful CLI tool that helps you automatically generate documentation (`Markdown`, `JSON`, and even `MDX`) directly from your JavaScript/TypeScript codebase.

💡 **Moto**:  
_"Write code, comment well, and let Easydox handle your docs!"_

---

## 📦 Installation

```bash
npm install -g easydox
```

or locally:

```bash
npm install --save-dev easydox
```

---

## 🛠️ Usage

### **Interactive Mode (Recommended)**

```bash
easydox
```

Easydox will walk you through questions to configure everything interactively.

### **Non-interactive (Args Mode)**

```bash
easydox -s ./src -o ./docs -f md,json,mdx
```

| Option     | Description                                  |
|------------|----------------------------------------------|
| `-s, --source` | Source directory (default: `./src`)           |
| `-o, --output` | Output directory (default: `./docs`)          |
| `-f, --formats`| Output formats, comma-separated (`md`, `json`, `mdx`) |

---

## ✨ Features

- 🚀 **Auto-generated Markdown docs** from your JS/TS files.
- 🧠 **AST-powered** parsing (via Babel) for deep analysis.
- 📝 **Supports JSDoc** comments extraction.
- 🎯 **Multiple formats**: Markdown, JSON, MDX.
- ⚙️ **Flexible CLI**: interactive or non-interactive modes.
- 🧩 Easy integration with any JS/TS project.
- 💥 **Fast and developer-friendly**!

---

## 📄 Example Output

```bash
/docs
 ┣ 📄 api.md
 ┣ 📄 api.json
 ┗ 📄 api.mdx
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or PR.

---

## 📜 License

MIT © [Vikram Samak](https://github.com/vikramsamak)

---
