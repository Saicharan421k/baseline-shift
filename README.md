

# 🚀 Baseline Shift: Your Intelligent Code Modernization Advisor

> A submission for the **Baseline Tooling Hackathon**.

**Baseline Shift** is a smart VS Code extension that acts as your personal refactoring coach. It doesn't just find browser compatibility problems; it proactively identifies outdated JavaScript and CSS patterns in your code and offers single-click **"Quick Fixes"** to upgrade them to their modern, faster, and **Baseline-supported** equivalents.

It turns the Baseline dataset from a passive checklist into an active, automated tool for accelerating web modernization.

-----

## The Problem: The Inertia of Old Code

Developers working in existing codebases constantly face a choice: stick with old, familiar patterns (`array.indexOf`) or spend time looking up and manually refactoring to the modern, safer alternative (`array.includes`). Manually auditing and upgrading a large project is tedious, error-prone, and rarely prioritized.

Current tools are good at saying "no" (you can't use this new feature), but they fail at saying "yes, and here's how" (you should use this better, safer alternative).

-----

## The Solution: Proactive, Automated Upgrades

**Baseline Shift** intelligently finds these modernization opportunities and offers to fix them for you, right inside your editor. It flips the paradigm from negative enforcement to **positive reinforcement**, making it trivially easy to improve your code quality and adopt modern web standards.

-----

## ✅ Core Features

  * **Automated JavaScript Modernization:** Identifies legacy JS patterns and provides a VS Code "Quick Fix" to automatically refactor them.
  * **Intelligent CSS Suggestions:** Finds outdated CSS properties used for layout and suggests modern, Baseline-supported alternatives like Flexbox and Grid.
  * **100% Data-Driven:** All suggestions are validated against the official `web-features` npm package to ensure they are safe, reliable, and part of the Baseline feature set.

-----



## How It Integrates Baseline Data

Baseline Shift is built directly on top of the hackathon's core data sources.

1.  On activation, the extension dynamically imports the `web-features` npm package.
2.  Before any diagnostic is shown to the user, its modern equivalent is checked against the loaded data.

For example, the suggestion to use `.includes()` is only shown after the code confirms that the feature ID `array-includes` is marked as `baseline: 'high'`.

Similarly, the suggestion to use Flexbox is only shown after confirming the `flexbox` feature ID is also part of Baseline.

This ensures that every piece of advice the extension gives is accurate, trustworthy, and directly aligned with the mission of the Baseline project.

-----

## ⚙️ Tech Stack

  * **Core:** TypeScript
  * **Platform:** VS Code Extension API
  * **JavaScript Analysis:** `@babel/parser` to generate an Abstract Syntax Tree (AST)
  * **CSS Analysis:** `postcss` to generate a CSS AST
  * **Data Source:** `web-features` npm package

-----

## 🛠️ Getting Started (for Judges & Contributors)

1.  **Clone the repository:**
    ```shell
    git clone https://github.com/your-username/baseline-shift.git
    ```
2.  **Install dependencies:**
    ```shell
    npm install
    ```
3.  **Open the project** in VS Code.
4.  **Press `F5`** (or use the "Run and Debug" panel) to launch the Extension Development Host window.
5.  In the new window, create a `test.js` or `test.css` file and use the example code from our test cases to see the diagnostics and Quick Fixes in action.

-----

## 🔭 Post-Hackathon Vision

The extension is built around an extensible rule system. The goal is to create a community-driven platform where developers can easily contribute new modernization rules, helping to build the ultimate tool for automatically reducing tech debt in any web project.

-----

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
