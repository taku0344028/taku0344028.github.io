(function(){
    var Board = function(id){
	this.elm = document.getElementById(id);
	var size = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
	this.resize(size, size);
	this.setTouchEventListener();
    };
    Board.prototype = {
	resize: function(w, h){
	    this.elm.style.width  = w + "px";
	    this.elm.style.height = h + "px";
	},
	setTouchEventListener: function(){
	    this.elm.ontouchmove(function(event){
		event.preventDefault();
	    });
	}
    };
    
    window.onload = function(){
	var mnBrd = new Board("mainBoard");
    };
})();
