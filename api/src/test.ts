import * as twitter from './twitter.service';
import { imageUrlToBuffer, normalizeHashtags, printJSON, rnd, save, urlUrlToBuffer,  } from './utils'
import fs from 'fs';
import { initClient  } from './twitter.config';
import { Tweetv2SearchParams } from 'twitter-api-v2';
import { normalizeAnnotations, normalizeDomains, normalizeEntities } from './twitter.service';

async function generateImages(twittername: string) {
    const landscape =  { width: 1200, height: 675 }
    const portrait =  { width: 1080, height: 1350 }

    return await Promise.all(
        [
            { url: `http://192.168.0.148:4200/#/images/${twittername}/basics`, options: { ...landscape, convertCanvas2Image: true, headless: true} },
            { url: `http://192.168.0.148:4200/#/images/${twittername}/weekly`, options: { ...landscape, convertCanvas2Image: true, headless: true}},
            { url: `http://192.168.0.148:4200/#/images/${twittername}/activity`, options: { ...landscape, convertCanvas2Image: true, headless: true} },
            { url: `http://192.168.0.148:4200/#/images/${twittername}/hashtags`, options: { ...landscape, convertCanvas2Image: true, headless: true} }
        ].map(u => urlUrlToBuffer(u.url, u.options, 5000))
    );
}

async function saveImages(buffers:Buffer[]) {
    return await Promise.all(buffers.map(b =>
                  save(`./tmp/img-${ Date.now()}-${rnd(0, 100000)}.png`, b)));
}

async function postTweet(twittername: string, buffers: Buffer[]) {
    return await twitter.reply(`who is @undressor? \r\n\r\nmore insights » https://undressor-ui.herokuapp.com/#/insights/undressor \r\n`, '1542084253634134016', buffers);
}



async function start() {
    const username = 'elonmusk';

    // const imageBuffers = await generateImages(username);
    // // await saveImages(imageBuffers);
    // await postTweet(username, imageBuffers);

    const result = await twitter.analyseLink('1547870812245331969');

    printJSON('ANALYSE LINK: ', result);

    // printJSON('HASHTAGS: ', hashtags);
    // printJSON('ANNOTATIONS: ', annotations);
    // printJSON('ENTITIES: ', entities);

    // printJSON('domains', domains);
}

(async () => {
    start();
})();