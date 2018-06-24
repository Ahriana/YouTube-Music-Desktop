const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('media', (event, store) => {
    console.log('key:', store);
    if (store === 'nextTrack') {
        document.getElementsByClassName('next-button')[0].click();
    } else if (store === 'previousTrack') {
        document.getElementsByClassName('previous-button')[0].click();
    } else if (store === 'playPause') {
        document.getElementsByClassName('play-pause-button')[0].click();
    } else {
        console.log('unhandled key');
    }
});
