const cvs = document.getElementById("canvas");
const context_2d = cvs.getContext("2d");

// load images
const bird = new Image();
const bc_img = new Image();
const floor = new Image();
const pipeTop = new Image();
const pipeBottom = new Image();

bird.src = "images/bird.png";
bc_img.src = "images/bg.png";
floor.src = "images/floor.png";
pipeTop.src = "images/pipeTop.png";
pipeBottom.src = "images/pipeBottom.png";


// some variables
const gravity = 1.5;
let gap = 85;
let constant;
let bX = 10;
let bY = 150;
let score_count = 0;

// audio files
const fly = new Audio();
const score_sound = new Audio();
const _game_sound = new Audio();

fly.src = "sounds/fly.wav";
score_sound.src = "sounds/score.mp3";
_game_sound.src = 'sounds/_game_sound.mp3';

// pipe coordinates
let pipe = [];
pipe[0] = {
    x : cvs.width,
    y : 0
}

// on key down and up
document.addEventListener("keydown",() => {
  bY -= 25;
  fly.play();
});

document.addEventListener('keyup', () => {
  fly.pause();
  fly.currentTime = 0;
});

const game_sound = () => _game_sound.play();

// draw images
const draw = () => {
    context_2d.drawImage(bc_img,0,0);
    for(let i in pipe){
        constant = pipeTop.height + gap;
        context_2d.drawImage( pipeTop,pipe[i].x,pipe[i].y );
        context_2d.drawImage( pipeBottom,pipe[i].x,pipe[i].y + constant );
        pipe[i].x--;
        
        if( pipe[i].x == 125 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random() * pipeTop.height) - pipeTop.height
            }); 
        }

        // detect collision
        if( bX + bird.width >= pipe[i].x &&
	  bX <= pipe[i].x + pipeTop.width &&
	  (bY <= pipe[i].y + pipeTop.height || 
	  bY + bird.height >= pipe[i].y + constant) ||
	  bY + bird.height >=  cvs.height - floor.height -5){
	    restart_game( render );
        }
        
        if(pipe[i].x == 5){
            score_count++;
            score_sound.play();
        }
    }

    context_2d.drawImage( floor,0,cvs.height - floor.height );
    context_2d.drawImage( bird,bX,bY );
    bY += gravity;
    context_2d.fillStyle = "#000";
    context_2d.font = "20px Verdana";
    context_2d.fillText("Score : " + score_count,10,cvs.height - 20);
    render = requestAnimationFrame( draw );
}

const restart_game = ( render ) => {
  cancelAnimationFrame( render );
  bX = 10;
  bY = 150;
  score_count = 0;
  pipe.splice(0,pipe.length);
  pipe[0] = {
    x : cvs.width,
    y : 0
  }
  _game_sound.currentTime = 0;
  draw();
}

const start_game = () => {
  let render;
  draw();
  game_sound();
}
start_game();
