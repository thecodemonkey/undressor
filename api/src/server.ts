import express, { NextFunction } from 'express'
import cors from 'cors'
import * as twitter from './twitter.service'
import NodeCache from 'node-cache' ;
import { printJSON, decrypt } from './utils';
const cache = new NodeCache({ stdTTL: 0} );

const app = express();
const port = process.env.PORT;

app.use(cors());

process.on('unhandledRejection', (reason, promise) => {
  printJSON('UNHANDLED REJECTION: ', reason || reason)
})


const cached = async (key:string, clbk: () => any) => {
  let item = cache.get(key);

  if (!item) {
    item = await clbk();
    cache.set(key, item);
  }

  return item;
}

const callservice = async (req:any, res:any, key:string, clbk: (tname:string) => any) => {
  const twittername = decrypt(req.params.enctwittername);

  console.log(`tname - enc: ${req.params.enctwittername}| dec: ${twittername}`)

  res.json(
    await cached(`${key}-${twittername}`,
      async () => {
        return await clbk(twittername);
    })
  );

}

app.get('/user/:username', async (req, res) => {

  res.json(
    await cached(`user-${req.params.username}`,
      async () => {
        return await twitter.getUser(req.params.username);
    })
  );
});

app.get('/:enctweetid/link', async (req, res) => {
  const tweetid = decrypt(req.params.enctweetid);

  res.json(
    await cached(`link-${tweetid}`,
      async () => {
        return await twitter.analyseLink(tweetid);
    })
  );
});

app.get('/profile/:enctwittername/basics', async (req, res) => {
  await callservice(req, res, 'basic', async (tname) =>
    await twitter.getBasics(tname)
  );
});

app.get('/profile/:enctwittername/interests', async (req, res) => {
  await callservice(req, res, 'interests', async (tname) =>
    await twitter.getInterests(tname)
  );

});

app.get('/profile/:enctwittername/hashtags', async (req, res) => {
  await callservice(req, res, 'hashtags', async (tname) =>
    await twitter.getHashtags(tname)
  );
});

app.get('/profile/:enctwittername/weekly', async (req, res) => {
  await callservice(req, res, 'weekly', async (tname) =>
    await twitter.getWeeklyCounts(tname)
  );
});


app.get('/:enctwittername/activity', async (req, res) => {
  await callservice(req, res, 'activity', async (tname) =>
    await twitter.getActivity(tname)
  );
});

app.get('/profile/:enctwittername', async (req, res) => {
  await callservice(req, res, 'profile', async (tname) =>
    await twitter.getProfile(tname)
  );
});

app.get('/insights/:enctwittername', async (req, res) => {
  await callservice(req, res, 'insights', async (tname) =>
    await twitter.getInsights(tname)
  );
});


app.get('/alive', async (req, res) => {
  res.status(200).send('hello');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});