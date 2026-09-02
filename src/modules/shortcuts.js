import { openShortcuts, closeDialogs } from "./pages.js";
import { fileNameDialog, editorFileImport } from "./dom.js";

export let ctrl = false;
export let shift = false;

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