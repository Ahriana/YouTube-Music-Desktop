const { app, BrowserWindow, globalShortcut } = require('electron');
let mainWindow;
const path = require('path').win32;

function createWindow () {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL('https://music.youtube.com/');
    // mainWindow.webContents.insertCSS
    const ren = path.resolve(`${__dirname}`, 'renderer.js');

    mainWindow.webContents.executeJavaScript(`require("${ren.replace(/\\/g, '\\\\')}")`);
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => { mainWindow = null; });
    setTimeout(() => {
        console.log('keys injected!');
        globalShortcut.register('MediaPreviousTrack', () => {
            mainWindow.webContents.send('media', 'previousTrack');
        });

        globalShortcut.register('MediaPlayPause', () => {
            mainWindow.webContents.send('media', 'playPause');
        });

        globalShortcut.register('MediaNextTrack', () => {
            mainWindow.webContents.send('media', 'nextTrack');
        });

        globalShortcut.register('MediaStop', () => {
            mainWindow.webContents.send('media', 'stop');
        });
    }, 3000);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', () => { if (mainWindow === null) { createWindow(); } });

