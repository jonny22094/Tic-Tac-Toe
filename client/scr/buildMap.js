const map = document.getElementsByClassName('map-container')[ 0 ];

for( let i = 0; i < 3; i++ ) {
    let brickLine = document.createElement( "div" );
        brickLine.className = "brick-line";

    for( let j = i * 3; j < i * 3 + 3; j++ ) {
        let brick = document.createElement( "div" );
            brick.className = "brick";

        brick.addEventListener( "click", i => { move( j ); } );

        brickLine.appendChild( brick );
    }

    map.appendChild( brickLine );
}
