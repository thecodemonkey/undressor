import { CronJob } from 'cron';
import * as db from './db';
import { initROClient } from './twitter.config';
import * as tclient from './twitter.proxy';


async function run() {
    try
    {
        // console.log('call db...');
        const res = await db.getLastMention();
        // console.log('res', res);

        const lastmention = await checkMentions(res.id);

        if (lastmention) {
            console.log('persist lastmention...', lastmention);
            await db.updateLastMention(lastmention);

            tclient.reply('reply 2... https://undressor-ui.herokuapp.com/ ', lastmention.id);
        }
    }
    catch(e)
    {
        console.error('error while processing', e);
    }
}


async function checkMentions(lastMentionId: string) {
    const twitter = initROClient();

    // console.log(`call users id of '${ process.env.TWITTER_NAME }' `);
    const user = await twitter.v2.userByUsername(process.env.TWITTER_NAME);

    // console.log(`'${process.env.TWITTER_NAME}' id is: ${user.data.id} `);

    const mentions = await twitter.v2.userMentionTimeline(user.data.id, {
        since_id: lastMentionId
    });

    const mentResult = mentions.data;

    if (mentResult.meta.result_count < 1) {
        console.log('NO RESULT!');

        return null;
    } else {
        console.log('\nmentions: ', JSON.stringify(mentResult.data, null, 4));

        return mentResult.data[0];
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