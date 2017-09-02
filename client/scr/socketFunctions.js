const socket = io();

const move = data => {
    socket.emit( "move", data );
}

socket.on( "move", data => {
    document.getElementById( data.id ).innerHTML = data.text;
} );

socket.on( "alert", data => { console.log( data ) } );
socket.on( "end", data => {
  console.log( data );
  console.log( "reload page to search new opponent" );
} );
