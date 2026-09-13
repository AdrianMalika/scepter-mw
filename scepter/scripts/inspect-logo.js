const fs = require('fs');

function getJpegDimensions(buffer) {
  let i = 0;
  if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) return null;
  i = 2;
  while (i < buffer.length) {
    while (buffer[i] !== 0xFF) i++;
    while (buffer[i] === 0xFF) i++;
    const marker = buffer[i++];
    if (marker === 0xD9 || marker === 0xDA) break;
    const len = buffer.readUInt16BE(i);
    if (marker >= 0xC0 && marker <= 0xC3) {
      const height = buffer.readUInt16BE(i + 3);
      const width = buffer.readUInt16BE(i + 5);
      return { width, height };
    }
    i += len;
  }
  return null;
}

const buf = fs.readFileSync('public/brand/logo-original.jpg');
console.log(JSON.stringify(getJpegDimensions(buf)));
