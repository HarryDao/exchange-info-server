import 'dotenv/config';
import http from 'http';

import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import { PORT } from './configs';
import { initServices } from './services';
import { initSocket } from './socket';
import { router } from './routes';
import { saveToLocal } from './data';
import { initWatchList } from './watchList';

(async () => {
  const app = express();
  const server = http.createServer(app);
  initSocket(server);

  await initServices();
  if (process.env.ENABLE_SAVE_FILE_TO_LOCAL) {
    saveToLocal();
  }

  initWatchList();

  server.listen(PORT, () => {
    console.log(`Server for Exchange Info running on port ${PORT}`);
  });

  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(cors());

  app.use(router);
})();
