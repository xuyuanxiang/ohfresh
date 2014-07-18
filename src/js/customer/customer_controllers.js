define(['../application',
    '../settings'
], function (OhFresh, Settings) {
    angular.module('ohFresh.customer.controllers', ['ngCookies'])
        .controller('LoginCtrl', ['$scope', '$http', '$location', '$cookieStore', '$rootScope',
            function ($scope, $http, $location, $cookieStore, $rootScope) {
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
                                    $location.url('/home');
                                    $rootScope.$broadcast('url.change');
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
                var data = {url: '#/customer/login'};
                $rootScope.$broadcast('back.change', data);
                $http.jsonp(Settings.locationUrl).success(function (data) {
                    $scope.countries = angular.fromJson(data) || [];
                    $scope.provinces = $scope.countries.length > 0 ? $scope.countries[0].children : [];
                    $scope.cities = $scope.provinces.length > 0 ? $scope.provinces[0].children : [];
                    $scope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                });
                $scope.countryChange = function (country) {
                    $scope.provinces = country.children || [];
                    $scope.cities = $scope.provinces.length > 0 ? $scope.provinces[0].children : [];
                    $scope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                };
                $scope.provinceChange = function (province) {
                    $scope.cities = province.children || [];
                    $scope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                };
                $scope.cityChange = function (city) {
                    $scope.counties = city.children || [];
                };
                //注册
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
                        alert(url);
                        OhFresh.showIndicator();
                        $http.jsonp(url).success(function (data) {
                            OhFresh.hideIndicator();
                            data.password = '';
                            $cookieStore.put('customer', data);
                            OhFresh.addNotification({
                                title: '提示',
                                message: data.message,
                                hold: 2000
                            });
                            $rootScope.$broadcast('customer.change');
                            $location.url('/home');
                            $rootScope.$broadcast('url.change');
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
