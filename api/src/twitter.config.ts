import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';


function initROClient () {
    const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
    return twitterClient.readOnly;
}

function initStream () {
    const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
    return twitterClient.v2.sampleStream();
}

export { initROClient, initStream }
