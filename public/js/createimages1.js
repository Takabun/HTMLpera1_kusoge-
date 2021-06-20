//canvasのオブジェクト作成
var canvas = document.getElementById( 'canvas' );

//クライアント側の画面横幅。リロード時のみ読み込み
//.canvas-containerを基準にするとおかしくなる
// var yokohaba = document.querySelector( '.canvas-container' ).clientWidth;
var yokohaba = window.outerWidth;




// var squaresize = ''
// if (yokohaba > 780){ squaresize = 18; }
// else if ( yokohaba <= 780 && yokohaba > 480) {squaresize = 16;}
// else if ( yokohaba <= 480 && yokohaba >= 400) {squaresize = 12;}
// else { squaresize = 10;}
// var squaresize = 18
if (yokohaba > 780){ squaresize = 16; }
else if ( yokohaba <= 780 && yokohaba > 480) {squaresize = 16;}
else {squaresize = 12}

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
rico.x = squaresize;　//スタート地点x  | 18 * 31
rico.y = squaresize;  //スタート地点y | 18 * 43
rico.move = 0;

//キャラクターの1マスの移動スピードを調整
// if (window.matchMedia('(max-width: 767px)').matches) { //SP処理
// 	var movecell = 2
// } else if (window.matchMedia('(min-width:768px)').matches) { //PC
// 	var movecell = 2
// }
var movecell = 2


//壁のImageオブジェクト
var block = new Image();
block.src = 'img/block.png';
 
//路のimageオブジェクト
var road = new Image();
road.src = 'img/road.png';

//ゴールのImageオブジェクトを作る
var goal = new Image();
goal.src = 'img/goal.png';


//落とし穴のimageオブジェクト
var hole = new Image();
hole.src = 'img/hole.png';

//ワープ穴のimageオブジェクト
var warp1 = new Image();
warp1.src = 'img/warp1.png';

var warp2 = new Image();
warp2.src = 'img/warp2.png';

var warp3 = new Image();
warp3.src = 'img/warp3.png';

var warp4 = new Image();
warp4.src = 'img/warp4.png';

var warp5 = new Image();
warp5.src = 'img/warp5.png';

var warp6 = new Image();
warp6.src = 'img/warp6.png';

//背景画像
var haikei = new Image();
haikei.src = 'img/shiro.jpg';


//キーボードのオブジェクトを作成
var key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';

// ↓マップ作成(新)ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//今6が無い
var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 5, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 4, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 7, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1, 8, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 4, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 6, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 8, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 7, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 4, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 4, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 6, 1, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 4, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 4, 1, 0, 1],
    [1, 5, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 10, 1, 9, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1]
]
// ↑マップ作成(新)ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー


//メインループ
function main() {

　//落とし穴のx/y座標を格納
	otoshianas = [];
	warp1hairetu = [];
	warp2hairetu = [];
	warp3hairetu = [];
	warp4hairetu = [];
	warp5hairetu = [];
	warp6hairetu = [];

	//背景画像
	ctx.drawImage( haikei, 0, 0, 1200, 1500, 0, 0, canvas.width , canvas.height  );

	// map[x][y]の数値0~2に画像を当て込むのは、このmainループ内。でないと、rikoちゃんの残像が残る
	for (var y = 0; y < map.length; y++) {
		for (var x = 0; x < map[0].length; x++) {
			if (map[y][x] === 1) {
				//drawImage引数解説(①描画する画像　②起点x　③起点y　④起点xから描画する範囲x ⑤起点yから描画する範囲y 
				//⑥ map内の描画スタート地点x ⑦map内の描画スタート地点y ⑧描画サイズx ⑨描画サイズy)
					ctx.drawImage( block, 0, 0, 300, 300, squaresize*x, squaresize*y, squaresize, squaresize );
			} if (map[y][x] === 3){
				ctx.drawImage( goal, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
			}
			//落とし穴イベント
			if (map[y][x] === 4){
			ctx.drawImage( hole, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
			var otoshiana_y = squaresize*y;
			var otoshiana_x = squaresize*x;
			a_otoshiana = {y: otoshiana_y, x: otoshiana_x }
			otoshianas.push(a_otoshiana)
			}

			//ワープ1
			if (map[y][x] === 5){
				ctx.drawImage( warp1, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
				var warp1_y = squaresize*y;
				var warp1_x = squaresize*x;
				a_warp1 = {y: warp1_y, x: warp1_x }
				warp1hairetu.push(a_warp1)
			}
			//ワープ2
			if (map[y][x] == 6){
				ctx.drawImage( warp2, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
				var warp2_y = squaresize*y;
				var warp2_x = squaresize*x;
				a_warp2 = {y: warp2_y, x: warp2_x }
				warp2hairetu.push(a_warp2)
			} 
			//ワープ3
			if (map[y][x] == 7){
				ctx.drawImage( warp3, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
				var warp3_y = squaresize*y;
				var warp3_x = squaresize*x;
				a_warp3 = {y: warp3_y, x: warp3_x }
				warp3hairetu.push(a_warp3)
			} 

			//ワープ4
			if (map[y][x] == 8){
				ctx.drawImage( warp4, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
				var warp4_y = squaresize*y;
				var warp4_x = squaresize*x;
				a_warp4 = {y: warp4_y, x: warp4_x }
				warp4hairetu.push(a_warp4)
			} 

			//ワープ5
			if (map[y][x] == 9){
				ctx.drawImage( warp5, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
				var warp5_y = squaresize*y;
				var warp5_x = squaresize*x;
				a_warp5 = {y: warp5_y, x: warp5_x }
				warp5hairetu.push(a_warp5)
			}
			
			//ワープ6
			if (map[y][x] == 10){
				ctx.drawImage( warp6, 0, 0, 350, 350, squaresize*x, squaresize*y, squaresize, squaresize );
				var warp6_y = squaresize*y;
				var warp6_x = squaresize*x;
				a_warp6 = {y: warp6_y, x: warp6_x }
				warp6hairetu.push(a_warp6)
			} 
		}
	}


	//暗くする
	ctx.fillStyle="rgba(0,0,0,0.91)";
	ctx.fillRect(0 ,0, canvas.width, rico.y-14*squaresize);
	ctx.fillRect(0 , rico.y-14*squaresize, rico.x-14*squaresize, squaresize*28);
	ctx.fillRect(rico.x+14*squaresize, rico.y-14*squaresize, canvas.width,squaresize*28);
	ctx.fillRect(0, rico.y+14*squaresize,  canvas.width, canvas.height);

	//ゴール付近だけ明るくする
	ctx.drawImage( block, canvas.width-squaresize, canvas.height-squaresize, squaresize,  squaresize);
	ctx.drawImage( block, canvas.width-squaresize, canvas.height-(squaresize*2), squaresize,  squaresize);
	ctx.drawImage( goal, canvas.width-(squaresize*2), canvas.height-squaresize, squaresize,  squaresize);
	ctx.drawImage( block, canvas.width-(squaresize*3), canvas.height-squaresize, squaresize,  squaresize);
	ctx.drawImage( road, canvas.width-(squaresize*2), canvas.height-(squaresize*2), squaresize,  squaresize);
	ctx.drawImage( road, canvas.width-(squaresize*3), canvas.height-(squaresize*2), squaresize,  squaresize);

	//ricoちゃんを表示
	ctx.drawImage( rico.img, rico.x, rico.y, squaresize,  squaresize);
	// addEventListener("keydown", keydownfunc, false);
	// addEventListener("keyup", keyupfunc, false);
	
	//方向キーが押されている場合は、りこちゃんが移動する
	if ( rico.move == 0 ) {
		if ( key.left == true ) {
			var x = rico.x/squaresize;
			var y = rico.y/squaresize;
			x--;
			if ( map[y][x] !== 1) {
			rico.move = squaresize;
			key.push = 'left';
			}
		}
		if ( key.up == true ) {
			var x = rico.x/squaresize;
			var y = rico.y/squaresize;
			if ( y > 0) {
			y--;
				if ( map[y][x] !== 1) {
				rico.move = squaresize;
				key.push = 'up';
			}
			}
		}
		if ( key.right === true ) {
			var x = rico.x/squaresize;
			var y = rico.y/squaresize;
			x++;
			if ( map[y][x] !== 1) {
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
				if ( map[y][x] !== 1) {
					rico.move = squaresize;
					key.push = 'down';
				}		
			}
		}
	}

	//rico.moveが0より大きい場合は、4pxずつ移を続ける
	if (rico.move > 0) {
		rico.move -= movecell;
		if ( key.push === 'left' ) rico.x -= movecell;
		if ( key.push === 'up' ) rico.y -= movecell;
		if ( key.push === 'right' ) rico.x += movecell;
		if ( key.push === 'down' ) rico.y += movecell;
	}
 
	requestAnimationFrame( main );
}


//ページと依存している全てのデータが読み込まれたら、メインループ開始
// addEventListener('load', main(), false);
main()
 
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

