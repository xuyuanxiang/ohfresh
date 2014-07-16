define(['./home_controllers'], function () {
    angular.module('ohFresh.home', ['ngRoute', 'ohFresh.home.controllers'])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.when('/home', {
                    templateUrl: 'tpl/home/home.html',
                    controller: 'HomeCtrl'
                });
                $routeProvider.otherwise({
                    redirectTo: '/home'
                });
            }
        ]
    );
});
