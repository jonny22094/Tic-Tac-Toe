var  text   = document.getElementsByClassName( 'text' )
   , socket = io()
   , win    = 0
   , lose   = 0
   , id
   , you
   , turn   = 1
   , moves  = 0
   , stop   = 0
   , maps   = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
                           ];


var z = ( y, x ) => {
  socket.emit( 'turn', y, x, id, you );
}


var zero = () => {
    you;
    turn  = 1;
    moves = 0;
    stop  = 0;
    maps  = [
               [0, 0, 0],
               [0, 0, 0],
               [0, 0, 0],
                         ];
   for( var i = 0; i < 3; i++ )
      for( var j = 0; j < 3; j++ )
          document.getElementById( i+","+j ).innerHTML = '';

}


var check = () => {
    if( moves == 9 )        end( "DRAW" );

    for( var g = 1; g <= 2; g++ ){
        for( var y = 0; y <= 2; y++ ){
            if( maps[y][0]==g && maps[y][1]==g && maps[y][2]==g ||
                maps[0][y]==g && maps[1][y]==g && maps[2][y]==g ||
                maps[0][0]==g && maps[1][1]==g && maps[2][2]==g ||
                maps[2][0]==g && maps[1][1]==g && maps[0][2]==g){

                if( g === you ) win++;
                else            lose++;

                if( g === 1 ) end( "WIN: X" );
                else          end( "WIN: O" );

                y = 3;
            }
        }
    }
}


var end = name => {
  text[ 1 ].innerHTML = `${win}:${lose}`;
  text[ 2 ].innerHTML = `${win}:${lose}`;

  document.getElementById( "win" ).innerHTML = name;
  document.getElementById( "win_b" ).style.display = "block";
  document.getElementById( "win_b" ).classList.add( "fadeIn" );
}

document.getElementsByClassName( 'reset' )[ 0 ].addEventListener('click', () => {
  socket.emit( 'restart' );
  document.getElementById( 'res' ).innerHTML = "Oczekiwanie na 2 gracza";
});
