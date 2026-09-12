import { EditorNote, FlashcardNote } from "./custom-elements.js";

// Dialogs

export let fileNameDialog = /** @type {HTMLDialogElement} */ (document.getElementById("file-name-dialog"));
export let keyboardShortcutsDialog = /** @type {HTMLDialogElement} */ (document.getElementById("keyboard-shortcuts-dialog"));
export let saveProgressDialog = /** @type {HTMLDialogElement} */ (document.getElementById("save-progress-dialog"));
export let openShortcutsButtons = /** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName("open-shortcuts-button"));

// Editor page

export let editor = /** @type {HTMLDivElement} */ (document.getElementById("editor"));
export let notesLabels = /** @type {HTMLCollectionOf<HTMLAnchorElement>} */ (document.getElementsByClassName("label"));
export let notesKeys = /** @type {HTMLCollectionOf<HTMLInputElement>} */ (document.getElementsByClassName("key"));
export let printButton = /** @type {HTMLButtonElement} */ (document.getElementById("print-button"));
export let editorFileImport = /** @type {HTMLInputElement} */ (document.getElementById("editor-file-import"));
export let clearEditorButton = /** @type {HTMLButtonElement} */ (document.getElementById("clear-editor-button"));
export let confirmClearEditorButton = /** @type {HTMLButtonElement} */ (document.getElementById("confirm-clear-editor-button"));
export let clearEditorDialog = /** @type {HTMLDialogElement} */ (document.getElementById("clear-editor-dialog"));

// Flashcards page

export let flashcardsDisplay = /** @type {HTMLDivElement} */ (document.getElementById("flashcards-display"));
export let flashcardsProgress = /** @type {HTMLLabelElement} */ (document.getElementById("flashcards-progress"));
export let flashcardsRetention = /** @type {HTMLLabelElement} */ (document.getElementById("flashcards-retention"));
export let previousButton = /** @type {HTMLButtonElement} */ (document.getElementById("previous-button"));
export let nextButton = /** @type {HTMLButtonElement} */ (document.getElementById("next-button"));
export let correctButton = /** @type {HTMLButtonElement} */ (document.getElementById("correct-button"));
export let incorrectButton = /** @type {HTMLButtonElement} */ (document.getElementById("incorrect-button"));
export let treePath = /** @type {HTMLParagraphElement} */ (document.getElementById("tree-path"));
export let flashcardFileImport = /** @type {HTMLInputElement} */ (document.getElementById("flashcard-file-import"));
export let clearFlashcardsButton = /** @type {HTMLButtonElement} */ (document.getElementById("clear-flashcards-button"));
export let confirmClearFlashcardsButton = /** @type {HTMLButtonElement} */ (document.getElementById("confirm-clear-flashcards-button"));
export let clearFlashcardsDialog = /** @type {HTMLDialogElement} */ (document.getElementById("clear-flashcards-dialog"));

// Custom elements

export let editorNotes = /** @type {HTMLCollectionOf<EditorNote>} */ (document.getElementsByTagName("editor-note"));
export let flashcardNotes = /** @type {HTMLCollectionOf<FlashcardNote>} */ (document.getElementsByTagName("flashcard-note"));

// Toolbars

export let flashcardsData = /** @type {HTMLDivElement} */ (document.getElementById("flashcards-data"));
export let navSelects = /** @type {HTMLSelectElement} */ (document.getElementsByClassName("nav-select"));
export let editorToolbar = /** @type {HTMLDivElement} */  (document.getElementById("editor-toolbar"));

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

// Insights page

export let averageRetention = /** @type {HTMLParagraphElement} */ (document.getElementById("average-retention"));
export let medianRetention = /** @type {HTMLParagraphElement} */ (document.getElementById("median-retention"));
export let insightsFileImport = /** @type {HTMLInputElement} */ (document.getElementById("insights-file-import"));

// Settings page

export let hueValue = /** @type {HTMLInputElement} */ (document.getElementById("hue-value"));
export let accentHueValue = /** @type {HTMLInputElement} */ (document.getElementById("accent-hue-value"));