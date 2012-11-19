var drawLoopPong;
var $canvasPong;
var canvasObjectPong;
var canvasHeightPong;
var canvasWidthPong;
var contextPong;
var running;
var player1;
var player2;
var player1Score = 0;
var player2Score = 0;
var playerWidth = 5;
var ball;
var INTERVAL = 20; //20ms interval 
var volleyCounter = 0;
var stuckWatcher = 0;
var keys = new Array();
var keyMap = {
    87: 'P1UP',
    83: 'P1DOWN',
    38: 'P2UP',
    40: 'P2DOWN'
    },
    getKey = function(key) {
        return keyMap[(key.which || key.keyCode)] || '';
    };

jQuery(document).ready(function($){
	  initPong();
    setupKeyListeners();
});


function setupKeyListeners() {
    jQuery(document).keydown(function(event) {
        switch (getKey(event)) {
        case 'P1UP':
            event.preventDefault();
            keys['P1UP'] = true;
            break;
        case 'P1DOWN':
            event.preventDefault();
            keys['P1DOWN'] = true;
            break;
        case 'P2UP':
            event.preventDefault();
            keys['P2UP'] = true;
            break;
        case 'P2DOWN':
            event.preventDefault();
            keys['P2DOWN'] = true;
            break;
        default:
            break;
        }
    });

    jQuery(document).keyup(function(event) {
        switch (getKey(event)) {
        case 'P1UP':
            event.preventDefault();
            delete keys['P1UP'];
            break;
        case 'P1DOWN':
            event.preventDefault();
            delete keys['P1DOWN'];
            break;
        case 'P2UP':
            event.preventDefault();
            delete keys['P2UP'];
            break;
        case 'P2DOWN':
            event.preventDefault();
            delete keys['P2DOWN'];
            break;
        default:
            break;
        }
    });
}

function initPong() {
    $canvasPong = jQuery('#pong');
    canvasHeightPong = $canvasPong.height();
    canvasWidthPong = $canvasPong.width();
    canvasObjectPong = $canvasPong.get(0);
    contextPong = canvasObjectPong.getContext('2d');
    initObjects();
    drawPong(true);
	var clicker = jQuery('.out');
	clicker.show();
    clickStart(clicker);

    clicker.click(function() {
        if (!running) {
			clicker.hide();
            running = true;
            drawLoopPong = setInterval(drawPong, INTERVAL);
        }
    });
}

function clickStart(clicker) {
    clicker.toggleClass('in');
    setTimeout(clickStart, 1000);
}

function initObjects() {
    player1 = new PlayerPaddle(75, 5);
    player2 = new PlayerPaddle(75, 495);
    ball = new Ball();
}

/*
* function to redraw the canvas
*/

function drawPong(force) {
    if (running || force) {
        clear(contextPong);
        movePlayers(player1, player2);
        collision(ball, player1, player2);
        redrawPong(contextPong);
    } else {
        clearInterval(drawLoopPong);
        drawLoopPong = 0;
        jQuery('#clickMe').show();
        initObjects();
    }
}

function movePlayers(player1, player2) {
    if (keys['P1UP']) {
        if (player1.yBottom >= 0) {
            player1.yTop -= 5;
            player1.yBottom -= 5;
        }
    }

    if (keys['P1DOWN']) {
        if (player1.yTop <= canvasHeightPong) {
            player1.yTop += 5;
            player1.yBottom += 5;
        }
    }

    if (keys['P2UP']) {
        if (player2.yBottom >= 0) {
            player2.yTop -= 5;
            player2.yBottom -= 5;
        }
    }

    if (keys['P2DOWN']) {
        if (player2.yTop <= canvasHeightPong) {
            player2.yTop += 5;
            player2.yBottom += 5;
        }
    }
}

function collision(ball, player1, player2) {
    if (ball.y < 0) { //Ball is above the canvas (reverse y velocity)
        ball.yV = -ball.yV;
        stuckWatcher++;
    }
    if (ball.y > canvasHeightPong) { //Ball is below the canvas (reverse y velocity)
        ball.yV = -ball.yV;
        stuckWatcher++;
    }
    if (ball.x > player2.x && (ball.y < player2.yBottom && ball.y > player2.yTop)) {
        ball.xV = -ball.xV;
        stuckWatcher = 0;
        volleyCounter++;
    } else if (ball.x > player2.x) {
        running = false;
        player1Score++;
        ball = new Ball();
        stuckWatcher = 0;
        volleyCounter = 0;
    }

    if (ball.x < (player1.x + playerWidth) && (ball.y < player1.yBottom && ball.y > player1.yTop)) {
        ball.xV = -ball.xV;
        stuckWatcher = 0;
        volleyCounter++;
    } else if (ball.x < (player1.x + playerWidth)) {
        running = false;
        player2Score++;
        ball = new Ball();
        stuckWatcher = 0;
        volleyCounter = 0;
    }

    if (ball.xV > 0) {
        ball.x += ball.xV;
    } else {
        ball.x += ball.xV;
    }
    if (ball.y < 0) {
        ball.y += ball.yV;
    } else {
        ball.y += ball.yV;
    }

    if (stuckWatcher > 6) {
        stuckWatcher = 0;
        ball.xV++;
    }
    if (volleyCounter > 10) {
        volleyCounter = 0;
        if (ball.yV > 0) {
            ball.yV = getRandomNumber(ball.velocity);
        } else {
            ball.yV = -getRandomNumber(ball.velocity);
        }
        if (ball.xV > 0) {
            ball.xV = getRandomNumber(ball.velocity);
        } else {
            ball.xV = -getRandomNumber(ball.velocity);
        }
    }
}

function redrawPong(contextPong) {
    contextPong.lineWidth = 1;
    contextPong.fillStyle = 'White';
    contextPong.lineStyle = '#ffff00';
    contextPong.font = '1em sans-serif';
    contextPong.fillText(player1Score + ' : ' + player2Score, (canvasWidthPong / 2) - 9, 20); //display players scores
    contextPong.fillStyle = 'White';
    contextPong.fillRect(player1.x, player1.yTop, playerWidth, player1.height); //X, Y, width, height
    contextPong.fillRect(player2.x, player2.yTop, playerWidth, player2.height); //X, Y, width, height    
    contextPong.beginPath();
    contextPong.fillStyle = 'Yellow';
    contextPong.arc(ball.x, ball.y, 5, 0, 6.28, false);
    contextPong.stroke();
    contextPong.fill();
    contextPong.closePath();
}

function clear(contextPong) {
    contextPong.clearRect(0, 0, canvasWidthPong, canvasHeightPong);
}


function Ball() {
    this.x = getRandomNumber(15) + (canvasWidthPong / 2);
    this.y = getRandomNumber(canvasHeightPong);
    this.velocity = 5;

    if (getLeftOrRight()) { //random start left || right
        this.xV = getRandomNumber(this.velocity); //init x velocity right
    } else {
        this.xV = -getRandomNumber(this.velocity); //init x velocity left
    }

    if (getLeftOrRight()) {
        this.yV = getRandomNumber(this.velocity); //init y velocity down
    } else {
        this.yV = -getRandomNumber(this.velocity); //init y velocity up
    }
}

function getLeftOrRight() {
    if (Math.floor(Math.random() * 2) == 1) {
        return true;
    } else {
        return false;
    }
}

function getRandomNumber(between) {
    return Math.floor(Math.random() * between);
}

function PlayerPaddle(height, x) {
    this.height = height;
    this.yTop = ($canvasPong.height() / 2);
    this.yBottom = this.yTop + this.height;
    this.x = x;
}

