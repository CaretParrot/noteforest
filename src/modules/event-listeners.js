import * as pages from "./pages.js";
import * as dom from "./dom.js";

// Clears file inputs on click.

dom.editorFileImport.onclick = function () {
    dom.editorFileImport.value = "";
}

dom.flashcardFileImport.onclick = function () {
    dom.flashcardFileImport.value = "";
}

// Loads files when the user adds a file.

dom.editorFileImport.oninput = function () {
    pages.EditorPage.readFile();
}

dom.flashcardFileImport.oninput = function () {
    pages.FlashcardsPage.readFile();
    dom.flashcardsData.style.display = "grid";
}

dom.insightsFileImport.oninput = function () {
    pages.InsightsPage.readFile();
}

// Print button

dom.printButton.onclick = function () {
    pages.EditorPage.print();
}

// Prompts user to input a file name for download.

dom.saveButton.onclick = function () {
    dom.fileNameDialog.showModal();
}

dom.saveProgressButton.onclick = function () {
    dom.saveProgressDialog.showModal();
}

/**
 * Downloads a file to save information when the user enters a file name.
 * 
 * @param {*} event 
 */
dom.fileNameInput.onkeydown = function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        dom.fileNameDialog.close();
        pages.EditorPage.downloadJSON(dom.fileNameInput.value || "notes.json");
    }
}

/**
 * Downloads a file to save progress when the user enters a file name.
 * 
 * @param {*} event 
 */
dom.saveNameInput.onkeydown = function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        dom.saveProgressDialog.close();
        pages.FlashcardsPage.downloadJSON(dom.saveNameInput.value || "notes.json");
    }
}

// Page navigation transitions

for (let i = 0; i < dom.navSelects.length; i++) {
    dom.navSelects[i].onchange = function () {
        // @ts-expect-error
        pages.pageGroup.changePage(dom.navSelects[i].value);
        // @ts-expect-error
        dom.navSelects[i].value = "->";
    }
}

// Dialog opening and closing

for (let i = 0; i < dom.closeButtons.length; i++) {
    dom.closeButtons[i].onclick = function () {
        pages.closeDialogs();
    }
}

for (let i = 0; i < dom.openShortcutsButtons.length; i++) {
    dom.openShortcutsButtons[i].onclick = function () {
        pages.openShortcuts();
    }
}

// Flashcards display

dom.previousButton.onclick = function () {
    pages.FlashcardsPage.changeFlashcard(-1);
}

dom.nextButton.onclick = function () {
    pages.FlashcardsPage.changeFlashcard(1);
}

dom.correctButton.onclick = function () {
    pages.FlashcardsPage.changeRetention(1);
}

dom.incorrectButton.onclick = function () {
    pages.FlashcardsPage.changeRetention(-2);
}

dom.hueValue.oninput = function () {
    document.documentElement.style.setProperty("--hue", dom.hueValue.value);
    pages.SettingsPage.saveSettings();
}

dom.accentHueValue.oninput = function () {
    document.documentElement.style.setProperty("--accent-hue", String(+dom.accentHueValue.value));
    pages.SettingsPage.saveSettings();
}

dom.clearEditorButton.onclick = function () {
    dom.clearEditorDialog.showModal();
}

dom.confirmClearEditorButton.onclick = function () {
    pages.EditorPage.clear();
    dom.clearEditorDialog.close();
}