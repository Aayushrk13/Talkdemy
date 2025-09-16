import { createClient,BasicClientSideCache } from "redis";
const cache = new BasicClientSideCache({
    ttl:600000,
    maxEntries:0,
    evictPolicy:"LRU",
    recordStats:true
})
const client = createClient({
    clientSideCache:cache,
    RESP:3
});
client.on("error", (err) => console.log("Redis client error", err));

client.connect();

export default client;