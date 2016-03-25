/******************************************************************************
 * (C) 2015 Takuya Okubo
 ******************************************************************************/

(function(){
    var MainWindow = function(){};
    MainWindow.prototype = {
	init: function(id){
	    var cvs = document.getElementById(id);
	    if(typeof cvs === "undefined"){
		cvs = document.createElement("canvas");
		cvs.id = id;
	    }
	    cvs.width = 1600;
	    cvs.height = 900;
	    cvs.style.width = cvs.width / 2;
	    cvs.style.height = cvs.height / 2;
	    this.color = "green";
	    this.ctx = cvs.getContext("2d");
	    this.cvs = cvs;
	},
	draw: function(){
	    this.ctx.save();
	    this.ctx.fillStyle = this.color;
	    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
	    this.ctx.restore();
	},
	update: function(){
	    if(typeof this.delta === "undefined") this.delta = 3;
	    this.s = (this.s + this.delta) || 0;
	    if(this.s > 256){
		this.delta = -this.delta;
		this.s = 256;
	    }
	    else if(this.s < 0){
		this.delta = -this.delta;
		this.s = 0;
	    }
	    this.color = "rgb(" + this.s + "," + this.s + "," + this.s + ")";
	    this.draw();
	}
    };

    window.onload = function(){
	var mainWindow = new MainWindow;
	mainWindow.init("mainWindow");
	mainWindow.draw();
	var update = function(){
	    mainWindow.update();
	    window.setTimeout(function(){update();}, 1000 / 60);
	};
	update();
    };
})();
