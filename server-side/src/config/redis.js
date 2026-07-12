const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const REDIS_URL = process.env.REDIS_URL;

const attachRedisAdapter = async (io) => {
  if (!REDIS_URL) {
    console.log("Redis URL not configured. Socket.IO will run in single-instance mode.");
    return null;
  }

  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on("error", (err) => {
    console.error("Redis publisher error:", err.message);
  });

  subClient.on("error", (err) => {
    console.error("Redis subscriber error:", err.message);
  });

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));

  console.log("Socket.IO Redis adapter enabled.");
  return { pubClient, subClient };
};

module.exports = attachRedisAdapter;