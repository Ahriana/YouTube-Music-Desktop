const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  Tray
} = require('electron');

//store states

const windowStateKeeper = require('electron-window-state');
let mainWindow, tray;
const path = require('path');

function createWindow(mainWindowState) {
  //Create and/or load states
  var windowState = {};
  tray = new Tray('tray.png')
  mainWindow = new BrowserWindow({
    icon: 'ytmusic.png',
    frame: true,
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'renderer.js')
    },
    show: false,
  });

  mainWindow.loadURL('https://music.youtube.com/');

  mainWindow.on('ready-to-show', function() {
    mainWindow.show();
    mainWindow.focus();
  });
  //minimize to tray
  mainWindow.on('close', function(event) {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  setTimeout(() => {
    // media keys
    globalShortcut.register('MediaPreviousTrack', () => sendKey('previousTrack'));
    globalShortcut.register('MediaPlayPause', () => sendKey('playPause'));
    globalShortcut.register('MediaNextTrack', () => sendKey('nextTrack'));
  }, 3000);
}

//media keys
function sendKey(key) {
  mainWindow.webContents.send('media', key);
}
// System tray
ipcMain.on('load-tray', (event) => {

  const contextMenu = Menu.buildFromTemplate([{
      label: 'Play/Pause',
      click: () => {
        event.sender.send('play-pause');
      }
    },
    {
      label: 'Next Track',
      click: () => {
        event.sender.send('next-track');
      }
    },
    {
      label: 'Previous Track',
      click: () => {
        event.sender.send('previous-track');
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ])
  tray.setToolTip('YT Music Client')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    !mainWindow.isVisible() || mainWindow.isMinimized() ? mainWindow.show() : mainWindow.hide()
  })
})

app.on('ready', function() {

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });
  createWindow(mainWindowState);
  mainWindowState.manage(mainWindow);

});
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow;
  }
});
