import { EditorNote } from "./custom-elements.js";
// @ts-expect-error
import { PageGroup } from "https://caretparrot.github.io/papaya-salad/page-group.js";
import * as dom from "./dom.js";

const EDITOR_CACHE = "editor-cache";
const FLASHCARD_CACHE = "flashcard-cache";
const SETTINGS = "settings";

export let pageGroup = new PageGroup("page", "grid");

export class EditorPage {
    /**
     * Appends new key value fields to the end of the document.
     * 
     * @param {number} parentId
     * @param {string} key
     * @param {string} value
     * @param {number} retention
     * @returns {void}
     */
    static addNote(parentId = -1, key = "", value = "", retention = 0) {
        let newNote = /** @type {EditorNote} */ (document.createElement("editor-note"));

        newNote.dataset.parentId = String(parentId);
        newNote.dataset.key = key;
        newNote.dataset.value = value;
        newNote.dataset.retention = String(retention);

        dom.editor.appendChild(newNote);
    }

    /**
     * Removes any notes linked to the input note.
     * 
     * @param {EditorNote} note 
     */
    static removeLinking(note) {
        note.children[0].innerHTML = "";
        // @ts-expect-error
        note.children[0].href = "";
        // @ts-expect-error
        note.children[0].style.pointerEvents = "none";
        note.dataset.parent = "-1";
    }

    /**
     * Updates any linked note labels when updating a parent note.
     * 
     * @returns {void}
     */
    static refreshLabelUpdating() {
        for (let i = 0; i < dom.notesKeys.length; i++) {
            dom.notesKeys[i].oninput = function () {
                for (let j = 0; j < dom.notesLabels.length; j++) {
                    if (dom.editorNotes[j].dataset.parentId === String(i)) {
                        dom.notesLabels[j].innerHTML = dom.notesKeys[i].value;
                    }
                }
            }
        }

        EditorPage.cacheJSON();
    }

    /**
     * Generates JSON string from the key value fields.
     * 
     * @returns {string}
     */
    static generateJSON() {
        let json = [];

        for (let i = 0; i < dom.editorNotes.length; i++) {
            json.push(dom.editorNotes[i].toJSON());
        }

        return JSON.stringify(json);
    }

    static cacheJSON() {
        localStorage.setItem(EDITOR_CACHE, EditorPage.generateJSON());
    }

    /**
     * 
     * @returns {boolean}
     */
    static loadCachedJSON() {
        if (localStorage.getItem(EDITOR_CACHE) === undefined || localStorage.getItem(EDITOR_CACHE) === "") {
            return false;
        }

        EditorPage.loadJSON(localStorage.getItem(EDITOR_CACHE) || "");
        return true;
    }

    /**
     * Loads in json into the editor from text.
     * 
     * @param {string} text 
     */
    static loadJSON(text) {
        let json = JSON.parse(text);

        for (let i = dom.editorNotes.length - 1; i >= 0; i--) {
            dom.editorNotes[i].remove();
        }

        for (let i = 0; i < json.length; i++) {
            EditorPage.addNote(json[i]["parentId"], json[i]["key"], json[i]["value"], json[i]["retention"]);
        }

        EditorPage.refreshLabelUpdating();
    }

    /**
     * Reads in a file from the file input.
     * 
     * @returns {void}
     */
    static readFile() {
        if (dom.editorFileImport.files === null) {
            return;
        }

        const file = dom.editorFileImport.files[0];
        const reader = new FileReader();
        let text;

        reader.addEventListener("load", () => {
            text = reader.result;
            // @ts-expect-error
            EditorPage.loadJSON(text);
        });

        if (file) {
            reader.readAsText(file);
        }
    }

    /**
     * Parses the key value fields as a JSON document and downloads the data
     * 
     * @param {string} fileName
     * @returns {void}
     */
    static downloadJSON(fileName) {
        let csvText = EditorPage.generateJSON();

        let blob = new Blob([csvText], {
            type: "application/json"
        });

        let downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
        downloadLink.remove();
    }

    static print() {
        dom.editorToolbar.style.display = "none";
        dom.editor.style.border = "none";
        window.print();
        dom.editorToolbar.style.display = "flex";
        dom.editor.style.border = "calc(var(--base-unit) / 4) solid hsla(0, 0%, 0%, 1)";
    }

    static clear() {
        dom.editor.innerHTML = "";
        EditorPage.addNote();
        EditorPage.refreshLabelUpdating();
    }
}

export class FlashcardsPage {
    /**
     * Generates JSON string from the key value fields
     * 
     * @returns {string}
     */
    static generateJSON() {
        let json = [];

        for (let i = 0; i < dom.flashcardNotes.length; i++) {
            json.push(dom.flashcardNotes[i].toJSON());
        }

        return JSON.stringify(json);
    }

    static addCard(parentId = -1, key = "", value = "", retention = 0) {
        let newCard = document.createElement("flashcard-note");

        newCard.dataset.parentId = String(parentId);
        newCard.dataset.key = key;
        newCard.dataset.value = value;
        newCard.dataset.retention = String(retention);

        dom.flashcardsDisplay.appendChild(newCard);
    }

    /**
     * Splits CSV document into key value fields 
     * 
     * @param {string} text 
     */
    static loadJSON(text) {
        let json = JSON.parse(text);
        dom.flashcardsDisplay.innerHTML = "";

        for (let i = 0; i < json.length; i++) {
            FlashcardsPage.addCard(json[i]["parentId"], json[i]["key"], json[i]["value"], json[i]["retention"]);
        }

        dom.flashcardsDisplay.dataset.number = "1";

        FlashcardsPage.updateFlashcards();
    }

    /**
     * Updates flashcard UI with the current number.
     */
    static updateFlashcards() {
        for (let i = 0; i < dom.flashcardsDisplay.children.length; i++) {
            // @ts-expect-error
            dom.flashcardsDisplay.children[i].children[0].style.display = "none";
            // @ts-expect-error
            dom.flashcardsDisplay.children[i].children[1].style.display = "none";
            // @ts-expect-error
            dom.flashcardsDisplay.children[i].style.display = "none";
        }

        // @ts-expect-error
        dom.flashcardsDisplay.children[+dom.flashcardsDisplay.dataset.number - 1].style.display = "initial";

        // @ts-expect-error
        dom.flashcardsDisplay.children[+dom.flashcardsDisplay.dataset.number - 1].children[0].style.display = "block";
        dom.flashcardsProgress.innerHTML = `${dom.flashcardsDisplay.dataset.number}/${dom.flashcardsDisplay.children.length}`;

        // @ts-expect-error
        dom.flashcardsRetention.innerHTML = dom.flashcardsDisplay.children[+dom.flashcardsDisplay.dataset.number - 1].dataset.retention;

        // @ts-expect-error
        if (dom.flashcardsDisplay.children[+dom.flashcardsDisplay.dataset.number - 1].dataset.parentId !== "-1") {
            // @ts-expect-error
            dom.treePath.innerHTML = dom.flashcardNotes[+dom.flashcardsDisplay.children[+dom.flashcardsDisplay.dataset.number - 1].dataset.parentId].children[0].innerHTML;
        } else {
            dom.treePath.innerHTML = "-";
        }

        FlashcardsPage.cacheJSON();
    }

    /**
     * 
     * @param {number} amount 
     */
    static changeFlashcard(amount) {
        // @ts-expect-error
        dom.flashcardsDisplay.dataset.number = String(+dom.flashcardsDisplay.dataset.number + amount);

        if (+dom.flashcardsDisplay.dataset.number > dom.flashcardsDisplay.children.length) {
            dom.flashcardsDisplay.dataset.number = "1";
        }

        if (+dom.flashcardsDisplay.dataset.number < 1) {
            dom.flashcardsDisplay.dataset.number = String(dom.flashcardsDisplay.children.length);
        }

        FlashcardsPage.updateFlashcards();
    }

    /**
     * Reads in a file from the file input, passing the text into editorParsePSV
     * 
     * @returns {void}
     */
    static readFile() {
        if (dom.flashcardFileImport.files === null) {
            return;
        }

        const file = dom.flashcardFileImport.files[0];
        const reader = new FileReader();
        let text;

        reader.addEventListener("load", () => {
            text = reader.result;
            // @ts-expect-error
            FlashcardsPage.loadJSON(text);
        });

        if (file) {
            reader.readAsText(file);
        }
    }

    /**
     * 
     * @param {number} amount 
     */
    static changeRetention(amount) {
        // @ts-expect-error
        dom.flashcardsDisplay.children[dom.flashcardsDisplay.dataset.number - 1].dataset.retention = String(+dom.flashcardsDisplay.children[dom.flashcardsDisplay.dataset.number - 1].dataset.retention + amount);

        FlashcardsPage.changeFlashcard(1);
    }

    /**
     * Parses the flashcards as a JSON document and downloads the data
     * 
     * @param {string} fileName
     * @returns {void}
     */
    static downloadJSON(fileName) {
        let csvText = FlashcardsPage.generateJSON();

        let blob = new Blob([csvText], {
            type: "application/json"
        });

        let downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
        downloadLink.remove();
    }

    static cacheJSON() {
        localStorage.setItem(FLASHCARD_CACHE, FlashcardsPage.generateJSON());
    }

    static loadCachedJSON() {
        if (localStorage.getItem(FLASHCARD_CACHE) === undefined || localStorage.getItem(FLASHCARD_CACHE) === "") {
            return false;
        }

        FlashcardsPage.loadJSON(localStorage.getItem(FLASHCARD_CACHE) || "");
        return true;
    }

    static clear() {
        dom.flashcardsDisplay.innerHTML = "";
        dom.treePath.innerHTML = "-";
        dom.flashcardsRetention.innerHTML = "?";
        dom.flashcardsProgress.innerHTML = "?/?";
        
        FlashcardsPage.cacheJSON();
    }
}

export class InsightsPage {
    /**
     * 
     * @param {number} num
     * @param {number} places
     */
    static roundToPlaces(num, places) {
        return Math.round(num * (10 ** places)) / (10 ** places);
    }

    /**
     * 
     * @param {any} json 
     */
    static calcAverageRetention(json) {
        let average = 0;

        for (let i = 0; i < json.length; i++) {
            average += json[i]["retention"];
        }

        dom.averageRetention.innerHTML = String(InsightsPage.roundToPlaces(average / json.length, 5));
    }

    /**
     * 
     * @param {any} json 
     */
    static calcMedianRetention(json) {
        let retentions = [];

        for (let i = 0; i < json.length; i++) {
            retentions.push(json[i]["retention"]);
        }

        retentions.sort();
        let middle = Math.floor(retentions.length / 2);

        if (retentions.length % 2 === 0) {
            dom.medianRetention.innerHTML = String((retentions[middle] + retentions[middle + 1]) / 2);
        } else {
            dom.medianRetention.innerHTML = String(retentions[middle]);
        }
    }

    /**
     * 
     * @param {string} text 
     */
    static loadJSON(text) {
        let json = JSON.parse(text);

        InsightsPage.calcAverageRetention(json);
        InsightsPage.calcMedianRetention(json);
    }

    /**
     * Reads in a file from the file input.
     * 
     * @returns {void}
     */
    static readFile() {
        if (dom.editorFileImport.files === null) {
            return;
        }

        // @ts-expect-error
        const file = dom.insightsFileImport.files[0];
        const reader = new FileReader();
        let text;

        reader.addEventListener("load", () => {
            text = reader.result;
            // @ts-expect-error
            InsightsPage.loadJSON(text);
        });

        if (file) {
            reader.readAsText(file);
        }
    }
}

export class SettingsPage {
    static saveSettings() {
        localStorage.setItem(SETTINGS, JSON.stringify(
            {
                hue: +dom.hueValue.value,
                accentHue: +dom.accentHueValue.value
            }
        ));
    }

    static loadSettings() {
        if (localStorage.getItem(SETTINGS) === undefined || localStorage.getItem(SETTINGS) === "") {
            return false;
        }

        // @ts-expect-error
        let settings = JSON.parse(localStorage.getItem(SETTINGS));

        dom.hueValue.value = String(settings.hue);
        document.documentElement.style.setProperty("--hue", dom.hueValue.value);
        dom.accentHueValue.value = String(settings.accentHue);
        document.documentElement.style.setProperty("--accent-hue", String(+dom.accentHueValue.value));
    }    
    
}

export function closeDialogs() {
    dom.fileNameDialog.close();
    dom.keyboardShortcutsDialog.close();
    dom.saveProgressDialog.close();
}

export function openShortcuts() {
    console.log("Hello!");
    dom.keyboardShortcutsDialog.showModal();
}