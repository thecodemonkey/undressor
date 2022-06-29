import { Console } from 'console';
import { TwitterApi } from 'twitter-api-v2';
import { initClient, initOAuth1Client, initROClient } from './twitter.config'


async function getProfile(twittername: string) {
    const tclient = initROClient();

    const user = await tclient.v2.userByUsername(twittername);


    console.log('### read user info: ###\n\n');
    console.log('user', user);

    return { status: 'ok', profile: user };
}


async function reply(text: string, tweetid: string) {
    const tclient = initOAuth1Client();

    const res = await tclient.v2.reply(text, tweetid);

    console.debug('send reply', JSON.stringify(res, null, 4));
}

async function send(text: string) {

    const tclient = initOAuth1Client();



    const res = await tclient.v2.tweet(text);


    console.debug('send tweet result', JSON.stringify(res, null, 4));
}

export { reply, send, getProfile }
