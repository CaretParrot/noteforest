// @ts-expect-error
export const fs = window.__TAURI_PLUGIN_FS__;

if (!(await fs.exists("NoteForest", { baseDir: fs.BaseDirectory.Document }))) {
    await fs.mkdir("NoteForest", {
        baseDir: fs.BaseDirectory.Document
    });
}