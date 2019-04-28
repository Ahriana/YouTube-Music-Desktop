document.addEventListener('DOMContentLoaded', () => {
    const ipcRenderer = require('electron').ipcRenderer;
    const DiscordRPC = require('discord-rpc');
    const clientId = '460456226090778634';
    let discord = false;
    const rpc = new DiscordRPC.Client({ transport: 'ipc' });
    let last = ['', {}];
    let API = {};
    ipcRenderer.send('load-content');

    ipcRenderer.on('media', (event, store) => {
        if (store === 'nextTrack') {
            return API.nextVideo();
        } else if (store === 'previousTrack') {
            return API.previousVideo();
        } else if (store === 'playPause') {
            const state = API.getPlayerState();
            if (state === 1) {
                return API.pauseVideo();
            } else if (state === 2) { return API.playVideo(); } else {
                return console.log('unhandled player state', state);
            }
        } else {
            console.log('unhandled key');
        }
    });

    const ytmusic_api = document.getElementsByClassName('ytmusic-app');
    Object.keys(ytmusic_api).forEach(element => {
        if (ytmusic_api[element].playerApi_) { API = ytmusic_api[element].playerApi_; }
    });

    API.addEventListener('onStateChange', () => {
        const data = API.getVideoData();
        const curTime = API.getCurrentTime();
        const now = Date.now() / 1000;

        const act = {
            largeImageKey: 'large_logo',
            details: `${data.author ? data.author : 'NA'} - ${data.title ? data.title : 'NA'}`,
            state: data.video_id ? `youtu.be/${data.video_id}` : null,
            type: 'WATCHING',
            startTimestamp: Math.round(now - curTime),
        };
        last[1] = act;
    });

    API.addEventListener('onReady', () => console.log('onReady'));

    function updateDiscord() {
        if (!last[1].state) { return; }
        if (last[0] === last[1].state) { return; }
        last[0] = last[1].state;
        rpc.setActivity(last[1]);
    }

    rpc.on('ready', () => {
        console.log('Discord client detected!');
        if (discord) { return; }
        discord = true;
        setInterval(() => { updateDiscord(); }, 15000);
    });
    rpc.login({ clientId });
}, false);
