Create a client with options:

* `dorianEndpoint`: required
* `lydianEndpoint`: required
* `token`: optional access token

```js
client = require('indaba-client')({
  dorianEndpoint: 'http://beta.indavelopment.com',
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
  token: token
});
```

Client has our models:

```js
var opp = new client.Opportunity(opportunityJsonData);
```




## Get Request:

* `path`: required URL path (`/opportunities/`)
* `query`: object used to build query string
* `cast`: data or datum will be cast to this class (`client.Opportunity`)

```js
client.get({
  path: '/opportunities',
  query: {
    limit: 10
  }
  cast: client.Opportunity
}, function(err, data) {
  var opp = data[0];
  console.log("opp phase: ", opp.getPhase());
})
```


## Post Request:

* `path`: required URL path
* `body`: payload object of post request
* `cast`: data or datum will be cast to this class


```js
client.post({
  path: '/opportunities/xxx/enter'
}, function(err) {
  if (!err) {
    console.log("you are entered!");
  }
})
```
