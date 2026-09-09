import { EditorPage, FlashcardsPage } from "./modules/pages.js";

// Adds a note to the editor page

if (!EditorPage.loadCachedJSON()) {
    EditorPage.addNote();
    EditorPage.refreshLabelUpdating();
}

FlashcardsPage.loadCachedJSON();