import * as twitter from './twitter.service';
import { decrypt, encrypt, rnd, save, urlUrlToBuffer,  } from './utils'


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
    // const username = 'elonmusk';

    // const user1 = await twitter.getUserById('47954872');
    // printJSON('USER BY ID', user1);

    // const user2 = await twitter.getUserByName('chillya');
    // printJSON('USER BY NAME', user2)

    // const tweet = await twitter.getTweet('1548579806484504576');
    // printJSON('TWEET', tweet);

    // const whois = await twitter.whois('iljaleyberman.com');
    // printJSON('WHOIS', whois);

    // musk: 3b7a1689595c3ffc|
    // chillya: 3d7e108b58502d

    // tweet: 6f234cd40c1d7ba5be1d29eec6981af56bf0a9
    const encrypted = encrypt('1553847218507063296');
    const decrypted = decrypt(encrypted);

    console.log(`enc: ${encrypted}| dec: ${decrypted}`)

    // const imageBuffers = await generateImages(username);
    // // await saveImages(imageBuffers);
    // await postTweet(username, imageBuffers);

    // const result = await twitter.analyseLink('1547870812245331969');

    // printJSON('ANALYSE LINK: ', result);

    // printJSON('HASHTAGS: ', hashtags);
    // printJSON('ANNOTATIONS: ', annotations);
    // printJSON('ENTITIES: ', entities);

    // printJSON('domains', domains);
}

(async () => {
    start();
})();