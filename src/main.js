// @ts-check
// DOM Elements

let database = /** @type {HTMLDivElement} */ (document.getElementById("database-wrapper"));
let notesLabels = /** @type {HTMLCollectionOf<HTMLAnchorElement>} */ (document.getElementsByClassName("label"));
let notesValues = /** @type {HTMLCollectionOf<HTMLTextAreaElement>} */ (document.getElementsByClassName("value"));
let notesKeys = /** @type {HTMLCollectionOf<HTMLInputElement>} */ (document.getElementsByClassName("key"));
let editorFileImport = /** @type {HTMLInputElement} */ (document.getElementById("editor-file-import"));
let flashcardFileImport = /** @type {HTMLInputElement} */ (document.getElementById("flashcard-file-import"));
let saveButton = /** @type {HTMLButtonElement} */ (document.getElementById("save-button"));
let fileNameDialog = /** @type {HTMLDialogElement} */ (document.getElementById("file-name-dialog"));
let keyboardShortcutsDialog = /** @type {HTMLDialogElement} */ (document.getElementById("keyboard-shortcuts-dialog"));
let fileNameInput = /** @type {HTMLInputElement} */ (document.getElementById("file-name-input"));
let flashcardsDisplay = /** @type {HTMLDivElement} */ (document.getElementById("flashcards-display"));
let flashcardsProgress = /** @type {HTMLLabelElement} */ (document.getElementById("flashcards-progress"));
let flashcardsRetention = /** @type {HTMLLabelElement} */ (document.getElementById("flashcards-retention"));
let saveProgressButton = /** @type {HTMLButtonElement} */ (document.getElementById("save-progress-button"));
let saveProgressDialog = /** @type {HTMLDialogElement} */ (document.getElementById("save-progress-dialog"));
let saveNameInput = /** @type {HTMLInputElement} */ (document.getElementById("save-name-input"));
let learnConfirm = /** @type {HTMLDivElement} */ (document.getElementById("learn-confirm"));

// @ts-expect-error
let pageGroup = new PageGroup("page", "grid");

let ctrl = false;
let shift = false;

class EditorNote extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ["parentIndex", "retention"];
    }

    toJSON() {
        return {
            index: this.dataset.index,
            parentIndex: this.dataset.parentIndex,
            // @ts-expect-error
            key: this.children[1].value,
            // @ts-expect-error
            value: this.children[2].value,
            retention: this.dataset.retention
        }
    }

    connectedCallback() {
        // Creates label to link to parent if available
        let newLabel = document.createElement("a");
        newLabel.classList.add("label");

        newLabel.dataset.parent = String(this.dataset.parentIndex);

        // Adds a link back to the parent note if it is a linked note.
        if (this.dataset.parentIndex !== "-1") {
            // @ts-expect-error
            newLabel.innerHTML = notesKeys[parseInt(this.dataset.parentIndex)].value;
            newLabel.href = `#${this.dataset.parentIndex}-key`;
        }

        // Creates new key field
        let newKey = document.createElement("input");
        newKey.classList.add("key");
        newKey.placeholder = "Term";
        newKey.id = `${notesKeys.length}-key`;

        // Creates new value field
        let newValue = document.createElement("textarea");
        newValue.classList.add("value");
        newValue.placeholder = "Definition";
        newValue.id = `${notesValues.length}-value`;

        // Add both input fields and the label to the wrapper element
        this.appendChild(newLabel);
        this.appendChild(newKey);
        this.appendChild(newValue);


        // Set focus to the new key field, then refresh keybinds
        newKey.focus();
        Editor.refreshEnterToAddNote();
    }

    disconnectedCallback() {
        // If a linked note points back to the note being removed, remove the linking
        for (let i = 0; i < notesLabels.length; i++) {
            if (notesLabels[i].dataset.parent === this.dataset.index) {
                notesLabels[i].innerHTML = "";
                notesLabels[i].href = "";
                notesLabels[i].style.pointerEvents = "none";
                notesLabels[i].dataset.parent = "-1";
            }
        }

        // Set the focus to the previous value field, then refresh keybinds
        try {
            notesValues[notesValues.length - 1].focus();
        }
        catch (error) {
            if (error !== TypeError) {
                throw error;
            }
        }

        Editor.refreshEnterToAddNote();
    }
}

customElements.define("editor-note", EditorNote);

class Editor {
    /**
     * Appends new key value fields to the end of the document
     * 
     * @param {number} parentIndex
     * @returns {void}
     */
    static addNote(parentIndex = -1) {
        let newNote = document.createElement("editor-note");
        newNote.dataset.parentIndex = String(parentIndex);
        newNote.dataset.retention = "0";
        database.appendChild(newNote);
    }

    /**
     * Removes the currently focused key value field pair
     * 
     * @param {number} index 
     * @returns {void}
     */
    static removeNote(index) {
        database.children[index].remove();
    }

    /**
     * Refreshes the keybinds to allow appending and removing notes through keybinds
     * 
     * @returns {void}
     */
    static refreshEnterToAddNote() {
        // Remove empty fields when hitting backspace on key fields
        for (let i = 0; i < notesKeys.length; i++) {
            notesKeys[i].onkeydown = function (event) {
                if (event.key === "Backspace" && notesValues[i].value === "" && notesKeys[i].value === "" && notesKeys.length > 1) {
                    Editor.removeNote(i);
                }
            }

            // Update coorespoding labels when editing a key
            notesKeys[i].oninput = function () {
                for (let j = 0; j < notesLabels.length; j++) {
                    if (notesLabels[j].dataset.parent === String(j)) {
                        // @ts-expect-error
                        notesLabels[j].innerHTML = document.getElementById(`${notesLabels[j].dataset.parent}-key`).value;
                    }
                }
            }
        }

        for (let i = 0; i < notesValues.length; i++) {
            notesValues[i].onkeydown = function (event) {
                // enter: Add an unlinked note
                if (!ctrl && !shift && event.key === "Enter") {
                    Editor.addNote();
                }

                // ctrl+enter: Add a linked note
                if (ctrl && !shift && event.key === "Enter") {
                    Editor.addNote(i);
                }

                // Remove empty fields when hitting backspace on value fields
                if (event.key === "Backspace" && notesValues[i].value === "" && notesKeys[i].value === "" && notesKeys.length > 1) {
                    Editor.removeNote(i);
                }
            }
        }
    }

    /**
     * Generates JSON string from the key value fields
     * 
     * @returns {string}
     */
    static generateJSON() {
        let json = [];
        let allNotes = /** @type {HTMLCollectionOf<EditorNote>} */ (document.getElementsByTagName("editor-note"));

        for (let i = 0; i < notesKeys.length; i++) {
            json.push(allNotes[i].toJSON());
        }

        return JSON.stringify(json);
    }

    /**
     * Splits CSV document into key value fields 
     * 
     * @param {string} text 
     */
    static parseJSON(text) {
        let json = JSON.parse(text);

        for (let i = notesKeys.length - 1; i > 0; i--) {
            Editor.removeNote(i);
        }

        for (let i = 0; i < json.length - 1; i++) {
            Editor.addNote();
        }

        let allNotes = document.getElementsByTagName("editor-note");

        for (let i = 0; i < json.length; i++) {
            if (json[i]["parent"] !== "" && json[i]["parent"] !== "-1") {
                notesLabels[i].dataset.parent = json[i]["parent"];
                notesLabels[i].href = `#${notesLabels[i].dataset.parent}-key`;
                notesLabels[i].innerHTML = notesKeys[parseInt(/** @type {string} */(notesLabels[i].dataset.parent))].value;
            }

            notesKeys[i].value = json[i]["key"];
            notesValues[i].value = json[i]["value"];
            notesLabels[i].dataset.retention = json[i]["retention"];
        }

        Editor.refreshEnterToAddNote();
    }

    /**
     * Reads in a file from the file input, passing the text into editorParsePSV
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
            Editor.parseJSON(text);
        });

        if (file) {
            reader.readAsText(file);
        }
    }
}

class Flashcards {
    constructor() { }

    /**
     * Generates CSV string from the key value fields
     * 
     * @returns {string}
     */
    static generateJSON() {
        let json = [];

        for (let i = 0; i < flashcardsDisplay.children.length; i += 2) {
            json.push({
                "id": i / 2,
                // @ts-expect-error
                "parent": flashcardsDisplay.children[i].dataset.parent || "-1",
                "key": flashcardsDisplay.children[i].innerHTML,
                "value": flashcardsDisplay.children[i + 1].innerHTML,
                // @ts-expect-error
                "retention": flashcardsDisplay.children[i].dataset.retention || "0"
            });
        }

        return JSON.stringify(json);
    }

    /**
     * Splits CSV document into key value fields 
     * 
     * @param {string} text 
     */
    static parseJSON(text) {
        let object = JSON.parse(text);
        flashcardsDisplay.innerHTML = "";

        for (let i = 0; i < object.length; i++) {
            let term = document.createElement("h1");
            term.innerHTML = object[i]["key"];
            flashcardsDisplay.appendChild(term);

            let definition = document.createElement("p");
            definition.innerHTML = object[i]["value"];
            flashcardsDisplay.appendChild(definition);

            term.dataset.retention = object[i]["retention"] || "0";
            term.dataset.parent = object[i]["parent"] || "-1";

            term.onclick = function () {
                term.style.display = "none";
                definition.style.display = "initial";
            }

            definition.onclick = function () {
                definition.style.display = "none";
                term.style.display = "initial";
            }
        }

        flashcardsDisplay.dataset.number = "1";

        Flashcards.updateFlashcards();
    }

    /**
     * Updates flashcard UI with the current number.
     */
    static updateFlashcards() {
        for (let i = 0; i < flashcardsDisplay.children.length; i++) {
            // @ts-expect-error
            flashcardsDisplay.children[i].style.display = "none";
        }

        // @ts-expect-error
        flashcardsDisplay.children[2 * parseInt(flashcardsDisplay.dataset.number) - 2].style.display = "initial";

        // @ts-expect-error
        flashcardsProgress.innerHTML = `${parseInt(flashcardsDisplay.dataset.number)}/${flashcardsDisplay.children.length / 2}`;

        // @ts-expect-error
        flashcardsRetention.innerHTML = flashcardsDisplay.children[2 * parseInt(flashcardsDisplay.dataset.number) - 2].dataset.retention;
    }

    /**
     * 
     * @param {number} amount 
     */
    static changeFlashcard(amount) {
        // @ts-expect-error
        flashcardsDisplay.dataset.number = String(parseInt(flashcardsDisplay.dataset.number) + amount);

        if (parseInt(flashcardsDisplay.dataset.number) > flashcardsDisplay.children.length / 2) {
            flashcardsDisplay.dataset.number = "1";
        }

        if (parseInt(flashcardsDisplay.dataset.number) < 1) {
            flashcardsDisplay.dataset.number = String(flashcardsDisplay.children.length / 2);
        }

        Flashcards.updateFlashcards();
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
            Flashcards.parseJSON(text);
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
        flashcardsDisplay.children[2 * flashcardsDisplay.dataset.number - 2].dataset.retention = String(parseInt(flashcardsDisplay.children[2 * flashcardsDisplay.dataset.number - 2].dataset.retention) + amount);

        Flashcards.changeFlashcard(1);
    }
}

/**
 * Parses the key value fields as a CSV document and downloads the data
 * 
 * @param {string} fileName
 * @param {string} context
 * @returns {void}
 */
function downloadJSON(fileName, context) {
    let csvText;
    if (context === "editor") {
        csvText = Editor.generateJSON();
    } else {
        csvText = Flashcards.generateJSON();
    }

    let blob = new Blob([csvText], {
        type: "application/json"
    });

    let downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
}

editorFileImport.onclick = function () {
    editorFileImport.value = "";
}

flashcardFileImport.onclick = function () {
    flashcardFileImport.value = "";
}

editorFileImport.onchange = function () {
    Editor.readFile();
}

flashcardFileImport.onchange = function () {
    Flashcards.readFile();
    learnConfirm.style.display = "grid";
}

/**
 * Keybind Logic
 * ctrl+s: Save To Disk
 * ctrl+o: Open File From Disk
 */
onkeydown = function (event) {
    if (event.key === "Control") {
        ctrl = true;
    }

    if (event.key === "Shift") {
        shift = true;
    }

    if (ctrl === true && event.key === "s") {
        event.preventDefault();
        fileNameDialog.showModal();
    }

    if (ctrl === true && event.key === "o") {
        event.preventDefault();
        editorFileImport.click();
    }

    if (ctrl === true && event.key === "/") {
        event.preventDefault();
        openShortcuts();
    }

    if (event.key === "Escape") {
        event.preventDefault();
        closeDialogs();
    }
}

/**
 * Releases control and shift keys
 */
onkeyup = function (event) {
    if (event.key === "Control") {
        ctrl = false;
    }

    if (event.key === "Shift") {
        shift = false;
    }
}

saveButton.onclick = function () {
    fileNameDialog.showModal();
}

/**
 * @param {*} event 
 */
fileNameInput.onkeydown = function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        fileNameDialog.close();
        downloadJSON(fileNameInput.value || "notes.json", "editor");
    }
}

/**
 * @param {*} event 
 */
saveNameInput.onkeydown = function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveProgressDialog.close();
        downloadJSON(saveNameInput.value || "notes.json", "flashcards");
    }
}

function closeDialogs() {
    fileNameDialog.close();
    keyboardShortcutsDialog.close();
}

function openShortcuts() {
    keyboardShortcutsDialog.showModal();
}

saveProgressButton.onclick = function () {
    saveProgressDialog.showModal();
}

Editor.addNote();
Editor.refreshEnterToAddNote();