// DOM Elements
let database = document.getElementById("database-wrapper");
let notesLabels = /** @type {HTMLCollectionOf<HTMLAnchorElement>} */ (document.getElementsByClassName("label"));
let notesValues = /** @type {HTMLCollectionOf<HTMLTextAreaElement>} */ (document.getElementsByClassName("value"));
let notesKeys = /** @type {HTMLCollectionOf<HTMLInputElement>} */ (document.getElementsByClassName("key"));
let fileImport = /** @type {HTMLInputElement} */ (document.getElementById("fileImport"));
let saveButton = /** @type {HTMLButtonElement} */ (document.getElementById("saveButton"));
let fileNameDialog = /** @type {HTMLDialogElement} */ (document.getElementById("fileNameDialog"));
let keyboardShortcutsDialog = /** @type {HTMLDialogElement} */ (document.getElementById("keyboardShortcutsDialog"));
let fileNameInput = /** @type {HTMLInputElement} */ (document.getElementById("fileNameInput"));

/**
 * Appends new key value fields to the end of the document
 * 
 * @param {number} parentIndex
 * @returns {void}
 */
function addNote(parentIndex = -1) {
    // Creates label to link to parent if available
    let newLabel = document.createElement("a");
    newLabel.classList.add("label");

    // Adds linking if the note was created with a linked index, otherwise
    newLabel.dataset.parent = String(parentIndex);

    if (parentIndex !== -1) {
        newLabel.innerHTML = notesKeys[parentIndex].value;
        newLabel.href = `#${parentIndex}-key`;
    }

    // Creates new key field
    let newKey = document.createElement("input");
    newKey.classList.add("key");
    newKey.placeholder = "Term";

    // Creates new value field
    let newValue = document.createElement("textarea");
    newValue.classList.add("value");
    newValue.placeholder = "Definition";

    newKey.id = `${notesKeys.length}-key`;
    newValue.id = `${notesValues.length}-value`;
    
    // Add both input fields and the label to the wrapper element
    document.getElementById("database-wrapper")?.appendChild(newLabel);
    document.getElementById("database-wrapper")?.appendChild(newKey);
    document.getElementById("database-wrapper")?.appendChild(newValue);

    // Set focus to the new key field, then refresh keybinds
    newKey.focus();
    refreshEnterToAddNote();
}

/**
 * Removes the currently focused key value field pair
 * 
 * @param {number} index 
 * @returns {void}
 */
function removeNote(index) {
    // Remove both fields and the label
    notesLabels[index].remove();
    notesValues[index].remove();
    notesKeys[index].remove();

    // Set the focus to the previous value field, then refresh keybinds
    notesValues[index - 1].focus();
    refreshEnterToAddNote();
}

let ctrl = false;
let shift = false;

/**
 * Refreshes the keybinds to allow appending and removing notes through keybinds
 * 
 * @returns {void}
 */
function refreshEnterToAddNote() {
    for (let i = 0; i < notesLabels.length; i++) {

        // ctrl+click: Clear linking on label
        notesLabels[i].onclick = function (event) {
            if (ctrl) {
                event.preventDefault();
                notesLabels[i].innerHTML = "";
                notesLabels[i].href = "";
                notesLabels[i].style.pointerEvents = "none";
                notesLabels[i].dataset.parent = "";
            }
        }

        if (notesLabels[i].dataset.parent !== "-1") {
            notesLabels[i].href = `#${notesLabels[i].dataset.parent}-key`;
            // @ts-expect-error
            notesLabels[i].innerHTML = document.getElementById(`${notesLabels[i].dataset.parent}-key`).value;
        }
    }

    for (let i = 0; i < notesKeys.length; i++) {
        // Remove empty fields when hitting backspace on key fields
        notesKeys[i].onkeydown = function (event) {
            if (event.key === "Backspace" && notesValues[i].value === "" && notesKeys[i].value === "" && notesKeys.length > 1) {
                removeNote(i);
            }
        }

        // Update coorespoding labels when editing a key
        notesKeys[i].oninput = function () {
            for (let i = 0; i < notesLabels.length; i++) {
                if (notesLabels[i].dataset.parent !== "-1") {
                    // @ts-expect-error
                    notesLabels[i].innerHTML = document.getElementById(`${notesLabels[i].dataset.parent}-key`).value;
                }
            }
        }
    }

    for (let i = 0; i < notesValues.length; i++) {
        notesValues[i].onkeydown = function (event) {
            // enter: Add an unlinked note
            if (!ctrl && !shift && event.key === "Enter") {
                addNote();
            }

            // ctrl+enter: Add a linked note
            if (ctrl && !shift && event.key === "Enter") {
                addNote(i);
            }

            // shift+enter: Add a new line in the value field

            // Remove empty fields when hitting backspace on value fields
            if (event.key === "Backspace" && notesValues[i].value === "" && notesKeys[i].value === "" && notesKeys.length > 1) {
                removeNote(i);
            }
        }
    }
}

/**
 * Splits CSV document into key value fields 
 * 
 * @param {string} text 
 */
function parseCSV(text) {
    let lines = text.split("\n");

    for (let i = notesKeys.length - 1; i > 0; i--) {
        removeNote(i);
    }

    for (let i = 0; i < lines.length - 1; i++) {
        addNote();
    }

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].split("|")[0] !== "" && lines[i].split("|")[0] !== "-1") {
            notesLabels[i].dataset.parent = lines[i].split("|")[0];
            notesLabels[i].href = `#${notesLabels[i].dataset.parent}-key`;
            notesLabels[i].innerHTML = notesKeys[parseInt(/** @type {string} */(notesLabels[i].dataset.parent))].value;
        }

        notesKeys[i].value = lines[i].split("|")[1];
        notesValues[i].value = lines[i].split("|")[2];
    }

    refreshEnterToAddNote();
}

/**
 * Reads in a file from the file input, passing the text into parseCSV
 * 
 * @returns {void}
 */

function readFile() {
    if (fileImport.files === null) {
        return;
    }

    const file = fileImport.files[0];
    const reader = new FileReader();
    let text;

    reader.addEventListener("load", () => {
        text = reader.result;
        // @ts-expect-error
        parseCSV(text);
    });

    if (file) {
        reader.readAsText(file);
    }
}

/**
 * Generates CSV string from the key value fields
 * 
 * @returns {string}
 */

function generateCSV() {
    let csvText = "";

    for (let i = 0; i < notesKeys.length; i++) {
        csvText += `${notesLabels[i].dataset.parent}|${notesKeys[i].value}|${notesValues[i].value}`;
        if (i !== notesKeys.length - 1) {
            csvText += `\n`;
        }
    }

    return csvText;
}

/**
 * Parses the key value fields as a CSV document and downloads the data
 * 
 * @param {string} fileName
 * @returns {void}
 */

function downloadCSV(fileName) {
    let csvText = generateCSV();

    let blob = new Blob([csvText], {
        type: "text/plain"
    });

    let downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
}

fileImport.onclick = function () {
    fileImport.value = "";
}

fileImport.onchange = function () {
    readFile();
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
        fileImport.click();
    }

    if (event.key === "Escape") {
        event.preventDefault();
        fileNameDialog.close();
        keyboardShortcutsDialog.close();
    }
}

/**
 * Releases control key
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
 * 
 * @param {*} event 
 */
fileNameInput.onkeydown = function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        fileNameDialog.close();
        downloadCSV(fileNameInput.value || "notes.csv");
    }
}

function closeDialogs() {
    fileNameDialog.close();
    keyboardShortcutsDialog.close();
}

function openShortcuts() {
    keyboardShortcutsDialog.showModal();
}

refreshEnterToAddNote();