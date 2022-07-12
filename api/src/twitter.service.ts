import { Console } from 'console';
import moment from 'moment';
import { SendTweetV2Params, TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import { initClient, initOAuth1Client, initROClient } from './twitter.config'

async function getMentionsCounts24h(tclient: TwitterApiReadOnly, username:string) {
    const start = moment().startOf('day').subtract(1, 'day');



    return await tclient.v2.tweetCountRecent(`@${username} -to:${username}`, {
        start_time:  start.toISOString(), end_time: start.endOf('day').toISOString(),
        granularity: 'day'
    });
}

async function getTweetCounts24h(tclient: TwitterApiReadOnly, userid:string, replies?: boolean) {
    const start = moment().startOf('day').subtract(1, 'day');

    const q = replies === true? '(is:retweet OR is:reply OR is:quote)' : '';

    return await tclient.v2.tweetCountRecent(`(from:${userid}) ${q} `, {
        start_time:  start.toISOString(), end_time: start.endOf('day').toISOString(),
        granularity: 'day'
    });
}

async function getProfile(twittername: string) {
    const tclient = initROClient();

    const user = await tclient.v2.userByUsername(twittername, { "user.fields" : ['public_metrics','protected','profile_image_url']});

    const tweetsCnt = await getTweetCounts24h(tclient, user.data.id);
    const repliesCnt = await getTweetCounts24h(tclient, user.data.id, true);
    const mentions = await getMentionsCounts24h(tclient, twittername);

    console.log('### read user info: ###\n\n');
    console.log('counts', mentions);

    // const likes = await tclient.v2.userLikedTweets(user.data.id);
    // console.log('likes', likes);

    return {
        profile_image_url: user.data.profile_image_url,
        followers_count: user.data.public_metrics.followers_count,
        following_count: user.data.public_metrics.following_count,
        listed_count: user.data.public_metrics.listed_count,
        tweet_count: tweetsCnt.meta.total_tweet_count - repliesCnt.meta.total_tweet_count,
        reply_count: repliesCnt.meta.total_tweet_count,
        mention_count: mentions.meta.total_tweet_count
    };
}


async function reply(text: string, tweetid: string, images?:Buffer[]) {
    const tclient = initOAuth1Client();

    const params:Partial<SendTweetV2Params> = { media : {} };

    if (images && images.length > 0) {

        params.media.media_ids = await Promise.all(
            images.map(i => tclient.v1.uploadMedia(i, { mimeType: 'image/png' }))
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
