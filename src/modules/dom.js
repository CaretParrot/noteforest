import { EditorNote, FlashcardNote } from "./custom-elements.js";

// Dialogs

export let fileNameDialog = /** @type {HTMLDialogElement} */ (document.getElementById("file-name-dialog"));
export let keyboardShortcutsDialog = /** @type {HTMLDialogElement} */ (document.getElementById("keyboard-shortcuts-dialog"));
export let saveProgressDialog = /** @type {HTMLDialogElement} */ (document.getElementById("save-progress-dialog"));
export let openShortcutsButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("open-shortcuts-button"));

// Editor page

export let database = /** @type {HTMLDivElement} */ (document.getElementById("database"));
export let notesLabels = /** @type {HTMLCollectionOf<HTMLAnchorElement>} */ (document.getElementsByClassName("label"));
export let notesKeys = /** @type {HTMLCollectionOf<HTMLInputElement>} */ (document.getElementsByClassName("key"));

// Flashcards page

export let flashcardsDisplay = /** @type {HTMLDivElement} */ (document.getElementById("flashcards-display"));
export let flashcardsProgress = /** @type {HTMLLabelElement} */ (document.getElementById("flashcards-progress"));
export let flashcardsRetention = /** @type {HTMLLabelElement} */ (document.getElementById("flashcards-retention"));
export let previousButton = /** @type {HTMLButtonElement} */ (document.getElementById("previous-button"));
export let nextButton = /** @type {HTMLButtonElement} */ (document.getElementById("next-button"));
export let correctButton = /** @type {HTMLButtonElement} */ (document.getElementById("correct-button"));
export let incorrectButton = /** @type {HTMLButtonElement} */ (document.getElementById("incorrect-button"));
export let treePath = /** @type {HTMLParagraphElement} */ (document.getElementById("tree-path"));

// Custom elements

export let editorNotes = /** @type {HTMLCollectionOf<EditorNote>} */ (document.getElementsByTagName("editor-note"));
export let flashcardNotes = /** @type {HTMLCollectionOf<FlashcardNote>} */ (document.getElementsByTagName("flashcard-note"));

// File import fields

export let editorFileImport = /** @type {HTMLInputElement} */ (document.getElementById("editor-file-import"));
export let flashcardFileImport = /** @type {HTMLInputElement} */ (document.getElementById("flashcard-file-import"));

// Toolbars

export let flashcardsData = /** @type {HTMLDivElement} */ (document.getElementById("flashcards-data"));
export let navSelects = /** @type {HTMLSelectElement} */ (document.getElementsByClassName("nav-select"));

// File name inputs

export let saveNameInput = /** @type {HTMLInputElement} */ (document.getElementById("save-name-input"));
export let fileNameInput = /** @type {HTMLInputElement} */ (document.getElementById("file-name-input"));

// Page navigation buttons

export let toFlashcardsPageButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("to-flashcards-page"));
export let toEditorPageButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("to-editor-page"));

// Save buttons

export let saveButton = /** @type {HTMLButtonElement} */ (document.getElementById("save-button"));
export let saveProgressButton = /** @type {HTMLButtonElement} */ (document.getElementById("save-progress-button"));

// Close buttons

export let closeButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("close-button"));