export interface IElectronClipboard {
    writeText: (text: string) => void;
    readText: () => string;
}

declare global {
    interface Window {
        electronClipboard: IElectronClipboard;
    }
}