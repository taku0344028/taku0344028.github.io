/*
 * アイギスシミュレータ
 * (C) 2015 Takuya Okubo
 */

// Enemy class
var Enemy = function(arg){
    this.x = arg.x || 0;
    this.y = arg.y || 0;
    this.hp = arg.hp || 100;
    this.attack = arg.attack || 100;
    this.attackSpeed = arg.attackSpeed || 100;
    this.attackRange = arg.attackRange || 10;
    this.defence = arg.defence || 0;
    this.antiMagic = arg.antiMagic || 0;
    this.popTime = arg.popTime || 1000;
    this.speed = arg.speed || 0.3;
    this.route = arg.route || new Route();
    this.motion = 0;
};
Enemy.prototype = {
    initialize: function(){},
    isAlive: function(){},
    isMovable: function(){},
    choseTarget: function(){},
    update: function(elapseTime){
        if(this.route.isGoal()){
            return 1;
        }
        var speed = this.route.getDirection(this.x, this.y, this.speed);
        this.x += speed.x;
        this.y += speed.y;
        this.motion = (Math.cos(elapseTime / 200) + 1) / 2;
        return 0;
    },
    draw: function(ctx){
        var x = this.x * g_r;
        var y = this.y * g_r;
        ctx.save();
        ctx.beginPath();
        var r = 5 * (this.motion + 1);
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
    }
};

var Armor = function(arg){
    Enemy.call(this, arg);
    this.speed = arg.speed || 0.1;
};
Armor.prototype = Object.create(Enemy.prototype, {
    constructor: {
        value: Armor
    }
});

var Knight = function(arg){
    Enemy.call(this, arg);
    this.speed = arg.speed || 0.6;
};
Knight.prototype = Object.create(Enemy.prototype, {
    constructor: {
        value: Knight
    }
});
