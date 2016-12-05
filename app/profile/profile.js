( function ( ) {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:Profile
 * @description
 * # LoginCtrl
 * Controller of the app
 */
angular.module( 'app.profile' ).controller( 'Profile', Profile );

/*@ngInject*/
function Profile( $rootScope, Notification, ApiService, $scope )  {
    var vm = this;
    $rootScope.loading = false;

    vm.update = update;

    // 0 - OK Saved, 1 - Edited SavePending, 2 - Saving, -1 - Errors to fix
    vm.savingStatus = 0;
    vm.countCategoriesSelected = 0;

    initialize( );

    function initialize( ) {
        $rootScope.breadCrumbs = 'Profile  >  Corporate Info';
        get( );
    }

    function get( ) {
        $rootScope.loading = true;
        ApiService.get( 'contact', '0' )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.profile = response.data;

                    //console.log( vm.profile );

                    $scope.$watchCollection( angular.bind( vm, function ( ) {
                        return vm.profile.data;
                    } ), function ( newValue, oldValue ) {
                          if ( newValue !== oldValue) {
//                             console.log( newValue );
                            vm.savingStatus = 1;
                          }
                    } );    
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;
                    return { };
                }

                $rootScope.loading = false;
            });
    }

    function update( ) {
        $rootScope.loading = true;
        vm.savingStatus = 2;

        ApiService.put( 'contact', vm.profile )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;

//                     console.log( payload );

                    Notification.success( 'Your profile has been successfully updated' );
                    vm.savingStatus = 0;
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;

                    return { };
                }

                $rootScope.loading = false;
            });
    }
}
})();