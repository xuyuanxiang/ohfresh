define(['./customer_controllers'], function () {
    angular.module('ohFresh.customer', ['ngRoute', 'ohFresh.customer.controllers'])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.when('/login', {
                    templateUrl: 'tpl/customer/login.html',
                    controller: 'LoginCtrl'
                });
                $routeProvider.when('/customer/register', {
                    templateUrl: 'tpl/customer/register.html',
                    controller: 'RegisterCtrl'
                });
                $routeProvider.when('/customer/info', {
                    templateUrl: 'tpl/customer/info.html',
                    controller: 'InfoCtrl'
                });
            }
        ]
    );
});
