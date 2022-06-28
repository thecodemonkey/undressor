// import { initROClient, initStream } from './twitter.config'
import { CronJob } from 'cron';



async function process() {
    console.log('hello...');
}



const job = new CronJob(
    '0/5 * * * * *',
    async () => { await process() },
    null,
    true
)

// async function start() {
//     const twitter = initROClient();

//     const user = await twitter.v2.userByUsername('undressor');
//     const mentions = await twitter.v2.userMentionTimeline(user.data.id, {
//         since_id: '1491163106944622594'
//     });

//     console.log('timeline', JSON.stringify(mentions, null, 4));

//     // const stream = await initStream();

//     // stream.on(ETwitterStreamEvent.Data, console.log);
//     // stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
//     // // Start stream!
//     // await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
// }


// (async () => {
//     start();
// })();