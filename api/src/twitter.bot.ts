import console from 'console';
import { CronJob } from 'cron';
import moment from 'moment';
import { TweetV2 } from 'twitter-api-v2';
import * as db from './db';
import * as tclient from './twitter.service';
import { imageUrlToBuffer, rnd, save, urlUrlToBuffer } from './utils';

enum Command {
    LINK,
    DEFAULT
}

const DIMENSION =  { width: 1200, height: 675 }
let RUNNING:boolean = false;

const getImages = (cmd: Command, username: string, tweetId?: string ) => {

    switch(cmd) {
        case Command.LINK:

            return [
                { url: `${process.env.BASE_IMAGE_URL}#/images/${tweetId}/link-hashtags`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true} },
                { url: `${process.env.BASE_IMAGE_URL}#/images/${tweetId}/link-domains`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true}},
                { url: `${process.env.BASE_IMAGE_URL}#/images/${tweetId}/link-annotations`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true} },
                { url: `${process.env.BASE_IMAGE_URL}#/images/${tweetId}/link-entities`, options: { width: 2400, height: 1350, convertCanvas2Image: true, headless: true} }
            ]
        case Command.DEFAULT:
        default:

            return [
                { url: `${process.env.BASE_IMAGE_URL}#/images/${username}/basics`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true} },
                { url: `${process.env.BASE_IMAGE_URL}#/images/${username}/weekly`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true}},
                { url: `${process.env.BASE_IMAGE_URL}#/images/${username}/activity`, options: { ...DIMENSION, convertCanvas2Image: true, headless: true} },
                { url: `${process.env.BASE_IMAGE_URL}#/images/${username}/hashtags`, options: { width: 2400, height: 1350, convertCanvas2Image: true, headless: true} }
            ]
    }
}


async function processAnswer(mention:TweetV2, dryRun?:boolean) {
    if (mention) {
        console.log('persist lastmention...', mention);

        if (!dryRun)
        {
            await db.updateLastMention(mention);
        }

        // get author of original tweet. if mention is not inside reply, use author_id of the guy who asked undressor.
        const ogAuthorId = mention.in_reply_to_user_id || mention.author_id;
        const ogTweetId = mention.referenced_tweets? mention.referenced_tweets[0].id : mention.id; // '1547870812245331969';

        const user = await tclient.getUserById(ogAuthorId);
        const username = user.username;

        const cmd = (mention.text.indexOf('link') > -1)? Command.LINK : Command.DEFAULT;
        console.log(`reply to: ${username} | cmd: ${cmd} | ogTweetId: ${ogTweetId}`);

        // generate images...
        const imageBuffers = await Promise.all(
            getImages(cmd, username, ogTweetId)
                    .map(u => urlUrlToBuffer(u.url, u.options, 5000))
         );

        console.log(`images loaded ${imageBuffers.length}`);

        if (dryRun) {
            console.log('DRY RUN: persist images...');
             await Promise.all(imageBuffers.map(b => save(`./tmp/img-${ Date.now()}-${rnd(0, 100000)}.png`, b)));
             console.log('DRY RUN: images created.');
        }
        // generate images end.
        const url = `${process.env.BASE_URL}#/insights/${username}`;

        await tclient.reply(`who is @${username}? \r\n\r\nmore insights » ${url} \r\n`, mention.id, imageBuffers, dryRun );
        // tclient.reply(`reply 2... ${url}`, lastmention.id, imageBuffers);
    }
}

async function run(dryRun?:boolean) {
    try
    {
        if (RUNNING) {
            console.log('BOT is heavily engaged.');
            return;
        }

        RUNNING = true;
        // console.log('call db...');
        const res = await db.getLastMention();
        console.log(`last mention: ${res.id}`);

        const mentions = await tclient.getNewMentions(res.id);

        console.log(`found ${mentions? mentions.length : 0} mentions.`)

        if (mentions)
        {
            // const sorted = mentions.map((men:TweetV2) => ({...men, created: moment(men.created_at).unix()}))
            //                        .sort((a,b) => b.created - a.created)

            for(const m of mentions.reverse()) {
                await processAnswer(m, dryRun);
            }
        }

        RUNNING = false;
    }
    catch(e)
    {
        console.error('error while processing', e);
        RUNNING = false;
    }
}





const job = new CronJob(
    `0/${process.env.BOT_POLLING_INTERVAL} * * * * *`,
    async () => { await run(JSON.parse(process.env.BOT_DRY_RUN)) },
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