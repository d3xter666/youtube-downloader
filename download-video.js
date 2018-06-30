/**
 * Download YouTube videos described in input-video.txt
 */
const fs = require('fs');
const ytdl = require('ytdl-core');
const readline = require('readline');
const sanitize = require("sanitize-filename");
const transliteration = require('transliteration.cyr');

function download(aStreamList, options, extention) {
    var sStreamId = aStreamList.pop();

    if (!sStreamId) {
        console.log("All done!!!");
        return;
    }

    ytdl.getInfo(sStreamId).then(function (info) {
        let sFilename = transliteration.transliterate(info.title);
        sFilename = sanitize(sFilename);

        return ytdl(sStreamId, options)
            .on('progress', (iChunk, iDownloaded, iTotal) => {
                readline.cursorTo(process.stdout, 0);
                process.stdout.write("Downloading #" + aStreamList.length + " " + sFilename + ": " + ((iDownloaded / iTotal) * 100));
            })
            .on('end', (iChunk, iDownloaded, iTotal) => {
                console.log("");
                console.log("Finished downloading: " + sFilename);
                download(aStreamList, options, extention);
            })
            .pipe(fs.createWriteStream('./downloads/' + sFilename + '.' + extention));
    });
}

fs.readFile('./input-mp3.txt', 'utf8', function (err, downloadList) {
    aYouTubeList = downloadList.split(/\n/);

    download(aYouTubeList, {
        quality: 'highest',
        filter: (format) => format.container === 'mp4'
    }, 'mp4');
});