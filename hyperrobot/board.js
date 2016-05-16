/******************************************************************************
 * board.js
 *
 * Time-stamp: <Sun Jul 26 22:05:02 2015> 
 *
 * (C) 2015 Takuya Okubo.
 ******************************************************************************/

// Random generator
var Random = function(){
    this.a = 22695477;
    this.b = 1;
    this.m = 32767;
};
Random.prototype = {
    setSeed: function(seed){
	this.seed = seed;
	this.x = seed;
    },
    getRand: function(){
	return Math.floor(Math.random() * 100);
	// var x = (this.a * this.x + this.b) % this.m;
	// this.x = x;
	// return x;
    }
};

var E_TOP    = 1 << 0;
var E_RIGHT  = 1 << 1;
var E_BOTTOM = 1 << 2;
var E_LEFT   = 1 << 3;
var color = [
    "",
    "red", "green", "blue", "yellow",
    "green", "blue", "yellow", "red",
    "blue", "yellow", "red", "green",
    "yellow", "red", "green", "blue"
];

var shape = [
];

// Hyper Robot generator
var HyperRobot = function(){
    this.tile = new Array;
    for(var row = 0; row < 16; row++){
	this.tile[row] = new Array;
    }
    this.seed = 1;
    this.rand = new Random();
};
HyperRobot.prototype = {
    setSeed: function(n){
	this.seed = n;
    },
    initBoard: function(){
	this.rand.setSeed(this.seed);
	for(var row = 0; row < 16; row++)
	    for(var col = 0; col < 16; col++)
		this.tile[row][col] = {wall: 0, target: 0};
	return this;
    },
    generateBoard: function(){
	this.initBoard()
	    .setOuterWallDependsSeed()
	    .setCenterWall()
	    .adjustWall()
	    .setTargetTiles()
	    .setOuterWall()
	    .adjustWall()
	    .setGoalTarget();
    },
    setGoalTarget: function(){
	var r = (this.rand.getRand() % 16) + 1;
	this.goalTarget = {target: r, wall: 0};
    },
    setTargetTiles: function(){
	var wallList;
	for(var i = 1; i <= 16; i++){
	    var row, col;
	    while(1){
		row = this.rand.getRand() % 8;
		col = this.rand.getRand() % 8;
		row += i < 9 ? 0 : 8;
		col += i < 5 ? 0 : i < 9 ? 8 : i < 13 ? 0 : 8;
		if(this.lineIsEmpty(row, col) && this.aroundIsEmpty(row, col))
		    break;
	    }
	    if(i % 4 == 1)
		wallList = [0, 1, 2, 3];
	    var w = wallList.splice(this.rand.getRand() % wallList.length, 1)[0];
	    this.tile[row][col].target = i;
	    this.tile[row][col].wall = 1 << (w % 4) | 1 << ((w + 1) % 4);
	}

	// set special target tile
	while(1){
	    row = this.rand.getRand() % 16;
	    col = this.rand.getRand() % 16;
	    if(this.lineIsEmpty(row, col) && this.aroundIsEmpty(row, col)){
		w = this.rand.getRand() % 4;
		this.tile[row][col].target = 99;
		this.tile[row][col].wall = 1 << w | 1 << ((w + 1) % 4);
		break;
	    }
	}
	// var i = 1;
	// var wallList;
	// while(i <= 16){
	//     var r = this.rand.getRand();
	//     var row = this.rand.getRand() % 8;
	//     var col = this.rand.getRand() % 8;
	//     row += i < 9 ? 0 : 8;
	//     col += i < 5 ? 0 : i < 9 ? 8 : i < 13 ? 0 : 8;
	//     if(this.lineIsEmpty(row, col) && this.aroundIsEmpty(row, col)){
	// 	if(i % 4 == 1)
	// 	    wallList = [0, 1, 2, 3];
	// 	var w = wallList.splice(r % wallList.length)[0];
	// 	console.log(w);
	// 	this.tile[row][col].target = i;
	// 	this.tile[row][col].wall = 1 << (w % 4) | 1 << ((w + 1) % 4);
	// 	i++;
	//     }
	// }
	return this;
    },
    lineIsEmpty: function(row, col){
	var rb = row < 8 ? 0 : 8;
	var cb = col < 8 ? 0 : 8;
	for(var r = rb; r < rb + 8; r++){
	    if(this.tile[r][col].target)
		return 0;
	}
	for(var c = cb; c < cb + 8; c++){
	    if(this.tile[row][c].target)
		return 0;
	}
	return 1;
    },
    aroundIsEmpty: function(row, col){
	for(var r = row - 1; r <= row + 1; r++){
	    if(r < 0 || 15 < r)
		return 0;
	    for(var c = col - 1; c <= col + 1; c++){
		if(c < 0 || 15 < c)
		    return 0;
		if(this.tile[r][c].wall != 0)
		    return 0;
		if(this.tile[r][c].target)
		    return 0;
	    }
	}
	return 1;
    },
    setOuterWall: function(){
	for(var row = 0; row < 16; row++){
	    for(var col = 0; col < 16; col++){
		var wall = 0;
		if(row == 0) wall |= E_TOP;
		else if(row == 15) wall |= E_BOTTOM;
		if(col == 0) wall |= E_LEFT;
		else if(col == 15) wall |= E_RIGHT;
		this.tile[row][col].wall |= wall;
	    }
	}

	return this;
    },
    setCenterWall: function(){
	this.tile[7][7].wall = E_TOP | E_LEFT;
	this.tile[7][8].wall = E_TOP | E_RIGHT;
	this.tile[8][7].wall = E_BOTTOM | E_LEFT;
	this.tile[8][8].wall = E_BOTTOM | E_RIGHT;

	return this;
    },
    setOuterWallDependsSeed: function(){
	for(var area = 0; area < 8; area++){
	    var r = this.rand.getRand();
	    var wallState = area < 4 ? E_RIGHT : E_BOTTOM;
	    var row = area < 2 ? 0 : area < 4 ? 15 : r % 6 + 1 + 7 * (area % 2);
	    var col = area > 5 ? 15 : area > 3 ? 0 : r % 6 + 1 + 7 * (area % 2);
	    if(this.tile[row][col].wall == undefined)
		this.tile[row][col].wall |= wallState;
	    else
		this.tile[row][col].wall = wallState;
	}

	return this;
    },
    adjustWall: function(){
	for(var row = 0; row < 16; row++){
	    for(var col = 0; col < 16; col++){
		if(row > 0)
		    if(this.tile[row - 1][col].wall & E_BOTTOM)
			this.tile[row][col].wall |= E_TOP;
		if(row < 15)
		    if(this.tile[row + 1][col].wall & E_TOP)
			this.tile[row][col].wall |= E_BOTTOM;
		if(col > 0)
		    if(this.tile[row][col - 1].wall & E_RIGHT)
			this.tile[row][col].wall |= E_LEFT;
		if(col < 15)
		    if(this.tile[row][col + 1].wall & E_LEFT)
			this.tile[row][col].wall |= E_RIGHT;
	    }
	}
	return this;
    }
};

var GameManager = function(){
    this.clickable = true;
    this.mainBoardWidth = 1600;
    this.mainBoardHeight = 1200;
};

GameManager.prototype = {
    resize: function(){},
    run: function(){
	this.mainBoard = document.getElementById("mainBoard");
	this.mainBoard.width = this.mainBoardWidth;
	this.mainBoard.height = this.mainBoardHeight;
	this.mainBoard.style.width = this.mainBoardWidth / 2 + "px";
	this.mainBoard.style.height = this.mainBoardHeight / 2 + "px";
	this.hyperRobot = new HyperRobot;
	this.hyperRobot.generateBoard();
	var ctx = this.mainBoard.getContext("2d");
	var bw = new BoardWriter();
	bw.draw(ctx, this.hyperRobot, this.mainBoardWidth, this.mainBoardHeight);

	var self = this;
	this.mainBoard.onclick = function(){
	    if(self.clickable){
		self.clickable = false;
		self.hyperRobot.setSeed(self.hyperRobot.seed + 1);
		self.hyperRobot.generateBoard();
		if(bw.draw(ctx, self.hyperRobot, self.mainBoardWidth, self.mainBoardHeight))
		    self.clickable = true;
	    }
	};
    }
};

var BoardWriter = function(){
    this.tileCount = 0;
};
BoardWriter.prototype = {
    clear: function(ctx, x, y, w, h){
	ctx.clearRect(x, y, w, h);
    },
    draw: function(ctx, hyperRobot, w, h){
	return this.write(ctx, hyperRobot, w, h);
    },
    write: function(ctx, hyperRobot, w, h){
	var boardSize = w < h ? w : h;
	var margin = boardSize * 0.02;
	var gridSize = boardSize - margin * 2;
	var tileSize = gridSize / 16;

	this.clear(ctx, 0, 0, w, h);

	for(var row = 0; row < 16; row++){
	    for(var col = 0; col < 16; col++){
		this.writeTile(ctx, hyperRobot.tile[row][col],
			       margin + tileSize * col,
			       margin + tileSize * row,
			       tileSize, tileSize);
	    }
	}
	this.writeGrid(ctx, margin, margin, gridSize, gridSize);

	ctx.save();
	ctx.fillRect(margin + tileSize * 7, margin + tileSize * 7, tileSize * 2, tileSize * 2);
	ctx.restore();

	this.writeTargetTile(ctx, hyperRobot.goalTarget.target, margin + tileSize * 7, margin + tileSize * 7, tileSize * 2, tileSize * 2);
	return true;
    },
    writeTargetTile: function(ctx, target, x, y, w, h){
	if(target == 99){
	    this.writeSpecialTarget(ctx, x, y, w, h);
	}
	else if(target){
	    switch(target % 4){
	    case 0:
		this.writeTriangleTarget(ctx, color[target], x, y, w, h);
		break;
	    case 1:
		this.writeSquareTarget(ctx, color[target], x, y, w, h);
		break;
	    case 2:
		this.writeDiamondTarget(ctx, color[target], x, y, w, h);
		break;
	    case 3:
		this.writeMoonTarget(ctx, color[target], x, y, w, h);
		break;
	    default:
		ctx.save();
		ctx.fillStyle = color[target];
		ctx.fillRect(x, y, w, h);
		ctx.restore();
		break;
	    }
	}	
    },
    writeTile: function(ctx, tile, x, y, w, h){
	this.writeTileBase(ctx, x, y, w, h);
	this.writeTargetTile(ctx, tile.target, x, y, w, h);
	this.writeWall(ctx, tile.wall, x, y, w, h);
    },
    writeMoonTarget: function(ctx, color, x, y, w, h){
	ctx.save();
	ctx.translate(x + w * 0.5, y + h * 0.5);
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(0, 0, w * 0.3, 0, Math.PI * 2, true);
	ctx.stroke();
	ctx.fill();
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(0, 0, w * 0.26, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(0, 0, w * 0.23, 0, Math.PI * 0.75, false);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
    },
    writeDiamondTarget: function(ctx, color, x, y, w, h){
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "white";
	ctx.beginPath();
	var r = w * 0.35;
	ctx.moveTo(w * 0.5 + r,  h * 0.5);
	for(var i = 1; i <= 6; i++){
	    var xx = w * 0.5 + r * Math.cos(i * Math.PI / 3);
	    var yy = h * 0.5 + r * Math.sin(i * Math.PI / 3);
	    ctx.lineTo(xx, yy);
	}
	ctx.stroke();
	ctx.fill();
	ctx.fillStyle = color;
	ctx.beginPath();
	r = w * 0.3;
	ctx.moveTo(w * 0.5 + r, h * 0.5);
	for(i = 1; i <= 6; i++){
	    xx = w * 0.5 + r * Math.cos(i * Math.PI / 3);
	    yy = h * 0.5 + r * Math.sin(i * Math.PI / 3);
	    ctx.lineTo(xx, yy);
	}
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = "white";
	ctx.beginPath();
	var r1 = w * 0.36, r2 = w * 0.06;
	ctx.moveTo(w * 0.5 + r1, h * 0.5);
	for(i = 1; i <= 8; i++){
	    r = i % 2 ? r2 : r1;
	    xx = w * 0.5 + r * Math.cos(i * Math.PI / 4);
	    yy = h * 0.5 + r * Math.sin(i * Math.PI / 4);
	    ctx.lineTo(xx, yy);
	}
	ctx.stroke();
	ctx.fill();
	ctx.restore();
    },
    writeSquareTarget: function(ctx, color, x, y, w, h){
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "white";
	ctx.fillRect(w * 0.2, h * 0.2, w * 0.6, h * 0.6);
	ctx.fillStyle = color;
	ctx.fillRect(w * 0.22, h * 0.22, w * 0.56, h * 0.56);
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(w * 0.5, h * 0.5, w * 0.15, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();

	ctx.save();
	var rad = Math.PI * 3 / 4;
	ctx.translate(w * 0.5, h * 0.5);
	ctx.transform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0);
	ctx.scale(2, 0.3);
	ctx.beginPath();
	ctx.arc(0, 0, w * 0.18, -Math.PI * 0.35, Math.PI * 1.35, false);
	ctx.restore();
	ctx.save();
	ctx.strokeStyle = "white";
	ctx.lineWidth = w * 0.06;
	ctx.stroke();
	ctx.restore();
	ctx.stroke();

	ctx.restore();
    },
    writeTriangleTarget: function(ctx, color, x, y, w, h){
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.moveTo(w * 0.5, h * 0.2);
	ctx.lineTo(w * 0.8, h * 0.8);
	ctx.lineTo(w * 0.2, h * 0.8);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.moveTo(w * 0.5, h * 0.3);
	ctx.lineTo(w * 0.7, h * 0.72);
	ctx.lineTo(w * 0.3, h * 0.72);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	var n = 24;
	var r1 = w * 0.2, r2 = w * 0.14;
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.moveTo(w * 0.5 + r1, h * 0.56);
	for(var i = 0; i <= n; i++){
	    var r = i % 2 ? r1 : r2;
	    var xx = w * 0.5 + r * Math.cos(i * 2 * Math.PI / n);
	    var yy = h * 0.56 + r * Math.sin(i * 2 * Math.PI / n);
	    ctx.lineTo(xx, yy);
	}
	ctx.stroke();
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(w * 0.5, h * 0.56, w * 0.1, 0, Math.PI * 2, true);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
    },
    writeSpecialTarget: function(ctx, x, y, w, h){
	ctx.save();
	ctx.fillStyle = "black";
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.arc(w * 0.5, h * 0.5, w * 0.25, 0, Math.PI * 2, true);
	ctx.fill();
	ctx.restore();
    },
    writeTileBase: function(ctx, x, y, w, h){
	var xx = x, yy = y, ww = w, hh = h;
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "#ecb";
	ctx.fillRect(0, 0, ww, hh);
	
	xx = w * 0.19;
	yy = h * 0.19;
	ww = w * 0.62;
	hh = h * 0.62;

	ctx.fillStyle = "#eee";
	ctx.strokeStyle = "#6af";
	ctx.strokeRect(xx, yy, ww, hh);
	ctx.fillRect(xx, yy, ww, hh);

	// 
	ctx.save();
	ctx.translate(w * 0.14, h * 0.14);
	ctx.fillStyle = "silver";
	for(var n = 0; n < 9; n++){
	    ctx.beginPath();
	    ctx.arc(w * 0.36 * (n % 3), h * 0.36 * Math.floor(n / 3), 2, 0, Math.PI * 2, true);
	    ctx.stroke();
	    ctx.fill();
	}
	ctx.restore();

	xx = w * 0.33;
	yy = h * 0.33;
	ww = w * 0.34;
	hh = h * 0.34;

	ctx.fillStyle = "#eea";
	ctx.beginPath();
	ctx.rect(xx, yy, ww, hh);
	ctx.fill();
	ctx.clip();
	ctx.save();
	this.tileCount++;
	if(this.tileCount % 16 == 0)
	    this.tileCount++;
	var rad;
	if(this.tileCount % 2 == 0){
	    ctx.translate(w * 0.84, h * 0.5);
	    rad = Math.PI * 0.75;
	}
	else{
	    ctx.translate(w * 0.5, h * 0.16);
	    rad = Math.PI * 0.25;
	}
	ctx.transform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0);
	ctx.fillStyle = "#777";
	for(var i = 0; i < 4; i++){
	    ctx.fillRect(w * 0.14 * i, 0, w * 0.07, h);
	}
	ctx.restore();
	ctx.restore();
    },
    writeWall: function(ctx, wall, x, y, w, h){
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "brown";
	var thickness = h * 0.1;
	if(wall & E_TOP){
	    ctx.fillRect(0, 0, w, thickness);
	    if(wall & E_LEFT)
		ctx.fillRect(-thickness, -thickness, thickness, thickness);
	    if(wall & E_RIGHT)
		ctx.fillRect(w, -thickness, thickness, thickness);
	}
	if(wall & E_LEFT){
	    ctx.fillRect(0, 0, thickness, h);
	}
	if(wall & E_RIGHT){
	    ctx.fillRect(w - thickness, 0, thickness, h);
	}
	if(wall & E_BOTTOM){
	    ctx.fillRect(0, h - thickness, w, thickness);
	    if(wall & E_LEFT){
		ctx.save();
		ctx.fillStyle = "blue";
		ctx.fillRect(-thickness, h, thickness, thickness);
		ctx.restore();
	    }
	    if(wall & E_RIGHT)
		ctx.fillRect(w, h, thickness, thickness);
	}
	ctx.restore();
    },
    writeGrid: function(ctx, x0, y0, w, h){
	ctx.save();
	ctx.beginPath();
	var dw = w / 16;
	var dh = h / 16;
	for(var i = 0; i <= 16; i++){
	    ctx.moveTo(x0, y0 + dh * i);
	    ctx.lineTo(x0 + w, y0 + dh * i);
	    ctx.moveTo(x0 + dw * i, y0);
	    ctx.lineTo(x0 + dw * i, y0 + h);
	}
	ctx.stroke();
	ctx.restore();
    }
};

// Hyper Robot Solver
var HRSolver = function(){};

HRSolver.prototype = {
    setBoard: function(board){
    },
    solve: function(){
    }
};

// This file ends here.
