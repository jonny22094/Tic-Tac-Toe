const express = require( 'express' );
const app     = express();
const http    = require( 'http' ).Server( app );
const io      = require( 'socket.io' )( http );

const rooms = {};
const users = {};

app.use( express.static( __dirname + '/client' ) );

io.on( 'connection', ( socket ) => {
    const user = {
        room: null
    }

    for( const id in rooms ){
        if( rooms[ id ].userTwo === null ){
            rooms[ id ].userTwo = socket.id;
            user.room = id;

            //send socket ( find oponent )
        }
    }

    if( user.room === null ) {
        const newRoom = {};

        newRoom.userOne = socket.id;
        newRoom.userTwo = null;
        newRoom.maps    = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, ];

        rooms[ socket.id ] = newRoom;
        user.room = socket.id;

        //send alert ( 'waiting for oponents' )
    }

    users[ socket.id ] = user;

});

http.listen( 3000, () => {
  console.log('server start in 3000 port');
});
