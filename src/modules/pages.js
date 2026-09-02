import { EditorNote, FlashcardNote } from "./custom-elements.js";
import { keyboardShortcutsDialog, database, notesKeys, notesLabels, editorNotes, editorFileImport, flashcardNotes, flashcardsDisplay, flashcardsProgress, flashcardFileImport, fileNameDialog, saveProgressDialog, flashcardsRetention, treePath } from "./dom.js";

// @ts-expect-error
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

        database.appendChild(newNote);
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
        for (let i = 0; i < notesKeys.length; i++) {
            notesKeys[i].oninput = function () {
                for (let j = 0; j < notesLabels.length; j++) {
                    if (editorNotes[j].dataset.parentId === String(i)) {
                        notesLabels[j].innerHTML = notesKeys[i].value;
                    }
                }
            }
        }
    }

    /**
     * Generates JSON string from the key value fields.
     * 
     * @returns {string}
     */
    static generateJSON() {
        let json = [];

        for (let i = 0; i < editorNotes.length; i++) {
            json.push(editorNotes[i].toJSON());
        }

        return JSON.stringify(json);
    }

    /**
     * Loads in json into the editor from text.
     * 
     * @param {string} text 
     */
    static loadJSON(text) {
        let json = JSON.parse(text);

        for (let i = editorNotes.length - 1; i >= 0; i--) {
            editorNotes[i].remove();
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
        if (editorFileImport.files === null) {
            return;
        }

        const file = editorFileImport.files[0];
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
}

export class FlashcardsPage {
    /**
     * Generates JSON string from the key value fields
     * 
     * @returns {string}
     */
    static generateJSON() {
        let json = [];

        for (let i = 0; i < flashcardNotes.length; i++) {
            json.push(flashcardNotes[i].toJSON());
        }

        return JSON.stringify(json);
    }

    static addCard(parentId = -1, key = "", value = "", retention = 0) {
        let newCard = document.createElement("flashcard-note");

        newCard.dataset.parentId = String(parentId);
        newCard.dataset.key = key;
        newCard.dataset.value = value;
        newCard.dataset.retention = String(retention);

        flashcardsDisplay.appendChild(newCard);
    }

    /**
     * Splits CSV document into key value fields 
     * 
     * @param {string} text 
     */
    static loadJSON(text) {
        let json = JSON.parse(text);
        flashcardsDisplay.innerHTML = "";

        for (let i = 0; i < json.length; i++) {
            FlashcardsPage.addCard(json[i]["parentId"], json[i]["key"], json[i]["value"], json[i]["retention"]);
        }

        flashcardsDisplay.dataset.number = "1";

        FlashcardsPage.updateFlashcards();
    }

    /**
     * Updates flashcard UI with the current number.
     */
    static updateFlashcards() {
        for (let i = 0; i < flashcardsDisplay.children.length; i++) {
            // @ts-expect-error
            flashcardsDisplay.children[i].children[0].style.display = "none";
            // @ts-expect-error
            flashcardsDisplay.children[i].children[1].style.display = "none";
            // @ts-expect-error
            flashcardsDisplay.children[i].style.display = "none";
        }

        // @ts-expect-error
        flashcardsDisplay.children[+flashcardsDisplay.dataset.number - 1].style.display = "initial";
        // @ts-expect-error
        flashcardsDisplay.children[+flashcardsDisplay.dataset.number - 1].children[0].style.display = "block";
        flashcardsProgress.innerHTML = `${flashcardsDisplay.dataset.number}/${flashcardsDisplay.children.length}`;
        // @ts-expect-error
        flashcardsRetention.innerHTML = flashcardsDisplay.children[+flashcardsDisplay.dataset.number - 1].dataset.retention;

        // @ts-expect-error
        if (flashcardsDisplay.children[+flashcardsDisplay.dataset.number - 1].dataset.parentId !== "-1") {
            // @ts-expect-error
            treePath.innerHTML = flashcardNotes[+flashcardsDisplay.children[+flashcardsDisplay.dataset.number - 1].dataset.parentId].children[0].innerHTML;
        } else {
            treePath.innerHTML = "-";
        }
    }

    /**
     * 
     * @param {number} amount 
     */
    static changeFlashcard(amount) {
        // @ts-expect-error
        flashcardsDisplay.dataset.number = String(+flashcardsDisplay.dataset.number + amount);

        if (+flashcardsDisplay.dataset.number > flashcardsDisplay.children.length) {
            flashcardsDisplay.dataset.number = "1";
        }

        if (+flashcardsDisplay.dataset.number < 1) {
            flashcardsDisplay.dataset.number = String(flashcardsDisplay.children.length);
        }

        FlashcardsPage.updateFlashcards();
    }

    /**
     * Reads in a file from the file input, passing the text into editorParsePSV
     * 
     * @returns {void}
     */
    static readFile() {
        if (flashcardFileImport.files === null) {
            return;
        }

        const file = flashcardFileImport.files[0];
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
        flashcardsDisplay.children[flashcardsDisplay.dataset.number - 1].dataset.retention = String(+flashcardsDisplay.children[flashcardsDisplay.dataset.number - 1].dataset.retention + amount);

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
}

export function closeDialogs() {
    fileNameDialog.close();
    keyboardShortcutsDialog.close();
    saveProgressDialog.close();
}

export function openShortcuts() {
    console.log("Hello!");
    keyboardShortcutsDialog.showModal();
}