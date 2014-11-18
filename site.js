var all = require('./all.json');
var UnicodeMap = require('./');
var ss = require('simple-statistics');
var fonts = require('./fonts-slim.json');

var map = new UnicodeMap(document.getElementById('map'));

var data = [];

var scale = [
  '#21313E',
  '#324D60',
  '#436C83',
  '#538DA8',
  '#62AFCE',
  '#70D3F4'].reverse();

var fontSelect = document.getElementById('fonts');

for (var i = 0; i < fonts.length; i++) {
    var wrap = fontSelect.appendChild(document.createElement('div'));
    var radio = wrap.appendChild(document.createElement('input'));
    radio.type = 'radio';
    radio.value = fonts[i].face;
    radio.id = fonts[i].face;
    radio.name = 'font';
    radio.onchange = radioChange;
    var label = wrap.appendChild(document.createElement('label'));
    label.innerHTML = fonts[i].face;
    label.setAttribute('for', fonts[i].face);
    label.style.fontFamily = fonts[i].face.replace(/regular|bold/i, '');
}

function radioChange() {
    var name = this.value;
    var font = fonts.filter(function(f) {
        return f.face === name;
    })[0];
    var data = [];
    for (var i = 0; i < font.coverage.length; i++) {
        data.push([font.coverage[i], '#000']);
    }
    map.draw(data);
};

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
