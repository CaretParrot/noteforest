import * as pages from "./pages.js";
import { editorFileImport, flashcardFileImport, fileNameDialog, saveProgressDialog, flashcardsData, saveNameInput, fileNameInput, toFlashcardsPageButtons, toEditorPageButtons, saveButton, saveProgressButton, closeButtons, openShortcutsButtons, previousButton, nextButton, correctButton, incorrectButton } from "./dom.js";

// DOM Elements

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
    flashcardsData.style.display = "grid";
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