/**
 * (C) 2015 Takuya Okubo
 */
var g_font = "Impact";
var Button = function(arg){
    if(typeof arg === "undefined")
	arg = {};
    this.text = arg.text || "BUTTON";
    this.x = arg.x || 0;
    this.y = arg.y || 0;
    this.w = arg.w || 10;
    this.h = arg.h || 10;
    this.font = arg.font || g_font;
    this.fillStyle = arg.fillStyle || "white";
    this.strokeStyle = arg.strokeStyle || "black";
    this.clickAction = arg.clickAction || function(){return 1;};
};
Button.prototype = {
    click: function(){
	return this.clickAction();
    },
    inPoints: function(x, y){
	return this.x < x && x < this.x + this.w && this.y < y && y < this.y + this.h;
    },
    draw: function(ctx){
	var x = this.x, y = this.y, w = this.w, h = this.h, text = this.text;
        ctx.save();
        var fontSize = parseInt(h * 0.9);
        ctx.font = "" + fontSize + "px '" + this.font + "";
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 5;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var r = parseInt(h * 0.1);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.stroke();
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.strokeText(text, x + w / 2, y + h / 2);
        ctx.fillText(text, x + w / 2, y + h / 2);
        ctx.restore();
    }
};

var ImageButton = function(arg){
    Button.call(this, arg);
};
ImageButton.prototype = Object.create(Button.prototype, {
    constructor: {
	value: ImageButton
    },
    draw: {
	value: function(ctx){
	    return false;
	}
    }
});

var IconButton = function(arg){
    Button.call(this, arg);
    this.unit = arg.unit || new Hero({});
};
IconButton.prototype = Object.create(Button.prototype, {
    constructor: {
	value: IconButton
    },
    initialize: {
	value: function(){
	    this.unit.initialize();
	}
    },
    setMember: {
	value: function(unit){
	    unit.initialize();
	    this.unit = unit;
	}
    },
    draw: {
	value: function(ctx){
	    this.unit.drawIcon(ctx, this.x, this.y, this.w, this.h);
	}
    }
});

// This file ends here.
