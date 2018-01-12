var Local = function() {
    //遊戲對象
    var game;
    //時間間隔
    var INTERVAL = 200;
    //計時器
    var timer = null;
    //時間計數器
    var timeCount = 0;
    //時間
    var time = 0;
    //鍵盤事件
    var bindKeyEvent = function() {
        document.onkeydown = function(e) {
            if (e.keyCode == 38) { //上 (旋轉)
                game.rotate();
            } else if (e.keyCode == 39) { //右
                game.right();
            } else if (e.keyCode == 40) { //下
                game.down();
            } else if (e.keyCode == 37) { //左
                game.left();
            } else if (e.keyCode == 32) { //空白
                game.fall();
            }

        }
    }
    //移動
    var move = function() {
        timeFunc();
        if (!game.down()) {
            //停住
            game.fixed();
            //消除一行
            var line = game.checkClear();
            if (line) {
                game.addScore(line);
            }
            var gameOver = game.checkGameOver();
            if (gameOver) {
                game.gameOver(false);
                stop();
            } else {
                game.performNext(generateType(), generateDir());
            }
        }
    }
    //計時函數
    var timeFunc = function() {
        timeCount = timeCount + 1;
        if (timeCount == 5) {
            timeCount = 0;
            time = time + 1;
            game.setTime(time);
            if (time % 10 == 0) {
                game.addTailLines(generataBottomLine(1));
            }
        }

    }
    //隨機生成干擾行
    var generataBottomLine = function(lineNum) {
        var lines = [];
        for (var i = 0; i < lineNum; i++) {
            var line = [];
            for (var j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1);
                // line.push(1);
            }
            lines.push(line);
        }
        alert(lines);
        return lines;
    }
    //隨機生成一個方塊
    var generateType = function() {
        return Math.ceil(Math.random() * 7) - 1;
    }
    //隨機生成一個旋轉次數
    var generateDir = function() {
        return Math.ceil(Math.random() * 4) - 1;
    }
    //開始
    var start = function() {
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            resultDiv: document.getElementById('local_gameOver')
        }
        game = new Game();
        game.init(doms, generateType(), generateDir());
        bindKeyEvent();
        game.performNext(generateType(), generateDir());
        timer = setInterval(move, INTERVAL);
    }
    //結束
    var stop = function() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;

    }
    //導出api
    this.start = start;
}