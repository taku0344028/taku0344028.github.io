/**
 * (C) 2015 Takuya Okubo
 */

var DefaultFont = "'MSゴシック'";
var drawBackGround = function(ctx, w, h){
    ctx.save();
    var nStar = 6;
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    var color = "rgb(0, 50, 125)";
    grad.addColorStop(0.3, color);
    grad.addColorStop(0.6, "rgb(180, 230, 255)");
    grad.addColorStop(0.9, color);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.2;
    ctx.beginPath();
    for(var i = 0; i < 50; i++){
	ctx.moveTo(0, h * i / 50);
	ctx.lineTo(w, h * i / 50);
    }
    ctx.stroke();
    drawName(ctx, w, h);
    for(var n = 0; n < nStar; n++)
	drawStarMark(ctx, w * 0.27 - h * 0.05 * n, h * 0.095, h * 0.05);
    drawLevelPanel(ctx, w, h);
    drawStatusPanel(ctx, w, h);
    drawSkillPanel(ctx, w, h);
    drawCost(ctx, w, h);
    drawLike(ctx, w, h);

    drawPanel(ctx, w * 0.75, h * 0.8, w * 0.2, h * 0.15);
    drawPanel(ctx, w * 0.75, h * 0.64, w * 0.2, h * 0.15);
    drawPanel(ctx, w * 0.72, h * 0.02, w * 0.26, h * 0.1, {fillStyle: "rgba(10, 40, 10, 1)", strokeStyle: "rgb(5, 10, 5)", type: "serif"});
    ctx.restore();
};

var drawLike = function(ctx, mainWidth, mainHeight){
    var x = mainWidth * 0.15;
    var y = mainHeight * 0.89;
    var w = mainWidth * 0.15;
    var h = mainHeight * 0.07;
    drawPanel(ctx, x, y, w, h, {
	fillStyle: "rgba(230, 80, 140, 0.95)",
	strokeStyle: "yellow",
	r: 10
    });
    ctx.save();
    ctx.font = parseInt(h * 0.5) + "px " + DefaultFont;
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.fillRect(x + w * 0.05, y + h * 0.8, w * 0.9, h * 0.06);
    ctx.lineWidth = 2.5;
    ctx.strokeText("好感度", x + w * 0.05, y + h * 0.7);
    ctx.fillText("好感度", x + w * 0.05, y + h * 0.7);
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.font = parseInt(h * 0.7) + "px " + DefaultFont;
    ctx.fillText("100%", x + w * 0.9, y + h * 0.7);
    ctx.restore();
};

var drawStarMark = function(ctx, x, y, size){
    var radOffset = Math.PI / 2;
    ctx.save();
    ctx.fillStyle = "gold";
    for(var i = 0; i < 10; i++){
	var r = i % 2 ? size / 2 : size / 5;
	var rad = Math.PI * 2 * i / 10 + radOffset;
	var xx = x + size / 2 + Math.cos(rad) * r;
	var yy = y + size / 2 + Math.sin(rad) * r;
	if(i === 0)
	    ctx.moveTo(xx, yy);
	else
	    ctx.lineTo(xx, yy);	    
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
};

var drawName = function(ctx, mainWidth, mainHeight){
    var x = mainWidth * 0.1;
    var y = mainHeight * 0.09;
    ctx.save();
    ctx.lineWidth = 3;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.font = mainHeight * 0.06 + "px " + DefaultFont;
    ctx.fillText("竜姫アーニャ", x, y);
    ctx.strokeText("竜姫アーニャ", x, y);
    ctx.restore();
};

var drawLevelPanel = function(ctx, mainWidth, mainHeight){
    var x = mainWidth * 0.12;
    var y = mainHeight * 0.15;
    var w = mainWidth * 0.18;
    var h = mainHeight * 0.12;
    var labelFontSize = mainHeight * 0.03;
    drawPanel(
	ctx, x, y, w, h,
	{
	    fillStyle: "rgba(10, 70, 10, 0.9)",
	    strokeStyle: "rgb(230, 230, 0)"
	}
    );
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = labelFontSize + "px " + DefaultFont;
    ctx.fillText("レベル", x + mainWidth * 0.01, y + mainHeight * 0.03);
    ctx.fillText("EXP", x + mainWidth * 0.01, y + mainHeight * 0.07);
    ctx.fillText("次のレベルまで", x + mainWidth * 0.01, y + mainHeight * 0.11);
    ctx.font = parseInt(labelFontSize * 1.5) + "px " + DefaultFont;
    ctx.fillText("63/ 80", x + mainWidth * 0.07, y + mainHeight * 0.035);
    drawProgressBar(ctx, x + mainWidth * 0.042, y + mainHeight * 0.05, mainWidth * 0.13, mainHeight * 0.018, 0.7);
    ctx.font = parseInt(labelFontSize * 1.3) + "px " + DefaultFont;
    ctx.fillText("901", x + mainWidth * 0.12, y + mainHeight * 0.11);
    ctx.restore();
};

var drawStatusPanel = function(ctx, mainWidth, mainHeight){
    var x = mainWidth * 0.15;
    var y = mainHeight * 0.29;
    var w = mainWidth * 0.15;
    var h = mainHeight * 0.28;
    var margin = h / 7;
    drawPanel(ctx, x, y, w, h);
    ctx.save();
    ctx.font = parseInt(h / 8) + "px " + DefaultFont;
    ctx.fillStyle = "white";
    ctx.fillText("HP", x + w * 0.05, y + margin);
    ctx.fillText("攻撃力", x + w * 0.05, y + h * 1 / 5 + margin);
    ctx.fillText("防御力", x + w * 0.05, y + h * 2 / 5 + margin);
    ctx.fillText("魔法耐性", x + w * 0.05, y + h * 3 / 5 + margin);
    ctx.fillText("ブロック数", x + w * 0.05, y + h * 4 / 5 + margin);

    ctx.textAlign = "right";
    ctx.font = parseInt(h / 6) + "px " + DefaultFont;
    ctx.fillText("2046", x + w * 0.9, y + margin);
    ctx.fillText("408", x + w * 0.9, y + h * 1 / 5 + margin);
    ctx.fillText("472", x + w * 0.9, y + h * 2 / 5 + margin);
    ctx.fillText("0", x + w * 0.9, y + h * 3 / 5 + margin);
    ctx.fillText("2", x + w * 0.9, y + h * 4 / 5 + margin);
    ctx.restore();
};

var drawSkillPanel = function(ctx, mainWidth, mainHeight){
    var x = mainWidth * 0.12;
    var y = mainHeight * 0.63;
    var w = mainWidth * 0.18;
    var h = mainHeight * 0.2;
    var skillDescription = [
	"38秒魔法以外の",
	"ダメージを50%",
	"減少させる"
    ];
    drawPanel(ctx, x, y, w, h);
    ctx.save();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = parseInt(h * 0.2) + "px " + DefaultFont;
    ctx.fillText("スキル", x + w * 0.2, y - h * 0.1);
    ctx.strokeText("スキル", x + w * 0.2, y - h * 0.1);
    ctx.fillText("聖剣アスカロン", x + w * 0.05, y + h * 0.2);
    ctx.font = parseInt(h * 0.18) + "px " + DefaultFont;
    ctx.fillText("レベル4/5", x + w * 0.05, y + h * 0.35);
    for(var i in skillDescription){
	ctx.fillText(skillDescription[i], x + w * 0.05, y + h * 0.5 + h * 0.15 * i);
    }
    ctx.restore();
};

var drawCost = function(ctx, mainWidth, mainHeight){
    var x = mainWidth * 0.12;
    var y = mainHeight * 0.86;
    var w = mainWidth * 0.18;
    var h = mainHeight * 0.02;
    ctx.save();
    ctx.fillStyle = "rgba(10, 140, 240, 0.7)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "white";
    ctx.font = parseInt(h * 2) + "px " + DefaultFont;
    ctx.fillText("出撃コスト", x, y + h * 0.8);
    ctx.restore();
};

var drawProgressBar = function(ctx, x, y, w, h, pRate){
    ctx.save();
    var grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "black");
    grad.addColorStop(1, "grey");
    ctx.fillStyle = grad;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "yellow";
    ctx.fillRect(x, y, w * pRate, h);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
};

var drawPanel = function(ctx, x, y, w, h, style){
    if(typeof style === "undefined")
	style = {};
    var r = 25;
    if(typeof style.r !== "undefined")
	r = style.r;
    ctx.save();
    if(typeof style.strokeStyle === "undefined")
	ctx.strokeStyle = "white";
    else
	ctx.strokeStyle = style.strokeStyle;
    ctx.lineWidth = 8;
    if(typeof style.fillStyle === "undefined")
	ctx.fillStyle = "rgba(10, 140, 240, 0.7)";
    else
	ctx.fillStyle = style.fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    if(typeof style.type !== "undefined" && style.type === "serif"){
	ctx.lineTo(x + w * 0.2, y + h);
	ctx.quadraticCurveTo(x + w * 0.2, y + h * 1.3, x + w * 0.1, y + h * 1.3);
	ctx.quadraticCurveTo(x + w * 0.12, y + h * 1.3, x + w * 0.12, y + h);
    }
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
};

// This file ends here.
