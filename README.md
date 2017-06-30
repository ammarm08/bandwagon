# bandwagon
An Express-like server framework, mostly for shits, partly for giggles.

Just exploring ... don't actually use this

- All middleware and route functions must return a Promise
- All middleware and route functions are passed a Request and Response object.

- By default, URL is parsed into a req.url property that contains further data on the URL
- By default, body is parsed into moved into req.body

Sample usage:

```js
const bandwagon = require('index.js');
const app = bandwagon();
const PORT = 3000;

// sample middleware
function someMiddleWare (req, res) {
  return new Promise(resolve => {
    // .... do stuff with req
    console.log(req.url);
    resolve();
  });
}

// sample handler
function handleRoot (req, res) {
  return new Promise(resolve => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({foo: 'bar'}));
    resolve();
  });
}

// add custom middlewares ...
app.set(someMiddleWare);

// add routes
app.get('/', handleRoot);

app.listen(PORT, () => console.log(`Bandwagon listening on http://localhost:${PORT}`));
```
