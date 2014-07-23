define([''], function () {
    angular.module('ohFresh.product.controllers', [])
        .controller('ProductDetailCtrl', ['$scope', '$rootScope',
            function ($scope, $rootScope) {
                alert(angular.toJson($rootScope.currentProduct));
            }
        ]);
});