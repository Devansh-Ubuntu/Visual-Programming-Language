
# Why Did the Chicken Cross the Road? – A Programming Language 🐔

A visual programming language designed to teach core programming concepts in a fun and intuitive, game-like environment.

---

## ​ Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Language Concepts](#language-concepts)

---

## ​ About

This project presents a playful yet educational visual programming language built around the classic joke *“Why Did the Chicken Cross the Road?”*, guiding users through fundamental programming paradigms — like sequence, conditionals, loops, and functions — using an interactive block-based interface.

**GitHub Repo:**  
https://github.com/Devansh-Ubuntu/Visual-Programming-Language

---

## ​ Features

- **Drag & Drop Blocks**: Chain commands like “moveChicken()” or “ifEggExists() → doAction()”.
- **Real-time Execution**: See immediate results of block arrangements.
- **Educational Targets**: Covers control structures, iteration, variable usage.
- **Cross-Platform**: Runs as a desktop app (e.g., Electron/Qt) or web-based tool.
- **Extensible Architecture**: Supports adding custom blocks and control flows.

---

## ​​ Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Devansh-Ubuntu/Visual-Programming-Language.git
   cd Visual-Programming-Language

2. **Install dependencies**
   ```bash
   npm install   # or pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   npm start     # or python main.py
   ```

4. **Open the app** in your browser or desktop environment.

## Usage

1. **Create a new project.**
2. **Drag blocks** (e.g., `moveForward`, `turnLeft`, `loop`, `if`) onto the canvas.
3. **Assemble logic** to guide the chicken across the road.
4. **Run**, **debug**, and **reset** your sequence.
5. **Save/share** custom challenges and solutions.

---

## Language Concepts

| Block Type            | Description                              |
|-----------------------|------------------------------------------|
| `moveChicken()`       | Moves the chicken one step forward       |
| `turnLeft()/turnRight()` | Alters movement direction               |
| `loop(n)`             | Repeats enclosed blocks `n` times        |
| `if … then …`         | Conditional execution                    |
| `function()`          | Define reusable code blocks              |
