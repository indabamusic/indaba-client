var assert = require('assert');
var makeCollection = require('../lib/collection');

var collection = makeCollection();

var item1 = {
  id: 'item1-id',
  slug: 'item1-slug',
  name: 'Item 1'
};

var item2 = {
  id: 'item2-id',
  slug: 'item2-slug',
  name: 'Item 2'
};

var item3 = {
  id: 'item3-id',
  slug: 'item3-slug',
  name: 'Item 3'
};

describe('collection', function() {
  it('starts as empty', function() {
    assert.equal(collection.length, 0);
  });
  it('add an item', function() {
    collection.add(item1);
    assert.equal(collection.length, 1);
    assert.equal(collection.get(item1.id), item1);
    assert.equal(collection.get(item1.slug), item1);
  });
  it('add another item', function() {
    collection.add(item2);
    assert.equal(collection.length, 2);
  });
  it('remove an item', function() {
    collection.remove(item1);
    assert.equal(collection.length, 1);
    assert.equal(collection.get(item1.id), undefined);
    assert.ok(collection.get(item2.id));
  });
  it('reset', function() {
    collection.reset();
    assert.equal(collection.length, 0);
    assert.equal(collection.get(item2.id), undefined);
  });

  it ('add array', function() {
    collection.reset();
    collection.add([item1, item2, item3]);
    assert.equal(collection.length, 3);
    assert.ok(collection.get(item1.id));
    assert.ok(collection.get(item2.id));
    assert.ok(collection.get(item3.id));
  });

  it ('remove array', function() {
    collection.remove([item2, item3]);
    assert.equal(collection.length, 1);
    assert.ok(collection.get(item1.id));
  });
});
