import * as twitter from './twitter.proxy';
import { imageUrlToBuffer, save, urlUrlToBuffer } from './utils'
import fs from 'fs';

async function start() {

    // twitter.reply()
    // twitter.send('test 2...');

    // { width: 1200, height: 675} }


    // const urls = [
    //     { url: 'http://192.168.0.148:4200/#/images/bar', dimension: { width: 1080, height: 1350} },
    //     { url: 'http://192.168.0.148:4200/#/images/words', dimension: { width: 1080, height: 1350} },

    //     { url: 'http://192.168.0.148:4200/#/images/line', dimension: { width: 1080, height: 1350} }

    // ];

    // for (const u of urls ) {
    //     const b = await urlUrlToBuffer(u.url, u.dimension, 5000);
    //     await save(`./tmp/img-${ Date.now() }.png`, b)
    // }


    const imageBuffers = await Promise.all(
        [
            { url: 'http://192.168.0.148:4200/#/images/polar', dimension: { width: 1080, height: 1350} },
            { url: 'http://192.168.0.148:4200/#/images/radar', dimension: { width: 1080, height: 1350} },
            { url: 'http://192.168.0.148:4200/#/images/bar', dimension: { width: 1080, height: 1350} }

        ].map(u => urlUrlToBuffer(u.url, u.dimension))
    );

    // imageBuffers.forEach(async (b) => await save(`./tmp/img-${ Date.now() }.png`, b));



    twitter.reply('who is "undressor"? \r\n\r\nmore 👉 https://undressor-ui.herokuapp.com/ \r\n', '1542084253634134016', imageBuffers);


    // const buffer = await urlUrlToBuffer('http://192.168.0.148:4200/#/images', { width: 1080, height: 1350});
    // fs.writeFileSync('./test.png', buffer);
}


(async () => {
    start();
})();