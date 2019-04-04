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
	turn = 1;
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
		$('.selected').removeClass('selected');
		$('.featured').unbind();
		$('.featured').removeClass('featured');
		$(this).addClass('selected');
		getNextStep(getX(), getY());
		pickedPiece = this;
	});
}

function getAvailableSteps(cx, cy) {
	return [[$(`[posX = ${cx + 1}][posY = ${cy + 1}]`), $(`[posX = ${cx - 1}][posY = ${cy + 1}]`)], 
			[$(`[posX = ${cx + 1}][posY = ${cy - 1}]`), $(`[posX = ${cx - 1}][posY = ${cy - 1}]`)]];
}

function getAllSteps(cx, cy) {
	return getAvailableSteps(cx, cy)[0].concat(getAvailableSteps(cx, cy)[1]);
}

function getNextStep(cx, cy) {

	var a_front_s = getAvailableSteps(cx, cy)[0],
		a_back_s = getAvailableSteps(cx, cy)[1];

	//check for undefined values

	var color = currColor;

	for (var i = a_front_s.length - 1; i >= 0; i--) {
		if (a_front_s[i].length == 0 || a_front_s[i].children().hasClass(`${color}`)) {
			a_front_s.splice(i, 1);
		}
	}

	for (var i = a_back_s.length - 1; i >= 0; i--) {
		if (a_back_s[i].length == 0 || a_back_s[i].children().hasClass(`${color}`)) {
			a_back_s.splice(i, 1);
		}
	}

	//get enemies near the selected piece

	var a_all_s = getAllSteps(cx, cy);

	var enemies = getEnemies(cx, cy, a_all_s);


	//delete featured cells on the enemy position

	for (var i = a_front_s.length - 1; i >= 0; i--) {
		for (var j = 0; j < enemies.length; j++) {
			if (a_front_s[i] != undefined) {
				if (a_front_s[i].get(0) == enemies[j].get(0)) {
					a_front_s.splice(i, 1);
				}
			}
		}
	}

	for (var i = a_back_s.length - 1; i >= 0; i--) {
		for (var j = 0; j < enemies.length; j++) {
			if (a_back_s[i] != undefined) {
				if (a_back_s[i].get(0) == enemies[j].get(0)) {
					a_back_s.splice(i, 1);
				}
			}
		}
	}

	//get steps after the enemy and checking for undefined values

	var a_kill_s = [];
	for (var i = 0; i < enemies.length; i++) {
		var ex = +enemies[i].attr('posX'),
			ey = +enemies[i].attr('posY');
		if (getStepAfterEnemy(cx, cy, ex, ey) != false) {
			a_kill_s.push(getStepAfterEnemy(cx, cy, ex, ey));
		}
	}

	// console.log('ENEMIES');
	// console.log(enemies);
	// console.log('Front steps:');
	// console.log(a_front_s);
	// console.log('Back steps:');
	// console.log(a_back_s);
	// console.log('\n');

	drawFeatured(a_front_s, a_back_s, a_kill_s);
	setFeaturedClickable();
}

function getEnemies(cx, cy, steps) {
	var result = [];
	var available_enemies = steps;

	for (var i = 0; i < available_enemies.length; i++) {
		var ae = available_enemies[i];
		if (ae.children()[0] != undefined && !ae.children('div').hasClass(`${currColor}`)) {
			result.push(ae);
		}
	}

	return result;
}

function getStepAfterEnemy(cx, cy, ex, ey) {
	if (ey == cy + 1 && ex == cx + 1) { //top right
		var result = $(`[posX = ${ex + 1}][posY = ${ey + 1}]`);
	}
	else if (ey == cy + 1 && ex == cx - 1) { //top left
		var result = $(`[posX = ${ex - 1}][posY = ${ey + 1}]`);
		
	}
	else if (ey == cy - 1 && ex == cx + 1) { //bottom right
		var result = $(`[posX = ${ex + 1}][posY = ${ey - 1}]`);
	}
	else if (ey == cy - 1 && ex == cx - 1) { //bottom left
		var result = $(`[posX = ${ex - 1}][posY = ${ey - 1}]`);
	}

	if (result.children().get(0) == undefined && result.get(0) != undefined) {
		result.addClass('kill');
		result.attr({
			killX: `${ex}`,
			killY: `${ey}`
		});
		return result;
	} else{
		return false;
	}
}

function drawFeatured(white, black, kill_steps) {
	if (kill_steps[0] == undefined) {
		for (var i = 0; i < white.length; i++) {
			if (isWhite($('.selected'))) {
				white[i].addClass('featured');
			}
		}

		for (var i = 0; i < black.length; i++) {
			if (isBlack($('.selected'))) {
				black[i].addClass('featured');
			}
		}
	}
	
	for (var i = 0; i < kill_steps.length; i++) {
		kill_steps[i].addClass('featured');
	}
}

function setFeaturedClickable() {
	$('.featured').unbind();
	$('.featured').click(function(e) {
		$('.selected').remove();
		var _continue = stepIn(this, currColor);
		if (_continue) {
			$('.kill').removeAttr('killX');
			$('.kill').removeAttr('killY');
			$('.kill').removeClass('kill');
			turn++;
			run(turn);
		}
	});
}

function stepIn(el, color) {
	$('.featured').removeClass('featured');
	var x = +el.getAttribute('posX'),
		y = +el.getAttribute('posY');
	var next = $(`[posX = ${x}][posY = ${y}]`);
	var _continue = true;
	next.append(`<div class = "${color}"></div>`);

	if (next.hasClass('kill')) {
		var killX = +next.attr('killX'),
			killY = +next.attr('killY');
		$(`[posX = ${killX}][posY = ${killY}]`).empty();

		if (hasMoreAvailableKills(x, y)) {
			var enemies = getEnemies(x, y, getAllSteps(x, y)), kill_steps = [];

			_continue = false;

			for (var i = 0; i < enemies.length; i++) {
				var ex = +enemies[i].attr('posX'),
					ey = +enemies[i].attr('posY');
				if (getStepAfterEnemy(x, y, ex, ey)) {
					kill_steps.push(getStepAfterEnemy(x, y, ex, ey));
				}
			}

			$('.available_to_choose').unbind();

			next.children().addClass('selected');

			drawFeatured([], [], kill_steps);
			setFeaturedClickable();
		}
	}

	return _continue;
}

function hasMoreAvailableKills(x, y) {
	var enemies = getEnemies(x, y, getAllSteps(x, y));
	var result = false;

	for (var i = 0; i < enemies.length; i++) {
		var ex = +enemies[i].attr('posX'),
			ey = +enemies[i].attr('posY');
		if (getStepAfterEnemy(x, y, ex, ey)) {
			result = true;
		}
	}

	return result;
}

function getWinner() {
	if ($('.white').eq(0).get(0) == undefined) {
		return 'black';
	} else if ($('.black').eq(0).get(0) == undefined) {
		return 'white';
	}
}

function setWinner() {
	var winner = getWinner();
	$('h1').html(`<b>Winner: </b>${winner}`);
}

function endGame() {
	$('.white').remove();
	$('.black').remove();
	$('h1').remove();
	$('*').unbind();
	console.log('Game ended');
	turn = 1;
	setTimeout(() => {
		if (confirm('Start again?')) {
			startGame();
		}
	}, 200)
}