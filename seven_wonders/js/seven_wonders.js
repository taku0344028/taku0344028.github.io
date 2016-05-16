/******************************************************************************
 * seven_wonder.js -
 *
 * Time-stamp: <Wed Mar 30 22:01:03 2016>
 *
 * (C) 2015 Takuya Okubo
 ******************************************************************************/

var SevenWonders = SevenWonders || {};

(function(ns){
})(SevenWonders);

var loadwonders;
var loadcards;

(function(){
    window.onload = function(){
	var deck = [];
	
	for(var i = 0; i < cards.length; i++){
	    if (cards[i].age == 1)
		deck.push(cards[i]);
	}

	var cvs = document.getElementById("myCanvas");
	cvs.width = 1600;
	cvs.height = 1200;
	var ctx = cvs.getContext("2d");

	for(i = 0; i < deck.length; i++) {
	    drawCard(ctx, deck[i], 250 * Math.floor(i / 20), 50 * (i % 20), 245, 45);
	    console.log(deck[i]);
	}
    };

    var wonders;
    var cards;

    loadwonders = function(json){
	wonders = json;
    };

    loadcards = function(json){
	cards = json;
    };

    var drawCard = function(ctx, card, x, y, width, height){
	ctx.save();
	ctx.font = (height / 2) + "px 'Times New Roman'";
	ctx.textBaseline = "top";
	ctx.fillStyle = card.type;
	ctx.fillRect(x, y, width, height);
	ctx.fillStyle = "black";
	ctx.fillText(card.name, x, y, width);
	ctx.restore();
    };
})();

// This file ends here.
