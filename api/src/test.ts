import * as twitter from './twitter.proxy';

async function start() {

    // twitter.reply()
    // twitter.send('test 2...');


    twitter.reply('reply 1... https://github.com ', '1542084253634134016');

}


(async () => {
    start();
})();