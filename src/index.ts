import dotenv from 'dotenv';
import type { Express, Request, Response } from 'express';
import express from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
