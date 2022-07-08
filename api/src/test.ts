import * as twitter from './twitter.proxy';
import { imageUrlToBuffer, urlUrlToBuffer } from './utils'
import fs from 'fs';

async function start() {

    // twitter.reply()
    // twitter.send('test 2...');


    const imageBuffers = await Promise.all(
        [
            { url: 'http://192.168.0.148:4200/#/images/int', dimension: { width: 1080, height: 1350} },
            { url: 'http://192.168.0.148:4200/#/images/lang', dimension: { width: 1200, height: 675} },
            { url: 'http://192.168.0.148:4200/#/images/daily', dimension: { width: 1200, height: 675} }

        ].map(u => urlUrlToBuffer(u.url, u.dimension))
    );

    twitter.reply('who is behind "undressor"? \r\n\r\nhttps://undressor-ui.herokuapp.com/ ', '1542084253634134016', imageBuffers);


    // const buffer = await urlUrlToBuffer('http://192.168.0.148:4200/#/images', { width: 1080, height: 1350});
    // fs.writeFileSync('./test.png', buffer);
}


(async () => {
    start();
})();