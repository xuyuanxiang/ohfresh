define(['./address_controllers'], function () {
    angular.module('ohFresh.address', ['ngRoute', 'ohFresh.address.controllers'])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.when('/address', {
                    templateUrl: 'tpl/address/list.html',
                    controller: 'AddressCtrl'
                });
            }
        ]);
});