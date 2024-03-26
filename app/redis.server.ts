import { createClient } from 'redis';
import invariant from 'tiny-invariant';

declare global {
  var __client__: ReturnType<typeof createClient>;
}

let client: ReturnType<typeof createClient>;

if (process.env.NODE_ENV === 'production') {
  client = getClient();
} else {
  if (!global.__client__) {
    global.__client__ = getClient();
  }
  client = global.__client__;
}

function getClient() {
  invariant(
    typeof process.env.REDIS_URL === 'string',
    'REDIS_URL env var not set'
  );

  const redisClient = createClient({
    url: process.env.REDIS_URL,
  }).on('error', (err) => console.log('Redis Client Error', err));

  redisClient
    .connect()
    .then(() => console.log('Redis Client Connected'))
    .catch((err) => console.log('Redis Client Connection Error', err));

  return redisClient;
}

export { client };
