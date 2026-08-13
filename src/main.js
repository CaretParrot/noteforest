// DOM Elements

let database = document.getElementById("database-wrapper");
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

class Editor {
    constructor() {}

    /**
     * Appends new key value fields to the end of the document
     * 
     * @param {number} parentIndex
     * @returns {void}
     */
    static addNote(parentIndex = -1) {
        // Creates label to link to parent if available
        let newLabel = document.createElement("a");
        newLabel.classList.add("label");

        newLabel.dataset.parent = String(parentIndex);

        // Adds a link back to the parent note if it is a linked note.
        if (parentIndex !== -1) {
            newLabel.innerHTML = notesKeys[parentIndex].value;
            newLabel.href = `#${parentIndex}-key`;
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
        document.getElementById("database-wrapper")?.appendChild(newLabel);
        document.getElementById("database-wrapper")?.appendChild(newKey);
        document.getElementById("database-wrapper")?.appendChild(newValue);

        // Set focus to the new key field, then refresh keybinds
        newKey.focus();
        Editor.refreshEnterToAddNote();
    }

    /**
     * Removes the currently focused key value field pair
     * 
     * @param {number} index 
     * @returns {void}
     */
    static removeNote(index) {
        // If a linked note points back to the note being removed, remove the linking
        for (let i = 0; i < notesLabels.length; i++) {
            if (notesLabels[i].dataset.parent === String(index)) {
                notesLabels[i].innerHTML = "";
                notesLabels[i].href = "";
                notesLabels[i].style.pointerEvents = "none";
                notesLabels[i].dataset.parent = "-1";
            }
        }

        // Remove both fields and the label
        notesLabels[index].remove();
        notesValues[index].remove();
        notesKeys[index].remove();

        // Set the focus to the previous value field, then refresh keybinds
        try {
            notesValues[index - 1].focus();
        }
        catch (error) {
            if (error !== TypeError) {
                throw error;
            }
        }
        Editor.refreshEnterToAddNote();
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

        for (let i = 0; i < notesKeys.length; i++) {
            json.push({
                "id": i,
                "parent": notesLabels[i].dataset.parent || "-1",
                "key": notesKeys[i].value,
                "value": notesValues[i].value,
                "retention": notesLabels[i].dataset.retention || "0"
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

        for (let i = notesKeys.length - 1; i > 0; i--) {
            Editor.removeNote(i);
        }

        for (let i = 0; i < object.length - 1; i++) {
            Editor.addNote();
        }

        for (let i = 0; i < object.length; i++) {
            if (object[i]["parent"] !== "" && object[i]["parent"] !== "-1") {
                notesLabels[i].dataset.parent = object[i]["parent"];
                notesLabels[i].href = `#${notesLabels[i].dataset.parent}-key`;
                notesLabels[i].innerHTML = notesKeys[parseInt(/** @type {string} */(notesLabels[i].dataset.parent))].value;
            }

            notesKeys[i].value = object[i]["key"];
            notesValues[i].value = object[i]["value"];
            notesLabels[i].dataset.retention = object[i]["retention"];
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
        console.log(object);
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

Editor.refreshEnterToAddNote();