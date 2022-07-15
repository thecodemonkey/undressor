import express from 'express'
import cors from 'cors'
import * as twitter from './twitter.service'
import NodeCache from 'node-cache' ;
const cache = new NodeCache({ stdTTL: 0} );

const app = express();
const port = process.env.PORT;

app.use(cors());


const cached = async (key:string, clbk: () => any) => {
  let item = cache.get(key);

  if (!item) {
    item = await clbk();
    cache.set(key, item);
  }

  return item;
}


app.get('/:tweetid/link', async (req, res) => {

  let result = cache.get(`link-${req.params.tweetid}`);

  if (!result) {
    result = await twitter.analyseLink(req.params.tweetid);
    cache.set(`link-${req.params.tweetid}`, result);
  }

  res.json( result);
});

app.get('/profile/:userid/basics', async (req, res) => {

  let profile = cache.get(`basic-${req.params.userid}`);

  if (!profile) {
    profile = await twitter.getProfile(req.params.userid);
    cache.set(`basic-${req.params.userid}`, profile);
  }


  res.json( profile);
});

app.get('/profile/:userid/interests', async (req, res) => {
  const profile = await twitter.getInterests(req.params.userid);
  res.json( profile);
});

app.get('/profile/:userid/hashtags', async (req, res) => {

  let hashtags = cache.get(`hashtags-${req.params.userid}`);

  if (!hashtags) {
    hashtags = await twitter.getHashtags(req.params.userid);
    cache.set(`hashtags-${req.params.userid}`, hashtags);
  }

  res.json( hashtags);
});

app.get('/profile/:userid/weekly', async (req, res) => {
  let counts = cache.get(`counts-${req.params.userid}`);

  if (!counts) {
    counts = await twitter.getWeeklyCounts(req.params.userid);
    cache.set(`counts-${req.params.userid}`, counts);
  }

  res.json( counts );
});


app.get('/:userid/activity', async (req, res) => {

  res.json(
    await cached(`activity-${req.params.userid}`,
      async () => {
        return await twitter.getActivity(req.params.userid);
    })
  );
});


app.get('/profile/:twittername', async (req, res) => {
  const profile = await twitter.getProfile(req.params.twittername);

  res.json( profile);
});



app.get('/alive', async (req, res) => {
  res.status(200).send();
});





app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});