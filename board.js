(function(){
    var Board = function(elm){
	this.elm = elm;
	var size = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
	this.resize(size, size);
	this.isSp = getDevice() == "sp";
    };
    Board.prototype = {
	resize: function(w, h){
	    this.elm.setAttribute("width", w + "px");
	    this.elm.setAttribute("height", h + "px");
	    console.log("w = " + w + ", h = " + h);
	},
	touchStart: function(event){
	    event.preventDefault();
	    this.touched = true;
	},
	touchMove: function(event){
	    if(!this.touched) return;
	    var x = this.isSp ? event.changedTouches[0].pageX : event.pageX;
	    var y = this.isSp ? event.changedTouches[0].pageY : event.pageY;
	    var ctx = this.getContext("2d");
	    document.getElementById("debug").innerHTML = "x = " + x + ", y = " + y;
	    ctx.beginPath();
	    ctx.fillRect(x, y, 10, 10);
	},
	touchEnd: function(event){
	    this.touched = false;
	}
    };

    /* デバイスの種類を調べる */
    var getDevice = function(){
	var ua = navigator.userAgent;
	if(ua.indexOf("iPhone") > 0 || ua.indexOf("Android") > 0){
	    return "sp";
	}
	else{
	    return "other";
	}
    };

    window.onload = function(){
	var mnCvs = document.getElementById("mainBoard");
	var mnBrd = new Board(mnCvs);
	var dType = getDevice();
	var startEvent = dType == "sp" ? "touchstart" : "mousedown";
	var moveEvent = dType == "sp" ? "touchmove" : "mousemove";
	var endEvent = dType == "sp" ? "touchend" : "mouseup";
	mnCvs.addEventListener(startEvent, mnBrd.touchStart, false);
	mnCvs.addEventListener(moveEvent, mnBrd.touchMove, false);
	mnCvs.addEventListener(endEvent, mnBrd.touchEnd, false);
	document.getElementById("debug").innerHTML = "device = " + dType;
    };
})();
