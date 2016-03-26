/******************************************************************************
 * microrobot.js - Micro Robot Game
 *
 * Time-stamp: <Sat Mar 26 11:44:14 2016>
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

    var C_BUTTON = "white";
    var C_BUTTON_TEXT = "black";

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
    ns.Board.prototype = {
	initialize: function() {
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
	    
	    this.step = 0;
	    this.score = 0;
	},

	searchDiceCoordinate: function(dice) {
	    for (var row = 0; row < N_ROW; row++) {
		for (var col = 0; col < N_COL; col++) {
		    if (this.dEq(this.grid[row][col], dice))
			return {row: row, col: col};
		}
	    }
	    // not found
	    return {row: -1, col: -1};
	},

	isMovableDice: function(row, col) {
	    var dice = this.grid[row][col];
	    var coordinate = this.searchDiceCoordinate(this.activeDice);

	    if (coordinate.row == row && coordinate.col == col)
		return false;
	    if (coordinate.row != row && coordinate.col != col)
		return false;

	    return this.activeDice.n == dice.n || this.activeDice.color == dice.color;
	},

	setActiveDice: function(row, col) {
	    if (this.isMovableDice(row, col)) {
		this.activeDice = this.grid[row][col];
		this.step++;
	    }
	},

	createDice: function(n) {
	    return {n: Math.floor(n / 6) + 1, color: color_list[n % 6]};
	},

	getDicelist: function() {
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
	},

	getDiceStatus: function(dice) {
	    if (this.dEq(this.activeDice, dice)) {
		return F_ACTIVE;
	    }
	    if (this.dEq(this.startDice, dice)) {
		return F_START;
	    }
	    if (this.dEq(this.endDice, dice)) {
		return F_END;
	    }
	    return F_INACTIVE;
	},

	getRandomInt: function(min, max) {
	    return Math.floor(Math.random() * (max - min) + min);
	},

	check: function() {
	    return this.dEq(this.activeDice, this.endDice);
	},

	dEq: function(rightD, leftD) {
	    return rightD.n == leftD.n && rightD.color == leftD.color;
	}
    };

    ns.BoardWriter = function(cvs) {
	this.cvs = cvs;
	this.ctx = cvs.getContext("2d");
	this.tileSize = 160;
	this.controlPanelWidth = 360;
	this.cvs.width = this.tileSize * N_COL + this.controlPanelWidth;
	this.cvs.height = this.tileSize * N_ROW;
	this.controlPanelHeight = this.cvs.height;
	this.cvs.style.width = Math.floor(this.cvs.width / 2) + "px";
	this.cvs.style.height = Math.floor(this.cvs.height / 2) + "px";
    };

    ns.BoardWriter.prototype = {
	writeControlPanel: function(board) {
	    this.ctx.save();
	    this.ctx.fillStyle = "brown";
	    this.ctx.fillRect(0, 0, this.controlPanelWidth, this.controlPanelHeight);
	    
	    var margin = this.controlPanelWidth / 10;
	    this.ctx.fillStyle = "black";
	    this.ctx.font = this.tileSize / 3 + "px 'Times New Roman'";
	    this.ctx.translate(margin, margin);

	    var panelHeight = this.tileSize / 2;
	    this.ctx.textBaseline = "middle";

	    this.writePanel("STEP", board.step, this.controlPanelWidth - margin * 2, panelHeight);
	    this.ctx.translate(0, panelHeight + margin);
	    this.writePanel("SCORE", board.score, this.controlPanelWidth - margin * 2, panelHeight);
	    this.ctx.translate(0, panelHeight + margin);

	    var texts = ["RESET", "RESTART", "GIVE UP"];
	    for (var i = 0; i < texts.length; i++) {
		this.writeButton(texts[i], this.controlPanelWidth - margin * 2, panelHeight);
		this.ctx.translate(0, panelHeight + margin);
	    }

	    if (board.check()) {
		this.ctx.translate(0, panelHeight + margin);
		this.ctx.fillText("GOAL!!", 0, 0, this.controlPanelWidth - margin);
	    }

	    this.ctx.restore();
	},

	write: function(board) {
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
	    this.ctx.save();
	    this.ctx.translate(this.tileSize * N_COL, 0);
	    this.writeControlPanel(board);
	    this.ctx.restore();
	},

	writeTile: function(dice, status) {
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
	},

	writeDice: function(n, color, size) {
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
	},

	writeDicePip: function(x, y, size, color) {
	    this.ctx.save();
	    this.ctx.translate(x, y);
	    var grad = this.ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size);
	    grad.addColorStop(0, "white");
	    grad.addColorStop(0.3, color);
	    this.ctx.fillStyle = grad;
	    this.ctx.fillRect(0, 0, size, size);
	    this.ctx.restore();
	},

	writePanel: function(label, value, w, h) {
	    this.ctx.save();
	    this.ctx.textAlign = "left";
	    this.ctx.fillText(label, 0, h / 2, w);
	    this.ctx.textAlign = "right";
	    this.ctx.fillText(value, w, h / 2, w);

	    // writeGear(this.ctx, w / 2);
	    this.ctx.restore();
	},

	writeButton: function(text, w, h) {
	    this.ctx.save();
	    this.ctx.fillStyle = C_BUTTON;
	    this.ctx.shadowBlur = h / 5;
	    this.ctx.shadowColor = "black";
	    this.ctx.fillRect(0, 0, w, h);
	    this.ctx.restore();

	    this.ctx.fillStyle = "brown";
	    this.ctx.fillRect(w/20, h/20, w*9/10, h*9/10);

	    this.ctx.save();
	    this.ctx.textBaseline = "middle";
	    this.ctx.textAlign = "center";
	    this.ctx.fillStyle = C_BUTTON_TEXT;
	    this.ctx.fillText(text, w / 2, h / 2, w);
	    this.ctx.restore();
	}
    };

    ns.setEventListener = function(board, writer) {
	writer.cvs.onmousemove = function(e) {
	    var x = e.offsetX * this.width / parseInt(this.style.width);
	    var y = e.offsetY * this.height / parseInt(this.style.height);
	    if (x < writer.tileSize * N_COL) return;
	};

	writer.cvs.onclick = function(e) {
	    var x = e.offsetX * this.width / parseInt(this.style.width);
	    var y = e.offsetY * this.height / parseInt(this.style.height);
	    var row = Math.floor(y / writer.tileSize);
	    var col = Math.floor(x / writer.tileSize);
	    if (row < N_ROW && col < N_COL) {
		board.setActiveDice(row, col);
		if (board.check()) {
		    board.score += 200;
		}
		writer.write(board);
	    }
	    console.log("x = " + x + ", Y = " + y + ", row = " + row + ", col = " + col);
	};
    };

    var writeGear = function(ctx, size) {
	ctx.arc(0, 0, size, 0, Math.PI * 2, true);
	ctx.fill();
    };

    ns.GameManager = function() {};
    ns.GameManager.prototype = {
	initialize: function(cvs) {
	    this.board = new ns.Board();
	    this.writer = new ns.BoardWriter(cvs);
	    ns.setEventListener(this.board, this.writer);
	    this.board.initialize();
	    this.writer.write(this.board);
	}
    };

})(MicroRobot);

// This file ends here.
