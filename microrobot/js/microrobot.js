/******************************************************************************
 * microrobot.js - Micro Robot Game
 *
 * Time-stamp: <Fri Mar 25 19:11:04 2016>
 *
 * (C) 2016 Takuya Okubo
 ******************************************************************************/

var MicroRobot = MicroRobot || {};

(function(ns){
    // public class
    ns.Board = function(){};
    ns.Board.prototype.initialize = function() {
    };

    ns.BoardWriter = function(cvs) {
	this.cvs = cvs;
	this.ctx = cvs.getContext("2d");
    };

    ns.BoardWriter.prototype.write = function(board) {
    };

})(MicroRobot);

// This file ends here.
