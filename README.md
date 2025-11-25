# Global Exam Auto-Answer – Firefox Add-on

## 🧩 Overview

This Firefox extension automates answering questions on the **GlobalExam** website.
It detects the correct answers for each question and clicks them automatically.
If the auto-validation feature is enabled, the extension will also **validate the question** and **finish the exercise** without user interaction.

This tool is written in **plain JavaScript, HTML, and CSS**, with no external frameworks.

You can find the extension in the Firefox add-on store at https://addons.mozilla.org/en-US/firefox/addon/global-exam-auto-responses/

---

## ✨ Features

* Automatically selects the correct answer on GlobalExam.
* Optional auto-click on **Finish / Terminer**.
* Simple, lightweight, no dependencies.
* Runs directly inside Firefox as a standard WebExtension.

---

## 📁 Project Structure

```
├─ manifest.json
├─ background.js
├─ content.js
├─ assets/
│  ├─ public/
│  │  └─ warning.svg
│  └─ icon.png
└─ popup/
   ├─ index.html
   ├─ index.css
   └─ index.js
```

---

## ⚙️ How It Works

1. A background script will intercept the request containing the answers.
2. It will parse and retrieve the correct one then send tasks to the content script.
3. The content script is injected in the page and upon receiving tasks from the background script will /
  1. Click on the correct answers marking them for the user to complet
  2. Click on the validate and finish button if the user enabled it

---

## 🚀 Installation (Developer Mode)

1. Open Firefox and go to:

   ```
   about:debugging#/runtime/this-firefox
   ```
2. Click **Load Temporary Add-on**.
3. Select the `manifest.json` of this project.
4. Go to **GlobalExam** and activate the addon.

---

## 🔧 Settings

A popup UI (in the toolbar) allows you to toggle:

* The add-on
* Auto validate

---

## 📜 Requirements

* Firefox
* A GlobalExam account

---

## ⚠️ Disclaimer

This extension is made **for personal, educational, and research purposes only**.
Using automation on third-party services may violate their terms of use.
Use responsibly and at your own risk.
