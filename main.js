const { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray } = require('electron');
let mainWindow, tray;
function sendKey(key) { mainWindow.webContents.send('media', key); }
const path = require('path');

function createWindow () {
    tray = new Tray('assets/ytmusic.png');
    mainWindow = new BrowserWindow({
        icon: 'assets/ytmusic.png', frame: true,
        width: 800, height: 600,
        webPreferences: { nodeIntegration: true, preload: path.join(__dirname, 'renderer.js') },
        show: false,
    });
    mainWindow.loadURL('https://music.youtube.com/');

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('close', (event) => {
        if (!app.isQuitting) { event.preventDefault(); mainWindow.hide(); }
        return false;
    });

    mainWindow.on('closed', () => { mainWindow = null; });
}

ipcMain.on('load-content', () => {
    globalShortcut.register('MediaPreviousTrack', () => sendKey('previousTrack'));
    globalShortcut.register('MediaPlayPause', () => sendKey('playPause'));
    globalShortcut.register('MediaNextTrack', () => sendKey('nextTrack'));

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Play/Pause',
        click: () => { sendKey('playPause'); },
    },
    {
        label: 'Next Track',
        click: () => { sendKey('nextTrack'); },
    },
    {
        label: 'Previous Track',
        click: () => { sendKey('previousTrack'); },
    },
    {
        type: 'separator',
    },
    {
        label: 'Quit',
        click: () => { app.isQuitting = true; app.quit(); },
    }]);

    tray.setToolTip('YT Music Client');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => !mainWindow.isVisible() || mainWindow.isMinimized() ? mainWindow.show() : mainWindow.hide());
});


app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', () => { if (mainWindow === null) { createWindow(); } });
