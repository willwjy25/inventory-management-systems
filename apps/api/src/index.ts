import 'dotenv/config';

import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console -- intentional boot log
  console.log(`[api] listening on http://localhost:${env.PORT}`);
});
