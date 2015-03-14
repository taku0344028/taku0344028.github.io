(function(){
  var Board = function(id){
    this.elm = document.getElementById(id);
    var size = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
    this.resize(size, size);
  };
  Board.prototype = {
    resize: function(w, h){
      this.elm.style.width = w + "px";
      this.elm.style.height = h + "px";
      console.log("width = " + w + ", height = " + h);
    }
  };
  
  window.onload = function(){
    var mnBrd = document.getElementById("mainBoard");
  };
})();
