/*
 * �A�C�M�X�V�~�����[�^
 * (C) 2015 Takuya Okubo
 */

(function(){
    var IGIS_NS = "igis_simulator_namespace";
    // �{��
    var g_r = 2;
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
    
    var Route = function(points){
        this.points = [];
        
        if(points){
            for(var i = 0; i < points.length; i++){
                this.points[i] = {x: points[i].x, y: points[i].y};
            }
        }
        else{
            this.points = [{x: 100, y: 100}, {x: 130, y: 200}, {x: 450, y: 250}];
        }
    };
    Route.prototype = {
        isGoal: function(){
            return this.points.length === 0;
        },
        getDirection: function(x, y, speed){
            var p = this.points[0];
            var dx = p.x - x;
            var dy = p.y - y;
            var dr = Math.sqrt(dx * dx + dy * dy);
            if(dr <= speed){
                speed = dr;
                this.points.splice(0, 1);
            }
            return {x: speed * dx / dr, y: speed * dy / dr};
        }
    };
    
    var points_1 = [{x: 260, y: 170}, {x: 250, y: 100}, {x: 290, y:100}];

    var Hero = function(arg){
        this.x = arg.x || 0;
        this.y = arg.y || 0;
        this.hp = arg.hp || 577;
        this.attack = arg.attack || 127;
        this.defence = arg.defence || 53;
        this.antiMagic = arg.antiMagic || 0;
        this.lv = arg.lv || 1;
        this.lvCap = arg.lvCap || 50;
        this.cost = arg.cost || 10;
        this.rate = {
            hp: 3,
            attack: 1,
            defence: 1,
            antiMagic: 0
        };
        this.base = {
            hp: 300,
            attack: 100,
            defence: 50,
            antiMagic: 0
        };
        this.imgSrc = {
            icon: "http://gyazo.com/e2e9a8ca8c57cc92624ac22ee33df4dc.png"
        };
    };
    Hero.prototype = {
        initialize: function(){
            this.available = false;
            this.img = {
                unit: new Image(),
                icon: new Image()
            };
            this.img.unit.src = this.imgSrc.unit || this.imgSrc.icon; // fix me
            this.img.icon.src = this.imgSrc.icon;
        },
        update: function(availableCost){
            if(this.cost <= availableCost){
                this.available = true;
            }
            else{
                this.available = false;
            }
        },
        lvUp: function(adjust){
            if(this.lv < this.lvCap){
                this.lv++;
                if(adjust){
                    this.adjustParameter();
                }
            }
        },
        lvDown: function(adjust){
            if(this.lv > 1){
                this.lv--;
                if(adjust){
                    this.adjustParameter();
                }
            }  
        },
        adjustParameter: function(){
            this.hp = parseInt(this.rate.hp * this.lv + this.base.hp);
            this.attack = parseInt(this.rate.attack * this.lv + this.base.attack);
            this.defence = parseInt(this.rate.defence * this.lv + this.base.defence);
            this.antiMagic = parseInt(this.rate.antiMagic * this.lv + this.base.antiMagic);
        },
        drawUnit: function(ctx){
          var x = this.x;
          var y = this.y;
          ctx.drawImage(this.img.unit, x, y, 40, 40);
        },
        drawIconImage: function(ctx, x, y, w, h){
            ctx.save();
            ctx.drawImage(this.img.icon, x, y, w, h);
            ctx.restore();
        },
        drawIcon: function(ctx, x, y, w, h){
            ctx.save();
            this.drawIconImage(ctx, x, y, w, h);
            var fontSize = parseInt(h * 0.25);
            ctx.font = "" + fontSize + "px bold 'Times New Roman'";
            ctx.strokeStyle = "white";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.lineWidth = 1;
            ctx.strokeText("Lv." + this.lv, x + w * 0.05, y + h * 0.85);
            ctx.fillText("Lv." + this.lv, x + w * 0.05, y + h * 0.85);
            ctx.strokeText("�R�X�g�F", x + w * 0.05, y + h * 0.15);
            ctx.fillText("�R�X�g�F", x + w * 0.05, y + h * 0.15);
            ctx.textAlign = "right";
            ctx.strokeText(this.cost, x + w * 0.95, y + h * 0.15);
            ctx.fillText(this.cost, x + w * 0.95, y + h * 0.15);
            if(!this.available){
                ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
                ctx.fillRect(x, y, w, h);
            }
            ctx.restore();
        },
        draw: function(ctx, x, y, w, h){
            this.drawUnit(ctx);
            this.drawIcon(ctx, x, y, w, h);
        }
    };
    
    var Prince = function(arg){
        Hero.call(this, arg);
        this.lvCap = 99;
        this.hp = 707;
        this.attack = 206;
        this.defence = 155;
        this.cost = 10;
        this.rate = {
            hp: 7.08,
            attack: 1.98,
            defence: 1.48,
            antiMagic: 0
        };
        this.base = {
            hp: 700,
            attack: 204,
            defence: 154,
            antiMagic: 0
        };
        this.imgSrc.icon = "http://gyazo.com/c63cefdfba1034f95e27f61c6f91150b.png";
    };
    Prince.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Prince
        }
    });
    
    var Mission = function(arg){
      this.map = arg.map || new Map({});
      this.life = arg.life || 5;
      this.cost = arg.cost || 0;
      this.puttableUnit = arg.puttableUnit || 6;
      this.prevTime = 0;
    };
    Mission.prototype = {
        initialize: function(){
            this.map.initialize();
        },
        update: function(elapseTime){
            if(elapseTime - this.prevTime > 1000){
                this.prevTime = parseInt(elapseTime / 1000) * 1000;
                this.cost++;
            }
        },
        draw: function(ctx, w, h){
            this.map.draw(ctx, w, h);
            ctx.save();
            var grad = ctx.createLinearGradient(0, h * 0.8, 0, h * 0.85);
            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(1, 'rgb(0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, h * 0.8, w * 0.2, h * 0.05);
            ctx.font = "24px 'Times New Roman'";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white";
            ctx.fillText("�o���R�X�g", 0, h * 0.825);
            ctx.fillText("�c��o���\�F " + this.puttableUnit, w * 0.2, h * 0.825);
            ctx.textAlign = "right";
            ctx.fillText(this.cost, w * 0.17, h * 0.825);
            ctx.restore();
        }
    };
    
    var Map = function(arg){
        this.imgSrc = arg.imgSrc || "http://i.gyazo.com/f83dd6fcb259583dc990259d72380573.png";
        this.inPoints = arg.inPoints || [{x: 51, y: 40}, {x: 52, y: 50}];
        this.outPoints = arg.outPoints || [];
    };
    Map.prototype = {
        initialize: function(){
          this.img = new Image();
          this.img.src = this.imgSrc;
        },
        draw: function(ctx, w, h){
            ctx.drawImage(this.img, 0, 0, w, h);
            ctx.save();
            ctx.strokeStyle = "grey";
            var i, p;
            p = this.inPoints;
            for(i = 0; i < p.length; i++){
                ctx.beginPath();
                ctx.arc(w * p[i].x / 100, h * p[i].y / 100, w * 0.02, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
            }
            p = this.outPoints;
            for(i = 0; i < p.length; i++){
                ctx.beginPath();
                ctx.arc(w * p[i].x / 100, h * p[i].y / 100, w * 0.02, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        }
    };
    
    var Game = function(arg){
        this.cvs = arg.cvs;
        this.logger = arg.logger || console.log;
        this.enemies = [];
        this.activeEnemies = [];
        this.heroes = [new Prince({})];
        this.activeHeroes = [];
    };
    Game.prototype = {
        initialize: function(){
            this.ctx = this.cvs.getContext("2d");
            resizeCanvas(this.cvs);
            var heroes = this.heroes;
            this.load();
            /*
            heroes.push(new Hero({}));
            heroes.push(new Nenya({x: 100, y: 100}));
            heroes.push(new Arisa({lv: 50}));
            heroes.push(new HeavyArmor({}));
            heroes.push(new Soldger({}));
            heroes.push(new VampirePrincess({}));
            heroes.push(new Princess({}));
            heroes.push(new Walkure({}));
            heroes.push(new Onmyoji({}));
            heroes.push(new Logue({}));
            */
            heroes.sort(function(a, b){return a.cost - b.cost});
            for(var i = 0; i < heroes.length; i++){
                heroes[i].initialize();
            }
            var enemies = this.enemies;
            enemies.push(new Knight({x: 10, y: 10, popTime: 1}));
            enemies.push(new Armor({x: 10, y: 10, popTime: 1000}));
            enemies.push(new Enemy({x: 490, y: 180, route: new Route(points_1), popTime: 1000}));
            enemies.push(new Enemy({x: 490, y: 190, route: new Route(points_1), popTime: 1800}));
            enemies.push(new Enemy({x: 490, y: 180, route: new Route(points_1), popTime: 8000}));
            enemies.push(new Enemy({x: 490, y: 180, route: new Route(points_1), popTime: 9300}));
            enemies.push(new Enemy({x: 490, y: 180, route: new Route(points_1), popTime: 15000}));
            for(i = 0; i < enemies.length; i++){
                enemies[i].initialize();
            }
            this.mission = new Mission({});
            this.mission.initialize();
            this.startTime = +new Date();
            this.logger("initialize done");
        },
        save: function(){
            var h = this.heroes;
            var obj = [];
            var x = this.heroes[0];
            obj.push(x);
            var r = JSON.stringify(obj);
            console.log(r);
//            localStorage.setItem(IGIS_NS + ":hero", JSON.stringify(this.heroes));
        },
        load: function(){
            var r = localStorage.getItem(IGIS_NS + ":hero");
            if(r){
                console.log("loaded");
                this.heroes = JSON.parse(r);
            }
            else{
                console.log("not found in local storage");
            }
        },
        loadMission: function(mission){
            this.mission = mission;
        },
        run: function(){
            this.draw();
            this.update();
        },
        draw: function(){
            var ctx = this.ctx;
            var cvs = this.cvs;
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            this.mission.draw(ctx, cvs.width, cvs.height);
            drawGrid(ctx, cvs.width, cvs.height, cvs.width / 10, cvs.height / 10);
            var heroes = this.heroes;
            var size = cvs.width * 0.1;
            for(var i = 0; i < heroes.length; i++){
                heroes[i].draw(this.ctx, size * i, cvs.height - size, size, size);
            }
            var enemies = this.activeEnemies;
            for(i = 0; i < enemies.length; i++){
                enemies[i].draw(this.ctx);
            }
        },
        update: function(){
            var elapseTime = +new Date() - this.startTime;
            var enemies = this.activeEnemies;
            var tmp = [];
            var p;
            for(var i = 0; i < enemies.length; i++){
                p = enemies[i];
                var r = p.update(elapseTime);
                if(r === 0){
                    tmp.push(p);
                }
            }
            this.activeEnemies = tmp;
            
            enemies = this.enemies;
            tmp = [];
            for(i = 0; i < enemies.length; i++){
                p = enemies[i];
                if(elapseTime > p.popTime){
                    this.activeEnemies.push(p);
                }
                else{
                    tmp.push(p);
                }
            }
            this.enemies = tmp;
            this.mission.update(elapseTime);
            var heroes = this.heroes;
            for(i = 0; i < heroes.length; i++){
                heroes[i].update(this.mission.cost);
            }
        }
    };
    
    var MemberEditor = function(arg){
        this.selectedIdx = 0;
        this.active = false;
    };
    MemberEditor.prototype = {
        draw: function(ctx, w, h, game){
            ctx.save();
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "silver";
            ctx.fillRect(0, 0, w, h);
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.font = "" + h * 0.07 + "px 'Times New Roman'";
            // menu title
            (function(){
                var text = "�����o�[�ҏW";
                var grad = ctx.createLinearGradient(0, 0, 0, h * 0.1);
                grad.addColorStop(0, 'rgba(255,255,255,0)');
                grad.addColorStop(1, 'rgb(0,0,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w * 0.5, h * 0.1);
                ctx.strokeStyle = "white";
                ctx.fillStyle = "black";
                ctx.strokeText(text, w * 0.25, h * 0.05);
                ctx.fillText(text, w * 0.25, h * 0.05);
            })();
            
            // back button
            var g = ctx.createLinearGradient(0, 0, 0, h * 0.1);
            g.addColorStop(0, 'rgb(0, 0, 255)');
            g.addColorStop(1, 'rgb(0, 0, 0)');
            drawButton(ctx, w * 0.8, h * 0.01, w * 0.18, h * 0.08, "�߂�", g);
            var iconSize = w * 0.1;
            ctx.fillStyle = "cyan";
            ctx.fillRect(w * 0.4, h * 0.1, iconSize * 5, iconSize * 3);
            var members = game.heroes;
            for(var i = 0; i < 15; i++){
                var x = iconSize * (i % 5) + w * 0.4;
                var y = iconSize * parseInt(i / 5) + h * 0.1;
                if(i < members.length){
                    var member = members[i];
                    var t = member.available;
                    member.available = true;
                    member.drawIcon(ctx, x + 5, y + 5, iconSize - 10, iconSize - 10);
                    member.available = t;
                    if(i === this.selectedIdx){
//                    ctx.fillStyle = "rgba(200, 0, 0, 0.3)";
                    }
                    else{
                        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                        ctx.fillRect(x + 5, y + 5, iconSize - 10, iconSize - 10);
                    }
                }
                else{
                    drawEmptyIcon(ctx, x + 5, y + 5, iconSize - 10, iconSize - 10);
                    if(i === members.length){
                        drawButton(ctx, x + 10, y + 10, iconSize - 20, iconSize - 20, "+", "grey");
                    }
                }
            }
            var selectedMember = game.heroes[this.selectedIdx];
            this.drawUnitStatus(ctx, w, h, selectedMember);
            ctx.restore();
        },
        drawUnitStatus: function(ctx, w, h, member){
            ctx.save();
            var fontSize = parseInt(h * 0.04);
            ctx.font = "" + fontSize + "px 'Times New Roman'";
            ctx.textBaseline = "middle";
            (function(array){
                for(var i = 0; i < array.length; i++){
                    var x = w * 0.75;
                    var y = (fontSize * 1.1) * i + h * 0.55;
                    var g1 = ctx.createRadialGradient(x + fontSize / 2, y + fontSize / 2, 0, x + fontSize / 2, y + fontSize / 2, fontSize);
                    g1.addColorStop(1, 'rgb(0, 0, 0)');
                    g1.addColorStop(0, 'rgb(255, 0, 0)');
                    ctx.fillStyle = "white";
                    var g2 = ctx.createRadialGradient(w * 0.9 - fontSize / 2, y + fontSize / 2, 0, w * 0.9 - fontSize / 2, y + fontSize / 2, fontSize);
                    g2.addColorStop(1, 'rgb(0, 0, 0)');
                    g2.addColorStop(0, 'rgb(0, 255, 0)');
                    ctx.fillRect(x, y, w * 0.13, fontSize);
                    ctx.fillStyle = "black";
                    ctx.textAlign = "center";
                    drawButton(ctx, x, y, fontSize, fontSize, "-", g1);
                    drawButton(ctx, w * 0.9 - fontSize, y, fontSize, fontSize, "+", g2);
                    ctx.textAlign = "left";
                    ctx.fillText(array[i].k, x - w * 0.15, y + fontSize / 2);
                    ctx.textAlign = "right";
                    ctx.fillText(array[i].v, x + w * 0.11, y + fontSize / 2);
                }
            })([
                {k: "Lv.", v: member.lv},
                {k: "HP", v: member.hp},
                {k: "�U����", v: member.attack},
                {k: "�h���", v: member.defence},
                {k: "���@�ϐ�", v: member.antiMagic},
                {k: "�˒�", v: member.range || "-"},
                {k: "�R�X�g", v: member.cost}
            ]);
            ctx.restore();
        },
        /**
         * return 0: �ύX�Ȃ� 1: �ύX���� 2: �߂�
         */
        click: function(x, y, w, h, game){
            if(!this.active) return 0;
            var iconSize = w * 0.1;
            if(w * 0.1 < x && x < w * 0.1 + iconSize * 8 && h * 0.1 < y && y < h * 0.1 + iconSize * 3){
                var idx = parseInt((y - h * 0.1) / iconSize) * 8 + parseInt((x - w * 0.1) / iconSize);
                if(idx < game.heroes.length){
                    this.selectedIdx = idx;
                    return 1;
                }
            }
            var member = game.heroes[this.selectedIdx];
            var fontSize = parseInt(h * 0.04);
            if(w * 0.87 < x && x < w * 0.9){
                if(h * 0.55 < y && y < h * 0.55 + fontSize){
                    member.lvUp(true); 
                    return 1;
                }
            }
            if(w * 0.77 < x && x < w * 0.8){
                if(h * 0.55 < y && y < h * 0.55 + fontSize){
                    member.lvDown(true);
                    return 1;
                }
            }
            
            if(w * 0.8 < x && y < h * 0.1){
                this.active = false;
                return 2;
            }
            return 0;
        }
    };

    var menuImgSrcList = [
        {src: "http://embed.gyazo.com/9d3d4ec221e73967d6706ccea53d0b29.png", x: 400, y: 100, w: 560, h: 90}, 
        {src: "http://i.gyazo.com/dee461db23773e34cb590bb5a2600542.png", x: 400, y: 100, w: 560, h: 90},
        {src: "http://embed.gyazo.com/ac5500dfd1088128f41cefd981f44c72.png", x: 440, y: 20, w: 520, h: 90},
        {src: "http://gyazo.com/00976bd11bbb4a148d2c1f19b64aceff.png", x: 360, y: 100, w: 560, h: 130}
        ];
    var MainMenu = function(){
        this.menu = [];
        var img = new Image();
        this.imgData = menuImgSrcList[(parseInt(Math.random() * menuImgSrcList.length))];
        img.src = this.imgData.src;
        console.log(img.src);
        this.img = img;
        this.marginRate = 0.04;
        this.paddingRate = 0.01;
        this.widthRate = 0.8;
        this.heightRate = 0.2;
        this.active = true;
    };
    MainMenu.prototype = {
        draw: function(ctx, w, h){
            ctx.save();
            ctx.clearRect(0, 0, w, h);
            ctx.font = "bold 36px 'Times New Roman'";
            ctx.textBaseline = "middle";
            ctx.textAlign = "right";
            ctx.lineWidth = 5;
            var menu = this.menu;
            var margin = w * this.marginRate;
            var padding = h * this.paddingRate;
            var m_w = w * this.widthRate;
            var m_h = h * this.heightRate;
            var x = margin;
            for(var i = 0; i < menu.length; i++){
                var y = (m_h + padding) * i + margin;
                ctx.fillStyle = menu[i].active ? "#ee0" : "#c33";
                ctx.fillRect(x, y, m_w, m_h);
                ctx.drawImage(this.img, this.imgData.x, this.imgData.y, this.imgData.w, this.imgData.h, x + padding, y + padding, m_w - padding * 2, m_h - padding * 2);
                ctx.fillStyle = "#333";
                ctx.strokeStyle = "white";
                ctx.strokeText(menu[i].title, x + m_w - padding, y + m_h / 2);
                ctx.fillText(menu[i].title, x + m_w - padding, y + m_h / 2);
            }
            ctx.restore();
            var self = this;
            this.img.onload = function(){self.draw(ctx, w, h)};
        },
        setMenu: function(arg){
            this.menu.push({
                title: arg.title || "Empty",
                click: arg.click || function(){console.log("not implemented.")},
                active: false
            });
        },
        click: function(x, y, w, h){
            if(!this.active) return false;
            var menu = this.menu;
            var m_h = h * this.heightRate;
            var m_w = w * this.widthRate;
            var padding = h * this.paddingRate;
            var margin = w * this.marginRate;
            if(x < margin || m_w + margin < x || y < margin){
                return false;
            }
            for(var i = 0; i < menu.length; i++){
                if(y > (m_h + padding) * i + margin && (m_h + padding) * (i + 1) + margin - padding > y){
                    this.active = false;
                    menu[i].click();
                }
            }
        },
        mousemove: function(x, y, w, h){
            if(!this.active) return false;
            var menu = this.menu;
            var m_h = h * this.heightRate;
            var m_w = w * this.widthRate;
            var padding = h * this.paddingRate;
            var margin = w * this.marginRate;
            var updated = false;
            for(var i = 0; i < menu.length; i++){
                if(margin < x && x < m_w + margin && (m_h + padding) * i + margin < y && y < (m_h + padding) * (i + 1) + margin - padding){
                    if(!menu[i].active) updated = true;
                    menu[i].active = true;
                }
                else{
                    if(menu[i].active) updated = true;
                    menu[i].active = false;
                }
            }
            return updated;
        }
    };

    var requestAnimationFrame = (function(){
        return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(cb){setInterval(cb, 1000 / 60)};
    })();
    
    window.onEachFrame = function(cb){
        var _cb = function(){
            cb();
            return requestAnimationFrame(_cb);
        };
        return _cb();
    };
    
    window.onload = function(){
        var cvs = document.getElementById("myBoard");
        var ctx = cvs.getContext("2d");
        var size = resizeCanvas(cvs);
        var mainMenu = new MainMenu();
        var memberEditor = new MemberEditor();
        var game = new Game({
            cvs: cvs
        });
        game.initialize();

        mainMenu.setMenu({
            title: "�~�b�V�����I��",
            click: function(){
                var res = prompt("hoge", "fuga");
                console.log(res);
                mainMenu.active = true;
            }
        });
        mainMenu.setMenu({
            title: "�����o�[�ҏW",
            click: function(){
                memberEditor.active = true;
                memberEditor.draw(ctx, cvs.width, cvs.height, game);
            }
        });
        mainMenu.setMenu({
            title: "�V�~�����[�V�����J�n",
            click: function(){
                window.onEachFrame(function(){game.run();});
            }
        });
        mainMenu.draw(ctx, cvs.width, cvs.height);
        cvs.addEventListener("click", function(e){
            var p = getComputedCursorPosition(e, size);
            mainMenu.click(p.x, p.y, cvs.width, cvs.height);
            var r = memberEditor.click(p.x, p.y, cvs.width, cvs.height, game);
            if(r === 1){
                memberEditor.draw(ctx, cvs.width, cvs.height, game);
                game.save();
            }
            else if(r === 2){
                mainMenu.active = true;
                mainMenu.draw(ctx, cvs.width, cvs.height);
            }
        }, false);
        cvs.addEventListener("mousemove", function(e){
            var p = getComputedCursorPosition(e, size);
            if(mainMenu.mousemove(p.x, p.y, cvs.width, cvs.height)) mainMenu.draw(ctx, cvs.width, cvs.height);
        }, false);
    };
    
    var drawButton = function(ctx, x, y, w, h, text, color){
        ctx.save();
        var fontSize = parseInt(h * 0.9);
        ctx.font = "" + fontSize + "px 'Times New Roman";
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 5;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var r = parseInt(h * 0.1);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.stroke();
        ctx.fillStyle = color || "blue";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.strokeText(text, x + w / 2, y + h / 2);
        ctx.fillText(text, x + w / 2, y + h / 2);
        ctx.restore();
    };
    var getComputedCursorPosition = function(e, cvsSize){
        return {x: (e.clientX - cvsSize.border.left) * g_r, y: (e.clientY - cvsSize.border.top) * g_r};
    };
    
    var drawEmptyIcon = function(ctx, x, y, w, h){
        ctx.save();
        ctx.fillStyle = "grey";
        ctx.fillRect(x, y, w, h);
        ctx.restore();
    };
    
    // �O���b�h���𓙊Ԋu�Ɉ���
    var drawGrid = function(ctx, w, h, dw, dh){
        var tmp;
        ctx.save();
        ctx.strokeStyle = "green";
        ctx.beginPath();
        tmp = 0;
        while(tmp < w){
            ctx.moveTo(tmp, 0);
            ctx.lineTo(tmp, h);
            tmp += dw;
        }
        tmp = 0;
        while(tmp < h){
            ctx.moveTo(0, tmp);
            ctx.lineTo(w, tmp);
            tmp += dh;
        }
        ctx.stroke();
        ctx.restore();
    };
    
    // Canvas�v�f����ʂ����ς��Ɏg�����߂Ƀ��T�C�Y����
    var resizeCanvas = function(elm){
      var s = getAdjustSize(elm);
      elm.style.width = s.width;
      elm.style.height = s.height;
      elm.width = s.width * g_r;
      elm.height = s.height * g_r;
      return s;
    };
    
    // ��ʂ����ς��̃T�C�Y���擾
    var getAdjustSize = function(elm){
      var adjustWidth = document.documentElement.clientWidth;
      var adjustHeight = document.documentElement.clientHeight;
      var style = document.defaultView.getComputedStyle(elm, "");
      var border = {left: parseFloat(style.borderLeftWidth),
      right: parseFloat(style.borderRightWidth),
      top: parseFloat(style.borderTopWidth),
      bottom: parseFloat(style.borderBottomWidth)};
      adjustWidth -= (border.left + border.right);
      adjustHeight -= (border.top + border.bottom);
      return {width: adjustWidth, height: adjustHeight, border: border};
    };
    
    // �E�Ƃ��Ƃ̊�b�N���X
    // �ߐڐE
    // �\���W���[/�\���W���[�`�[�t/�\���W���[�G���[�g
    var Soldger = function(arg){
        Hero.call(this, arg);
    };
    Soldger.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Soldger
        }
    });
    
    // �w�r�[�A�[�}�[/�o�g���}�X�^�[/�M�K���g�A�[�}�[
    var HeavyArmor = function(arg){
        Hero.call(this, arg);
        this.cost = 15;
        this.imgSrc.icon = "http://gyazo.com/60cbbc2fb6656366499e5f06e08b714a.png";
    };
    HeavyArmor.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: HeavyArmor
        }
    });
    
    // �����L���[��/���j�R�[���i�C�g/�u�������q���f
    var Walkure = function(arg){
        Hero.call(this, arg);
        this.cost = 13;
        this.imgSrc.icon = "http://gyazo.com/bdc189fc66191fc025eb9431c3ca80ce.png";
    };
    Walkure.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Walkure
        }
    });
    
    // ���[�O/�A�T�V��/�}�X�^�[�A�T�V��
    var Logue = function(arg){
        Hero.call(this, arg);
        this.cost = 7;
        this.imgSrc.icon = "http://i.gyazo.com/00efb1f64e2e773462ff6f886d3e6e51.png";
    };
    Logue.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Logue
        }
    });

    // �v�����Z�X/�n�C�v�����Z�X
    var Princess = function(arg){
        Hero.call(this, arg);
        this.cost = 19;
        this.imgSrc.icon = "http://gyazo.com/2c92e9b34ba722fe02f0de95bfeae821.png";
    };
    Princess.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Princess
        }
    });
    
    // ���@���p�C�A�v�����Z�X/���@���p�C�A�N�C�[��//�C���[�^���v�����Z�X/�C���[�^���N�C�[��
    var VampirePrincess = function(arg){
        Hero.call(this, arg);
        this.cost = 19;
        this.imgSrc.icon = "https://i.gyazo.com/thumb/200/_d4284f5e03b9513e1ba495ce8c59c5e0.png";
    };
    VampirePrincess.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: VampirePrincess
        }
    });
    
    // �o���f�b�g/�o�[�T�[�J�[/�f�X�g���C���[
    var Bandit = function(arg){
        Hero.call(this, arg);
        this.cost = 10;
        this.imgSrc.icon = "http://gyazo.com/78fd1d565172d1129b3acc527ab29f9a.png";
    };
    Bandit.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Bandit
        }
    });

    // ��������/�㋉����
    var DragonSoldger = function(arg){
        Hero.call(this, arg);
        this.cost = 7;
        this.imgSrc.icon = "http://gyazo.com/0cfb2195c5255c8ed3a073656f1e4d62.png";
    };
    DragonSoldger.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: DragonSoldger
        }
    });

    // ����m/�h���S���v�����Z�X
    var DragonWarrior = function(arg){
        Hero.call(this, arg);
        this.imgSrc.icon = "http://gyazo.com/a13a516dc2db7f3038dd933dd966bda4.png";
    };
    DragonWarrior.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: DragonWarrior
        }
    });

    // �T�����C/�T�����C�}�X�^�[/�V���[�O��
    var Samurai = function(arg){
        Hero.call(this, arg);
        this.cost = 14;
        this.imgSrc.icon = "http://i.gyazo.com/8246182e94eff736120d057bf00bfc17.png";
    };
    Samurai.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Samurai
        }
    });

    // �E��/�E�҃}�X�^�[/���E
    var Ninja = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    Ninja.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Ninja
        }
    });

    // �y�K�T�X���C�_�[/�y�K�T�X�i�C�g/�y�K�T�X���[�h
    var PegasusRider = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    PegasusRider.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: PegasusRider
        }
    });
    
    // �_�[�N�t�@�C�^�[/�_�[�N�i�C�g/�p���f�B��
    var DarkFighter = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    DarkFighter.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: DarkFighter
        }
    });
    
    // �A�x���W���[/�f�X�A�x���W���[
    var Avenger = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    Avenger.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Avenger
        }
    });

    // �����N/�}�X�^�[�����N/����
    var Monk = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    Monk.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Monk
        }
    });

    // �O�q��p��/�O�q�R�t/���l�R�t
    var VanguardTactician = function(arg){
        Hero.call(this.arg);
        this.cost = 15;
        this.imgSrc.icon = "http://i.gyazo.com/b8ad470fbcc6397736b2303192375ac1.png";
    };
    VanguardTactician.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: VanguardTactician
        }
    });

    // ���@���m/���[���t�F���T�[/���[�����[�h
    var MagicSwordsman = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    MagicSwordsman.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: MagicSwordsman
        }
    });
    
    // �G���W�F��/�A�[�N�G���W�F��/�h�~�j�I��
    var Angel = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    Angel.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Angel
        }
    });

    // �����g��/�@�b�m
    var PuppetMaster = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    PuppetMaster.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: PuppetMaster
        }
    });
    
    // �Z�[���[/�Z�[���[�`�[�t/�Z�[���[�G���[�g
    var Sailor = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    Sailor.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Sailor
        }
    });
    
    // �d��/�V��
    var Inu = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    Inu.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Inu
        }
    });
    
    // �_����m/�_����m��/�f�B�o�C���A�[�}�[
    var PriestWarrior = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    PriestWarrior.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: PriestWarrior
        }
    });

    // ���C�W�A�[�}�[/�o�g�����C�W/�������Z��
    var MagiArmor = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    MagiArmor.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: MagiArmor
        }
    });
    
    // �h���S�����C�_�[/�h���S���i�C�g
    var DragonRider = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    DragonRider.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: DragonRider
        }
    });
    
    // �{�E���C�_�[/�{�E���C�_�[�`�[�t
    var BowRider = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    BowRider.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: BowRider
        }
    });
    
    // ���C�h
    var Maid = function(arg){
        Hero.call(this.arg);
        this.imgSrc.icon = "";
    };
    Maid.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Maid
        }
    });

    // �������E
    // �A�[�`���[/�X�i�C�p�[/�A���e�~�X
    var Archer = function(arg){
        Hero.call(this, arg);
    };

    // ���C�W/�E�H�[���b�N/�A�[�N���C�W
    var Sorcerer = function(arg){
        Hero.call(this, arg);
    };

    // �q�[���[/�v���[�e�X/�Z�C���g
    var Healer = function(arg){
        Hero.call(this, arg);
    };
    Healer.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Healer
        }
    });

    // �E�B�b�`/���[�h�E�B�b�`/�A�[�N�E�B�b�`
    var Witch = function(arg){
        Hero.call(this, arg);
    };
    Witch.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Witch
        }
    });

    // �p�C���[�c/�L���v�e��/�L���O�I�u�p�C���[�c
    var Pirate = function(arg){
        Hero.call(this, arg);
    };

    // �h���S���V���[�}��
    var DragonShaman = function(arg){
        Hero.call(this, arg);
    };

    // ���@���p�C�A�n���^�[/���@���p�C�A�L���[/�A���f�b�h�L���[
    var VampireHunter = function(arg){
        Hero.call(this, arg);
    };
    
    // �V���[�}��/�n�C�V���[�}��/�V���[�}�����[�h
    var Shaman = function(arg){
        Hero.call(this, arg);
    };
    
    // �r�V���b�v/�n�C�r�V���b�v/�G���_�[�r�V���b�v
    var Bishop = function(arg){
        Hero.call(this, arg);
    };
    
    // �A�z�t/�A�z��
    var Onmyoji = function(arg){
        Hero.call(this, arg);
        this.cost = 19;
        this.imgSrc.icon = "http://i.gyazo.com/bad5c4243564104279acecd18e5e0b5f.png";
    };
    Onmyoji.prototype = Object.create(Hero.prototype, {
        constructor: {
            value: Onmyoji
        }
    });
    
    // ��q��p��/��q�R�t/�Q�d�R�t
    var RearguardTactician = function(arg){
        Hero.call(this, arg);
    };
    
    // �T���i�[
    var Summoner = function(arg){
        Hero.call(this, arg);
    };

    // �����g��/�����m/�������m
    var FengShuiMaster = function(arg){
        Hero.call(this, arg);
    };
    
    // �C�p�m/�d�C�m/�L���m���}�X�^�[
    var GunnaryMaster = function(arg){
        Hero.call(this, arg);
    };

    // �_���T�[/�g�b�v�_���T�[/�X�[�p�[�_���T�[
    var Dancer = function(arg){
        Hero.call(this, arg);
    };
    
    // ������
    var Secretary = function(arg){
        Hero.call(this, arg);
    };
    
    // �l�N���}���T�[
    var Necromancer = function(arg){
        Hero.call(this, arg);
    };
    
    // �N���m�E�B�b�`
    var ChronoWitch = function(arg){
        Hero.call(this, arg);
    };
    // �h���C�h
    var Druid = function(arg){
        Hero.call(this, arg);
    };
    
    // �A���P�~�X�g/�n�C�A���P�~�X�g
    var Alchemist = function(arg){
        Hero.call(this, arg);
    };
    
    // �����W���[/�n�C�����W���[
    var Ranger = function(arg){
        Hero.call(this, arg);
    };

    // �L�������Ƃ̃N���X
    var Arisa = function(arg){
        Healer.call(this, arg);
        this.cost = 17;
        this.imgSrc.icon = "http://gyazo.com/19d1046a16024d685b44dd18d481bb58.png";
    };
    Arisa.prototype = Object.create(Healer.prototype, {
        constructor: {
            value: Arisa
        }
    });
    
    var Nenya = function(arg){
        Witch.call(this, arg);
        this.cost = 9;
        this.imgSrc.unit = "http://i.gyazo.com/b60655ebce95d1522edcce9b4e74a839.png";
        this.imgSrc.icon = "http://i.gyazo.com/06411e6360fdf284b3c6b2ddffb21ed7.png";
    };
    Nenya.prototype = Object.create(Witch.prototype, {
        constructor: {
            value: Nenya
        }
    });
})();
