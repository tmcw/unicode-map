var blockNames = require('./block-names.json');

function UnicodeMap(elem) {
    this.base = 256;
    this.scale = 5;
    elem.innerHTML = '';
    elem.style.position = 'relative';

    this.canvas = this.makeCanvas(elem);
    this.hoverCanvas = this.makeCanvas(elem);
    this.ctx = this.canvas.getContext('2d');
    this.hoverCtx = this.hoverCanvas.getContext('2d');
    this.hoverCanvas.addEventListener('click', this.click.bind(this));
    this.hoverCanvas.addEventListener('mousemove', this.mousemove.bind(this));
    this.hoverCanvas.addEventListener('mouseover', this.mouseover.bind(this));
    this.hoverCanvas.addEventListener('mouseout', this.mouseout.bind(this));

    this.hoverCanvas.style.webkitTransition = 'opacity 200ms ease-in-out';

    this.view = 'bmp'; // or block
    this.block = null; // or block
}

UnicodeMap.prototype.makeCanvas = function(elem) {
    var canvas = elem.appendChild(document.createElement('canvas'));
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.width = this.base * this.scale;
    canvas.height = this.base * this.scale;
    canvas.style.width = (this.base * this.scale / 2) + 'px';
    canvas.style.height = (this.base * this.scale / 2) + 'px';
    return canvas;
};

UnicodeMap.prototype.click = function(e) {
    if (this.view == 'block') {
        this.view = 'bmp';
        this.draw(this.data);
    } else if (this.view == 'bmp') {
        var blockX = Math.floor(e.offsetX / (this.scale * 8));
        var blockY = Math.floor(e.offsetY / (this.scale * 8));
        this.view = 'block';
        this.block = (blockX * 256) + (blockY * 256 * 16);
        this.draw(this.data);
    }
};

UnicodeMap.prototype.clearCanvas = function(e) {
    e.width = e.width;
};

UnicodeMap.prototype.mouseover = function(e) {
    this.hoverCanvas.style.opacity = 1;
};

UnicodeMap.prototype.mouseout = function(e) {
    this.hoverCanvas.style.opacity = 0;
};

UnicodeMap.prototype.mousemove = function(e) {
    this.clearCanvas(this.hoverCanvas);
    this.hoverCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.hoverCtx.fillRect(0, 0,
        this.base * this.scale,
        this.base * this.scale);
    var blockX = Math.floor(e.offsetX / (this.scale * 8));
    var blockY = Math.floor(e.offsetY / (this.scale * 8));
    this.hoverCtx.clearRect(
        blockX * 16 * this.scale,
        blockY * 16 * this.scale,
        16 * this.scale,
        16 * this.scale);
     this.hoverCtx.strokeStyle = 'red';
     this.hoverCtx.strokeRect(
        blockX * 16 * this.scale,
        blockY * 16 * this.scale,
        16 * this.scale,
        16 * this.scale);
     // draw the focus box
     var eventBlock = this.getEventBlock(e);
     this.hoverCtx.font = '20px monospace';
     this.hoverCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';

     this.hoverCtx.fillStyle = '#fff';
     var textX;
     if (blockX > 12) {
         textX = ((blockX) * 16 * this.scale) - 10;
         this.hoverCtx.textAlign = 'right';
     } else {
         textX = ((blockX + 1) * 16 * this.scale) + 10;
         this.hoverCtx.textAlign = 'left';
     }

     if (this.view === 'bmp') {
         this.hoverCtx.font = '25px monospace';
         this.hoverCtx.fillText(
            this.blockHex(eventBlock) + '⇢' +
            this.blockHex(eventBlock + 256),
            textX,
            (blockY * 16 * this.scale) + 30);
         this.hoverCtx.font = '20px monospace';
         var y = (blockY * 16 * this.scale) + 30 + 30;
         if (blockNames[eventBlock]) {
            blockNames[eventBlock].forEach(function(name) {
              this.hoverCtx.fillText(
                name,
                textX,
                y);
              y += 25;
            }.bind(this));
         }
     } else {
         var codePoint = this.getEventCodePoint(e);
         this.hoverCtx.fillText(
            'hexadecimal ' + this.blockHex(codePoint),
            textX,
            (blockY * 16 * this.scale) + 30);
         this.hoverCtx.fillText(
            'decimal ' + codePoint,
            textX,
            (blockY * 16 * this.scale) + 60);
         this.hoverCtx.fillText(
            String.fromCharCode(codePoint),
            textX,
            (blockY * 16 * this.scale) + 90);
     }
};

UnicodeMap.prototype.blockHex = function(number) {
    var hex = number.toString(16);
    while (hex.length < 4) hex = '0' + hex;
    return hex;
};

UnicodeMap.prototype.getEventBlock = function(e) {
    var blockX = Math.floor(e.offsetX / (this.scale * 8));
    var blockY = Math.floor(e.offsetY / (this.scale * 8));
    return (blockX * 256) + (blockY * 256 * 16);
};

UnicodeMap.prototype.getEventCodePoint = function(e) {
    var blockX = Math.floor(e.offsetX / (this.scale * 8));
    var blockY = Math.floor(e.offsetY / (this.scale * 8));
    return (blockX) + (blockY * 16) + this.block;
};

UnicodeMap.prototype.draw = function(data) {
    this.data = data;
    this.clearCanvas(this.canvas);
    var i, codePoint, value, xy;
    if (this.view === 'bmp') {
        for (i = 0; i < data.length; i++) {
            codePoint = data[i][0];
            value = data[i][1];
            xy = this.codePointToXY(codePoint);
            this.ctx.fillStyle = value;
            this.ctx.fillRect(
                xy[0] * this.scale,
                xy[1] * this.scale,
                this.scale, this.scale);
        }
    } else if (this.view === 'block') {
        for (i = 0; i < data.length; i++) {
            codePoint = data[i][0];
            value = data[i][1];
            if (codePoint >= this.block && codePoint <= this.block + 256) {
                xy = this.codePointToXYBlock(codePoint, this.blockStart);
                this.ctx.fillStyle = value;
                this.ctx.fillRect(
                    xy[0] * this.scale,
                    xy[1] * this.scale,
                    this.scale * 16, this.scale * 16);

                this.ctx.font = '30px monospace';
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(
                    String.fromCharCode(codePoint),
                    (xy[0] * this.scale) + 20,
                    (xy[1] * this.scale) + 40);
            }
        }
    }
};

// in 65536 items
// 256 blocks (16*16)
// each block holds 256 items (16*16)
UnicodeMap.prototype.codePointToXY = function(point) {
    var block = Math.floor(point / 256);
    var blockRow = Math.floor(block / 16);
    var blockColumn = block % 16;
    var blockStart = point % 256;
    var subBlockRow = Math.floor(blockStart / 16);
    var subBlockColumn = blockStart % 16;
    return [
        subBlockColumn + (blockColumn * 16),
        subBlockRow + (blockRow * 16)
    ];
};

// in 65536 items
// 256 blocks (16*16)
// each block holds 256 items (16*16)
UnicodeMap.prototype.codePointToXYBlock = function(point) {
    var blockColumn = (point - this.block) % 16;
    var blockRow = Math.floor((point - this.block) / 16);
    return [
        blockColumn * 16,
        blockRow * 16
    ];
};

module.exports = UnicodeMap;
