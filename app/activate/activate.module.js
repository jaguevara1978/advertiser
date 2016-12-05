( function( ) {
    'use strict';

    angular
        .module( 'app.activate', [ 'noCAPTCHA' ] )
        .config( config );
        /*@ngInject*/
        function config( $routeProvider, $httpProvider, config, noCAPTCHAProvider ) {
            noCAPTCHAProvider.setSiteKey( '6Lcq5B4TAAAAAH9TouXudeamQRTzQlT_2NjC0Ipv' );
        }

} )( );