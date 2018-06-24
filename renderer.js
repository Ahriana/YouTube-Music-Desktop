const ipcRenderer = require('electron').ipcRenderer;
const DiscordRPC = require('discord-rpc');
const ClientId = '460456226090778634';
let discord = false;
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

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

const API = document.getElementsByClassName('ytmusic-app')[3].playerApi_;

API.addEventListener('onStateChange', (a) => {
    console.log('onStateChange', a);
    switch (event.data) {
        case 0:
            console.log('video ended');
            break;
        case 1:
            console.log(`video playing`);
            break;
        case 2:
            console.log(`video paused`);
    }
});

API.addEventListener('onVideoDataChange', (a) => {
    console.log('onVideoDataChange', a);
    if (a.type === 'dataupdated') {
        console.log('update discord now?');
        if (discord) { return updateDiscord(); }
        // API.getVideoData()
    }
});
API.addEventListener('onReady', () => console.log('onReady'));

// API.addEventListener('onPlaylistNext', () => { console.log(e.queue); });
// API_.addEventListener('onPlaylistPrevious', () => console.log(e));
// this.store.subscribeBySelector("player.volume",function(a){e.onVolumeChange(a)});

function updateDiscord() {
    const data = API.getVideoData();
    const curTime = API.getCurrentTime();
    const lengh = API.getDuration();
    const now = Date.now() / 1000;

    rpc.setActivity({
        largeImageKey: 'large_logo',
        smallImageKey: 'small_logo',
        // smallImageText: '',
        details: `${data.author} - ${data.title}`,
        state: `https://www.youtube.com/watch?v=${data.video_id}`,
        type: 'WATCHING',
        startTimestamp: Math.round(now - curTime),
        // endTimestamp: Math.round(now + lengh),
    });
    console.log(`discord presence updated`);
}

rpc.on('ready', () => { console.log('discord detected!'); discord = true; });
rpc.login(ClientId).catch(console.error);
