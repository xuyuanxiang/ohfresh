define(['./product_controllers'], function () {
    angular.module('ohFresh.product', ['ngRoute', 'ohFresh.product.controllers'])
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.when('/product/detail', {
                    templateUrl: 'tpl/product/detail.html',
                    controller: 'ProductDetailCtrl'
                });
            }
        ]);
});