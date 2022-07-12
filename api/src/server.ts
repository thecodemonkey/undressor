import express from 'express'
import cors from 'cors'
import * as twitter from './twitter.service'
import NodeCache from 'node-cache' ;
const cache = new NodeCache({ stdTTL: 0} );

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get('/profile/:userid/basics', async (req, res) => {

  let profile = cache.get(`basic-${req.params.userid}`);

  if (!profile) {
    profile = await twitter.getProfile(req.params.userid);
    cache.set(`basic-${req.params.userid}`, profile);
  }


  res.json( profile);
});

app.get('/profile/:userid/interests', async (req, res) => {
  const profile = await twitter.getProfile(req.params.userid);

  res.json( profile);
});

app.get('/profile/:userid/hashtags', async (req, res) => {

  let hashtags = cache.get(`hashtags-${req.params.userid}`);

  if (!hashtags) {
    hashtags = await twitter.getHashtags(req.params.userid);
    cache.set(`hashtags-${req.params.userid}`, hashtags);
    console.log('update cache...');
  }

  res.json( hashtags);
});

app.get('/profile/:userid/weekly', async (req, res) => {
  const profile = await twitter.getProfile(req.params.userid);

  res.json( profile);
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