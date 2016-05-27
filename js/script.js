var black;
var over;
var isNewGame = false;

var chessBoard = [];
/*赢法数组*/
var wins = [];
/*多少种赢法*/
var count;
/*赢法统计数组*/
var blackWin = [];
var whiteWin = [];

var chess;
var context;

var $ = function (id) {
  return document.getElementById(id);
}

var draw = function () {
  var logo = new Image();
  logo.src = 'images/logo.png';
  logo.onload = function () {
    context.drawImage(logo, 0, 0, 450, 450);
    drawChessBoard();
  }
}

var drawChessBoard = function () {
  context.strokeStyle = "#bfbfbf";
  for (var i = 0; i < 15; i++) {
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
  }
};

var oneStep = function (i, j, black) {
  context.beginPath();
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();

  var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
  if (black) {
    gradient.addColorStop(0, "#0A0A0A");
    gradient.addColorStop(1, "#636766");
  } else {
    gradient.addColorStop(0, "#D1D1D1");
    gradient.addColorStop(1, "#F9F9F9");
  }
  context.fillStyle = gradient;
  context.fill();
}

var newGame = function () {
  black = true;
  over = false;
  chessBoard = [];

  //赢法数组
  wins = [];
  //赢法统计数组
  blackWin = [];
  whiteWin = [];

  chess = null;
  context = null;

  $("box").innerHTML = '<canvas id="chess" width="450" height="450"></canvas>';
  chess = document.getElementById("chess");
  context = chess.getContext("2d");

  /*初始化棋盘数据*/
  for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (var j = 0; j < 15; j++) {
      chessBoard[i][j] = 0;
    }
  }

  /*初始化赢法数据*/
  for (var i = 0; i < 15; i++) {
    wins[i] = []
    for (var j = 0; j < 15; j++) {
      wins[i][j] = [];
    }
  }

  /*计算有多少种赢法*/
  count = 0;
  for (var i = 0; i < 15; i++) {//横线五子
    for (var j = 0; j < 11; j++) {
      for (var k = 0; k < 5; k++) {
        wins[i][j + k][count] = true;
      }
      count++;
    }
  }
  for (var i = 0; i < 11; i++) {//竖线五子
    for (var j = 0; j < 15; j++) {
      for (var k = 0; k < 5; k++) {
        wins[i + k][j][count] = true;
      }
      count++;
    }
  }
  for (var i = 0; i < 11; i++) {//斜线(\)五子
    for (var j = 0; j < 11; j++) {
      for (var k = 0; k < 5; k++) {
        wins[i + k][j + k][count] = true;
      }
      count++;
    }
  }
  for (var i = 0; i < 11; i++) {//斜线(/)五子
    for (var j = 14; j > 3; j--) {
      for (var k = 0; k < 5; k++) {
        wins[i + k][j - k][count] = true;
      }
      count++;
    }
  }

  /*初始化每一种赢法*/
  for (var i = 0; i < count; i++) {
    blackWin[i] = 0;
    whiteWin[i] = 0;
  }

  chess.onclick = function (e) {
    myClick(e);
  }
}

var gameOver = function (black) {
  over = true;
  var a;
  if (black) {
    a = confirm("你赢了，是否重新开始");
  } else {
    a = confirm("电脑赢了，是否重新开始");
  }
  if (a) {
    setTimeout(function () {
      newGame();
      draw();
    }, 200);
  }
};

var computerAI = function () {
  var blackScore = [];
  var whiteScore = [];
  var max = 0;
  var u = 0, v = 0;

  /*棋盘每个点得分归零*/
  for (var i = 0; i < 15; i++) {
    blackScore[i] = [];
    whiteScore[i] = [];
    for (var j = 0; j < 15; j++) {
      blackScore[i][j] = 0;
      whiteScore[i][j] = 0;
    }
  }

  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      if (chessBoard[i][j] == 0) {
        for (var k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            switch (blackWin[k]) {
              case 1:
                blackScore[i][j] += 200;
                break;
              case 2:
                blackScore[i][j] += 500;
                break;
              case 3:
                blackScore[i][j] += 2000;
                break;
              case 4:
                blackScore[i][j] += 10000;
                break;
            }

            switch (whiteWin[k]) {
              case 1:
                whiteScore[i][j] += 220;
                break;
              case 2:
                whiteScore[i][j] += 520;
                break;
              case 3:
                whiteScore[i][j] += 2200;
                break;
              case 4:
                whiteScore[i][j] += 20000;
                break;
            }
          }
        }

        if (blackScore[i][j] > max) {
          max = blackScore[i][j];
          u = i;
          v = j;
        }else if (blackScore[i][j] == max) {
          if (whiteScore[i][j] > whiteScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if (whiteScore[i][j] > max) {
          max = whiteScore[i][j];
          u = i;
          v = j;
        }else if (whiteScore[i][j] == max) {
          if (blackScore[i][j] > blackScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }

  oneStep(u, v, false);
  chessBoard[u][v] = 2;
  for (var k = 0; k < count; k++) {
    if (wins[u][v][k]) {
      whiteWin[k]++;
      blackWin[k] = 6;
      if (whiteWin[k] == 5) {
        gameOver(black);
      }
    }
  }

  if (!over) {
    black = !black;
  }
}

window.onload = function () {
  newGame();
  draw();
};

function myClick(e) {
  if (over || !black) return;
  var i = Math.floor(e.offsetX / 30);
  var j = Math.floor(e.offsetY / 30);
  if (chessBoard[i][j] != 0) return;
  oneStep(i, j, black);
  chessBoard[i][j] = 1;
  for (var k = 0; k < count; k++) {
    if (wins[i][j][k]) {
      blackWin[k]++;
      whiteWin[k] = 6;
      if (blackWin[k] == 5) {
        gameOver(black);
      }
    }
  }
  if (!over) {
    black = !black;
    computerAI();
  }
}

$("new-btn").onclick = function(){
  var a = confirm("是否重新开始");
  if (a) {
    black = true;
    newGame();
    draw();
  }
}

