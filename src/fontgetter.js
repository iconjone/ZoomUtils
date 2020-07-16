const fetch = require('node-fetch');
const fs = require('fs');
const mkdirp = require('mkdirp');

const fontDirPath = './fonts/Roboto';
mkdirp.sync(fontDirPath);

(async () => {
  const text = await (
    await fetch('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900', {
      headers: {
        // we need to supply user-agent header because Google will return different (insufficient) response without it
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0',
      },
    })
  ).text();

  const fontCss = text
    .split('\n')
    .map(line => {
      const hasURL = line.includes('url(https');
      const [, url, fileName] = line.match(new RegExp('(https://.*/(.*.woff2))\\)')) || [];
      if (hasURL) downloadFile(url, `${fontDirPath}/${fileName}`);
      return hasURL ? line.replace(url, fileName) : line;
    })
    .join('\n');
  fs.writeFileSync(`${fontDirPath}/font_roboto.css`, Buffer.from(fontCss, 'utf-8'));
})();

async function downloadFile(url, path) {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}
