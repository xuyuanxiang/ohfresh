define(['../application',
    '../settings'
], function (OhFresh, Settings) {
    angular.module('ohFresh.address.controllers', ['ngCookies'])
        .controller('AddressCtrl', ['$scope', '$http', '$cookieStore', '$location', '$rootScope',
            function ($scope, $http, $cookieStore, $location, $rootScope) {
                $scope.customer = $cookieStore.get('customer');
                if (!$scope.customer)
                    return $location.url('#/customer/login');
                $rootScope.$on('back.change', {url: '#/customer/info'});

                $scope.list = function () {
                    OhFresh.showPreloader();
                    var url = Settings.addressQuery + "&customerId=" + $scope.customer.id;
                    $http.jsonp(url).success(function (data) {
                        $scope.addresses = data;
                        $http.jsonp(Settings.locationUrl).success(function (data) {
                            OhFresh.hidePreloader();
                            $scope.countries = angular.fromJson(data) || [];
                            $scope.provinces = $scope.countries.length > 0 ? $scope.countries[0].children : [];
                            $scope.cities = $scope.provinces.length > 0 ? $scope.provinces[0].children : [];
                            $scope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                        }).error(function () {
                            OhFresh.hidePreloader();
                            OhFresh.addNotification({
                                title: "提示",
                                message: "系统连接失败！请稍后重试...",
                                hold: 3000
                            });
                        });
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
                $scope.edit = function (address) {
                    $scope.currentAddress = address || {};
                    $scope.currentAddress.name = $scope.currentAddress.name ? $scope.currentAddress.name : $scope.customer.name;
                    $scope.currentAddress.mobilephone = $scope.currentAddress.mobilephone ? $scope.currentAddress.mobilephone : $scope.customer.mobilephone;
                    $scope.index = 1;
                    if ($scope.currentAddress && $scope.currentAddress.locationId) {
                        for (var i = 0; $scope.countries && i < $scope.countries.length; i++) {
                            if ($scope.currentAddress.locationId.indexOf($scope.countries[i].id) >= 0) {
                                $scope.country = $scope.countries[i];
                                $scope.currentAddress.assemblename = $scope.currentAddress.assemblename.replace($scope.country.name, '');
                                break;
                            }
                        }
                        for (var j = 0; $scope.provinces && j < $scope.provinces.length; j++) {
                            if ($scope.currentAddress.locationId.indexOf($scope.provinces[j].id) >= 0) {
                                $scope.province = $scope.provinces[j];
                                $scope.currentAddress.assemblename = $scope.currentAddress.assemblename.replace($scope.province.name, '');
                                break;
                            }
                        }
                        for (var k = 0; $scope.cities && k < $scope.cities.length; k++) {
                            if ($scope.currentAddress.locationId.indexOf($scope.cities[k].id) >= 0) {
                                $scope.city = $scope.cities[k];
                                $scope.currentAddress.assemblename = $scope.currentAddress.assemblename.replace($scope.city.name, '');
                                break;
                            }
                        }
                        for (var l = 0; $scope.counties && l < $scope.counties.length; l++) {
                            if ($scope.currentAddress.locationId.indexOf($scope.counties[l].id) >= 0) {
                                $scope.county = $scope.counties[l];
                                $scope.currentAddress.assemblename = $scope.currentAddress.assemblename.replace($scope.county.name, '');
                                break;
                            }
                        }
                    } else {
                        $scope.county = $scope.counties ? $scope.counties[0] : null;
                    }
                };
                $scope.remove = function (address) {

                };
                $scope.back = function () {
                    $scope.index = 0;
                    $scope.currentAddress = null;
                };
                $scope.doSave = function () {
                    var address = $scope.currentAddress;
                    if (address && $scope.customer) {
                        OhFresh.showIndicator();
                        var url = address.id ? Settings.addressUpdate : Settings.addressCreate;
                        if (address.id)
                            url += "&id=" + address.id;
                        url += "&customerId=" + $scope.customer.id;
                        url += "&mobilephone=" + $scope.customer.mobilephone;
                        url += "&name=" + $scope.customer.name;
                        url += "&countryId=" + ($scope.country ? $scope.country.id : '');
                        url += "&provinceId=" + ($scope.province ? $scope.province.id : '');
                        url += "&cityId=" + ($scope.city ? $scope.city.id : '');
                        url += "&countyId=" + ($scope.county ? $scope.county.id : '');
                        url += "&homeaddress=" + ($scope.country ? $scope.country.name : '')
                            + ($scope.province ? $scope.province.name : '')
                            + ($scope.city ? $scope.city.name : '')
                            + ($scope.county ? $scope.county.name : '')
                            + ($scope.homeaddress);
                        $http.jsonp(url).success(function (data) {
                            OhFresh.hideIndicator();
                            if (data) {
                                OhFresh.addNotification({
                                    title: "提示",
                                    message: "保存成功！",
                                    hold: 2000
                                });
                                $scope.list();
                            }
                        }).error(function () {
                            OhFresh.hideIndicator();
                            OhFresh.addNotification({
                                title: "提示",
                                message: "系统连接失败！请稍后重试...",
                                hold: 3000
                            });
                        });
                    }

                };
            }
        ]);
});