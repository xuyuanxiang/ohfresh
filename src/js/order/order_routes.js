define(['./order_controllers'
], function () {
    angular.module('ohFresh.order', ['ngRoute', 'ohFresh.order.controllers'])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.when('/order/create', {
                    templateUrl: 'tpl/order/create.html',
                    controller: 'OrderCreateCtrl'
                });
            }
        ]);
});