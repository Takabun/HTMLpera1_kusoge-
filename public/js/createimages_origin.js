//canvasのオブジェクト作成
var canvas = document.getElementById( 'canvas' );

//クライアント側の画面横幅。しかし、リロード時にしか読み込めない
var yokohaba = document.querySelector( '.canvas-container' ).clientWidth;

// squaresize:1セルの大きさ
// 偶数にしないと、ricoちゃんが動くときにrico.moveの値が0でなく-1とかになってフリーズする
// time.js内のgoal_x, goal_yもこの数値を参照
// クライアント側の画面サイズに応じてレスポンシブ対応
var squaresize = ''
if (yokohaba > 780){ squaresize = 18;}
else if ( yokohaba <= 780 && yokohaba > 480) {squaresize = 16;}
else if ( yokohaba <= 480 && yokohaba >= 400) {squaresize = 12;}
else { squaresize = 10;}


function handleTouchMove(event) {
    event.preventDefault();
}
//touchmoveの時だと、文字をコピーできてしまっていた(しかし、JSをちゃんと描いてもスマホには反映されず。CSS書く必要あり)
document.addEventListener('touchstart', handleTouchMove, { passive: false });
document.removeEventListener('touchstart', handleTouchMove, { passive: false });


var w = 33; // 迷路の横幅セル数
var h = 45; // 迷路の縦幅セル数
canvas.width = w*squaresize;  //迷路の横幅px
canvas.height = h*squaresize;	//迷路の縦幅px
 

//コンテキストを取得（しゅとく）
var ctx = canvas.getContext( '2d' );
 
//りこちゃんのオブジェクト作成
var rico = new Object();
rico.img = new Image();
rico.img.src = 'img/rico.png';
rico.x = squaresize;　//スタート地点x
rico.y = squaresize;  //スタート地点y
rico.move = 0;


//壁のImageオブジェクト
var block = new Image();
block.src = 'img/block.png';
 
//路のimageオブジェクト
var road = new Image();
road.src = 'img/road.png';

//ゴールのImageオブジェクトを作る
var goal = new Image();
goal.src = 'img/goal.png';

//キーボードのオブジェクトを作成
var key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';



// ↓マップ作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーs
var makeMaze = function () {

	var maze = new Array();

	for (y = 0; y < h; y++) {
		maze[y] = new Array();
		for (x = 0; x < w; x++) {
			if (y == 0 || y == h - 1 || x == 0 || x == w - 1) {
				maze[y][x] = 1; // 外周に1を代入
			} else if (y % 2 == 0 && x % 2 == 0) {
				maze[y][x] = 1; // [偶数][偶数]棒倒しの棒に1を代入
			} else {
				maze[y][x] = 0; // その他はまだ0
			}
		}
	}

	// 壁(というより棒)位置
	for (y = 2; y < h - 2; y += 2) {
		for (x = 2; x < w - 2; x += 2) {
			//nに0~3のランダム数値を指定
			var n;
			if (y == 2) { // 一番上の段
				if (maze[y][x - 1] == 1) {
					n = rand(0, 2);
				} else {
					n = rand(0, 3);
				}
			} else {
				if (maze[y][x - 1] == 1) {
					n = rand(1, 2);
				} else {
					n = rand(1, 3);
				}
			}
　　　　　　　　　//nに指定された0~3のランダム数値を元に、周りのセルを書き換える
			switch (n) {
				case 0: // 上
					maze[y - 1][x] = 1;
					break;
				case 1: // 右
					maze[y][x + 1] = 1;
					break;
				case 2: // 下
					maze[y + 1][x] = 1;
					break;
				default: // 左
					maze[y][x - 1] = 1;
					break;
			}
		}
	}
	//ゴール地点
	maze[h-1][w-2] = 3;
	return maze;
};


// 乱数取得
var rand = function (min, max) {
	return Math.floor(Math.random() * (max + 1 - min) + min);
};

var map = makeMaze(); // 0か1かでマップを作成


// ↑マップ作成ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

//メインループ
function main() {

	// map[x][y]の数値0~2に画像を当て込むのは、このmainループ内。でないと、rikoちゃんの残像が残る
	for (var y = 0; y < map.length; y++) {
		for (var x = 0; x < map[0].length; x++) {
			if (map[y][x] === 1) {
				//drawImage引数解説(①描画する画像　②起点x　③起点y　④起点xから描画する範囲x ⑤起点yから描画する範囲y 
				//⑥ map内の描画スタート地点x ⑦map内の描画スタート地点y ⑧描画サイズx ⑨描画サイズy)
					ctx.drawImage( block, 0, 0, 300, 300, squaresize*x, squaresize*y, squaresize, squaresize );
			} if (map[y][x] === 0){
				ctx.drawImage( road, 0, 0, 300, 300, squaresize*x, squaresize*y, squaresize, squaresize );
			} if (map[y][x] === 3){
				ctx.drawImage( goal, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
			}
		}
	}

	//画像を表示
	ctx.drawImage( rico.img, rico.x, rico.y, squaresize,  squaresize);
	addEventListener("keydown", keydownfunc, false);
	addEventListener("keyup", keyupfunc, false);


	//方向キーが押されている場合は、りこちゃんが移動する
	if ( rico.move === 0 ) {
		if ( key.left === true ) {
			var x = rico.x/squaresize;
			var y = rico.y/squaresize;
			x--;
			if ( map[y][x] === 0 ) {
				rico.move = squaresize;
				key.push = 'left';
			}
		}
		if ( key.up === true ) {
			var x = rico.x/squaresize;
			var y = rico.y/squaresize;
			if ( y > 0) {
				y--;
				if ( map[y][x] === 0 ) {
					rico.move = squaresize;
					key.push = 'up';
				}
			}
		}
		if ( key.right === true ) {
			var x = rico.x/squaresize;
			var y = rico.y/squaresize;
			x++;
			if ( map[y][x] === 0 ) {
				rico.move = squaresize;
				key.push = 'right';
			}
		}
		if ( key.down === true ) {
			var x = rico.x/squaresize;
			var y = rico.y/squaresize;
			if ( y <= h ) {
				//↑y < 19となっていたせいでricoちゃんがゴールにつけないというエラーが発生した
				y++;
				if ( map[y][x] === 0 ||map[y][x] === 3 ) {
					rico.move = squaresize;
					key.push = 'down';
				}
			}
		}
	}
 
	//rico.moveが0より大きい場合は、4pxずつ移を続ける
	if (rico.move > 0) {
		rico.move -= 2;
		if ( key.push === 'left' ) rico.x -= 2;
		if ( key.push === 'up' ) rico.y -= 2;
		if ( key.push === 'right' ) rico.x += 2;
		if ( key.push === 'down' ) rico.y += 2;
	}
 
	requestAnimationFrame( main );
}
//ページと依存している全てのデータが読み込まれたら、メインループ開始
addEventListener('load', main(), false);
 
//キーボードが押されたときに呼び出される関数
function keydownfunc( event ) {
	var key_code = event.keyCode;
	if( key_code === 37 ) key.left = true;
	if( key_code === 38 ) key.up = true;
	if( key_code === 39 ) key.right = true;
	if( key_code === 40 ) key.down = true;
	event.preventDefault();		//方向キーでブラウザがスクロールしないようにする
}

//キーボードが放されたときに呼び出される関数
function keyupfunc( event ) {
	var key_code = event.keyCode;
	if( key_code === 37 ) key.left = false;
	if( key_code === 38 ) key.up = false;
	if( key_code === 39 ) key.right = false;
	if( key_code === 40 ) key.down = false;
}

//スマホ用のキー動作
document.getElementById( "left" ).addEventListener("touchstart", function() {
	key.left = true;
}, false);

document.getElementById( "left" ).addEventListener("touchend", function() {
	key.left = false;
}, false);

document.getElementById( "up" ).addEventListener("touchstart", function() {
	key.up = true;
}, false);
  
  document.getElementById( "up" ).addEventListener("touchend", function() {
	key.up = false;
}, false);

document.getElementById( "down" ).addEventListener("touchstart", function(event) {
	event.preventDefault
	key.down = true;
}, false);

document.getElementById( "down" ).addEventListener("touchend", function(event) {
	event.preventDefault
	key.down = false;
}, false);

document.getElementById( "right" ).addEventListener("touchstart", function() {
	key.right = true;
}, false);

document.getElementById( "right" ).addEventListener("touchend", function() {
	key.right = false;
}, false);






//ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
// //りこちゃんのオブジェクトを作成
// var rico = new Object();
// rico.x = 0;
// rico.y = 0;
// rico.move = 0;
 
// //キーボードのオブジェクトを作成
// var key = new Object();
// key.up = false;
// key.down = false;
// key.right = false;
// key.left = false;
 
// push_key = '';

// //メインループ
// function main() {
// 	//キーボードが押された時、keydownfunc関数（かんすう）を呼び出す
// 	addEventListener("keydown", keydownfunc, false);
// 	//キーボードが放（はな）された時、keydownfunc関数（かんすう）を呼び出す
// 	addEventListener("keyup", keyupfunc, false);
 
// 	//方向キーが押されている場合（ばあい）は、りこちゃんが移動する
// 	if ( rico.move === 0 ) {
// 		if ( key.left === true ) {
// 			rico.move = 32;
// 			push_key = 'left';
// 		}
// 		if ( key.up === true ) {
// 			rico.move = 32;
// 			push_key = 'up';
// 		}
// 		if ( key.right === true ) {
// 			rico.move = 32;
// 			push_key = 'right';
// 		}
// 		if ( key.down === true ) {
// 			rico.move = 32;
// 			push_key = 'down';
// 		}
// 	}
 
// 	//rico.moveが0より大きい場合は、4pxずつ移動（いどう）を続ける
// 	if (rico.move > 0) {
// 		rico.move -= 4;
// 		if ( push_key === 'left' ) rico.x -= 4;
// 		if ( push_key === 'up' ) rico.y -= 4;
// 		if ( push_key === 'right' ) rico.x += 4;
// 		if ( push_key === 'down' ) rico.y += 4;
// 	}
 
// 	//りこちゃんの位置（いち）を決める
// 	document.getElementById( 'rico' ).style.top = rico.y + "px";
// 	document.getElementById( 'rico' ).style.left = rico.x + "px";
 
// 	//main関数（かんすう）、つまり自分自身の関数を呼び出すことでループさせる。
// 	requestAnimationFrame(main);
// }
// requestAnimationFrame(main);
 
// //キーボードが押されたときに呼び出される関数（かんすう）
// function keydownfunc( event ) {
// 	var key_code = event.keyCode;
// 	if( key_code === 37 ) key.left = true;
// 	if( key_code === 38 ) key.up = true;
// 	if( key_code === 39 ) key.right = true;
// 	if( key_code === 40 ) key.down = true;
// 	event.preventDefault();
// }
 
// //キーボードが放（はな）されたときに呼び出される関数
// function keyupfunc( event ) {
// 	var key_code = event.keyCode;
// 	if( key_code === 37 ) key.left = false;
// 	if( key_code === 38 ) key.up = false;
// 	if( key_code === 39 ) key.right = false;
// 	if( key_code === 40 ) key.down = false;
// }