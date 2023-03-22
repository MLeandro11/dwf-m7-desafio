import Dropzone from "dropzone";

export function initDropzone(buttonEl) {
    return new Dropzone(buttonEl, {
        url: "/falsa",
        autoProcessQueue: false,
    });
}