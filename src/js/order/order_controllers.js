define(['../application',
    '../settings'
], function (OhFresh, Settings) {
    angular.module('ohFresh.order.controllers', ['ngCookies', 'ngRoute'])
        .controller('OrderCreateCtrl', ['$scope', '$cookieStore', '$rootScope', '$location', '$routeParams',
            function ($scope, $cookieStore, $rootScope, $location, $routeParams) {
                $rootScope.$broadcast('url.change');
                $rootScope.$broadcast('back.change', null);
                if ($routeParams.id) {
                    $scope.products = $cookieStore.get('cart');
                    $scope.products[0].checked = true;
                } else {
                    $scope.products = $cookieStore.get('carts');
                }
                $scope.total = function () {
                    var totalPrice = 0;
                    var totalNum = 0;
                    var products = [];
                    angular.forEach($scope.products, function (product) {
                        if (product.checked) {
                            totalPrice += Number(product.num) * Number(product.price);
                            totalNum += 1;
                            products.push(product);
                        }
                    });
                    return {
                        price: totalPrice,
                        num: totalNum,
                        products: products
                    };
                };
                $scope.removeFromCart = function (product) {
                    var newProducts = [];
                    angular.forEach($scope.products, function (item) {
                        if (item.id != product.id) {
                            newProducts.push(item);
                        }
                    });
                    $scope.products = newProducts;
                    $cookieStore.put('carts', $scope.products);
                    $rootScope.$broadcast('carts.change');
                    if ($routeParams.id) {
                        $location.url('#/home');
                        $rootScope.$broadcast('url.change');
                    } else {
                        $location.url('#/order/create');
                        $rootScope.$broadcast('url.change');
                    }

                };
                $scope.checkOut = function (products) {
                    var newProducts = [];
                    angular.forEach($scope.products, function (oldPro) {
                        var flag = true;
                        angular.forEach(products, function (newPro) {
                            if (oldPro.id === newPro.id)
                                flag = false;
                        });
                        if (flag)
                            newProducts.push(oldPro);
                    });
                    $scope.products = newProducts;
                    $cookieStore.put('carts', $scope.products);
                    $rootScope.$broadcast('carts.change');
                    var customer = $cookieStore.get('customer');
                    if (customer)
                        alert(angular.toJson(products));
                };

            }
        ]);
});