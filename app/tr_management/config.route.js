(function() {
    'use strict';

    angular
        .module('app.tr_management')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/tr_management',
                config: {
                    templateUrl: 'tr_management/tr_management.html',
                    controller: 'Tr_management',
                    controllerAs: 'vm',
                    title: 'Target Market',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> '
                    }
                }
            }
        ];
    }

})();