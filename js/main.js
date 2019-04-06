$(document).ready(function() {
	drawMainMenu();
	// drawCells();
	// startGame();
});

function drawMainMenu() {
	$('.field').remove();
	$('.menu').show();
	$('#1vs1on1').click(function(event) {
		drawCells();
		startGame();
	});
}

function drawCells() {
	$('.menu').hide();
	$('.container').append('<div class="field"></div>');

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

function spawnCheckers(n = 12) {
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

	for (var i = 0; i < n; i++) {
		white[i].append(`<div class = "white"></div>`);
		black[i].append(`<div class = "black"></div>`);
	}
}

function deleteCheckers() {
	$('.white').remove();
	$('.black').remove();
}

function getX() {
	return +$(`.selected`).parent().attr('posX');
}

function getY() {
	return +$(`.selected`).parent().attr('posY');
}

function isWhite(el = $('.selected')) {
	return el.hasClass('white');
}

function isBlack(el = $('.selected')) {
	return el.hasClass('black');
}

function isDamka(el = $('.selected')) {
	if (el.hasClass('damka')) {
		return true;
	} else{
		return false;
	}
}

var gameOn = true;
var turn = 1;
var currColor = false;

function startGame(mode = 1) {
	gameOn = true;
	$('.container').prepend('<h1></h1>');
	turn = 1;
	spawnCheckers();

	run(turn);
}

function run(turn) {
	$('*').unbind();
	$('.selected').removeClass('selected');
	$('.available_to_choose').removeClass('available_to_choose');
	$('.must_to_choose').removeClass('must_to_choose');

	if ($('.white').get(0) == undefined || $('.black').get(0) == undefined) {
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
	if (!SmthHasEnemy()) {
		setPickedPiece();
	}
}

function BlackTurn() {
	$('h1').html('Turn: black');
	$('.black').addClass('available_to_choose');
	currColor = 'black';
	if (!SmthHasEnemy()) {
		setPickedPiece();	
	}
}

function SmthHasEnemy() {
	var arr = $('.available_to_choose').parent(), result = false, a_kill_s = [];

	for (var i = 0; i < arr.length; i++) {
		var x = +arr.eq(i).attr('posX'), y = +arr.eq(i).attr('posY');
		var enemies = getEnemies(x, y, getAllSteps(x, y));

		for (var j = 0; j < enemies.length; j++) {
			var ex = +enemies[j].attr('posX'),
				ey = +enemies[j].attr('posY');
			if (getStepAfterEnemy(x, y, ex, ey) != false) {
				a_kill_s.push(getStepAfterEnemy(x, y, ex, ey));
			}
		}

		if (enemies[0] != undefined && a_kill_s[0] != undefined) {
			result = true;
			a_kill_s = [];

			$(`.available_to_choose`).removeClass('available_to_choose');
			$(`[posX = ${x}][posY = ${y}]`).children().addClass('must_to_choose');
			setPickedPiece();
		}

		if (isDamka(arr.eq(i).children())) {
			var damka_steps = getDamkaSteps(x, y);
			if (damka_steps.length <= 4) {
				$('.available_to_choose').removeClass('available_to_choose');
				$(`[posX = ${x}][posY = ${y}]`).children().addClass('must_to_choose');
			}
		}
	}

	return result;
}

var pickedPiece;

function setPickedPiece() {
	$('.available_to_choose, .must_to_choose').on('click', function(e) {
		$('.selected').removeClass('selected');
		$('.kill').removeClass('kill');
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

function getDamkaSteps(cx, cy) {
	var result = [], state = true, _continue = true;
	var vars = [[1, 1], [-1, -1], [1, -1], [-1, 1]];
	var n = 1, h = 1;

	for (var i = 0; i < vars.length; i++) {
		while (state && _continue) {
			var ax = cx - n * vars[i][0];
			n++;
			var ay = cy - h * vars[i][1];
			h++;
			var thisEl = $(`[posX = ${ax}][posY = ${ay}]`);

			if (thisEl.get(0) == undefined) {
				state = false;
			} else{
				result.push(thisEl);
			}

			if (thisEl.children().get(0) != undefined && !thisEl.children().hasClass(`${currColor}`)) {

				if (getStepAfterEnemy(ax + vars[i][0], ay + vars[i][1], ax, ay)) {
					result = [$(`[posX = ${ax - vars[i][0]}][posY = ${ay - vars[i][1]}]`)];
					_continue = false;
					break;
				}
			}

			if (thisEl.children().get(0) != undefined) {
				result.pop();
				break;
			}
		}

		state = true;
		n = 1; 
		h = 1;
	}

	return result;
}

function getNextStep(cx, cy) {

	if (!isDamka()) {
		var a_damka_s = [],
			a_front_s = getAvailableSteps(cx, cy)[0],
			a_back_s = getAvailableSteps(cx, cy)[1];

		//check for undefined values

		for (var i = a_front_s.length - 1; i >= 0; i--) {
			if (a_front_s[i].get(0) == undefined || a_front_s[i].children().hasClass(`${currColor}`)) {
				a_front_s.splice(i, 1);
			}
		}

		for (var i = a_back_s.length - 1; i >= 0; i--) {
			if (a_back_s[i].get(0) == undefined || a_back_s[i].children().hasClass(`${currColor}`)) {
				a_back_s.splice(i, 1);
			}
		}
	} else{
		var a_damka_s = getDamkaSteps(cx, cy),
			a_front_s = [],
			a_back_s = [];
	}

	//get enemies near the selected piece

	if (!isDamka()) {
		var a_all_s = getAllSteps(cx, cy);
	} else{
		var a_all_s = a_damka_s;
	}
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

	for (var i = a_damka_s.length - 1; i >= 0; i--) {
		for (var j = 0; j < enemies.length; j++) {
			if (a_damka_s[i] != undefined) {
				if (a_damka_s[i].get(0) == enemies[j].get(0)) {
					a_damka_s.splice(i, 1);
				}
			}
		}
	}

	//get steps after the enemy and checking for undefined values

	var a_kill_s = [];
	if (!isDamka()) {
		for (var i = 0; i < enemies.length; i++) {
			var ex = +enemies[i].attr('posX'),
				ey = +enemies[i].attr('posY');
			if (getStepAfterEnemy(cx, cy, ex, ey) != false) {
				a_kill_s.push(getStepAfterEnemy(cx, cy, ex, ey));
			}
		}
	}

	// console.log('ENEMIES');
	// console.log(enemies);
	// console.log('Front steps:');
	// console.log(a_front_s);
	// console.log('Back steps:');
	// console.log(a_back_s);
	// console.log('Damka steps:');
	// console.log(a_damka_s);
	// console.log('\n');

	drawFeatured(a_front_s, a_back_s, a_kill_s, a_damka_s);
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

	if (result != undefined && result.children().get(0) == undefined && result.get(0) != undefined) {
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

function drawFeatured(white, black, kill_steps, damka_steps = []) {
	if (kill_steps[0] == undefined && damka_steps[0] == undefined) {
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

	for (var i = 0; i < damka_steps.length; i++) {
		damka_steps[i].addClass('featured');
	}
}

function setFeaturedClickable() {
	$('.featured').unbind();
	$('.featured').click(function(e) {
		var is_damka = isDamka();
		var is_white = isWhite();
		var is_black = isBlack();


		$('.selected').remove();
		var _continue = stepIn(this, currColor, is_white, is_black, is_damka);
		if (_continue) {
			$('.kill').removeAttr('killX');
			$('.kill').removeAttr('killY');
			$('.kill').removeClass('kill');
			turn++;
			run(turn);
		}
	});
}

function stepIn(el, color, is_white, is_black, is_damka) {
	$('.featured').removeClass('featured');
	var x = +el.getAttribute('posX'),
		y = +el.getAttribute('posY');
	var next = $(`[posX = ${x}][posY = ${y}]`);
	var _continue = true;

	if (is_damka) {
		next.append(`<div class = "${color} damka"></div>`);
	} else{
		next.append(`<div class = "${color}"></div>`);
	}

	if (is_white && y == 8 && !is_damka) {
		next.children().addClass('damka');
	}
	if (is_black && y == 1 && !is_damka) {
		next.children().addClass('damka');
	}

	if (next.hasClass('kill')) {
		var killX = +next.attr('killX'),
			killY = +next.attr('killY');


		$(`[posX = ${killX}][posY = ${killY}]`).empty();

		if (hasMoreAvailableKills(x, y)) { //two kills in one step
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
	if ($('.white').get(0) == undefined) {
		return 'black';
	} 
	else if ($('.black').get(0) == undefined) {
		return 'white';
	} else{
		return 'tie';
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
	var agree = confirm('Start again?');
	setTimeout(() => {
		if (agree) {
			startGame();
		} else{
			drawMainMenu();
		}
	}, 200)
}