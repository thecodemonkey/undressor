import { Console } from 'console';
import moment from 'moment';
import { json } from 'stream/consumers';
import { HomeTimelineV1Paginator, SendTweetV2Params, TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import { weeklyUsage } from './data/weekly.cnt';
import { initClient, initOAuth1Client, initROClient } from './twitter.config'
import { normalizeHashtags, printJSON, rnd } from './utils';

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

async function getWeeklyCounts(userid: string) {
    const tclient = initROClient();
    const generateMatrix = () => {
        const matrix:{x:number, y:number, r: number}[] = [];

        for(let x = 0; x < 24; x++) {
          for(let y = 1; y <= 7; y++) {
            matrix.push({ x, y, r: 0});
          }
        }

        return matrix;
    }

    const start = moment().subtract(1, 'week').add(10, 'minutes').utcOffset(7200).toISOString();
    const end = ''; // moment().subtract(1, 'minute').toISOString();

    console.log(`start: ${start} | end: ${end}`);


    // const c2 = await initOAuth1Client();
    // c2.v1.updateAccountSettings( { time_zone: 'Europe/Berlin' });
    // const settings = await c2.v1.accountSettings();
    // const user = await tclient.v2.userByUsername(userid, {
    //                                 "user.fields" : ['public_metrics','protected','profile_image_url', 'location']});
    // printJSON('USER', user);


    const counts = await tclient.v2.tweetCountRecent(`from:${userid}`, {
        // start_time:  start,
        // end_time: end,
        granularity: 'hour'
    });

    // const dat = weeklyUsage();
    const result = generateMatrix();

    counts.data.forEach((cnt) => {
        const m = moment(cnt.start);
        // console.log(`day: ${cnt.start} | hour: ${m.hour()} `);

        const item = result.find(i => i.x === m.hour() && i.y === m.day()+1);
        if (item)
          item.r = cnt.tweet_count;
    });



    return result;
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

async function getInterests(twittername: string) {
    const tclient = initROClient();

    const user = await tclient.v2.userByUsername(twittername);

    const result = tclient.v2.userLikedTweets(user.data.id, { "tweet.fields": ['context_annotations', 'entities', 'public_metrics'] })
    printJSON('INTERESTS', result);

    return result;
}

async function getHashtags(twittername:string) {
    const tclient = initROClient();

    const user = await tclient.v2.userByUsername(twittername);


    const tweets =  await tclient.v2.userLikedTweets(user.data.id, { max_results: 100, "tweet.fields": ['entities'] });
    const hastags = await tclient.v2.search(`(from:${user.data.id} OR retweets_of:${user.data.id} OR @${user.data.id}) has:hashtags -is:retweet`, { max_results: 100, "tweet.fields": ['entities'] });

    const ht = hastags.data?.data?.filter(d => d.entities?.hashtags?.length  > 0)
                                  .flatMap(d => d.entities.hashtags.map(h => h.tag));

    const ht2 = tweets.data?.data?.filter(d => d.entities?.hashtags?.length  > 0)
                                  .flatMap(d => d.entities.hashtags.map(h => h.tag));


    const result = normalizeHashtags((ht || []).concat(ht2));

    console.log('hastags:', result);

    // printJSON('HASHTAGS', hastags)

    return result;
}

async function getActivity(twittername: string) : Promise<any> {

    const tclient = initROClient();
    const user = await tclient.v2.userByUsername(twittername);

    const likes = await tclient.v2.userLikedTweets(user.data.id, {
        "tweet.fields": ['created_at']
    });

    const counts = await tclient.v2.tweetCountRecent(`from:${twittername}`, {
        // start_time:  start,
        // end_time: end,
        granularity: 'day'
    });

    const now = moment();
    const lks = likes.data?.data?.map(d => moment(d.created_at))
                                 .map(d => ({date:d, age: (d.diff(now, 'days') * -1)}))
                                 .filter(d => d.age < 7);

    const tweetsCnt = counts.data?.map(c => {
        const m = moment(c.start);
        return {
            d: m,
            count: c.tweet_count,
            age: (m.diff(now, 'days') * -1)
        }
    })


    const result = [{d:0},{d:1},{d:2},{d:3},{d:4},{d:5},{d:6}]
    result.forEach((r:any, i:number) => {
        r.t_count = tweetsCnt.find(t => t.age === r.d)?.count
        r.l_count = lks.filter(l => l.age === r.d)?.length
    });



    // printJSON('LIKES: ', lks);
    // printJSON('COUNTS: ', tweetsCnt);
    // printJSON('RESULT: ', result);

    return result;
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

export { reply, send, getProfile, getNewMentions, getHashtags, getWeeklyCounts, getInterests, getActivity }
