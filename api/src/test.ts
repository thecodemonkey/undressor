import * as twitter from './twitter.proxy';
import { urlToBuffer } from './utils'

async function start() {

    // twitter.reply()
    // twitter.send('test 2...');


    const imageBuffers = await Promise.all(
        [
            'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-daily.png',
            'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-weekly.png'

        ].map(u => urlToBuffer(u))
    );

    twitter.reply('reply 3... https://undressor-ui.herokuapp.com/ ', '1542084253634134016', imageBuffers);
}


(async () => {
    start();
})();