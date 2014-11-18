var fs = require('fs');
var fonts = require('./fonts.json');

var select = ['Verdana Bold', 'Arial Regular', 'Comic Sans MS Regular', 'American Typewriter Regular', 'Andale Mono Regular', 'Courier New Regular'];

var slim = fonts.filter(function(f) {
  return select.indexOf(f.face) !== -1;
});

fs.writeFileSync('fonts-slim.json', JSON.stringify(slim));
