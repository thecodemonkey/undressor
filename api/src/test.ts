import * as twitter from './twitter.service';
import { imageUrlToBuffer, rnd, save, urlUrlToBuffer,  } from './utils'
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

    const landscape =  { width: 1200, height: 675 }
    const portrait =  { width: 1080, height: 1350 }
    const username = 'BBattmer';


    const imageBuffers = await Promise.all(
        [
            { url: `http://192.168.0.148:4200/#/images/${username}/basics`, options: { ...landscape, convertCanvas2Image: true, headless: true} },
            { url: `http://192.168.0.148:4200/#/images/${username}/weekly`, options: { ...landscape, convertCanvas2Image: true, headless: true}},
            { url: `http://192.168.0.148:4200/#/images/${username}/interests`, options: { ...landscape, convertCanvas2Image: true, headless: true} },
            { url: `http://192.168.0.148:4200/#/images/${username}/hashtags`, options: { ...landscape, convertCanvas2Image: true, headless: true} }

        ].map(u => urlUrlToBuffer(u.url, u.options, 5000))
    );


    //  await Promise.all(imageBuffers.map(b =>
    //          save(`./tmp/img-${ Date.now()}-${rnd(0, 100000)}.png`, b)));


    await twitter.reply('who is @undressor? \r\n\r\nmore insights » https://undressor-ui.herokuapp.com/ \r\n', '1542084253634134016', imageBuffers);
}


(async () => {
    start();
})();