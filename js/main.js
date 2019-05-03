$(document).ready(function() {
	drawMainMenu();
});

function drawMainMenu() {
	$('.field').remove();
	$('.menu').show();
	$('#1vs1on1').click(function(event) {
		drawCells();
		startGame(1);
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

///////////////////////////////////////////////////////

function spawnAt(x, y, color) {
	$(`[posX = ${x}][posY = ${y}]`).append(`<div class = '${color}'></div>`);
}

function deleteCheckers() {
	$('.white').remove();
	$('.black').remove();
}

function getX(el = $('.selected')) {
	return +el.parent().attr('posX');
}

function getY(el = $('.selected')) {
	return +el.parent().attr('posY');
}

function isWhite(el = $('.selected')) {
	return el.hasClass('white');
}

function isBlack(el = $('.selected')) {
	return el.hasClass('black');
}

function isDamka(el = $('.selected')) {
	return el.hasClass('damka');
}

function getElementByCoords(x, y) {
	return $(`[posX = ${x}][posY = ${y}]`);
}

function getChild (el) {
	return el.children();
}

function isDefined (smth) {
	return smth !== undefined;
}

function getAllCheckers(color) {
	let result = [];
	for (var i = 0; i < $(`.${color}`).get().length; i++) {
		result.push($(`.${color}`).eq(i));
	}
	return result;
}
///////////////////////////////////////////////


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
	$('.featured').removeClass('featured');
	$('.available_to_choose').removeClass('available_to_choose');
	$('.kill').removeClass('kill');
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

	if (gameOn === false) {
		setWinner();
		setTimeout(endGame, 1500);
	}
}

function WhiteTurn() {
	$('h1').html('Turn: white');
	currColor = 'white';
	if (!SmthHasEnemy()) {
		$('.white').addClass('available_to_choose');
	}
	setPickedPiece();
}

function BlackTurn() {
	$('h1').html('Turn: black');
	currColor = 'black';
	if (!SmthHasEnemy()) {
		$('.black').addClass('available_to_choose');
	}
	setPickedPiece();
}

function SmthHasEnemy() {
	let result = false;
	let checkers = getAllCheckers(currColor);
	let kill = [];

	for (var i = 0; i < checkers.length; i++) {
		let cx = getX(checkers[i]);
		let cy = getY(checkers[i]);

		let enemies = getEnemies(cx, cy, getAllSteps(cx, cy));

		if (isDefined(enemies[0])) {
			for (var j = 0; j < enemies.length; j++) {
				let ex = +enemies[j].attr("posX");
				let ey = +enemies[j].attr("posY");

				if (getStepAfterEnemy(cx, cy, ex, ey)) {
					setPriority(checkers[i]);
					kill.push(getStepAfterEnemy(cx, cy, ex, ey));
					result = true;
				}
			}
		}

		if (isDamka(checkers[i])) {
			let damkaSteps = getDamkaSteps(cx, cy);

			for (var j = 0; j < damkaSteps.length; j++) {
				if (damkaSteps[j].hasClass("must->" + cx + "|" + cy)) {
					damkaSteps[j].removeClass("must->" + cx + "|" + cy);
					setPriority(checkers[i]);
					kill = damkaSteps;
					result = true;
					break;
				}
			}
		}
	}

	return result;
}

function setPriority(el) {
	$('.available_to_choose').removeClass('available_to_choose');
	el.addClass('must_to_choose');
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

function getDamkaSteps(cx, cy, vars = [[1, 1], [-1, 1], [-1, -1], [1, -1]], def = true, prevX, prevY) {
	var result = [], state = true, _continue = true;
	var x_offset = 1, y_offset = 1;

	for (var i = 0; i < vars.length; i++) {
		while (state && _continue) {
			var ax = cx + x_offset * vars[i][0];
			x_offset++;
			var ay = cy + y_offset * vars[i][1];
			y_offset++;
			var thisEl = getElementByCoords(ax, ay);

			if (!isDefined(thisEl.get(0))) {
				state = false;
				break;
			}

			if (isDefined(getChild(thisEl).get(0))) {
				if (getChild(thisEl).hasClass(currColor)) {
					state = false;
					break;
				} else{
					if (getStepAfterEnemy(ax - vars[i][0], ay - vars[i][1], ax, ay) && def) {
						_continue = false;
						let killSteps = getDamkaSteps(ax, ay, [vars[i]], false, cx, cy);
						result = killSteps;
					}
					break;
				}
			}

			if (!def) {
				thisEl.addClass("must->" + prevX + "|" + prevY);
				thisEl.addClass('kill');
				thisEl.attr({
					killX: `${cx}`,
					killY: `${cy}`
				});
			}

			result.push(thisEl);
		}

		state = true;
		x_offset = 1; 
		y_offset = 1;
	}

	return result;
}

function getNextStep(cx, cy) {
	var current = getElementByCoords(cx, cy);
	let front = [], back = [], kill = [], damka = [];

	if (getChild(current).hasClass('damka')) {
		damka = getDamkaSteps(cx, cy);
	} else{
		getNormalSteps(); 
	}


	function getNormalSteps() {
		let frontStepsVars = [[1, 1], [-1, 1]];
		let backStepsVars = [[1, -1], [-1, -1]];

		for (var i = 0; i < 2; i++) {
			let el = getElementByCoords(cx + frontStepsVars[i][0], cy + frontStepsVars[i][1]);
			if (el) {
				front.push(el);

				if (isDefined(getChild(el).get(0))) {
					if (getChild(el).hasClass(currColor)) {
						//it is friend
						front.pop();
					} else{
						//it is enemy
						let enemies = getEnemies(cx, cy, getAllSteps(cx, cy));

						for (var i = 0; i < enemies.length; i++) {
							let ex = +enemies[i].attr("posX");
							let ey = +enemies[i].attr("posY");

							let killStep = getStepAfterEnemy(ex, ey);
							if (killStep) {
								kill.push(killStep);
							} else{
								front.pop();
							}
						}
					}
				}
			}
		}

		for (var i = 0; i < backStepsVars.length; i++) {
			let el = getElementByCoords(cx + backStepsVars[i][0], cy + backStepsVars[i][1]);
			if (el) {
				back.push(el);

				if (isDefined(getChild(el).get(0))) {
					if (getChild(el).hasClass(currColor)) {
						//it is friend
						back.pop();
					} else{
						//it is enemy
						let enemies = getEnemies(cx, cy, getAllSteps(cx, cy));

						for (var i = 0; i < enemies.length; i++) {
							let ex = +enemies[i].attr("posX");
							let ey = +enemies[i].attr("posY");

							let killStep = getStepAfterEnemy(ex, ey);
							if (killStep) {
								kill.push(killStep);
							} else{
								back.pop();
							}
						}
					}
				}
			}
		}
	}




	drawFeatured(front, back, kill, damka);
	setFeaturedClickable();
}

function getEnemies(cx, cy, steps) {
	var result = [];
	var available_enemies = steps;

	for (var i = 0; i < available_enemies.length; i++) {
		var ae = available_enemies[i];
		if (isDefined(getChild(ae).get(0)) && !getChild(ae).hasClass(currColor)) {
			result.push(ae);
		}
	}

	return result;
}

function getStepAfterEnemy(cx, cy , ex, ey, is_damka) {
	if (!ex && !ey) {
		ex = cx;
		ey = cy;
		cx = getX();
		cy = getY();
	}


	var Gresult = false, result;
	if (ey == cy + 1 && ex == cx + 1) { //top right
		result = getElementByCoords(ex + 1, ey + 1);
	}
	else if (ey == cy + 1 && ex == cx - 1) { //top left
		result = getElementByCoords(ex - 1, ey + 1);
	}
	else if (ey == cy - 1 && ex == cx + 1) { //bottom right
		result = getElementByCoords(ex + 1, ey - 1);
	}
	else if (ey == cy - 1 && ex == cx - 1) { //bottom left
		result = getElementByCoords(ex - 1, ey - 1);
	}

	if (isDefined(result) && !isDefined(getChild(result).get(0)) && isDefined(result.get(0))) {
		if (!is_damka) {
			result.addClass('kill');
			result.attr({
				killX: `${ex}`,
				killY: `${ey}`
			});
		}	
		
		Gresult = result;
	}

	return Gresult;
}

function drawFeatured(white, black, kill_steps, damka_steps = []) {
	if (!isDefined(kill_steps[0]) && !isDefined(damka_steps[0])) {
		for (var i = 0; i < white.length; i++) {
			if (isWhite()) {
				white[i].addClass('featured');
			}
		}

		for (var i = 0; i < black.length; i++) {
			if (isBlack()) {
				black[i].addClass('featured');
			}
		}
	} else{
		for (var i = 0; i < kill_steps.length; i++) {
			kill_steps[i].addClass('featured');
		}

		for (var i = 0; i < damka_steps.length; i++) {
			damka_steps[i].addClass('featured');
		}
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
	var next = getElementByCoords(x, y);
	var _continue = true;

	if (is_damka) {
		next.append(`<div class = "${color} damka"></div>`);
	} else{
		next.append(`<div class = "${color}"></div>`);
	}

	if (is_white && y == 8 && !is_damka) {
		getChild(next).addClass('damka');
	}
	if (is_black && y == 1 && !is_damka) {
		getChild(next).addClass('damka');
	}

	if (next.hasClass('kill')) {
		var killX = +next.attr('killX'),
			killY = +next.attr('killY');


		getElementByCoords(killX, killY).empty();

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

			getChild(next).addClass('selected');

			drawFeatured([], [], kill_steps);
			setFeaturedClickable();
		}
	}

	return _continue;
}

function hasMoreAvailableKills(x, y) {
	let result = false;
	var enemies = getEnemies(x, y, getAllSteps(x, y));

	for (var i = 0; i < enemies.length; i++) {
		ex = +enemies[i].attr("posX");
		ey = +enemies[i].attr("posY");
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