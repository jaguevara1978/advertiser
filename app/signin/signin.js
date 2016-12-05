( function ( ) {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:SignIn
 * @description
 * # SignIn
 * Controller of the app
 */
angular.module( 'app.signin' ).controller( 'SignIn', SignIn );

/*@ngInject*/
function SignIn( $rootScope, $scope, $location, $timeout, AuthenticationService, ApiService, $routeParams, Notification ) {
    var vm = this;
    vm.loading = false;
    vm.signingup = false;
    vm.login = login;
    vm.rotate = rotate;
    vm.signup = signup;
    vm.retrievePassword = retrievePassword;

    vm.signin = true;

    var signInButton = document.getElementById( 'signin_submit' );
    var signUpButton = document.getElementById( 'signup_submit' );
    var shellContent = document.getElementById( 'shell_content' );
    var signInWrapper = document.getElementById( 'signin_wrapper' );
    var signUpWrapper = document.getElementById( 'signup_wrapper' );
    var signinBubbles = document.getElementById( 'signin_bubbles' );
    
    //LOADING
    var buttonText;

    // Unrestricted pages do not use navigation bar
    $rootScope.showMainNavBar = false;

    vm.forgotpwd = false;

// Just for testing purposes, this must remain in comments on Production Mode
/*
vm.user = {
    data: {
        company_name: 'Test Company',
        primary_email: 'jaguevara1978@gmail.com'
    },
    extra: {
        password: ''
    }
};
*/
// Just for testing purposes, this must remain in comments on Production Mode

/*
    if ( $routeParams.id && $routeParams.pwd ) {
        vm.user = {
            id: $routeParams.id,
            pwd: $routeParams.pwd
        };
        login( );
    }
*/

    initController( );

    function initController( ) {
        /* Fix Height control for SignIn form only */
        document.getElementById( 'main_content' ).style.top = '0px';

        /* Height control */

        //console.log(vm.user);
        // reset login status
        AuthenticationService.ClearCredentials( );
    };

    function login( ) {
        if ( !vm.loading ) {
            vm.loading = true;
            loadingAnimation( signInButton );

            ApiService.post( 'auth', vm.user )
                .then(function ( response ) {
                    stopLoading( signInButton );
                    vm.loading = false;

                    if ( response.success ) {
                        AuthenticationService.setCredentials( response.data );
                        $location.path( '/tr_management' );
                        Notification.info( { message: 'Welcome to the Sponsor Zone', delay: 1000 } );
                    } else {
                        Notification.error( { message: response.message, delay: 5000 } );
                    }
                    vm.loading = false;
                }
            );
        }
    }

    function signup( ) {
        vm.loading = true;
        vm.signingup = true;
        loadingAnimation( signUpButton );
        vm.user.data.fname = vm.user.data.company_name;
        vm.user.data.lname = vm.user.data.company_name;
        vm.user.extra.type = 'advertiser';
        console.log(vm.user);
        ApiService.post( 'contact', vm.user )
            .then( function ( response ) {
                stopLoading( signUpButton );
                vm.loading = false;

                if ( response.success ) {
                    $rootScope.globals.name = vm.user.data.fname;
                    $rootScope.globals.email = vm.user.data.primary_email;

                    vm.user = null;

                    vm.loading = false;
                    vm.signin = true;
                    vm.signingup = false;

                    Notification.success( 'We have just sent you an e-mail confirmation. Please, take a look.', 20000 );
                    $( '.signin_container' ).removeClass( 'active' );
                } else {
                    vm.loading = false;
                    vm.signingup = false;
                    Notification.error( response.message, 20000 );
                }
            });
    }

    function rotate( ) {
        vm.signin = vm.signin ? false : true;
    }

    function loadingAnimation( parent ) {
        // Temporarily save parent text
        buttonText = parent.innerHTML;
        // Remove Text
        parent.innerHTML = '<span>Validating  <i class="fa fa-refresh fa-spin"></i></span>';
    }

    function stopLoading( parent ) {
        $timeout( function( ) {
            parent.innerHTML = buttonText;
        },  750 );
    }

    function retrievePassword(  ) { 
        Notification.warning( 'I am under construction, sorry about that', 5000 );
    }
}
})();