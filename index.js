const express = require( 'express' );
const app     = express();
const http    = require( 'http' ).Server( app );
const io      = require( 'socket.io' )( http );

const rooms = {};
const users = {};

app.use( express.static( __dirname + '/client' ) );

io.on( 'connection', ( socket ) => {
    const user = {}
});

http.listen( 3000, () => {
  console.log('server start in 3000 port');
});
