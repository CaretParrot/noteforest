import { EditorPage, FlashcardsPage, pageGroup } from "./pages.js";

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

// Clears file inputs on click.

editorFileImport.onclick = function () {
    editorFileImport.value = "";
}

flashcardFileImport.onclick = function () {
    flashcardFileImport.value = "";
}

// Loads files when the user adds a file.

editorFileImport.oninput = function () {
    EditorPage.readFile();
}

flashcardFileImport.oninput = function () {
    FlashcardsPage.readFile();
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
        EditorPage.downloadJSON(fileNameInput.value || "notes.json");
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
        FlashcardsPage.downloadJSON(saveNameInput.value || "notes.json");
    }
}

// Page navigation transitions

for (let i = 0; i < toFlashcardsPageButtons.length; i++) { 
    toFlashcardsPageButtons[i].onclick = function () {
        pageGroup.changePage("flashcards-page");
    }
}

for (let i = 0; i < toEditorPageButtons.length; i++) {
    toEditorPageButtons[i].onclick = function () {
        pageGroup.changePage("editor-page");
    }
}