/**
 * (C) 2015 Takuya Okubo
 */

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
    costUp: function(){
	if(!this.costMax || this.cost < this.costMax){this.cost++}
    },
    costDown: function(){
	if(this.cost > 1){this.cost--}
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
        ctx.font = "" + fontSize + "px bold '" + g_font + "'";
        ctx.strokeStyle = "white";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.lineWidth = 1;
        ctx.strokeText("Lv." + this.lv, x + w * 0.05, y + h * 0.85);
        ctx.fillText("Lv." + this.lv, x + w * 0.05, y + h * 0.85);
        ctx.strokeText("コスト：", x + w * 0.05, y + h * 0.15);
        ctx.fillText("コスト：", x + w * 0.05, y + h * 0.15);
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

// 職業ごとの基礎クラス
// 近接職
// ソルジャー/ソルジャーチーフ/ソルジャーエリート
var Soldger = function(arg){
    Hero.call(this, arg);
};
Soldger.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Soldger
    }
});

// ヘビーアーマー/バトルマスター/ギガントアーマー
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

// ワルキューレ/ユニコーンナイト/ブリュンヒルデ
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

// ローグ/アサシン/マスターアサシン
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

// プリンセス/ハイプリンセス
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

// ヴァンパイアプリンセス/ヴァンパイアクイーン//イモータルプリンセス/イモータルクイーン
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

// バンデット/バーサーカー/デストロイヤー
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

// 中級竜兵/上級竜兵
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

// 竜戦士/ドラゴンプリンセス
var DragonWarrior = function(arg){
    Hero.call(this, arg);
    this.imgSrc.icon = "http://gyazo.com/a13a516dc2db7f3038dd933dd966bda4.png";
};
DragonWarrior.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: DragonWarrior
    }
});

// サムライ/サムライマスター/ショーグン
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

// 忍者/忍者マスター/超忍
var Ninja = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
Ninja.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Ninja
    }
});

// ペガサスライダー/ペガサスナイト/ペガサスロード
var PegasusRider = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
PegasusRider.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: PegasusRider
    }
});

// ダークファイター/ダークナイト/パラディン
var DarkFighter = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
DarkFighter.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: DarkFighter
    }
});

// アベンジャー/デスアベンジャー
var Avenger = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
Avenger.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Avenger
    }
});

// モンク/マスターモンク/拳聖
var Monk = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
Monk.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Monk
    }
});

// 前衛戦術家/前衛軍師/武人軍師
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

// 魔法剣士/ルーンフェンサー/ルーンロード
var MagicSwordsman = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
MagicSwordsman.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: MagicSwordsman
    }
});

// エンジェル/アークエンジェル/ドミニオン
var Angel = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
Angel.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Angel
    }
});

// くぐつ使い/機甲士
var PuppetMaster = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
PuppetMaster.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: PuppetMaster
    }
});

// セーラー/セーラーチーフ/セーラーエリート
var Sailor = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
Sailor.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Sailor
    }
});

// 妖狐/天狐
var Inu = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
Inu.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Inu
    }
});

// 神官戦士/神官戦士長/ディバインアーマー
var PriestWarrior = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
PriestWarrior.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: PriestWarrior
    }
});

// メイジアーマー/バトルメイジ/超魔導鎧将
var MagiArmor = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
MagiArmor.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: MagiArmor
    }
});

// ドラゴンライダー/ドラゴンナイト
var DragonRider = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
DragonRider.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: DragonRider
    }
});

// ボウライダー/ボウライダーチーフ
var BowRider = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
BowRider.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: BowRider
    }
});

// メイド
var Maid = function(arg){
    Hero.call(this.arg);
    this.imgSrc.icon = "";
};
Maid.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Maid
    }
});

// 遠距離職
// アーチャー/スナイパー/アルテミス
var Archer = function(arg){
    Hero.call(this, arg);
};

// メイジ/ウォーロック/アークメイジ
var Sorcerer = function(arg){
    Hero.call(this, arg);
};

// ヒーラー/プリーテス/セイント
var Healer = function(arg){
    Hero.call(this, arg);
};
Healer.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Healer
    }
});

// ウィッチ/ロードウィッチ/アークウィッチ
var Witch = function(arg){
    Hero.call(this, arg);
};
Witch.prototype = Object.create(Hero.prototype, {
    constructor: {
        value: Witch
    }
});

// パイレーツ/キャプテン/キングオブパイレーツ
var Pirate = function(arg){
    Hero.call(this, arg);
};

// ドラゴンシャーマン
var DragonShaman = function(arg){
    Hero.call(this, arg);
};

// ヴァンパイアハンター/ヴァンパイアキラー/アンデッドキラー
var VampireHunter = function(arg){
    Hero.call(this, arg);
};

// シャーマン/ハイシャーマン/シャーマンロード
var Shaman = function(arg){
    Hero.call(this, arg);
};

// ビショップ/ハイビショップ/エルダービショップ
var Bishop = function(arg){
    Hero.call(this, arg);
};

// 陰陽師/陰陽頭
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

// 後衛戦術家/後衛軍師/参謀軍師
var RearguardTactician = function(arg){
    Hero.call(this, arg);
};

// サモナー
var Summoner = function(arg){
    Hero.call(this, arg);
};

// 風水使い/風水士/風水導士
var FengShuiMaster = function(arg){
    Hero.call(this, arg);
};

// 砲術士/重砲士/キャノンマスター
var GunnaryMaster = function(arg){
    Hero.call(this, arg);
};

// ダンサー/トップダンサー/スーパーダンサー
var Dancer = function(arg){
    Hero.call(this, arg);
};

// 政務官
var Secretary = function(arg){
    Hero.call(this, arg);
};

// ネクロマンサー
var Necromancer = function(arg){
    Hero.call(this, arg);
};

// クロノウィッチ
var ChronoWitch = function(arg){
    Hero.call(this, arg);
};
// ドルイド
var Druid = function(arg){
    Hero.call(this, arg);
};

// アルケミスト/ハイアルケミスト
var Alchemist = function(arg){
    Hero.call(this, arg);
};

// レンジャー/ハイレンジャー
var Ranger = function(arg){
    Hero.call(this, arg);
};

// キャラごとのクラス
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
