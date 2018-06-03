const fs = require('fs');
const ytdl = require('ytdl-core');
const readline = require('readline');

function download(aStreamList, options, extention) {
    var sStreamId = aStreamList.pop();

    if (!sStreamId) {
        console.log("All done!!!");
        return;
    }

    ytdl.getInfo(sStreamId).then(function (info) {
        return ytdl(sStreamId, options)
            .on('progress', (iChunk, iDownloaded, iTotal) => {
                readline.cursorTo(process.stdout, 0);
                process.stdout.write("Downloading " + info.title + ": " + ((iDownloaded / iTotal) * 100));
            })
            .on('end', (iChunk, iDownloaded, iTotal) => {
                console.log("");
                console.log("Finished downloading: " + info.title);
                download(aStreamList, options, extention);
            })
            .pipe(fs.createWriteStream('./downloads/' + info.title + '.' + extention));
    });
}

fs.readFile('./input.txt', 'utf8', function (err, downloadList) {
    aYouTubeList = downloadList.split(/\n/);

    // download(aYouTubeList, {
    //     quality: 'highestaudio',
    //     filter: 'audioonly'
    // }, 'mp3');

    download(aYouTubeList, {
        quality: 'highest',
        filter: 'video'
    }, 'mp4');
});