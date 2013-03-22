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

Get Request:

* By specifying `cast` all records will be wrapped in Opportunity model

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
