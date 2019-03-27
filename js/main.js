$(document).ready(function() {
	drawCells();
	spawnCheckers();
	startGame();
});

function drawCells() {
	var n = 100, //num of cells
		letter = ["A", "B", "C", "D", "E", "F", "G", "H"];

	$('.field').append(`<div class = "borderless"></div>`);
	for (var i = 0; i < 8; i++) {
		$('.field').append(`<div class = "borderless">${letter[i]}</div>`);
	}
	$('.field').append(`<div class = "borderless"></div>`);

	for (var i = 8; i >= 1; i--) {
		$('.field').append(`<div class = "borderless">${i}</div>`);
		for (var j = 1; j < 9; j++) {
			$('.field').append(`<div class = "cell" posX = ${j} posY = ${i}></div>`);
			if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0)) {
				$('.cell').last().css('backgroundColor', '#988177');
			} else{
				$('.cell').last().css('backgroundColor', 'rgb(255, 248, 220)');
			}
		}
		$('.field').append(`<div class = "borderless">${i}</div>`);
	}

	$('.field').append(`<div class = "borderless"></div>`);
	for (var i = 0; i < 8; i++) {
		$('.field').append(`<div class = "borderless">${letter[i]}</div>`);
	}
	$('.field').append(`<div class = "borderless"></div>`);
}

function spawnCheckers() {
	var white = [
	$('[posX = 1][posY = 1]'),
	$('[posX = 3][posY = 1]'),
	$('[posX = 5][posY = 1]'),
	$('[posX = 7][posY = 1]'),
	$('[posX = 2][posY = 2]'),
	$('[posX = 4][posY = 2]'),
	$('[posX = 6][posY = 2]'),
	$('[posX = 8][posY = 2]'),
	$('[posX = 1][posY = 3]'),
	$('[posX = 3][posY = 3]'),
	$('[posX = 5][posY = 3]'),
	$('[posX = 7][posY = 3]')],
		black = [
	$('[posX = 2][posY = 6]'),
	$('[posX = 4][posY = 6]'),
	$('[posX = 6][posY = 6]'),
	$('[posX = 8][posY = 6]'),
	$('[posX = 1][posY = 7]'),
	$('[posX = 3][posY = 7]'),
	$('[posX = 5][posY = 7]'),
	$('[posX = 7][posY = 7]'),
	$('[posX = 2][posY = 8]'),
	$('[posX = 4][posY = 8]'),
	$('[posX = 6][posY = 8]'),
	$('[posX = 8][posY = 8]')];

	for (var i = 0; i < 12; i++) {
		white[i].append(`<div class = "white"></div>`);
		black[i].append(`<div class = "black"></div>`);
	}
}

function getX(el) {
	 return +el.parent().attr('posX');
}

function getY(el) {
	 return +el.parent().attr('posY');
}


function startGame() {
	var turn = 1;
	$('.container').prepend('<h1></h1>');
	var gameOn = true;

	if ($('.white').eq(0)[0] == undefined || $('.black').eq(0)[0] == undefined) {
		gameOn = false;
	}

	run(turn);

	function run(turn) {
		if (turn % 2 != 0) {
			$('h1').html('White turn');
		} else{
			$('h1').html('Black turn');
		} 
	}
}