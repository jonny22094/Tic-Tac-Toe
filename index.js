const express = require( 'express' );
const app     = express();
const http    = require( 'http' ).Server( app );
const io      = require( 'socket.io' )( http );

const rooms = {};
const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

app.use( express.static( __dirname + '/client' ) );

io.on( 'connection', ( socket ) => {
    const user = {
        room: null,
        round: null
    }

    for( const id in rooms ){
        if( rooms[ id ].userTwo === null ){
            rooms[ id ].userTwo = socket;
            rooms[ id ].start   = true;

            user.room = id;
            user.round = 1;

                         socket.emit( "alert", "Opponent move" );
            rooms[ id ].userOne.emit( "alert", "You move" );
        }
    }

    if ( user.room === null ) {
        const newRoom = {};

        newRoom.userOne = socket;
        newRoom.userTwo = null;
        newRoom.map     = new Array( 9 ).fill( null );
        newRoom.round   = 0;
        newRoom.moves   = 0;
        newRoom.start   = false;

        rooms[ socket.id ] = newRoom;

        user.room = socket.id;
        user.round = 0;

        socket.emit( "alert", "Waiting for oponent" );
    }

    users[ socket.id ] = user;

    socket.on( "move", data => {
        if ( user.round === rooms[ user.room ].round && rooms[ user.room ].map[ data ] === null && rooms[ user.room ].start ) {
                rooms[ user.room ].map[ data ] = user.round;
                rooms[ user.room ].moves++;

                rooms[ user.room ].userOne.emit( "move", { id: data, text: rooms[ user.room ].round ? "X" : "O" } );
                rooms[ user.room ].userTwo.emit( "move", { id: data, text: rooms[ user.room ].round ? "X" : "O" } );

                for( let i = 0; i < lines.length; i++ ) {
                    const [ a, b, c ] = lines[ i ];

                    if ( rooms[ user.room ].map[ a ] !== null
                      && rooms[ user.room ].map[ a ] === rooms[ user.room ].map[ b ]
                      && rooms[ user.room ].map[ a ] === rooms[ user.room ].map[ c ] ) {
                          rooms[ user.room ].start = false;

                          socket.emit( "end", "You win" );

                          if( rooms[ socket.id ] == null ) rooms[ user.room ].userOne.emit( "end", "You lose" );
                          else                             rooms[ socket.id ].userTwo.emit( "end", "You lose" );
                    }
                }

                if( rooms[ user.room ].moves === 9 ) {
                    rooms[ user.room ].start = false;

                    rooms[ user.room ].userOne.emit( "end", "Draw" );
                    rooms[ user.room ].userTwo.emit( "end", "Draw" );
                }

                rooms[ user.room ].round = rooms[ user.room ].round ? 0 : 1;
        }
    } )

    socket.once( "disconnect", () => {
    } );

});

http.listen( 3000, () => {
  console.log('server start in 3000 port');
});
