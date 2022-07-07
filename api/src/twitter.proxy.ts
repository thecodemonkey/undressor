import { Console } from 'console';
import { request } from 'http';
import { SendTweetV2Params, TwitterApi } from 'twitter-api-v2';
import { initClient, initOAuth1Client, initROClient } from './twitter.config'


async function getProfile(twittername: string) {
    const tclient = initROClient();

    const user = await tclient.v2.userByUsername(twittername);


    console.log('### read user info: ###\n\n');
    console.log('user', user);

    return { status: 'ok', profile: user };
}


async function reply(text: string, tweetid: string, images?:Buffer[]) {
    const tclient = initOAuth1Client();

    const params:Partial<SendTweetV2Params> = { media : {} };

    if (images && images.length > 0) {

        params.media.media_ids = await Promise.all(
            images.map(i => tclient.v1.uploadMedia(i, { type: 'png' }))
        );
    }



    const res = await tclient.v2.reply(text, tweetid, params);
    console.debug('send reply', JSON.stringify(res, null, 4));
}

async function send(text: string) {

    const tclient = initOAuth1Client();



    const res = await tclient.v2.tweet(text);


    console.debug('send tweet result', JSON.stringify(res, null, 4));
}

async function getNewMentions(lastMentionId: string) {
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

export { reply, send, getProfile, getNewMentions }
