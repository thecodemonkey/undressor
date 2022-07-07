import { CronJob } from 'cron';
import * as db from './db';
import * as tclient from './twitter.proxy';
import { urlToBuffer } from './utils'


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


            // generate images...
            const imageBuffers = await Promise.all([ 'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-daily.png', 'https://raw.githubusercontent.com/thecodemonkey/undressor/main/ui/src/assets/dummy/chart-weekly.png'].map(u => urlToBuffer(u)));

            // generate images end.


            const url = `${process.env.BASE_URL}insights/undressor`;
            tclient.reply(`reply 2... ${url}`, lastmention.id, imageBuffers);
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