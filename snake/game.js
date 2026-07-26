(function(){
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const restartBtn = document.getElementById('restart');

  const TILE = 20; // cell size
  const COLS = canvas.width / TILE;
  const ROWS = canvas.height / TILE;

  let snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
  let dir = {x:0,y:0};
  let food = spawnFood();
  let speed = 8; // frames per second
  let score = 0;
  let gameOver = false;
  let lastMove = {x:0,y:0};

  function spawnFood(){
    let pos;
    do {
      pos = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) };
    } while (snake.some(s => s.x===pos.x && s.y===pos.y));
    return pos;
  }

  function reset(){
    snake = [{x: Math.floor(COLS/2), y: Math.floor(ROWS/2)}];
    dir = {x:0,y:0};
    food = spawnFood();
    score = 0;
    gameOver = false;
    scoreEl.textContent = score;
  }

  function update(){
    if (gameOver) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      gameOver = true; return;
    }

    // self collision
    if (snake.some((s, idx) => idx>0 && s.x===head.x && s.y===head.y)){
      gameOver = true; return;
    }

    snake.unshift(head);

    // eat food
    if (head.x === food.x && head.y === food.y){
      score += 1;
      scoreEl.textContent = score;
      food = spawnFood();
    } else {
      snake.pop();
    }
  }

  function draw(){
    // clear
    ctx.fillStyle = '#071012';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw food
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(food.x*TILE + 2, food.y*TILE + 2, TILE-4, TILE-4);

    // draw snake
    for (let i=0;i<snake.length;i++){
      ctx.fillStyle = i===0 ? '#58a6ff' : '#238636';
      const s = snake[i];
      ctx.fillRect(s.x*TILE+1, s.y*TILE+1, TILE-2, TILE-2);
    }

    if (gameOver){
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height/2 - 40, canvas.width, 80);
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over - Presiona Reiniciar', canvas.width/2, canvas.height/2 + 7);
    }
  }

  // input
  window.addEventListener('keydown', e => {
    const key = e.key;
    let nx=dir.x, ny=dir.y;
    if (key === 'ArrowUp' || key === 'w') { nx=0; ny=-1; }
    if (key === 'ArrowDown' || key === 's') { nx=0; ny=1; }
    if (key === 'ArrowLeft' || key === 'a') { nx=-1; ny=0; }
    if (key === 'ArrowRight' || key === 'd') { nx=1; ny=0; }

    // prevent reversing directly
    if (snake.length>1 && nx === -lastMove.x && ny === -lastMove.y) return;
    if (nx!==0 || ny!==0){ dir.x = nx; dir.y = ny; }
    lastMove = {x:dir.x,y:dir.y};
  });

  restartBtn.addEventListener('click', () => { reset(); });

  // main loop
  function loop(){
    update();
    draw();
  }

  // start
  reset();
  setInterval(loop, 1000/speed);
})();
