import http from 'http';
import NodeCache from 'node-cache';

class CachingProxyServer {
  constructor(port, origin) {
    this.port = port;
    this.origin = origin;
    this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  }

  async startServer() {
    const server = http.createServer((req, res) => this.#handleRequest(req, res));
    server.listen(this.port, 'localhost', () => {
      console.log(`Listening on port ${this.port}.`)
      console.log(`Ready to forward requests to ${this.origin}.`)
    })
  }

  clearCache = async () => {
    this.cache.flushAll();
    console.log("Cache cleared.")
  }

  #handleRequest = async (req, res) => {
    console.log('REQUEST -', req.method, req.url);
    const url = req.url;
    if (url.includes('chrome.devtools') || url.includes('favicon')) return;
    const cacheKey = url;
    const cachedData = this.cache.get(cacheKey); // check cache
    if (!cachedData) {
      // send data from origin
      try {
        const apiRes = await fetch(`${this.origin}${url}`)
        const data = await apiRes.json()
        res.setHeader('X-Cache', 'MISS');
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(data))
        res.end()
        this.cache.set(cacheKey, JSON.stringify(data)); // add to cache
      } catch (error) {
        console.log(error)
        res.writeHead(404)
        res.write(error)
        res.end()
      }
    } else {
      // send data from cache
      res.setHeader('X-Cache', 'HIT');
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.write(cachedData)
      res.end()
    }
    console.log("HEADERS - ")
    console.log(res.getHeaders())
  }
}

export default CachingProxyServer