import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getPageAnalysis } from './page-analysis';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/page-analysis', async (req: Request, res: Response) => {
  const pageUrl = req.query.url;
  if (!pageUrl) res.send('no');
  const analysis = await getPageAnalysis(pageUrl as string);
  res.send(analysis);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
