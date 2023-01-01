
import bolt from '@slack/bolt';
const { App } = bolt;
import config from 'config';
import { mountRoutes } from './routes.js';
import dbConnection from './db/database_service.js';

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});


mountRoutes(app)
app.start(config.get('app.port'));
console.log('⚡️ Bolt app is running!');
