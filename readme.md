Create a client

```js

var makeClient = require('indaba-client');

client = makeClient({
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
var opp = client.get({
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

* `path`: required URL path (`/opportunities/`)
* `body`: payload object of post request
* `cast`: data or datum will be cast to this class (`client.Opportunity`)


## Roadmap:

* client.startSession() -- loads all requisite data for user: follows, votes, entries, submissions, etc.
* emit events -- maybe use the fancy array, etc.
