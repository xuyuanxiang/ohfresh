define(['../application',
    '../settings'], function (OhFresh, Settings) {
    angular.module('ohFresh.home.controllers', ['ngRoute', 'ngCookies', 'angularMoment'])
        .controller('HomeCtrl', ['$scope', '$routeParams', '$cookieStore', '$http', '$rootScope', '$location',
            function ($scope, $routeParams, $cookieStore, $http, $rootScope, $location) {
                $rootScope.$broadcast('url.change');
                $rootScope.$broadcast('back.change', null);
                $scope.time = new Date();
                OhFresh.showPreloader();
                var url = Settings.homeUrl;
                $http.jsonp(url).success(function (data) {
                    OhFresh.hidePreloader();
                    $scope.channels = data;
                }).error(function () {
                    OhFresh.hidePreloader();
                    OhFresh.addNotification({
                        title: "提示",
                        message: "系统连接失败！请稍后重试...",
                        hold: 3000
                    });
                });
                $scope.addToCart = function (productIns) {
                    var carts = $cookieStore.get('carts') || [];
                    var newCarts = [];
                    var flag = true;
                    angular.forEach(carts, function (value) {
                        if (value.id != productIns.id) {
                            newCarts.push(value);
                        } else {
                            flag = false;
                            OhFresh.addNotification({
                                title: '提示',
                                additionalClass: 'addToCartExistNotification',
                                message: '购物车中已包含该商品！',
                                hold: 2500
                            });
                        }
                    });
                    newCarts.push(productIns);
                    $cookieStore.put('carts', newCarts);
                    if (flag) {
                        OhFresh.addNotification({
                            title: '提示',
                            additionalClass: 'addToCartSuccessNotification',
                            message: '添加成功！',
                            hold: 2500
                        });
                    }
                    $rootScope.$broadcast('carts.change');
                };
                $scope.createOrder = function (product) {
                    var cart = [];
                    cart.push(product);
                    $cookieStore.put('cart', cart);
                    $location.url('/order/create?id=' + product.id);
                }
            }
        ]
    );
});
