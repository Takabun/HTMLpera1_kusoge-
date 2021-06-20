//ゴール位置の座標を算出
goal_y = squaresize * (h - 1);
goal_x = squaresize * (w -2);

var startDate, cnt, intID;
var startElm, gameElm, successElm, mistakeElm;

window.onload = function(){
    gameElm = document.getElementById("game");
    successElm = document.getElementById("success");
    mistakeElm = document.getElementById("mistake");
};

function gameStart(){
    gameElm.style.display = "block";
    startDate = new Date();
    // window.onkeydown = getRemainCount;
    intID = setInterval("getRemainTime()", 20);
    addEventListener("keydown", keydownfunc, false);
	addEventListener("keyup", keyupfunc, false);
}

function getRemainTime(){
    var nowDate = new Date()
    var ms = 60000 - (nowDate.getTime()-startDate.getTime());
    document.getElementById("keke").innerText
        = (ms/1000).toFixed(1);
    if(ms <= 0){
        // gameElm.style.display = "none";
        // mistakeElm.style.display = "block";
        $('.layer_board_bg').fadeIn(800);	
        $('.layer_board_failure').fadeIn(800);
        window.onkeydown = null;
        clearInterval(intID);
    }
    //ゴール判定
    if(rico.x == goal_x  && rico.y == goal_y){
        // gameElm.style.display = "none";
        // successElm.style.display = "block";
        $('.layer_board_bg').fadeIn(800);	
        $('.layer_board_success').fadeIn(800);
        window.onkeydown = null;
        clearInterval(intID);
        disablemovement();
    }

    //落とし穴
    for (var i = 0; i < otoshianas.length; i++ ) {
      if (rico.y == otoshianas[i].y && rico.x == otoshianas[i].x) {
        // rico.hide();
        // gameElm.style.display = "none";
        // mistakeElm.style.display = "block";
        $('.layer_board_bg').fadeIn(800);	
        $('.layer_board_failure').fadeIn(800);
        window.onkeydown = null;
        clearInterval(intID);
        disablemovement();
      }
    }
    
    //ワープ1 ①
    //forループは使えない。(if分の中にforループはまだ考えられるが、逆は考えられない)
    if (rico.y == warp1hairetu[0].y && rico.x == warp1hairetu[0].x) {
        rico.y = warp1hairetu[1].y;
        rico.x = warp1hairetu[1].x;
        waapugonoidou()
    }

    //ワープ1 ②
    if (rico.y == warp1hairetu[1].y && rico.x == warp1hairetu[1].x) {
        rico.y = warp1hairetu[0].y;
        rico.x = warp1hairetu[0].x;
        waapugonoidou()
    }
 

    //ワープ2 ①
    if (rico.y == warp2hairetu[0].y && rico.x == warp2hairetu[0].x) {
        rico.y = warp2hairetu[1].y;
        rico.x = warp2hairetu[1].x;
        waapugonoidou()
    }

    //ワープ2 ②
    if (rico.y == warp2hairetu[1].y && rico.x == warp2hairetu[1].x) {
        rico.y = warp2hairetu[0].y;
        rico.x = warp2hairetu[0].x;
        waapugonoidou()
    }

    //ワープ3 ①
    if (rico.y == warp3hairetu[0].y && rico.x == warp3hairetu[0].x) {
        rico.y = warp3hairetu[1].y;
        rico.x = warp3hairetu[1].x;
        waapugonoidou()
    }

    //ワープ3 ②
    if (rico.y == warp3hairetu[1].y && rico.x == warp3hairetu[1].x) {
        rico.y = warp3hairetu[0].y;
        rico.x = warp3hairetu[0].x;
        waapugonoidou()
    }


    //ワープ4 ①
    if (rico.y == warp4hairetu[0].y && rico.x == warp4hairetu[0].x) {
        rico.y = warp4hairetu[1].y;
        rico.x = warp4hairetu[1].x;
        waapugonoidou()
    }

    //ワープ4 ②
    if (rico.y == warp4hairetu[1].y && rico.x == warp4hairetu[1].x) {
        rico.y = warp4hairetu[0].y;
        rico.x = warp4hairetu[0].x;
        waapugonoidou()
    }

    //ワープ5 ①
    if (rico.y == warp5hairetu[0].y && rico.x == warp5hairetu[0].x) {
        rico.y = warp5hairetu[1].y;
        rico.x = warp5hairetu[1].x;
        waapugonoidou()
    }

    //ワープ5 ②
    if (rico.y == warp5hairetu[1].y && rico.x == warp5hairetu[1].x) {
        rico.y = warp5hairetu[0].y;
        rico.x = warp5hairetu[0].x;
        waapugonoidou()
    }
         
    //ワープ6 ①
    if (rico.y == warp6hairetu[0].y && rico.x == warp6hairetu[0].x) {
        rico.y = warp6hairetu[1].y;
        rico.x = warp6hairetu[1].x;
        waapugonoidou()
    }

    //ワープ6 ②
    if (rico.y == warp6hairetu[1].y && rico.x == warp6hairetu[1].x) {
        rico.y = warp6hairetu[0].y;
        rico.x = warp6hairetu[0].x;
        waapugonoidou()
    }
}

function waapugonoidou() {
    var x = rico.x/squaresize;
    var y = rico.y/squaresize;

    x--;
    if ( map[y][x] === 0) {
        rico.move = squaresize;
        key.push = 'left';
    }
    
    y--;
    x = x+1;
    if ( map[y][x] === 0) {
        rico.move = squaresize;
        key.push = 'up';
    }

    x++;
    y= y+1;
        if ( map[y][x] === 0 ) {
        rico.move = squaresize;
        key.push = 'right';
    }

    y++;
    x = x - 1;
    if 
    ( map[y][x] === 0) {
        rico.move = squaresize;
        key.push = 'down';
    }       

    //これが無いとwaapugonoidou()が無限ループ
    if (rico.move > 0) {
		rico.move -= 2;
		if ( key.push === 'left' ) rico.x -= 2;
		if ( key.push === 'up' ) rico.y -= 2;
		if ( key.push === 'right' ) rico.x += 2;
		if ( key.push === 'down' ) rico.y += 2;
	}
}

function disablemovement() {
    rico.move = 0;
    key.left = false;
    key.up = false;
    key.right = false;
    key.down = false;
    removeEventListener("keydown", keydownfunc, false);
    removeEventListener("keyup", keyupfunc, false);
    document.getElementById( "left" ).removeEventListener("touchstart", function() { key.left = true; }, false);
    document.getElementById( "up" ).removeEventListener("touchstart", function() { key.up = true;}, false);
    document.getElementById( "down" ).removeEventListener("touchstart", function() { key.down = true; }, false);
    document.getElementById( "right" ).removeEventListener("touchstart", function() { key.right = true; }, false);
    rico.img.src=""
}