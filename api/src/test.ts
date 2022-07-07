import * as twitter from './twitter.proxy';
import { imageUrlToBuffer, urlUrlToBuffer } from './utils'
import fs from 'fs';

async function start() {

    // twitter.reply()
    // twitter.send('test 2...');


    // const imageBuffers = await Promise.all(
    //     [
    //         'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-daily.png',
    //         'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-weekly.png'

    //     ].map(u => imageUrlToBuffer(u))
    // );

    // twitter.reply('reply 3... https://undressor-ui.herokuapp.com/ ', '1542084253634134016', imageBuffers);


    const buffer = await urlUrlToBuffer('https://undressor-ui.herokuapp.com/#/', { width: 100, height: 300});
    fs.writeFileSync('./test.png', buffer);
}


(async () => {
    start();
})();