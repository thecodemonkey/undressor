import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';


function initROClient () {
    const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
    return twitterClient.readOnly;
}

function initClient () {
    const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
    return twitterClient.readWrite;
}

function initStream () {
    const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
    return twitterClient.v2.sampleStream();
}

function initOAuth1Client(){
    const twitterClient = new TwitterApi({
        appKey: process.env.APP_KEY,               // consumer key or api key
        appSecret: process.env.APP_SECRET,         // consumer secret or api secret
        accessToken: process.env.ACCESS_TOKEN,
        accessSecret: process.env.ACCESS_SECRET

    });

    return twitterClient.readWrite;
}

export { initOAuth1Client, initClient, initROClient, initStream }
