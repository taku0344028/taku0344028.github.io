/**
 * main.js -
 *
 * (C) 2018 Takuya Okubo
 */

let forestlab = {};

(function(ns){
    const Dice = function(n){
	this.n = n;
    };
    Dice.prototype = {
	role: function(){
	    return Math.floor(Math.random() * this.n + 1);
	}
    };

    ns.Tester = function(repeat){
	this.repeat = repeat;
    };
    ns.Tester.prototype = {
	test: function(numDice,n){
	    let sum = 0;
	    for (let i = 0; i < this.repeat; i++) {
		sum += this.run(numDice,n);
	    }
	    return {
		avg: sum / this.repeat
	    };
	},
	run: function(numDice,n){
	    let h = [];
	    let sum = 0;
	    let remDice = numDice;
	    const d = new Dice(n);
	    while (remDice > 0){
		for (let i = 0; i < n; i++) {
		    h[i] = 0;
		}
		for (let i = 0; i < remDice; i++) {
		    let r = d.role();
		    h[r - 1]++;
		    sum += r;
		}
		remDice = 0;
		for (let x in h){
		    if (h[x] < 2) continue;
		    remDice += h[x];
		}
	    }
	    return sum;
	}
    };
})(forestlab);

(function(){
    window.addEventListener("load", function(){
	let tester = new forestlab.Tester(10000);
	const elemNumDice = document.getElementById("numDice");
	const elemDiceType = document.getElementById("diceType");

	document.getElementById("diceForm").onsubmit = function(){
	    let r;
	    const numDice = elemNumDice.value;
	    const diceType = elemDiceType.value;
	    if (diceType <= 0)
		return false;
	    try {
		r = tester.test(numDice, diceType);
	    } catch (e) {
		console.log(e);
		return false;
	    }
	    document.getElementById("avg").innerText = r.avg;
	    return false;
	};
    }, false);
})();

// This file ends here.
