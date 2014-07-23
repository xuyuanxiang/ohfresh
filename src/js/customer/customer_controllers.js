define(['../application',
    '../settings'
], function (OhFresh, Settings) {
    angular.module('ohFresh.customer.controllers', ['ngCookies', 'ngRoute'])
        .controller('LoginCtrl', ['$scope', '$http', '$location', '$cookieStore', '$rootScope', '$routeParams',
            function ($scope, $http, $location, $cookieStore, $rootScope, $routeParams) {
                $scope.currentId = $routeParams.id;
                $scope.customer = $cookieStore.get('customer');
                if ($scope.customer) {
                    $rootScope.$broadcast('url.change');
                    $location.url('/customer/info');
                    return;
                }
                $rootScope.$broadcast('url.change');
                $rootScope.$broadcast('url.change');
                $rootScope.$broadcast('back.change', null);
                $scope.loginFormSubmit = function () {
                    if ($scope.loginForm.$valid) {
                        OhFresh.showIndicator();
                        var mobileReg = new RegExp('^1[0-9]{10,11}$');
                        var emailReg = new RegExp('^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$');
                        var weChatReg = new RegExp('^[a-zA-Z]{1}([a-zA-Z0-9]|[._-]){5,19}$');
                        var url = Settings.loginUrl + "&password=" + $scope.password;
                        if (mobileReg.test($scope.account))
                            url += "&mobilephone=" + $scope.account;
                        if (emailReg.test($scope.account))
                            url += "&email=" + $scope.account;
                        if (weChatReg.test($scope.account))
                            url += "&wechatcode=" + $scope.account;
                        $http.jsonp(url).success(
                            function (data) {
                                OhFresh.hideIndicator();
                                if (!data || !data.id) {
                                    OhFresh.addNotification({
                                        title: '提示',
                                        message: '账号或密码输入错误！',
                                        hold: 3000
                                    });
                                } else {
                                    data.password = '';
                                    $cookieStore.put('customer', data);
                                    OhFresh.addNotification({
                                        title: '提示',
                                        message: '登录成功！',
                                        hold: 2000
                                    });
                                    $rootScope.$broadcast('customer.change');
                                    if ($rootScope.currentId == data.id) {
                                        $rootScope.$broadcast('url.change');
                                        $location.url('/customer/info');
                                    } else {
                                        $rootScope.$broadcast('url.change');
                                        $location.url('/home');
                                    }
                                }
                            }
                        ).error(function () {
                                OhFresh.addNotification({
                                    title: "提示",
                                    message: "系统连接失败！请稍后重试...",
                                    hold: 3000
                                });
                                OhFresh.hideIndicator();
                            });
                    }
                }
            }
        ]).controller('RegisterCtrl', ['$scope', '$http', '$cookieStore', '$location', '$rootScope',
            function ($scope, $http, $cookieStore, $location, $rootScope) {
                $rootScope.$broadcast('back.change', {url: '#/customer/login'});
                $scope.doRegister = function () {
                    if ($scope.formRegister.$valid) {
                        var url = Settings.registerUrl;
                        url += "&name=" + $scope.name;
                        url += "&mobilephone=" + $scope.mobilephone;
                        url += "&password=" + $scope.password;
                        url += "&email=" + ($scope.email ? $scope.email : '');
                        url += "&wechatcode=" + ($scope.wechatcode ? $scope.wechatcode : '');
                        url += "&countryId=" + ($scope.country ? $scope.country.id : '');
                        url += "&provinceId=" + ($scope.province ? $scope.province.id : '');
                        url += "&cityId=" + ($scope.city ? $scope.city.id : '');
                        url += "&countyId=" + ($scope.county ? $scope.county.id : '');
                        url += "&homeaddress=" + ($scope.country ? $scope.country.name : '')
                            + ($scope.province ? $scope.province.name : '')
                            + ($scope.city ? $scope.city.name : '')
                            + ($scope.county ? $scope.county.name : '')
                            + ($scope.homeaddress ? $scope.homeaddress : '');
                        OhFresh.showIndicator();
                        $http.jsonp(url).success(function (data) {
                            OhFresh.hideIndicator();
                            OhFresh.addNotification({
                                title: '提示',
                                message: data.message,
                                hold: 2000
                            });
                            if (data.result == 1) {
                                data.password = '';
                                $cookieStore.put('customer', data);
                                $rootScope.$broadcast('customer.change');
                                $location.url('/home');
                                $rootScope.$broadcast('url.change');
                            }
                        }).error(function () {
                            OhFresh.addNotification({
                                title: "提示",
                                message: "系统连接失败！请稍后重试...",
                                hold: 3000
                            });
                            OhFresh.hideIndicator();
                        });
                    }
                }
            }
        ]).controller('InfoCtrl', ['$scope', '$cookieStore', '$location', '$rootScope',
            function ($scope, $cookieStore, $location, $rootScope) {
                $rootScope.$broadcast('url.change');
                $rootScope.$broadcast('back.change', null);
                $scope.customer = $cookieStore.get('customer');
                if (!$scope.customer) {
                    return $location.url('/customer/login');
                }
                $scope.logout = function () {
                    $cookieStore.put('customer', null);
                    $rootScope.$broadcast('customer.change');
                    $location.url('/customer/login');
                    $rootScope.$broadcast('url.change');
                }
            }
        ]);
});
