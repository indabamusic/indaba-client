# Indaba

Initialize `indaba` with ENV:

* `dorianEndpoint`: required
* `lydianEndpoint`: required

```js
indaba = require('indaba-client')({
  dorianEndpoint: 'http://beta.indavelopment.com',
  lydianEndpoint: process.env.INDABA_TEST_ENDPOINT,
});
```

`indaba` has our models:

```js
var opp = new indaba.Opportunity(opportunityJsonData);
```



### Get Request:

* `path`: **required** URL path
* `token`: optional access token
* `query`: optional query object
* `cast`: optional class to wrap result(s)

```js
indaba.get({
  path: '/opportunities',
  query: {
    limit: 10
  }
  cast: indaba.Opportunity
}, function(err, data) {
  var opp = data[0];
  console.log("opp phase: ", opp.getPhase());
})
```


### Post Request:

* `path`: **required** URL path
* `token`: **required** access token
* `body`: optional payload
* `cast`: optional class to wrap result(s)


```js
indaba.post({
  path: '/opportunities/xxx/enter',
  token: 'yyy'
}, function(err) {
  if (!err) {
    console.log("you are entered!");
  }
})
```


## Visitor

Stateful visitor session.  Instantiate with required token:

```js
var visitor = indaba.createVisitor(token);
visitor.whoami(function(err) {
  // visitor.currentUser is now set
});
```

see `lib/visitor.js` for API
