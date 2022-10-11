import fs from "fs";
import fetch from "node-fetch";
import FileType from "file-type";

async function savePhotoFromAPI() {
    const response = await fetch("https://picsum.photos/200");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await FileType.fromBuffer(buffer);
    if (fileType.ext) {
        const outputFileName = `test.${fileType.ext}`;
        fs.createWriteStream(outputFileName).write(buffer);
    } else {
        console.log("File Type not determied!");
    }
}

savePhotoFromAPI();
