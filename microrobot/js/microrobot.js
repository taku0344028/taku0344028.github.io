/******************************************************************************
 * microrobot.js - Micro Robot Game
 *
 * Time-stamp: <Wed Mar 30 01:08:12 2016>
 *
 * (C) 2016 Takuya Okubo
 ******************************************************************************/

var MicroRobot = MicroRobot || {};

(function(ns){
    var VERSION = "0.0.2";

    var SCORE_PERFECT = 10000;

    /**

     +------------+
     |         S_H_NAVIGATION_PANEL
     +------------+---+
     |            |   |
     |         S_BOARD|
     |            |   |
     |            |   |
     |            |   |
     |            |   |
     +------------+---+
                     \- S_W_CONTROL_PANEL
     **/

    var S_BOARD = 960;
    var S_W_CONTROL_PANEL = 360;
    var S_H_NAVIGATION_PANEL = 80;

    var N_GAME = 5;
    var N_DICE = 6;
    var N_ROW  = N_DICE;
    var N_COL  = N_DICE;

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
    var C_PIP_WHITE	= "black";
    var C_PIP_PURPLE    = "purple";
    var C_PIP_CYAN      = "cyan";
    var C_PIP_ORANGE    = "orange";

    var C_BUTTON = "white";
    var C_BUTTON_TEXT = "black";

    var F_INACTIVE = 0;
    var F_START    = 1;
    var F_END      = 2;
    var F_ACTIVE   = 3;

    var color_list = [
	C_PIP_RED, C_PIP_BLUE, C_PIP_GREEN,
	C_PIP_YELLOW, C_PIP_WHITE, C_PIP_PINK,
	C_PIP_PURPLE, C_PIP_CYAN, C_PIP_ORANGE
    ];

    var solve = function(board) {
	var route = [];

	var prevCoord = [];
	var stack = [];
	for (var row = 0; row < board.row_max; row++) {
	    prevCoord[row] = [];
	    for (var col = 0; col < board.col_max; col++) {
		if (board.dEq(board.grid[row][col], board.startDice)) {
		    prevCoord[row][col] = {row: -1, col: -1, step: 0};
		    stack[stack.length] = {row: row, col: col};
		}
		else {
		    prevCoord[row][col] = {row: -1, col: -1, step: -1};
		}
		if (board.dEq(board.grid[row][col], board.endDice)) {
		    route[route.length] = {row: row, col: col};
		}
	    }
	}

	var step = 0;
	while (stack.length) {
	    var nextStack = [];
	    for (var i = 0; i < stack.length; i++) {
		var prevRow = stack[i].row;
		var prevCol = stack[i].col;
		var coordinates = board.getMovableCoordinates(prevRow, prevCol);
		for (var j = 0; j < coordinates.length; j++) {
		    row = coordinates[j].row;
		    col = coordinates[j].col;
		    if (prevCoord[row][col].step >= 0)
			continue;
		    prevCoord[row][col] = {row: prevRow, col: prevCol, step: step + 1};
		    nextStack[nextStack.length] = {row: row, col: col};
		}
	    }
	    step++;
	    stack = nextStack;
	}

	// impossible to reach the end dice.
	if (prevCoord[route[0].row][route[0].col].step < 0)
	    return [];
	while (prevCoord[route[route.length - 1].row][route[route.length - 1].col].step) {
	    route[route.length] = {
		row: prevCoord[route[route.length - 1].row][route[route.length - 1].col].row,
		col: prevCoord[route[route.length - 1].row][route[route.length - 1].col].col
	    };
	}

	return route;
    };

    // public class
    ns.Board = function(){
	this.n_dice = N_DICE;
	this.row_max = N_ROW;
	this.col_max = N_COL;
    };

    ns.Board.prototype = {
	initialize: function(setting) {
	    if (setting != undefined) {
	    	if (setting.n_dice != undefined) {
	    	    console.log("setting");
	    	    this.setNDice(setting.n_dice);
	    	}
	    }

	    var n_creation = 0;
	    while (1) {
		var diceList = this.getDicelist();
		this.grid = [];
		for (var row = 0; row < this.row_max; row++) {
		    this.grid[row] = [];
		    for (var col = 0; col < this.col_max; col++) {
			this.grid[row][col] = this.createDice(diceList[row * this.col_max + col]);
		    }
		}

		n_creation++;
		if (!this.validation())
		    continue;

		var startIdx = this.getRandomInt(0, diceList.length - 1);
		var endIdx = this.getRandomInt(0, diceList.length - 2);
		if (endIdx >= startIdx) endIdx++;
		this.startDice = this.createDice(diceList[startIdx]);
		this.endDice = this.createDice(diceList[endIdx]);
		this.activeDice = this.startDice;
	    
		this.total_step = 0;
		this.step = 0;
		this.score = 0;
		break;
	    }

	    return n_creation;
	},

	setNDice: function(n) {
	    this.n_dice = n;
	    this.row_max = n;
	    this.col_max = n;
	},

	searchDiceCoordinate: function(dice) {
	    for (var row = 0; row < this.row_max; row++) {
		for (var col = 0; col < this.col_max; col++) {
		    if (this.dEq(this.grid[row][col], dice))
			return {row: row, col: col};
		}
	    }
	    // not found
	    return {row: -1, col: -1};
	},

	resetCount: function() {
	    for (var row = 0; row < this.row_max; row++) {
		for (var col = 0; col < this.col_max; col++) {
		    this.grid[row][col].count = 0;
		}
	    }
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

	validation: function() {
	    var s = [];
	    var row, col;
	    for (row = 0; row < this.row_max; row++) {
		s[row] = [];
		for (col = 0; col < this.col_max; col++) {
		    s[row][col] = -1;
		}
	    }
	    s[0][0] = 0;
	    var step = 0;
	    var f_complete = true;
	    var f_update = true;
	    while (f_update) {
		f_complete = true;
		f_update = false;
		for (row = 0; row < this.row_max; row++) {
		    for (col = 0; col < this.col_max; col++) {
			if (s[row][col] < 0)
			    f_complete = false;
			if (s[row][col] != step)
			    continue;
			var coordinates = this.getMovableCoordinates(row, col);
			for (var i = 0; i < coordinates.length; i++) {
			    var c = coordinates[i];
			    if (s[c.row][c.col] < 0) {
				s[c.row][c.col] = step + 1;
				f_update = true;
			    }
			}
		    }
		}
		step++;
	    }

	    return f_complete;
	},

	getMovableCoordinates: function(row, col) {
	    var coordinates = [];

	    var dice = this.grid[row][col];
	    for (var r = 0; r < this.row_max; r++) {
		if (r == row)
		    continue;
		if (this.grid[r][col].n == dice.n || this.grid[r][col].color == dice.color)
		    coordinates[coordinates.length] = {row: r, col: col};
	    }

	    for (var c = 0; c < this.col_max; c++) {
		if (c == col)
		    continue;
		if (this.grid[row][c].n == dice.n || this.grid[row][c].color == dice.color)
		    coordinates[coordinates.length] = {row: row, col: c};
	    }
	    return coordinates;
	},

	setActiveDice: function(row, col) {
	    if (this.isMovableDice(row, col)) {
		this.activeDice = this.grid[row][col];
		this.grid[row][col].count++;
		this.step++;
		this.total_step++;
	    }
	},

	createDice: function(n) {
	    return {n: Math.floor(n / this.n_dice) + 1, color: color_list[n % this.n_dice], count: 0};
	},

	getDicelist: function() {
	    var diceList = [];
	    for (var i = 0; i < (this.row_max * this.col_max); i++) diceList[diceList.length] = i;
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
	this.tileSize = S_BOARD / N_DICE;
	this.controlPanelWidth = S_W_CONTROL_PANEL;
	this.controlPanelHeight = this.tileSize * N_ROW;
	this.navigationPanelWidth = this.tileSize * N_COL + this.controlPanelWidth;
	this.navigationPanelHeight = S_H_NAVIGATION_PANEL;

	this.cvs.width = this.tileSize * N_COL + this.controlPanelWidth;
	this.cvs.height = this.tileSize * N_ROW + this.navigationPanelHeight;
	
	this.cvs.style.width = Math.floor(this.cvs.width / 2) + "px";
	this.cvs.style.height = Math.floor(this.cvs.height / 2) + "px";
	this.control_button = [];
	this.control_panel = [];

	this.margin = this.controlPanelWidth / 10;
	this.x = S_BOARD + this.margin;
	this.y = S_H_NAVIGATION_PANEL + this.margin;
    };

    ns.BoardWriter.prototype = {
	resizeTile: function(n_dice) {
	    this.tileSize = S_BOARD / n_dice;
	},

	writeControlPanel: function(board) {
	    this.ctx.save();
	    this.ctx.fillStyle = "brown";
	    this.ctx.fillRect(0, 0, this.controlPanelWidth, this.controlPanelHeight);
			      
	    this.ctx.fillStyle = "black";
	    this.ctx.translate(this.margin, this.margin);

	    var panelHeight = S_BOARD / 10;
	    this.ctx.textBaseline = "middle";

	    for (var i = 0; i < this.control_panel.length; i++) {
		var p = this.control_panel[i];
		this.writePanel(p.text, p.func(board), p.w, p.h);
		this.ctx.translate(0, p.h + this.margin);
	    }

	    for (i = 0; i < this.control_button.length; i++) {
		var button = this.control_button[i];
		this.writeButton(button.text, button.w, button.h, button.status);
		this.ctx.translate(0, button.h + this.margin);
	    }

	    this.ctx.restore();
	},

	writeNavigationPanel: function() {
	    this.ctx.save();
	    this.ctx.fillRect(0, 0, this.navigationPanelWidth, this.navigationPanelHeight);
//	    var texts = ["GAME", "MODE", "ACHIEVEMENT"];
	    var texts = [];
	    for (var i = 0; i < texts.length; i++) {
		this.writeButton(texts[i], 360, this.navigationPanelHeight);
		this.ctx.translate(360, 0);
	    }
	    this.ctx.restore();
	},

	setControlPanel: function(text, func) {
	    var r = {
		text: text,
		func: func,
		w: this.controlPanelWidth * 4 / 5,
		h: S_BOARD / 10
	    };
	    this.y += r.h + this.margin;
	    this.control_panel[this.control_panel.length] = r;
	},

	setControlButton: function(text, func) {
	    var r = {
		text: text,
		x: this.x,
		y: this.y,
		w: this.controlPanelWidth * 4 / 5,
		h: S_BOARD / 10,
		func: func,
		status: F_INACTIVE
	    };
	    this.control_button[this.control_button.length] = r;
	    this.y += r.h + this.margin;
	},

	write: function(board) {
	    this.writeNavigationPanel();
	    this.ctx.save();
	    this.ctx.translate(0, this.navigationPanelHeight);
	    this.ctx.save();
	    for (var row = 0; row < board.row_max; row++) {
		this.ctx.save();
		for (var col = 0; col < board.col_max; col++) {
		    var dice = board.grid[row][col];
		    this.writeTile(dice, board.getDiceStatus(dice));
		    this.ctx.translate(this.tileSize, 0);
		}
		this.ctx.restore();
		this.ctx.translate(0, this.tileSize);
	    }
	    this.ctx.restore();
	    this.ctx.save();
	    this.ctx.translate(S_BOARD, 0);
	    this.writeControlPanel(board);
	    this.ctx.restore();
	    this.ctx.restore();
	},

	writeTile: function(dice, status) {
	    this.ctx.save();
	    this.ctx.fillStyle = C_BACKGROUND;
	    this.ctx.fillRect(0, 0, this.tileSize, this.tileSize);

	    if (dice.count > 0) {
		this.ctx.save();
		this.ctx.globalAlpha = 0.5;
		this.ctx.fillStyle = "orange";
		if (dice.count == 1)
		    this.ctx.fillStyle = "yellow";
		this.ctx.fillRect(0, 0, this.tileSize, this.tileSize);
		this.ctx.restore();
	    }

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
	    case 8:
		this.writeDicePip(size / 2 - pipSize / 2, size / 3 - pipSize / 2, pipSize, color);
		this.writeDicePip(size / 2 - pipSize / 2, size * 2 / 3 - pipSize / 2, pipSize, color);
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
	    case 9:
		this.writeDicePip(size / 2 - pipSize / 2, size / 8, pipSize, color);
		this.writeDicePip(size / 2 - pipSize / 2, size * 7 / 8 - pipSize, pipSize, color);
	    case 7:
		this.writeDicePip(size / 8, size / 2 - pipSize / 2, pipSize, color);
		this.writeDicePip(size * 7 / 8 - pipSize, size / 2 - pipSize / 2, pipSize, color);
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
	    if (color == C_PIP_WHITE) {
		grad.addColorStop(0, "silver");
		grad.addColorStop(0.7, color);
	    }
	    else {
		grad.addColorStop(0, "white");
		grad.addColorStop(0.3, color);
	    }
	    this.ctx.fillStyle = grad;
	    this.ctx.fillRect(0, 0, size, size);
	    this.ctx.restore();
	},

	writePanel: function(label, value, w, h) {
	    this.ctx.save();
	    this.ctx.font = h * 2 / 5 + "px 'Times New Roman'";
	    this.ctx.textAlign = "left";
	    this.ctx.fillText(label, 0, h / 4, w);

	    this.ctx.translate(0, h / 2);
	    this.ctx.save();
	    this.ctx.fillStyle = "grey";
	    this.ctx.fillRect(0, 0, w, h / 2);

	    var grad = this.ctx.createLinearGradient(0, 0, 0, h / 2);
	    grad.addColorStop(0,   "black");
	    grad.addColorStop(0.5, "#ccc");
	    grad.addColorStop(1.0, "black");
	    this.ctx.fillStyle = grad;

	    this.ctx.textAlign = "center";
	    this.ctx.font = h * 2 / 5 + "px 'Times New Roman'";
	    var digit = 10;
	    var n = value;
	    for (var i = 0; i < digit; i++) {
		var x = w * (digit - i - 1) / digit;
		var dw = w / (digit + 1);
		this.ctx.fillRect(x, 0, dw, h / 2);
		this.ctx.save();
		this.ctx.fillStyle = "white";
		this.ctx.fillText(Math.floor(n % 10), x + dw / 2, h / 4, dw);
		this.ctx.restore();
		n /= 10;
	    }
	    this.ctx.restore();

	    // writeGear(this.ctx, w / 2);
	    this.ctx.restore();
	},

	writeButton: function(text, w, h, status) {
	    this.ctx.save();
	    this.ctx.fillStyle = C_BUTTON;
	    this.ctx.shadowBlur = h / 5;
	    this.ctx.shadowColor = "black";
	    this.ctx.fillRect(0, 0, w, h);

	    if (status == F_ACTIVE) {
		this.ctx.globalAlpha = 0.4;
		this.ctx.fillStyle = "yellow";
		this.ctx.fillRect(0, 0, w, h);
	    }
	    this.ctx.restore();

	    this.ctx.fillStyle = "brown";
	    // this.ctx.drawImage(this.img, w/20, h/20, w*9/10, h*9/10);

	    this.ctx.fillRect(w/20, h/20, w*9/10, h*9/10);

	    this.ctx.save();
	    this.ctx.font = h / 2 + "px 'Times New Roman'";
	    this.ctx.textBaseline = "middle";
	    this.ctx.textAlign = "center";
	    this.ctx.fillStyle = C_BUTTON_TEXT;
	    this.ctx.fillText(text, w / 2, h / 2, w);
	    this.ctx.restore();
	}
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
	    
//	    this.writer.setControlPanel("ROUND", function(e){return e.round;});
	    this.writer.setControlPanel("STEP", function(e){return e.step;});
	    this.writer.setControlPanel("TOTAL STEP", function(e){return e.total_step;});
	    this.writer.setControlPanel("SCORE", function(e){return e.score;});

	    this.writer.setControlButton("RESTART", function(e){e.restart();});
	    this.writer.setControlButton("PASS", function(e){e.pass();});
	    this.writer.setControlButton("NEW GAME", function(e){e.newGame();});

	    this.navigation_button = [];

	    this.setEventListener();
	    this.board.initialize();
	    this.writer.write(this.board, this.control_button);

	    this.gameCount = 0;
	},

	setDifficulty: function() {
	    
	},

	restart: function() {
	    if (this.gameCount < N_GAME) {
		this.board.step = 0;
		this.board.activeDice = this.board.startDice;
		this.board.resetCount();
		this.writer.write(this.board);
	    }
	},

	pass: function() {
	    if (this.gameCount < N_GAME) {
		this.gameCount++;
		this.board.step = 0;
		this.setNextDice();
		this.board.activeDice = this.board.startDice;
		this.writer.write(this.board);
	    }
	},
	
	newGame: function() {
	    this.gameCount = 0;
	    this.board.initialize();
	    this.writer.write(this.board);
	},

	resetGame: function() {
	    this.board.initialize({n_dice: 6});
	    this.writer.resizeTile(6);
	    this.writer.write(this.board);
	},

	initializeTest: function() {
	    var board = new ns.Board();
	    var creation = [];
	    for (var i = 0; i < 1000; i++) {
		var n = board.initialize();
		if (creation[n] == undefined)
		    creation[n] = 0;
		creation[n]++;
	    }

	    for (var j = 0; j < creation.length; j++) {
		if (creation[j] == undefined) continue;
		console.log(j + " = " + creation[j]);
	    }
	},

	setNextDice: function() {
	    this.board.startDice = this.board.endDice;
	    var nextDiceId = this.board.getRandomInt(0, this.board.n_dice * this.board.n_dice - 2);
	    var nextDice = this.board.createDice(nextDiceId);
	    if (this.board.dEq(nextDice, this.board.endDice)) {
		nextDice = this.board.createDice(nextDiceId + 1);
	    }
	    this.board.endDice = nextDice;	
	    this.board.resetCount();
	},

	setEventListener: function() {
	    var writer = this.writer;
	    var board = this.board;
	    var self = this;

	    writer.cvs.onmousemove = function(e) {
		var x = e.offsetX * this.width / parseInt(this.style.width);
		var y = e.offsetY * this.height / parseInt(this.style.height);

		
		if (x < S_BOARD) return;
		for (var i = 0; i < writer.control_button.length; i++) {
		    var b = writer.control_button[i];
		    // console.log(x + ", " + y);
		    // console.log(b.x + ", " + b.y + ", " + b.w + ", " + b.h);
		    if (b.x < x && x < b.x + b.w && b.y < y && y < b.y + b.h) {
			writer.control_button[i].status = F_ACTIVE;
		    }
		    else {
			writer.control_button[i].status = F_INACTIVE;
		    }
		}
		// console.log("update");
		writer.write(board);
	    };

	    writer.cvs.onclick = function(e) {
		var x = e.offsetX * this.width / parseInt(this.style.width);
		var y = e.offsetY * this.height / parseInt(this.style.height);
		var row = Math.floor((y - writer.navigationPanelHeight) / writer.tileSize);
		var col = Math.floor(x / writer.tileSize);

		if (0 <= row && row < N_ROW && 0 <= col && col < N_COL) {
		    if (self.gameCount < N_GAME) {
			board.setActiveDice(row, col);
			if (board.check()) {
			    var route = solve(board);
			    // console.log("solve route: " + route.length);
			    var score = Math.floor(SCORE_PERFECT / (board.step / (route.length - 1)));
			    score = Math.floor(score / 100) * 100;
			    board.score += score;
			    self.gameCount++;
			    if (self.gameCount < N_GAME) {
				self.setNextDice();
			    }
			    board.step = 0;
			}
			writer.write(board);
		    }
		}
		//	    console.log("x = " + x + ", Y = " + y + ", row = " + row + ", col = " + col);
		else {
		    for (var i = 0; i < writer.control_button.length; i++) {
			var b = writer.control_button[i];
			if (b.x < x && x < b.x + b.w && b.y < y && y < b.y + b.h) {
			    b.func(self);
			}
		    }
		}
	    };
	}
    };

})(MicroRobot);

// This file ends here.
