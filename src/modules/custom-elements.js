import { EditorPage } from "./pages.js";
import { ctrl, shift } from "./shortcuts.js";
import { editorNotes, flashcardNotes } from "./dom.js";

// Custom elements

export class EditorNote extends HTMLElement {
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
            id: +this.id,
            // @ts-expect-error
            parentId: +this.dataset.parentId,
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

        if (this.dataset.parentId !== "-1") {
            // @ts-expect-error
            newLabel.innerHTML = document.getElementById(this.dataset.parentId).children[1].value;
            newLabel.href = `#${this.dataset.parentId}`;
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
    removeAllChildNotes() {
        // If a linked note points back to the note being removed, remove the linking
        for (let i = 0; i < editorNotes.length; i++) {
            if (editorNotes[i].dataset.parent === this.id) {
                EditorPage.removeLinking(editorNotes[i]);
            }
        }
    }

    /**
     * Removes all linked notes and attempts to focus the previous element.
     */
    disconnectedCallback() {
        this.removeAllChildNotes();

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
                // @ts-expect-error
                EditorPage.addNote(+this.parentElement.id);
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

export class FlashcardNote extends HTMLElement {
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
            id: +this.id,
            // @ts-expect-error
            parentId: +this.dataset.parentId,
            key: this.children[0].innerHTML,
            value: this.children[1].innerHTML,
            // @ts-expect-error
            retention: +this.dataset.retention
        }
    }

    /**
     * Creates the front of the flashcard inside the flashcard note.
     * 
     * @returns {HTMLHeadingElement}
     */
    createKeyCard() {
        let newKey = document.createElement("h1");

        if (this.dataset.parentId !== "-1") {
            // @ts-expect-error
            newKey.innerHTML = `${flashcardNotes[parseInt(this.dataset.parentId)].children[0].innerHTML} -&gt; ${this.dataset.key}`;
        } else {
            // @ts-expect-error
            newKey.innerHTML = this.dataset.key;
        }

        newKey.style.display = "none";
        this.appendChild(newKey);
        return newKey;
    }

    /**
     * Creates the back of the flashcard in the flashcard note.
     * 
     * @returns {HTMLParagraphElement}
     */
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

customElements.define("editor-note", EditorNote);
customElements.define("flashcard-note", FlashcardNote);