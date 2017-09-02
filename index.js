const express = require( 'express' );
const app     = express();
const http    = require( 'http' ).Server( app );
const io      = require( 'socket.io' )( http );

const rooms = {};
const users = {};

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

                         socket.emit( "alert", "opponent move" );
            rooms[ id ].userOne.emit( "alert", "you move" );
        }
    }

    if( user.room === null ) {
        const newRoom = {};

        newRoom.userOne = socket;
        newRoom.userTwo = null;
        newRoom.map     = new Array( 9 );
        newRoom.round    = 0;
        newRoom.start   = false;

        rooms[ socket.id ] = newRoom;

        user.room = socket.id;
        user.round = 0;

        //send alert ( 'waiting for oponents' )
    }

    users[ socket.id ] = user;

    socket.on( "move", data => {
        if( users[ socket.id ].round === rooms[ users[ socket.id ].room ].round ) {
            if( rooms[ users[ socket.id ].room ].start )
                rooms[ users[ socket.id ].room ].map[ data ] = users[ socket.id ].round;

            rooms[ users[ socket.id ].room ].round = rooms[ users[ socket.id ].room ].round ? 0 : 1;
        }
    } )

});

http.listen( 3000, () => {
  console.log('server start in 3000 port');
});
