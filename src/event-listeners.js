import * as pages from "./pages.js";

// DOM Elements

// File imports

let editorFileImport = /** @type {HTMLInputElement} */ (document.getElementById("editor-file-import"));
let flashcardFileImport = /** @type {HTMLInputElement} */ (document.getElementById("flashcard-file-import"));

// Dialogs

let fileNameDialog = /** @type {HTMLDialogElement} */ (document.getElementById("file-name-dialog"));
let saveProgressDialog = /** @type {HTMLDialogElement} */ (document.getElementById("save-progress-dialog"));

// Toolbars

let learnConfirm = /** @type {HTMLDivElement} */ (document.getElementById("learn-confirm"));

// File name inputs

let saveNameInput = /** @type {HTMLInputElement} */ (document.getElementById("save-name-input"));
let fileNameInput = /** @type {HTMLInputElement} */ (document.getElementById("file-name-input"));

// Page navigation buttons

let toFlashcardsPageButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("to-flashcards-page"));
let toEditorPageButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("to-editor-page"));

// Save buttons

let saveButton = /** @type {HTMLButtonElement} */ (document.getElementById("save-button"));
let saveProgressButton = /** @type {HTMLButtonElement} */ (document.getElementById("save-progress-button"));

// Close buttons

let closeButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("close-button"));
let openShortcutsButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("open-shortcuts-button"));

// Flashcard widget buttons

let previousButton = /** @type {HTMLButtonElement} */ (document.getElementById("previous-button"));
let nextButton = /** @type {HTMLButtonElement} */ (document.getElementById("next-button"));
let correctButton = /** @type {HTMLButtonElement} */ (document.getElementById("correct-button"));
let incorrectButton = /** @type {HTMLButtonElement} */ (document.getElementById("incorrect-button"));

// Clears file inputs on click.

editorFileImport.onclick = function () {
    editorFileImport.value = "";
}

flashcardFileImport.onclick = function () {
    flashcardFileImport.value = "";
}

// Loads files when the user adds a file.

editorFileImport.oninput = function () {
    pages.EditorPage.readFile();
}

flashcardFileImport.oninput = function () {
    pages.FlashcardsPage.readFile();
    learnConfirm.style.display = "grid";
}

// Prompts user to input a file name for download.

saveButton.onclick = function () {
    fileNameDialog.showModal();
}

saveProgressButton.onclick = function () {
    saveProgressDialog.showModal();
}

/**
 * Downloads a file to save information when the user enters a file name.
 * 
 * @param {*} event 
 */
fileNameInput.onkeydown = function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        fileNameDialog.close();
        pages.EditorPage.downloadJSON(fileNameInput.value || "notes.json");
    }
}

/**
 * Downloads a file to save progress when the user enters a file name.
 * 
 * @param {*} event 
 */
saveNameInput.onkeydown = function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveProgressDialog.close();
        pages.FlashcardsPage.downloadJSON(saveNameInput.value || "notes.json");
    }
}

// Page navigation transitions

for (let i = 0; i < toFlashcardsPageButtons.length; i++) { 
    toFlashcardsPageButtons[i].onclick = function () {
        pages.pageGroup.changePage("flashcards-page");
    }
}

for (let i = 0; i < toEditorPageButtons.length; i++) {
    toEditorPageButtons[i].onclick = function () {
        pages.pageGroup.changePage("editor-page");
    }
}

// Dialog opening and closing

for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function () {
        pages.closeDialogs();
    }
}

for (let i = 0; i < openShortcutsButtons.length; i++) {
    openShortcutsButtons[i].onclick = function () {
        pages.openShortcuts();
    }
}

previousButton.onclick = function () {
    pages.FlashcardsPage.changeFlashcard(-1);
}

nextButton.onclick = function () {
    pages.FlashcardsPage.changeFlashcard(1);
}

correctButton.onclick = function () {
    pages.FlashcardsPage.changeRetention(1);
}

incorrectButton.onclick = function () {
    pages.FlashcardsPage.changeRetention(-2);
}