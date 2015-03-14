(function(){
    var Board = function(elm){
	this.elm = elm;
	var size = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
	this.resize(size, size);
    };
    Board.prototype = {
	resize: function(w, h){
	    this.elm.style.width  = w + "px";
	    this.elm.style.height = h + "px";
	},
	touchStart: function(event){
	    console.log(event.changedTouches[0].pageX + ", " + event.changedTouches[0].pageY);
	    event.preventDefault();
	}
    };
    
    window.onload = function(){
	var mnCvs = document.getElementById("mainBoard");
	var mnBrd = new Board(mnCvs);
	mnCvs.addEventListener("touchstart", mnBrd.touchStart, false);
    };
})();
