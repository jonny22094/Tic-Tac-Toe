socket.emit( 'login' );

socket.on( 'Start', ( socketId, xo ) => {
  console.log('Połączono z przeciwnikiem'); // connected to enemy
    id  = socketId;
    you = xo;

    if( xo === 1 ) text[ 0 ].innerHTML = 'Jesteś | X | zaczynasz'; // you are | x | and you turn
    else           text[ 0 ].innerHTML = 'Jesteś | O | przeciwnik zaczyna'; // you are | O | enemy turn
});

socket.on( 'err', () => {
  id  = null;
  zero();
  console.log('Twój przeciwnik wyszedł'); // enemy disconnect
  socket.emit( 'login' );
});



socket.on( 'turn', ( y, x, who ) => {
      if( maps[y][x] === 0 && who === turn){
          if( turn === 1 ){
              document.getElementById( y+","+x ).innerHTML = "X";
              turn++;
              maps[y][x] = 1;
          }
          else if( turn === 2 ){
              document.getElementById( y+","+x ).innerHTML = "O";
              turn--;
              maps[y][x] = 2;
          }

          moves++;
          check();
      }

      if( you == turn ) text[ 0 ].innerHTML = 'Twój ruch'; // you turn
      else              text[ 0 ].innerHTML = 'Ruch przeciwnika'; // enemy turn
});

socket.on('hide', () => {
    console.log( 'Restart 2/2' );
    console.log( 'Start next turn' );
    zero();
    if(you === 1) you = 2;
    else          you = 1;
    document.getElementById( "win_b" ).style.display = "none";
});
