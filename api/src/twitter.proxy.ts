import { initROClient } from './twitter.config'


async function getProfile(twittername: string) {
    const tclient = initROClient();

    const user = await tclient.v2.userByUsername(twittername);


    console.log('### read user info: ###\n\n');
    console.log('user', user);

    return { status: 'ok', profile: user };
}

export { getProfile }
