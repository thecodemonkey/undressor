// import { initROClient, initStream } from './twitter.config'
import { CronJob } from 'cron';
import * as db from './db';
import { initROClient } from './twitter.config';


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
    '0/60 * * * * *',
    async () => { await run() },
    null,
    true
)

// async function start() {


//     // stream.on(ETwitterStreamEvent.Data, console.log);
//     // stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
//     // // Start stream!
//     // await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
// }


// (async () => {
//     start();
// })();