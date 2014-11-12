var all = require('./all.json');
var UnicodeMap = require('./');
var ss = require('simple-statistics');

var map = new UnicodeMap(document.getElementById('map'));

var data = [];

var scale = [
  '#21313E',
  '#324D60',
  '#436C83',
  '#538DA8',
  '#62AFCE',
  '#70D3F4'].reverse();

var values = [];
for (var k in all) {
    data.push([+k, all[k]]);
    values.push(all[k]);
}

var quantiles = ss.quantile(values, [0, 0.2, 0.4, 0.6, 0.8, 1]);

for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < scale.length; j++) {
        if (data[i][1] <= quantiles[j]) data[i][1] = scale[j];
    }
}

map.draw(data);
