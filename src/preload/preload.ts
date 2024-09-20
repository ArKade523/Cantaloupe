// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { clipboard, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronClipboard', {
    writeText: (text: string) => clipboard.writeText(text),
    readText: () => clipboard.readText(),
})
