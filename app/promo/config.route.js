(function() {
    'use strict';

    angular
        .module('app.promo')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/promo',
                config: {
                    templateUrl: 'promo/promo.html',
                    controller: 'Promo',
                    controllerAs: 'vm',
                    title: 'Promotions',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> trivia'
                    }
                }
            }
        ];
    }

})();