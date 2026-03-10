# Simple Node.js Caching Proxy
- Forwards incoming requests to user provided origin server
- Caches responses recieved by the origin server
## Prerequisites
- Node.js
- npm
## Installation
1. Clone the repository
``` shell
git clone
```
2. Install node.js dependencies
``` shell
cd caching-proxy
npm install
```
## Running the application
### Starting the server
``` shell
node caching-proxy.js --port <number> --origin <url>
```
eg. `node caching-proxy.js --port 3000 --origin http://dummyjson.com`

### Clearing the cache
``` shell
---clear-cache
```