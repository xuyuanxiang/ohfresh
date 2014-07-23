define(['../application',
    '../settings'], function (OhFresh, Settings) {
    angular.module('ohFresh.home.controllers', ['ngRoute', 'ngCookies'])
        .controller('HomeCtrl', ['$scope', '$routeParams', '$cookieStore', '$http', '$rootScope', '$location',
            function ($scope, $routeParams, $cookieStore, $http, $rootScope, $location) {
                $scope.customer = $cookieStore.get('customer');
                if ($scope.customer) {
                    $rootScope.$broadcast('customer.change');
                }
                OhFresh.slider('#advertisementContainer .slider-container', {
                    pagination: '#advertisementContainer .slider-pagination',
                    autoplay: 4000
                });
                $rootScope.$broadcast('url.change');
                $rootScope.$broadcast('back.change', null);
                $scope.list = function () {
                    $scope.index = 0;
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
                };
                $scope.list();
                $scope.redToDetail = function (product) {
                    $rootScope.$broadcast('back.change', {url: '#/home' + new Date().getMilliseconds()});
                    $scope.currentProduct = product;
                    $scope.index = 1;
                };
                $scope.addToCart = function (productIns) {
                    if (!productIns.price) {
                        OhFresh.addNotification({
                            title: "提示",
                            message: "请选择要购买的产品类型！",
                            hold: 3000
                        });
                        return;
                    }
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
                    if (!product.price) {
                        OhFresh.addNotification({
                            title: "提示",
                            message: "请选择要购买的产品类型！",
                            hold: 3000
                        });
                        return;
                    }
                    var cart = [];
                    cart.push(product);
                    $cookieStore.put('cart', cart);
                    $location.url('/order/create?id=' + product.id);
                };
                $scope.selectProductIns = function (productins) {
                    $scope.currentProductIns = productins;
                    $scope.currentProductIns.num = 1;
                }
            }
        ]
    );
});
