import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("note-editor")
export class NoteEditor extends LitElement {
    static styles = css`
        span {
            display: block;
            text-align: left;
            width: 100%;
        }
    `;

    render() {
        return html`
            <span contenteditable="true">Test</span>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "note-editor": NoteEditor;
    }
}