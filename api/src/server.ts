import express from 'express'
import cors from 'cors'
import * as twitter from './twitter.proxy'

const app = express();
const port = process.env.PORT;

app.use(cors());




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