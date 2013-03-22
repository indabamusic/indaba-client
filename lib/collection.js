module.exports = function() {
  var collection = {};

  collection.get = function(id) {
    return collection.table[id];
  };

  collection.add = function(item) {
    if (Array.isArray(item)) {
      return item.forEach(function(i) {
        collection.add(i);
      });
    }
    if (!item || !item.id) throw new Error("item.id is required");
    if (collection.table[item.id]) return;
    collection.length += 1;
    collection.list.push(item);
    collection.table[item.id] = item;
    if (item.slug) {
      collection.table[item.slug] = item;
    }
  };

  collection.remove = function(item) {
    if (Array.isArray(item)) {
      return item.forEach(function(i) {
        collection.remove(i);
      });
    }
    if (!item || !item.id) throw new Error("item.id is required");
    if (!collection.table[item.id]) return;
    collection.list = collection.list.filter(function(i) {
      return i.id === item.id;
    });
    collection.length -= 1;
    collection.table[item.id] = undefined;
    if (item.slug) {
      collection.table[item.slug] = undefined;
    }
  };

  collection.reset = function() {
    collection.list = [];
    collection.table = {};
    collection.length = 0;
  };

  collection.reset();
  return collection;
};
