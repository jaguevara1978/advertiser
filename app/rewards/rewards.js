(function() {
    'use strict';
    /**
     * @ngdoc function
     * @name app.controller:Rewards
     * @description
     * # Rewards
     * Controller of the Rewards view
     */
    angular.module('app.rewards').controller('Rewards', Rewards); /*@ngInject*/

    function Rewards( TriviaService, $rootScope, ApiService, Notification ) {
        var vm = this;
        
        initController();

        function initController() {
            $rootScope.breadCrumbs = 'Under construction  <i class="fa fa-wrench"></i>';
        }
    }
})();