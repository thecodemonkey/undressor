import { CronJob } from 'cron';
import * as db from './db';
import * as tclient from './twitter.service';
import { imageUrlToBuffer, urlUrlToBuffer } from './utils'


const DIMENSION =  { width: 1200, height: 675 }

async function run() {
    try
    {
        // console.log('call db...');
        const res = await db.getLastMention();
        // console.log('res', res);

        const lastmention = await tclient.getNewMentions(res.id);

        if (lastmention) {
            console.log('persist lastmention...', lastmention);
            await db.updateLastMention(lastmention);

            const username = 'undressor';

            // generate images...
            // const imageBuffers = await Promise.all([ 'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-daily.png', 'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-weekly.png'].map(u => imageUrlToBuffer(u)));
            const imageBuffers = await Promise.all(
                [
                    { url: `http://192.168.0.148:4200/#/images/${username}/basics`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true} },
                    { url: `http://192.168.0.148:4200/#/images/${username}/weekly`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true}},
                    { url: `http://192.168.0.148:4200/#/images/${username}/interests`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true} },
                    { url: `http://192.168.0.148:4200/#/images/${username}/hashtags`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true} }

                ].map(u => urlUrlToBuffer(u.url, u.options, 5000))
            );
            // generate images end.


            const url = `${process.env.BASE_URL}#/insights/${username}`;
            await tclient.reply(`who is @${username}? \r\n\r\nmore insights » ${url} \r\n`, lastmention.id, imageBuffers);
            // tclient.reply(`reply 2... ${url}`, lastmention.id, imageBuffers);
        }
    }
    catch(e)
    {
        console.error('error while processing', e);
    }
}





const job = new CronJob(
    `0/${process.env.BOT_POLLING_INTERVAL} * * * * *`,
    async () => { await run() },
    null,
    false
)


const botActive = JSON.parse(process.env.BOT_ON);

if (botActive) {
    job.start()
}
else
{
    console.log('bot is deactivated. set BOT_ON env to true. ');
}