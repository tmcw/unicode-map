var ranges = require('./ranges.json');

var blocks = {};

ranges.forEach(function(r) {
  var start = parseInt(r.range.split(/–|-/)[0], 16);
  var end = parseInt(r.range.split(/–|-/)[1], 16);
  var startBlock = Math.floor(start / 256) * 256;
  var endBlock = Math.floor(end / 256) * 256;
  for (var i = startBlock; i <= endBlock; i += 256) {
    if (blocks[i] === undefined) blocks[i] = [];
    blocks[i].push(r.wikipedia);
  }
});

var fs = require('fs');

fs.writeFileSync('./block-names.json', JSON.stringify(blocks, null, 2));
