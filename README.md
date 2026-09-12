<div align="center">

# Code Craft

> A modern, browser-based code editor and IDE clone built with React, Vite, TypeScript, and Monaco Editor.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-Bundler-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8)
![Monaco](https://img.shields.io/badge/Editor-Monaco-007ACC)

</div>

---

## Overview

**Code Craft** is a lightweight, feature-rich online code editor inspired by Visual Studio Code. It provides a seamless development experience right inside your browser, featuring multi-language execution, customizable themes, cheat sheets, community code snippets, and a fully realized VS Code-like interface layout (including activity bars, status bars, command palettes, and terminal panels).

---

## Features

- **VS Code Interface Experience**: Custom title bar, activity bar, primary sidebar, editor tabs, command palette (`Ctrl+P`), and bottom terminal console.
- **Monaco Editor Integration**: Powered by the same editor engine as VS Code for rich syntax highlighting and code completion.
- **Multi-Language Support**: Execute and test code snippets across multiple languages (JavaScript, TypeScript, Python, C++, Go, Rust, Java, etc.).
- **Theme Customization**: Switch between different visual themes and styles.
- **Community Snippets**: View, save, and share code snippets with other developers.
- **Language Cheat Sheets**: Quick reference guide built right into the app.
- **State Management**: Robust client state handling using Zustand.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React** | UI Component Library |
| **Vite** | Fast Frontend Build Tool & Bundler |
| **TypeScript** | Static Type Safety |
| **Tailwind CSS v4** | Modern Utility-First Styling |
| **Monaco Editor** | Browser Code Editor Core |
| **Zustand** | Lightweight State Management |
| **Lucide React** | Icons |
| **React Hot Toast** | Notifications & Alerts |

---

## Project Structure

```text
code-craft/
├── public/                 # Static assets, logos, and icons
├── src/
│   ├── components/         # Reusable UI components & modals
│   │   ├── views/          # Main view containers (Editor, Profile, Snippets)
│   │   └── vscode/         # VS Code layout components (ActivityBar, Terminal, TitleBar)
│   ├── constants/          # Application constants & default settings
│   ├── store/              # Zustand state stores (app & code editor)
│   ├── types/              # TypeScript interfaces & type definitions
│   ├── App.tsx             # Main root component
│   ├── index.css           # Global stylesheet & Tailwind directives
│   └── main.tsx            # Application entry point
├── .env.example            # Environment variables template
├── index.html              # HTML root template
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration

```

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/mhdhamka/Code-Craft.git

```

### 2. Navigate into the project directory

```bash
cd code-craft

```

### 3. Install dependencies

```bash
npm install

```

### 4. Configure environment variables

Create a copy of the example environment file:

```bash
cp .env.example .env

```

### 5. Run the development server

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repository and submit a pull request.

---

## License

This project is intended for educational, personal, and portfolio purposes.

---

If you found this project interesting, consider giving it a star! ⭐

Made with ❤️ by **mdhamka**