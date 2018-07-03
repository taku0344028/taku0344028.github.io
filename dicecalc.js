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
	    let h = {};
	    for (let i = 0; i < this.repeat; i++) {
		let r = this.run(numDice,n); 
		if (h[r] == undefined)
		    h[r] = 0;
		h[r]++;
		sum += r;
	    }
	    return {
		avg: sum / this.repeat,
		freq: h
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
	let tester = new forestlab.Tester(100000);
	let tableData;
	let chart;
	const elemNumDice = document.getElementById("numDice");
	const elemDiceType = document.getElementById("diceType");
	const calcStart = function(){
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
	    tableData = new google.visualization.DataTable();
	    
	    tableData.addColumn("number", "x");
	    tableData.addColumn("number", "v");

	    for (let n in r.freq) {
		tableData.addRow([parseInt(n), r.freq[n]]);
	    }
	    
	    //let options = {title: "title", height: 300, width:400};
	    let options = {};
            chart.draw(tableData, options);

	    return false;
	};

	// Load the Visualization API and the corechart package.
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(function(){
            // Instantiate and draw our chart, passing in some options.
            chart = new google.visualization.AreaChart(document.getElementById('chart'));
	});

	document.getElementById("execButton").onclick = calcStart;
    }, false);
})();

// This file ends here.
