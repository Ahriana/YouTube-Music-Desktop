const packager = require('electron-packager');

const matrix = {
    mac: ['darwin', 'x64'],
    win: ['win32', 'ia32'],
    linux: ['linux', 'x64'],
};

const sel = matrix[process.argv[2]];

const opt = {
    name: 'YouTube-Music-Desktop',
    appCopyright: 'RosieCode95',
    dir: '.',
    asar: true,
    overwrite: true,
    prune: true,
    out: './builds',
    icon: './assets/ytmusic_icon.ico',
};

if (sel) {
    opt.platform = sel[0];
    opt.arch = sel[1];
} else {
    opt.all = true;
}

packager(opt).then((builds) => {
    for (const build of builds) { console.log('->', `"${build}"`); }
});
