import CachingProxyServer from './server.js';
import process from 'process';
import readline from 'readline';

// caching-proxy --port <number> --origin <url>
// caching-proxy --clear-cache

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (process.argv.length === 6 && process.argv[2] === '--port' && process.argv[4] === '--origin') {
  console.log("Ang's Caching Proxy Server!")
  const PORT = process.argv[3];
  const ORIGIN = process.argv[5];
  const myServer = new CachingProxyServer(PORT, ORIGIN);
  myServer.startServer();

  rl.on('line', (line) => {
    switch (line.trim()) {
      case '--clear-cache':
        console.log('Clearing cache.');
        myServer.clearCache();
        break;
      default:
        console.log('Try `--clear-cache` to clear the cache.');
        break;
    }
  }).on('close', () => {
    console.log("Thanks for using Ang\'s server!");
    process.exit(0);
  });
} else {
  console.log("run `caching-proxy --port <number> --origin <url>`")
  rl.close();
}