import { app, dialog, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 2560,
        height: 1440,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,  // Required for security
            nodeIntegration: false
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    if (process.env.NODE_ENV === 'development')
        mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()

    autoUpdater.setFeedURL({
        provider: 's3',
        bucket: 'cantaloupe-update-bucket',
        region: 'us-east-2',
        path: `cantaloupe/${process.platform}/${process.arch}/`,

        // url: 'https://cantaloupe-update-bucket.s3.us-east-2.amazonaws.com/cantaloupe/darwin/arm64/cantaloupe-darwin-arm64-0.0.1.zip',
    });
    autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new update is available. Downloading now...',
    });
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'A new update is ready. It will be installed on restart. Restart now?',
        buttons: ['Restart', 'Later'],
    }).then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall();
    });
});

autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error', error == null ? 'unknown' : (error.stack || error).toString());
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
