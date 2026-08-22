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
let editorNotes = /** @type {HTMLCollectionOf<EditorNote>} */ (document.getElementsByTagName("editor-note"));
let flashcardNotes = /** @type {HTMLCollectionOf<FlashcardNote>} */ (document.getElementsByTagName("flashcard-note"));

// @ts-expect-error
let pageGroup = new PageGroup("page", "grid");

let ctrl = false;
let shift = false;

class EditorNote extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * Returns the properties of the note to compile into a JSON file.
     * 
     * @returns {object}
     */
    toJSON() {
        return {
            index: +this.id,
            // @ts-expect-error
            parentIndex: +this.dataset.parentIndex,
            // @ts-expect-error
            key: this.children[1].value,
            // @ts-expect-error
            value: this.children[2].value,
            // @ts-expect-error
            retention: +this.dataset.retention
        }
    }

    /**
     * Creates a label field within the note wrapper. Adds a link back to the parent note if the label does not exist.
     * 
     * @returns {HTMLAnchorElement}
     */
    createLabelField() {
        let newLabel = document.createElement("a");
        newLabel.classList.add("label");

        if (this.dataset.parentIndex !== "-1") {
            // @ts-expect-error
            newLabel.innerHTML = document.getElementById(this.dataset.parentIndex).children[1].value;
            newLabel.href = `#${this.dataset.parentIndex}`;
        }

        this.appendChild(newLabel);
        return newLabel;
    }

    /**
     * Creates a new key field within the note wrapper.
     * 
     * @return {HTMLInputElement}
     */
    createKeyField() {
        let newKey = document.createElement("input");
        newKey.classList.add("key");
        newKey.placeholder = "Term";
        // @ts-expect-error
        newKey.value = this.dataset.key;
        this.appendChild(newKey);
        this.dataset.key = "";
        return newKey;
    }

    /**
     * Creates a new value field within the note wrapper.
     * 
     * @returns {HTMLTextAreaElement}
     */
    createValueField() {
        let newValue = document.createElement("textarea");
        newValue.classList.add("value");
        newValue.placeholder = "Definition";
        // @ts-expect-error
        newValue.value = this.dataset.value;
        this.appendChild(newValue);
        this.dataset.value = "";
        return newValue;
    }

    /**
     * Sets up element properties and creates fields, then adds keybinds.
     */
    connectedCallback() {
        this.id = String(Array.prototype.indexOf.call(this.parentNode?.children, this));

        this.createLabelField();
        this.createKeyField();
        this.createValueField();

        // Set focus to the new key field, then refresh keybinds
        // @ts-expect-error
        this.children[1].focus();
        EditorPage.refreshLabelUpdating();
        this.addKeyBinds();
    }

    /**
     * Checks for any notes that link back to the note and removes their linking.
     */
    removeAllLinkedNotes() {
        // If a linked note points back to the note being removed, remove the linking
        for (let i = 0; i < editorNotes.length; i++) {
            if (editorNotes[i].dataset.parent === this.dataset.index) {
                EditorPage.removeLinking(editorNotes[i]);
            }
        }
    }

    /**
     * Removes all linked notes and attempts to focus the previous element.
     */
    disconnectedCallback() {
        this.removeAllLinkedNotes();

        if (editorNotes.length > 1) {
            // @ts-expect-error
            editorNotes[editorNotes.length - 1].children[2].focus();
        }

        EditorPage.refreshLabelUpdating();
    }

    /**
     * Adds keybindings for quick note creation and deletion.
     */
    addKeyBinds() {
        // @ts-expect-error
        this.children[1].onkeydown = function (event) {
            // @ts-expect-error
            if (event.key === "Backspace" && this.value === "" && this.parentElement.children[2].value === "" && editorNotes.length > 1) {
                event.preventDefault();
                // @ts-expect-error
                this.parentElement.remove();
            }
        }

        // @ts-expect-error
        this.children[2].onkeydown = function (event) {
            // enter: Add an unlinked note
            if (!ctrl && !shift && event.key === "Enter") {
                event.preventDefault();
                EditorPage.addNote();
            }

            // ctrl+enter: Add a linked note
            if (ctrl && !shift && event.key === "Enter") {
                event.preventDefault();
                EditorPage.addNote(+this.id);
            }

            // Remove empty fields when hitting backspace on value fields
            // @ts-expect-error
            if (event.key === "Backspace" && this.value === "" && this.parentNode.children[1].value === "" && editorNotes.length > 1) {
                event.preventDefault();
                this.parentElement?.remove();
            }
        }
    }
}

class FlashcardNote extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * Returns the properties of the note to compile into a JSON file.
     * 
     * @returns {object}
     */
    toJSON() {
        return {
            index: +this.id,
            // @ts-expect-error
            parentIndex: +this.dataset.parentIndex,
            key: this.children[0].innerHTML,
            value: this.children[1].innerHTML,
            // @ts-expect-error
            retention: +this.dataset.retention
        }
    }

    createKeyCard() {
        let newKey = document.createElement("h1");
        // @ts-expect-error
        newKey.innerHTML = this.dataset.key;
        newKey.style.display = "none";
        this.appendChild(newKey);
        return newKey;
    }

    createValueCard() {
        let newValue = document.createElement("p");
        // @ts-expect-error
        newValue.innerHTML = this.dataset.value;
        newValue.style.display = "none";
        this.appendChild(newValue);
        return newValue;
    }

    /**
     * Creates the sub-elements and loads their properties.
     */
    connectedCallback() {
        this.id = String(Array.prototype.indexOf.call(this.parentNode?.children, this));

        let newKey = this.createKeyCard();
        let newValue = this.createValueCard();

        newKey.onclick = function () {
            newKey.style.display = "none";
            newValue.style.display = "block";
        }

        newValue.onclick = function () {
            newValue.style.display = "none";
            newKey.style.display = "block";
        }
    }
}

class EditorPage {
    /**
     * Appends new key value fields to the end of the document.
     * 
     * @param {number} parentIndex
     * @param {string} key
     * @param {string} value
     * @param {number} retention
     * @returns {void}
     */
    static addNote(parentIndex = -1, key = "", value = "", retention = 0) {
        let newNote = /** @type {EditorNote} */ (document.createElement("editor-note"));

        newNote.dataset.parentIndex = String(parentIndex);
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
                    if (editorNotes[j].dataset.parentIndex === String(i)) {
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
            EditorPage.addNote(json[i]["parentIndex"], json[i]["key"], json[i]["value"], json[i]["retention"]);
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
}

class FlashcardsPage {
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

    static addCard(parentIndex = -1, key = "", value = "", retention = 0) {
        let newCard = document.createElement("flashcard-note");

        newCard.dataset.parentIndex = String(parentIndex);
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
            FlashcardsPage.addCard(json[i]["parentIndex"], json[i]["key"], json[i]["value"], json[i]["retention"]);
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
}

customElements.define("editor-note", EditorNote);
customElements.define("flashcard-note", FlashcardNote);

/**
 * Parses the key value fields as a JSON document and downloads the data
 * 
 * @param {string} fileName
 * @param {string} context
 * @returns {void}
 */
function downloadJSON(fileName, context) {
    let csvText;
    if (context === "editor") {
        csvText = EditorPage.generateJSON();
    } else {
        csvText = FlashcardsPage.generateJSON();
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
    EditorPage.readFile();
}

flashcardFileImport.onchange = function () {
    FlashcardsPage.readFile();
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

EditorPage.addNote();
EditorPage.refreshLabelUpdating();