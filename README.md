# Noteworthy

Noteworthy is a simple note-taking and flashcard application designed to be fast and easy to use. In addition to the standard term-and-definition input, notes may be "linked" back to a parent note. This allows for the easy creation of trees and mind maps. 

Noteworthy is open source, uses open file formats, and requires no Internet connection, allowing you to edit and review your notes wherever you go. You're never locked in!

Built-in features include:
- Term/definition editor
- Flashcards review with retention indicators

*Additional features planned for future releases.*

# Download

- Go to [Releases](https://github.com/CaretParrot/noteworthy/releases/). As of writing, only **pre-release versions** are available.
- Download the source code zip.
- Extract the folder.

# Prerequisites

*Warning: As of writing, only pre-release versions of Noteworthy are available. As such, the code is not properly signed, and you may need to bypass your operating system's warnings to install the program.*

- If not already done, install the following before proceeding:
    - [Node.js](https://nodejs.org/en)
    - NPM, which comes with your Node.js installation
- Navigate to the directory containing the source code.
- Install the following inside the directory containing the source code:
    - [Tauri](https://v2.tauri.app/) (can be done by running ```npm add -D @tauri-apps/cli```)
- Then, run ```npm run tauri build```. This may take **several minutes**.
    - After building, the path containing the executable should be printed. Copy it and run it in the terminal.
    - This will run the installation wizard to help you install the application. The app should be ready to use upon completion!
 
# Instructions For Use

## Editor

- When opening up the app for the first time, you will be brought to the editor first.
- This will show terms, definitions, and a label used to identify the parent note that the label is linked to.
- Type in terms in the smaller boxes and definitions in the larger boxes.
- Hit Enter on a **definition** to add a new pair.
- Use the save button to save the file.
    - Noteworthy uses a JSON array to store your notes, allowing you to edit the file freely outside the built-in editor.
- Click on the shortcuts button to see a list of shortcuts.

## Flashcards

- Hitting the Flashcards button from the Editor page opens the Flashcards page.
- After loading in a saved file, your notes will load as flashcards.
- Use the forward and back buttons to move through the flashcards.
- You can use the ✓ and ✗ buttons to practice your flashcards.
    - Hit ✓ when you get a flashcard right. This increases your retention by 1.
    - Hit ✗ when you get a flashcard wrong. This decreases your retention by 2.
- Next to the ✓ and ✗ buttons are the progress indicator and retention score.
- Hit the save button to save your progress.

## Linked Notes

- Hitting Ctrl+Enter on a definition creates a linked note.
    - You'll see the new note appear with the previous note's term in the label.
    - Clicking on the label will link you back to the parent note.
