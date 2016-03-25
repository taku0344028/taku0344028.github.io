/******************************************************************************
 * microrobot.js - Micro Robot Game
 *
 * Time-stamp: <Fri Mar 25 22:11:21 2016>
 *
 * (C) 2016 Takuya Okubo
 ******************************************************************************/

var MicroRobot = MicroRobot || {};

(function(ns){
    var N_ROW = 6;
    var N_COL = 6;

    var C_BACKGROUND = "#333";
    var C_BACKGROUND_START = "green";
    var C_BACKGROUND_END = "red";
    var C_BACKGROUND_ACTIVE = "white";
    var C_FRAME = "grey";
    
    var C_PIP_RED	= "red";
    var C_PIP_BLUE	= "blue";
    var C_PIP_GREEN	= "green";
    var C_PIP_YELLOW	= "yellow";
    var C_PIP_PINK	= "pink";
    var C_PIP_WHITE	= "white";

    var F_INACTIVE = 0;
    var F_START = 1;
    var F_END   = 2;
    var F_ACTIVE = 3;

    var color_list = [C_PIP_RED, C_PIP_BLUE, C_PIP_GREEN,
		      C_PIP_YELLOW, C_PIP_WHITE, C_PIP_PINK];

    var solve = function(board) {
	var route = [];
	return route;
    };

    // public class
    ns.Board = function(){};
    ns.Board.prototype.initialize = function() {
	var diceList = this.getDicelist();
	this.grid = [];
	for (var row = 0; row < N_ROW; row++) {
	    this.grid[row] = [];
	    for (var col = 0; col < N_COL; col++) {
		this.grid[row][col] = this.createDice(diceList[row * 6 + col]);
	    }
	}

	var startIdx = this.getRandomInt(0, diceList.length - 1);
	var endIdx = this.getRandomInt(0, diceList.length - 2);
	if (endIdx >= startIdx) endIdx++;
	this.startDice = this.createDice(diceList[startIdx]);
	this.endDice = this.createDice(diceList[endIdx]);
	this.activeDice = this.startDice;
    };

    ns.Board.prototype.setActiveDice = function(row, col) {
	this.activeDice = this.grid[row][col];
    };

    ns.Board.prototype.createDice = function(n) {
	return {n: Math.floor(n / 6) + 1, color: color_list[n % 6]};
    };

    ns.Board.prototype.getDicelist = function() {
	var diceList = [];
	for (var i = 0; i < 36; i++) diceList[diceList.length] = i;
	var n = diceList.length;
	while (n) {
	    var j = this.getRandomInt(0, n--);
	    var t = diceList[n];
	    diceList[n] = diceList[j];
	    diceList[j] = t;
	}
	return diceList;
    };

    ns.Board.prototype.getDiceStatus = function(dice) {
	if (dice.n == this.activeDice.n && dice.color == this.activeDice.color) {
	    return F_ACTIVE;
	}
	if (dice.n == this.startDice.n && dice.color == this.startDice.color) {
	    return F_START;
	}
	if (dice.n == this.endDice.n && dice.color == this.endDice.color) {
	    return F_END;
	}
	return F_INACTIVE;
    };

    ns.Board.prototype.getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
    };

    ns.BoardWriter = function(cvs) {
	this.cvs = cvs;
	this.ctx = cvs.getContext("2d");
	this.tileSize = 160;
	this.cvs.width = this.tileSize * N_COL;
	this.cvs.height = this.tileSize * N_ROW;
    };

    ns.BoardWriter.prototype.write = function(board) {
	this.ctx.save();
	for (var row = 0; row < N_ROW; row++) {
	    this.ctx.save();
	    for (var col = 0; col < N_COL; col++) {
		var dice = board.grid[row][col];
		this.writeTile(dice, board.getDiceStatus(dice));
		this.ctx.translate(this.tileSize, 0);
	    }
	    this.ctx.restore();
	    this.ctx.translate(0, this.tileSize);
	}
	this.ctx.restore();
    };

    ns.BoardWriter.prototype.writeTile = function(dice, status) {
	this.ctx.save();
	this.ctx.fillStyle = C_BACKGROUND;
	this.ctx.fillRect(0, 0, this.tileSize, this.tileSize);

	var margin = this.tileSize / 20;
	var markerSize = this.tileSize - margin * 2;
	this.ctx.save();
	this.ctx.translate(margin, margin);
	switch(status) {
	case F_START:
	    this.ctx.fillStyle = C_BACKGROUND_START;
	    this.ctx.fillRect(0, 0, markerSize, markerSize);
	    break;
	case F_END:
	    this.ctx.fillStyle = C_BACKGROUND_END;
	    this.ctx.fillRect(0, 0, markerSize, markerSize);
	    break;
	case F_INACTIVE:
	    break;
	case F_ACTIVE:
	    this.ctx.fillStyle = C_BACKGROUND_ACTIVE;
	    this.ctx.fillRect(0, 0, markerSize, markerSize);
	    break;
	}
	this.ctx.restore();

	this.ctx.fillStyle = C_FRAME;
	
	this.ctx.fillRect(0, this.tileSize * 2 / 5, this.tileSize, this.tileSize / 5);
	this.ctx.fillRect(this.tileSize * 2 / 5, 0, this.tileSize / 5, this.tileSize); 

	var frameSize = this.tileSize * 4 / 5;
	this.ctx.translate((this.tileSize - frameSize) / 2, (this.tileSize - frameSize) / 2);
	this.ctx.fillRect(0, 0, frameSize, frameSize);

	var diceSize = frameSize * 6 / 7;
	this.ctx.translate((frameSize - diceSize) / 2, (frameSize - diceSize) / 2);
	this.writeDice(dice.n, dice.color, diceSize);

	this.ctx.restore();
    };

    ns.BoardWriter.prototype.writeDice = function(n, color, size) {
	this.ctx.save();

	this.ctx.save();
	this.ctx.shadowColor = color;
	this.ctx.shadowBlur = size / 10;
	this.ctx.fillStyle = C_BACKGROUND;
	this.ctx.fillRect(0, 0, size, size);
	this.ctx.restore();

	var pipSize = size / 6;
	switch(n) {
	case 6:
	    this.writeDicePip(size / 8, size / 2 - pipSize / 2, pipSize, color);
	    this.writeDicePip(size * 7 / 8 - pipSize, size / 2 - pipSize / 2, pipSize, color);
	case 4:
	    this.writeDicePip(size * 7 / 8 - pipSize, size / 8, pipSize, color);
	    this.writeDicePip(size / 8, size * 7 / 8 - pipSize, pipSize, color);
	case 2:
	    this.writeDicePip(size / 8, size / 8, pipSize, color);
	    this.writeDicePip(size * 7 / 8 - pipSize, size * 7 / 8 - pipSize, pipSize, color);
	    break;
	case 5:
	    this.writeDicePip(size * 7 / 8 - pipSize, size / 8, pipSize, color);
	    this.writeDicePip(size / 8, size * 7 / 8 - pipSize, pipSize, color);
	case 3:
	    this.writeDicePip(size / 8, size / 8, pipSize, color);
	    this.writeDicePip(size * 7 / 8 - pipSize, size * 7 / 8 - pipSize, pipSize, color);
	case 1:
	    this.writeDicePip(size / 2 - pipSize / 2, size / 2 - pipSize / 2, pipSize, color);
	    break;
	};

	this.ctx.restore();
    };

    ns.BoardWriter.prototype.writeDicePip = function(x, y, size, color) {
	this.ctx.save();
	this.ctx.translate(x, y);
	var grad = this.ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size);
	grad.addColorStop(0, "white");
	grad.addColorStop(0.3, color);
	this.ctx.fillStyle = grad;
	this.ctx.fillRect(0, 0, size, size);
	this.ctx.restore();
    };

    ns.setEventListener = function(board, writer) {
	console.log("setEventListener");
	writer.cvs.onclick = function(e) {
	    var row = Math.floor(e.offsetY / parseInt(this.style.height) * 6);
	    var col = Math.floor(e.offsetX / parseInt(this.style.width) * 6);
	    board.setActiveDice(row, col);
	    writer.write(board);
	    console.log(e.offsetX + ", " + e.offsetY);
	};
    };
})(MicroRobot);

// This file ends here.
