/**
 * main.js -
 *
 * (C) 2018 Takuya Okubo
 */

let forestlab = {};

(function(ns){
    const targetStep = 10;
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
	test: function(numDice,n,t){
	    const target = t;
	    if(numDice == 0 || n == 0)
		return {min: 0, max: 0, mean: 0, median: 0, mode: 0, freq: {}};
	    let min = -1;
	    let max = 0;
	    let sum = 0;
	    let mode = 0;
	    let counter = {"-3": 0, "-2": 0, "-1": 0, "+1": 0, "+2": 0, "+3": 0};
	    let h = {};
	    for (let i = 0; i < this.repeat; i++) {
		let r = this.run(numDice,n); 
		if (h[r] == undefined)
		    h[r] = 0;
		h[r]++;
		sum += r;
		if (r > max)
		    max = r;
		if (min == -1 || min > r)
		    min = r;
		if (mode == 0 || (mode != r && h[mode] < h[r]))
		    mode = r;
		if (r < target){
		    counter["-1"]++;
		    if (r < target - targetStep)
			counter["-2"]++;
		    if (r < target - targetStep * 2)
			counter["-3"]++;
		}
		else {
		    counter["+1"]++;
		    if (r >= target + targetStep)
			counter["+2"]++;
		    if (r >= target + targetStep * 2)
			counter["+3"]++;
		}
	    }
	    let k = 0;
	    let v = 0;
	    let median = 0;
	    let freqRatio = [];
	    while (k < this.repeat){
		v++;
		if (h[v] == undefined)
		    continue;
		if (k < this.repeat / 2)
		    median = v;
		k += h[v];
		freqRatio[v] = k / this.repeat;
	    }
	    for (let k in counter) {
		counter[k] = counter[k] * 100 / this.repeat;
	    }
	    return {
		min: min,
		max: max,
		mode: mode,
		median: median,
		mean: Math.round(sum * 100 / this.repeat) / 100,
		freq: h,
		freqRatio: freqRatio,
		success: counter
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
	const elemTarget = document.getElementById("target");
	const calcStart = function(){
	    let r;
	    const numDice = elemNumDice.value;
	    const diceType = elemDiceType.value;
	    const target = parseInt(elemTarget.value);
	    if (diceType <= 0)
		return false;
	    try {
		r = tester.test(numDice, diceType, target);
	    } catch (e) {
		console.log(e);
		return false;
	    }
	    document.getElementById("min").innerText = r.min;
	    document.getElementById("max").innerText = r.max;
	    document.getElementById("mean").innerText = r.mean;
	    document.getElementById("median").innerText = r.median;
	    document.getElementById("mode").innerText = r.mode;
	
	    document.getElementById("success1").innerText = r.success["+1"];
	    document.getElementById("success2").innerText = r.success["+2"];
	    document.getElementById("success3").innerText = r.success["+3"];
	    document.getElementById("failure1").innerText = r.success["-1"];
	    document.getElementById("failure2").innerText = r.success["-2"];
	    document.getElementById("failure3").innerText = r.success["-3"];

	    tableData = new google.visualization.DataTable();
	    
	    tableData.addColumn("number", "x");
	    tableData.addColumn("number", "v");

	    /*
	     for (let n in r.freq) {
	     tableData.addRow([parseInt(n), r.freq[n]]);
	     }
	     */
	    for (let n in r.freqRatio) {
		tableData.addRow([parseInt(n), r.freqRatio[n]]);
	    }

	    //let options = {title: "title", height: 300, width:400};
	    let options = {
		vAxis: {
		    format: "percent"
		},
		curveType: "function",
		animation: {
		    duration: 500,
		    easing: "out"
		}
	    };
            chart.draw(tableData, options);

	    return false;
	};

	// Load the Visualization API and the corechart package.
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(function(){
            // Instantiate and draw our chart, passing in some options.
            chart = new google.visualization.LineChart(document.getElementById('chart'));
	});

	document.getElementById("execButton").onclick = calcStart;
    }, false);
})();

// This file ends here.
