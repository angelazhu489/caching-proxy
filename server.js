/*
caching-proxy https://roadmap.sh/projects/caching-server
- create cache
- if request url in cache
  - send `X-Cache: HIT` to header
  - send response from cache
- if request url not in cache
  - forward request url to http://dummyjson.com
  - cache response
  - send `X-Cache: MISS` to header
  - send response from http://dummyjson.com
*/
const http = require('http');
const NodeCache = require('node-cache');

const PORT = 3000;
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const server = http.createServer(async (req, res) => {
  console.log('REQUEST -', req.method, req.url);
  const url = req.url;
  if (url.includes('chrome.devtools') || url.includes('favicon')) return;
  const cacheKey = url;
  const cachedData = cache.get(cacheKey); // create cache
  if (!cachedData) {
    // forward request
    try {
      const apiRes = await fetch(`http://dummyjson.com${url}`)
      const data = await apiRes.json()
      res.setHeader('X-Cache', 'MISS');
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.write(JSON.stringify(data))
      res.end()
      cache.set(cacheKey, JSON.stringify(data)); // add to cache
    } catch (error) {
      console.log(error)
      res.writeHead(404)
      res.write(error)
      res.end()
    }
  } else {
    // send cached data
    res.setHeader('X-Cache', 'HIT');
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(cachedData)
    res.end()
  }
});

server.listen(3000, 'localhost', () => {
  console.log(`Listening on port ${PORT}`)
})