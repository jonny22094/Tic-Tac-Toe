const socket = io();

const move = data => {
    socket.emit( "move", data );
}

socket.on( "move", data => {
    document.getElementById( data.id ).innerHTML = data.text;
} );

socket.on( "alert", data => {
    let alert = document.createElement( "li" );
        alert.className = "alert";
        alert.innerHTML = data;

    document.getElementById( "alerts" ).appendChild( alert );
} );
