/**
 * Download MP3s from YouTube described in input-mp3.txt
 */
const readline = require('readline');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const sanitize = require("sanitize-filename");
const transliteration = require('transliteration.cyr');


function download(aStreamList) {
    var sStreamId = aStreamList.pop();

    if (!sStreamId) {
        console.log("All done!!!");
        return;
    }

    ytdl.getInfo(sStreamId).then(function (info) {
        let sFilename = transliteration.transliterate(info.title);
        sFilename = sanitize(sFilename);

        let stream = ytdl(sStreamId, {
            quality: 'highestaudio',
            filter: 'audioonly',
        });

        let start = Date.now();
        ffmpeg(stream)
            .audioBitrate(128)
            .outputOptions('-metadata', 'title="' + info.title + '"', '-metadata', 'description="' + info.description + '"')
            .save(`./downloads/mp3/${sFilename}.mp3`)
            .on('progress', (p) => {
                readline.cursorTo(process.stdout, 0);
                process.stdout.write(`#${aStreamList.length} ${sFilename}: ${p.targetSize}kb downloaded`);
            })
            .on('end', () => {
                console.log("");
                console.log("Finished downloading: " + sFilename);
                download(aStreamList);
            });
    }, function (error) {
        console.log("Exception catched for stream: " + sStreamId);
        console.log(error);
    });
}

fs.readFile('./input-mp3.txt', 'utf8', function (err, downloadList) {
    aYouTubeList = downloadList.split(/\n/);
    
    download(aYouTubeList);
});