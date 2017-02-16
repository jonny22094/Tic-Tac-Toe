var express = require( 'express' ),
    app     = express(),
    http    = require( 'http' ).Server( app ),
    io      = require( 'socket.io' )( http );

const users = {};
const rooms = {};

app.use( express.static( __dirname + '/client' ) );

io.on('connection', ( socket ) => {
    const user = {};

    socket.on( 'login', ( data, callback ) => {
        user.id      = socket.id;
        user.socket  = socket;
        user.room    = null;
        user.you     = 1;
        user.restart = false;
        users[ user.id ] = user;

        //user.socket.emit( 'error', 'Szukanie przeciwnika' );

        for( const id in users ){
            if( users[ id ].room === null && id !== user.id ){

                users[ id ].room        = user.id;
                users[ socket.id ].room = id;
                users[ id ].you         = 2;

                       user.socket.emit( 'Start', id, user.you );
                users[ id ].socket.emit( 'Start', user.id, users[ id ].you );
            }
        }
    });

    socket.on('turn', ( y, x, id, you ) => {
        users[ id ].socket.emit( 'turn', y, x, you );
                    socket.emit( 'turn', y, x, you );
    });

    socket.on('restart', () => {
        users[ socket.id ].restart = true;

        if( users[ users[ socket.id ].room ].restart === true ){

            users[ socket.id ].restart = false;
            users[ users[ socket.id ].room ].restart = false;

            socket.emit('hide');
            users[ users[ socket.id ].room ].socket.emit('hide');
        }

    });

    socket.on('disconnect', () => {
        if( users[ socket.id ].room !== undefined && users[ socket.id ].room !== null )
            users[ users[ socket.id ].room ].socket.emit( 'err' );

        delete users[ socket.id ];
    });


});

http.listen( 3000, () => {
  console.log('server start in 3000 port');
});
