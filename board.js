(function(){
    var Robot = function(param){
	this.x = param.x || 0;
	this.y = param.y || 0;
	this.r = 20;
	this.style = param.style || "grey";
    };
    
    Robot.prototype = {
	draw: function(ctx){
	    ctx.save();
	    ctx.fillStyle = this.style;
	    ctx.beginPath();
	    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
	    ctx.fill();
	    ctx.restore();
	}
    };

    var Board = function(id){
	this.elm = document.getElementById(id);
	this.ctx = this.elm.getContext("2d");
	this.isSp = getDevice() == "sp";
	this.init();
    };

    Board.prototype = {
	init: function(){
	    this.Robots = new Array();
	    this.Robots.push(new Robot({x: 100, y: 100, style: "red"}));
	    this.Robots.push(new Robot({x: 100, y: 200, style: "blue"}));
	    this.Robots.push(new Robot({x: 200, y: 100, style: "green"}));
	    this.Robots.push(new Robot({x: 200, y: 200, style: "yellow"}));
	    this.resizeWindow();
	},

	resize: function(w, h){
	    this.width = w;
	    this.height = h;
	    this.elm.setAttribute("width", w + "px");
	    this.elm.setAttribute("height", h + "px");
	    this.update();
	    console.log("w = " + w + ", h = " + h);
	},
	
	resizeWindow: function(){
	    var size = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
	    this.resize(size, size);
	},

	getPageX: function(event){
	    return this.isSp ? event.changedTouches[0].pageX : event.pageX;
	},

	getPageY: function(event){
	    return this.isSp ? event.changedTouches[0].pageY : event.pageY;
	},

	direction: function(x, y){
	    if(!this.touched) return "";
	    var dx = x - this.touchedX;
	    var dy = y - this.touchedY;
	    var adx = Math.abs(dx);
	    var ady = Math.abs(dy);
	    if(adx < 10 && ady < 10) return "";
	    if(adx > ady){
		if(dx > 0) return "Right";
		return "Left";
	    }
	    else{
		if(dy > 0) return "Down";
		return "Up";
	    }
	},

	touchStart: function(event){
	    event.preventDefault();
	    this.touched = true;
	    this.touchedX = this.getPageX(event);
	    this.touchedY = this.getPageY(event);
	    this.activeRobot();
	    this.update();
	},

	touchMove: function(event){
	    if(!this.touched) return;
	    var x = this.getPageX(event);
	    var y = this.getPageY(event);
	    if(this.activeRobotIdx != undefined){
		this.Robots[this.activeRobotIdx].x = x;
		this.Robots[this.activeRobotIdx].y = y;
	    }
	    this.update();
	},

	touchEnd: function(event){
	    this.touched = false;
	    this.touchedX = -1;
	    this.touchedY = -1;
	    this.deactivateRobot();
	    this.update();
	},
	
	setEventListener: function(){
	    var startEvent = this.isSp ? "touchstart" : "mousedown";
	    var moveEvent = this.isSp ? "touchmove" : "mousemove";
	    var endEvent = this.isSp ? "touchend" : "mouseup";
	    var self = this;
	    this.elm.addEventListener(startEvent, function(e){self.touchStart(e)}, false);
	    this.elm.addEventListener(moveEvent, function(e){self.touchMove(e)}, false);
	    this.elm.addEventListener(endEvent, function(e){self.touchEnd(e)}, false);

	    window.addEventListener("resize", function(){self.resizeWindow()}, false);
	},

	activateRobot: function(){
	    var find = -1;
	    var x = this.touchedX;
	    var y = this.touchedY;
	    this.Robots.forEach(function(r, i){
		var dx = r.x - x;
		var dy = r.y - y;
		if(dx * dx + dy * dy <= r.r * r.r){
		    find = i;
		}
	    });
	    this.activeRobotIdx = find;
	},

	deactivateRobot: function(){
	    this.activeRobotIdx = undefined;
	},

	update: function(){
	    this.draw();
	},

	draw: function(){
	    var ctx = this.ctx;
	    ctx.clearRect(0, 0, this.width, this.height);
	    this.Robots.forEach(function(v, i, arr){v.draw(ctx)});
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
	var mnBrd = new Board("mainBoard");
	mnBrd.setEventListener();
    };
})();
