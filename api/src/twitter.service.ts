import { Console } from 'console';
import moment from 'moment';
import { json } from 'stream/consumers';
import { HomeTimelineV1Paginator, SendTweetV2Params, TweetV2, Tweetv2SearchParams, TwitterApi, TwitterApiReadOnly } from 'twitter-api-v2';
import { weeklyUsage } from './data/weekly.cnt';
import { initClient, initOAuth1Client, initROClient } from './twitter.config'
import { normalizeHashtags, printJSON, rnd } from './utils';


async function getTweet(id: string) {

    const tclient = initROClient();
    const user = await tclient.v2.singleTweet(id, {
        "user.fields": ['name', 'username', 'description'],
        "tweet.fields": ['entities', 'attachments'],
        "media.fields": ['url']
    });

    return user.data;
}

async function getUserByName(name: string) {

    const tclient = initROClient();
    const user = await tclient.v2.userByUsername(name, { "user.fields": ['name', 'username', 'description'] });

    return user.data;
}

async function getUserById(id: string) {

    const tclient = initROClient();
    const user = await tclient.v2.user(id, { "user.fields": ['name', 'username', 'description'] });

    return user.data;
}

function normalizeDomains(ents: any[]) {
    if (!ents || ents.length < 1) return [];

    const result:any = {};
    ents.forEach( (e:any) => {
        result[e.domain_id] = {
            domain: e.domain,
            domain_id: e.domain_id,
            domain_description: e.domain_description,
            count: ( result[e.domain_id]?.count || 0) + 1}
        }
    );

    return Object.keys(result).map(k => ({...result[k]}))
                 .sort((a, b) => b.count - a.count);
}

function normalizeAnnotations(annts: any[]){
    if (!annts || annts.length < 1) return [];

    const result:any = {};
    annts.forEach( (e:any) => {
        result[e.text] = {
            ...e,
            count: ( result[e.text]?.count || 0) + 1}
        }
    );


    return Object.keys(result).map(k => ({...result[k]}))
                 .sort((a, b) => b.count - a.count);
}

function normalizeEntities(ents: any[]){
    if (!ents || ents.length < 1) return [];

    const result:any = {};
    ents.forEach( (e:any) => {
        result[e.id] = {
            ...e,
            count: ( result[e.id]?.count || 0) + 1}
        }
    );


    return Object.keys(result).map(k => ({...result[k]}))
                 .sort((a, b) => b.count - a.count);
}

function hashtags(result: TweetV2[]) {
    return result?.filter(d => d.entities?.hashtags?.length  > 0)
                  .flatMap(d => d.entities.hashtags.map(h => h.tag));
}

function annotations(result: TweetV2[]) {
    return result?.filter(d => d.entities?.annotations?.length  > 0)
                  .flatMap(d => d.entities.annotations.map(h => ({ type: h.type, text: h.normalized_text, confidence: h.probability})));
}

function entities(result: TweetV2[]) {
    return result?.flatMap(d => d.context_annotations)
                  .filter(ca => ca && ca?.entity)
                  .map(a => ({...a.entity, domain: a.domain?.name, domain_id: a.domain?.id, domain_description: a.domain?.description }));
}


async function search(query: string, options: Partial<Tweetv2SearchParams>) {
    const client = initClient();
    return await client.v2.search(query, options);
}


async function getMentionsCounts24h(tclient: TwitterApiReadOnly, username:string) {
    const start = moment().subtract(1, 'day');

    return await tclient.v2.tweetCountRecent(`@${username} -to:${username}`, {
        start_time:  start.toISOString(),
        // end_time: start.endOf('day').toISOString(),
        granularity: 'day'
    });
}

async function getTweetCounts24h(tclient: TwitterApiReadOnly, userid:string, replies?: boolean) {
    const start = moment().subtract(1, 'day');

    const q = replies === true? '(is:retweet OR is:reply OR is:quote)' : '';

    return await tclient.v2.tweetCountRecent(`(from:${userid}) ${q} `, {
        start_time:  start.toISOString(),
        // end_time: start.endOf('day').toISOString(),
        granularity: 'day'
    });
}

async function getLikesCounts24h(tclient: TwitterApiReadOnly, userid:string) {
    const likes = await tclient.v2.userLikedTweets(userid, {
        "tweet.fields": ['created_at']
    });

    const now = moment();
    return likes.data?.data?.map(d => moment(d.created_at))
                            .map(d => ({date:d, age: (d.diff(now, 'days') * -1)}))
                            .filter(d => d.age < 1);
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
    const likes = await getLikesCounts24h(tclient, user.data.id);

    console.log('### read user info: ###\n\n');
    // console.log('counts', mentions);

    // const likes = await tclient.v2.userLikedTweets(user.data.id);
    // console.log('likes', likes);

    return {
        profile_image_url: user.data.profile_image_url,
        followers_count: user.data.public_metrics.followers_count,
        following_count: user.data.public_metrics.following_count,
        listed_count: user.data.public_metrics.listed_count,
        tweet_count: tweetsCnt.meta.total_tweet_count - repliesCnt.meta.total_tweet_count,
        reply_count: repliesCnt.meta.total_tweet_count,
        mention_count: mentions.meta.total_tweet_count,
        likes_count: likes.length
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

    try{
        const user = await tclient.v2.userByUsername(twittername);


        const tweets =  await tclient.v2.userLikedTweets(user.data.id, { max_results: 100, "tweet.fields": ['entities'] });
        const hastags = await tclient.v2.search(`(from:${twittername} OR retweets_of:${twittername} OR @${twittername}) has:hashtags -is:retweet`, { max_results: 100, "tweet.fields": ['entities'] });



        const ht = hastags.data?.data?.filter(d => d.entities?.hashtags?.length  > 0)
                                    .flatMap(d => d.entities.hashtags.map(h => h.tag));

        const ht2 = tweets.data?.data?.filter(d => d.entities?.hashtags?.length  > 0)
                                    .flatMap(d => d.entities.hashtags.map(h => h.tag));


        const result = normalizeHashtags((ht || []).concat(ht2));

        console.log('hastags:', result);

        // printJSON('HASHTAGS', hastags)

        return result;
    } catch(e) {
        console.error('error occured', e);
    }
}

async function getActivity(twittername: string) : Promise<any> {

    const tclient = initROClient();
    const user = await tclient.v2.userByUsername(twittername);

    const likes = await tclient.v2.userLikedTweets(user.data.id, {
        "tweet.fields": ['created_at']
    });

    const answers = await tclient.v2.tweetCountRecent(`from:${twittername} (is:retweet OR is:reply OR is:quote)`, {
        // start_time:  start,
        // end_time: end,
        granularity: 'day'
    });

    const counts = await tclient.v2.tweetCountRecent(`from:${twittername} (-is:retweet -is:reply -is:quote)`, {
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

    const answersCnt = answers.data?.map(c => {
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
        r.l_count = lks.filter(l => l.age === r.d)?.length,
        r.a_count = answersCnt.find(t => t.age === r.d)?.count
    });



    // printJSON('LIKES: ', lks);
    // printJSON('COUNTS: ', tweetsCnt);
    // printJSON('RESULT: ', result);

    return result;
}

async function reply(text: string, tweetid: string, images?:Buffer[], dryRun?:boolean) {
    const tclient = initOAuth1Client();

    const params:Partial<SendTweetV2Params> = { media : {} };

    if (images && images.length > 0) {

        if (!dryRun) {
            params.media.media_ids = await Promise.all(
                images.map(i => tclient.v1.uploadMedia(i, { mimeType: 'image/png' }))
            );
        } else {
            console.log(`DRY RUN: upload media`);
        }
    }



    if (!dryRun) {
        const res = await tclient.v2.reply(text, tweetid, params);
        console.debug('send reply', JSON.stringify(res, null, 4));
    } else {
        console.log(`DRY RUN: send reply \n${text}`);
    }
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
        since_id: lastMentionId,
        "tweet.fields": ['in_reply_to_user_id', 'author_id', 'conversation_id', 'reply_settings', 'referenced_tweets', 'created_at' ],
        expansions: [ 'referenced_tweets.id', 'referenced_tweets.id.author_id']
    });

    const mentResult = mentions.data;

    if (mentResult.meta.result_count < 1) {
        console.log('NO RESULT!');

        return null;
    } else {
        console.log('\nmentions: ', JSON.stringify(mentResult.data, null, 4));

        return mentResult.data;
    }
}

async function analyseLink(tweetid: string) {
    const tclient = initClient();

    const tweet = await tclient.v2.singleTweet(tweetid, {
        "tweet.fields": ['entities', 'attachments'],
        "media.fields": ['url']
    });

    const urls = tweet.data?.entities?.urls;
    const url = urls && urls.length  > 0? urls[0] : null;
    if (!url) throw Error(`no url/link found in tweet: ${tweetid}`);


    const result = await this.search(
        `(has:links url:"${url.expanded_url}" has:hashtags)`,
        {
            "tweet.fields": ['entities', 'context_annotations', 'attachments'],
            max_results: 100
        }
    );

    return {
        url: url.display_url,
        url_expanded: url.expanded_url,
        hashtags : normalizeHashtags(this.hashtags(result.data?.data)),
        entities : normalizeEntities(this.entities(result.data?.data)),
        annotations : normalizeAnnotations(this.annotations(result.data?.data)),
        domains : normalizeDomains(this.entities(result.data?.data))
    }
}

export {
    reply,
    send,
    getProfile,
    getNewMentions,
    getHashtags,
    getWeeklyCounts,
    getInterests,
    getActivity,
    hashtags,
    search,
    annotations,
    entities,
    normalizeEntities,
    normalizeAnnotations,
    normalizeDomains,
    analyseLink,
    getUserByName,
    getUserById,
    getTweet
}
