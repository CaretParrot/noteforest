# Noteworthy

Noteworthy is a simple note-taking and flashcard application designed to be fast and easy to use, with no Internet connection required. In addition to the standard term and definition input, notes may be "linked" back to a parent note. This allows for the easy creation of trees and mind maps.

Built-in features include:
- Term/definition editor
- Flashcards review with retention indicators

# Download

- Go to releases [Releases](https://github.com/CaretParrot/noteworthy/releases/). As of writing, only **pre-release versions** are available.
- Download the source code zip.
- Extract the folder.

# Prerequisites

*Warning: As of writing, only pre-release versions of Noteworthy are available. As such, the code does not have proper signing, and you may need to bypass warnings from your operating system to install the program.*

- If not already done, install the following before proceeding:
    - [Node.js](https://nodejs.org/en)
    - NPM (this comes with your Node.js installation)
- Navigate to the directory containing the source code
- Install the following inside the directory containing the source code:
    - [Tauri](https://v2.tauri.app/) (can be done by running ```npm install tauri```)
- Then, run ```npm run tauri build```. This may take **several minutes**.
    - After building, the path containing the executable should be printed. Copy it and run it in the terminal.
    - This will run the installation wizard to help you install the application. The app should be ready to use upon completion!
