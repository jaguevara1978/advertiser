( function( ) {
    'use strict';

angular.module( 'app.layout' ).controller( 'Shell', Shell );

/*@ngInject*/
function Shell( $rootScope, $location, $scope, ApiService, config ) {
    var vm = this;

    $rootScope.loading = false;

    $rootScope.breadCrumbs = 'Select an Option';

    initialize( );

    function initialize( ) {    }   

    /* Navigation menu options event listeners*/
  	var navContainer = document.getElementById( 'nav-container' );
    var nav_input_checkbox = document.getElementsByClassName( 'nav_input_checkbox' );
    var nav_child = document.getElementsByClassName( 'child_menu_option' );
    var selectedParentOption = '';

    function navInputClicked( event ) {
        for ( var i = 0; i < nav_input_checkbox.length; i++ ) {
            if ( nav_input_checkbox[ i ].id != event.target.id ) {
                $( nav_input_checkbox[ i ] ).prop( 'checked', false );
            }
        }
        selectedParentOption = event.target.id;
    }

    function navChildClicked( event ) {
        for ( var i = 0; i < nav_input_checkbox.length; i++ ) {
            $( nav_input_checkbox[ i ] ).prop( 'checked', false );
        }

        updateBreadCrumbs( event.target.innerHTML );
    }

    function updateBreadCrumbs( value ) {
        $rootScope.breadCrumbs = selectedParentOption + '  >  ' + value;
    }

    for ( var i = 0; i < nav_input_checkbox.length; i++ ) {
        nav_input_checkbox[ i ].addEventListener( 'click', navInputClicked, false );
    }

    for ( var i = 0; i < nav_child.length; i++ ) {
        nav_child[ i ].addEventListener( 'click', navChildClicked, false );
    }

    /* Navigation menu options event listeners*/    
}

} ) ( );
