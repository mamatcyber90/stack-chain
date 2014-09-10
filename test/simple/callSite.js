
var test = require("tap").test;
var chain = require('../../stack-chain.js');
var produce = require('../produce.js');

Error.stackTraceLimit = Infinity;

test("stack extend part", function (t) {
  var modify = function (text) {
    return function (error, frames) {
      if (error.test) {
        frames.push(text);
      }

      return frames;
    };
  };

  t.test("no extend modifier attached", function (t) {
    var error = new Error();
        error.test = error;

    var original = error.callSite.original.length;
    var mutated = error.callSite.mutated.length;
    t.strictEqual(mutated, original);

    t.end();
  });

  t.test("attach modifier", function (t) {
    var error = new Error();
        error.test = error;

    var wonderLand = modify("wonder land");

    chain.extend.attach(wonderLand);

    var original = error.callSite.original.length;
    var mutated = error.callSite.mutated.length;
    t.strictEqual(mutated, original + 1);

    chain.extend.deattach(wonderLand);

    t.end();
  });

  t.test("setting callSite", function (t) {
    var error = new Error();
        error.test = error;
        error.correct = true;

    error.callSite = "custom";
    t.strictEqual(error.callSite, "custom");
    error.stack;
    t.strictEqual(error.callSite, "custom");

    t.end();
  });

  t.test("callSite method", function (t) {
    var method = chain.callSite();
    var propery = (new Error()).callSite.original;
    t.strictEqual(method.length, propery.length);

    // The other stuff still works
    t.equal(produce.real(3), produce.fake([
      'Error: trace',
      '    at {where}:18:17',
      '    at deepStack ({where}:5:5)',
      '    at deepStack ({where}:7:5)'
    ]));

    t.end();
  });

  t.end();
});
