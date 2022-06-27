import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.get('/', (req, res) => {
  res.json({status: 'ok'});
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});