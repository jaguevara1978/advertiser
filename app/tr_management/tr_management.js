( function ( ) {
'use strict';

/**
 * @ngdoc function
 * @name app.controller:Tr_management
 * @description
 * # Tr_management
 * Controller of the app
 */
angular.module( 'app.tr_management' ).controller( 'Tr_management', Tr_management );

/*@ngInject*/
function Tr_management( $rootScope, Notification, ApiService, $scope )  {
    var vm = this;

    $rootScope.loading = false;
    vm.update = update;
    
    // 0 - OK Saved, 1 - Edited SavePending, 2 - Saving, -1 - Errors to fix
    vm.savingStatus = 0;
    vm.countCategoriesSelected = 0;

    initialize( );

    function initialize( ) {
        $rootScope.breadCrumbs = 'Traffic  >  Target Market';

        get( );
    }

    function get( ) {
        $rootScope.loading = true;
        ApiService.get( 'tr_mgmt', '0' )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.base = response.data;

                    //console.log( vm.base );
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

        ApiService.put( 'tr_mgmt', vm.base )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;

                    Notification.success( 'Your configuration has been successfully updated' );
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