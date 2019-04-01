$(document).ready(function() {
	drawCells();
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

function getX() {
	return +$(`.selected`).parent().attr('posX');
}

function getY() {
	return +$(`.selected`).parent().attr('posY');
}

function isWhite(el) {
	return el.hasClass('white');
}

function isBlack(el) {
	return el.hasClass('black');
}

var gameOn = true;
var turn = 1;
var currColor = false;

function startGame() {
	spawnCheckers();
	$('.container').prepend('<h1></h1>');

	run(turn);
}

function run(turn) {
	$('*').unbind();
	$('.selected').removeClass('selected');
	$('.available_to_choose').removeClass('available_to_choose');

	if ($('.white').eq(0)[0] == undefined || $('.black').eq(0)[0] == undefined) {
		gameOn = false;
	} else{
		if (turn % 2 != 0) {
			WhiteTurn();
		} else{
			BlackTurn();
		}
	}

	if (gameOn == false) {
		setWinner();
		setTimeout(endGame, 2000);
	}
}

function WhiteTurn() {
	$('h1').html('Turn: white');
	$('.white').addClass('available_to_choose');
	currColor = 'white';

	setPickedPiece();
}

function BlackTurn() {
	$('h1').html('Turn: black');
	$('.black').addClass('available_to_choose');
	currColor = 'black';

	setPickedPiece();	
}

var pickedPiece;

function setPickedPiece() {
	$('.available_to_choose').on('click', function(e) {
		$('.selected').removeClass('selected')
		$('.featured').removeClass('featured');
		$(this).addClass('selected');
		getNextStep(getX(), getY());
		pickedPiece = this;
	});
}

function getNextStep(cx, cy) {
	var a_white_s = [$(`[posX = ${cx + 1}][posY = ${cy + 1}]`), $(`[posX = ${cx - 1}][posY = ${cy + 1}]`)],
		a_black_s = [$(`[posX = ${cx + 1}][posY = ${cy - 1}]`), $(`[posX = ${cx - 1}][posY = ${cy - 1}]`)];

	for (var i = 1; i >= 0; i--) {
		if (a_white_s[i] == undefined || a_white_s[i].children('div').hasClass('white')) {
			a_white_s.splice(i, 1);
		} else{
			if (isWhite($('.selected'))) {
				a_white_s[i].addClass('featured');
			}
		}

		if (a_black_s[i] == undefined || a_black_s[i].children('div').hasClass('black')) {
			a_black_s.splice(i, 1);
		} else{
			if (isBlack($('.selected'))) {
				a_black_s[i].addClass('featured');
			}
		}
		if (currColor == 'white') {
			if (a_white_s[i].children() != undefined && a_white_s[i].children().hasClass('black')) {
				var enemyX = +a_white_s[i].attr('posX'),
					enemyY = +a_white_s[i].attr('posY');
				console.log(`ENEMY: ${enemyX}  ${enemyY}`)
			}
		} else{
			if (a_black_s[i].children() != undefined && a_black_s[i].children().hasClass('white')) {
				var enemyX = +a_black_s[i].attr('posX'),
					enemyY = +a_black_s[i].attr('posY');
				console.log(`ENEMY: ${enemyX}  ${enemyY}`)
			}
		}
	}

	setFeaturedClickable();
}

function setFeaturedClickable() {
	$('.featured').unbind();
	$('.featured').click(function(e) {
		$('.selected').remove();
		stepIn(this, currColor);
		turn++;
		run(turn);
	});
}

function stepIn(el, color) {
	$('.featured').removeClass('featured');
	var x = +el.getAttribute('posX'),
		y = +el.getAttribute('posY');
	var next = $(`[posX = ${x}][posY = ${y}]`);
	if (next[0] != undefined) {
		next.empty();
	}
	next.append(`<div class = "${color}"></div>`);
}

function getWinner() {
	if ($('.white').eq(0)[0] == undefined) {
		return 'black';
	} else if ($('.black').eq(0)[0] == undefined) {
		return 'white';
	}
}

function setWinner() {
	var winner = getWinner();
	$('h1').html(`<b>Winner:</b>${winner}`);
}

function endGame() {
	$('.white').remove();
	$('.black').remove();
	$('h1').remove();
	$('*').unbind();
	console.log('Game ended');
}