const socket = io();

const move = data => {
    console.log( data );
    socket.emit( "move", data );
}
