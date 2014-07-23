define(['../application',
    '../settings'
], function (OhFresh, Settings) {
    angular.module('ohFresh.address.controllers', ['ngCookies', 'ngRoute'])
        .controller('AddressCtrl', ['$scope', '$http', '$cookieStore', '$location', '$rootScope', '$routeParams',
            function ($scope, $http, $cookieStore, $location, $rootScope, $routeParams) {
                $scope.customer = $cookieStore.get('customer');
                if (!$scope.customer)
                    return $location.url('#/customer/login');
//                $rootScope.$on('back.change', {url: '#/customer/info'});
                $scope.list = function () {
                    $scope.backUrl = $routeParams.from ? '#/' + $routeParams.from.replace('.', '/') : '';
                    if ($scope.backUrl) {
                        $rootScope.$broadcast('back.change', {url: $scope.backUrl});
                    }
                    OhFresh.showPreloader();
                    var url = Settings.addressQuery + "&customerId=" + $scope.customer.id;
                    $http.jsonp(url).success(function (data) {
                        OhFresh.hidePreloader();
                        $scope.addresses = data;
                        for (var i = 0; i < $scope.addresses.length; i++) {
                            if ($scope.addresses[i].id == $scope.customer.addressId) {
                                $scope.addresses[i].checked = true;
                                $rootScope.defaultAddress = $scope.addresses[i];
                                break;
                            }
                        }
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
                $scope.edit = function (address) {
                    if ($scope.backUrl)
                        $rootScope.$broadcast('back.change', null);
                    $scope.currentAddress = address || {};
                    $scope.currentAddress.name = $scope.currentAddress && $scope.currentAddress.name ? $scope.currentAddress.name : $scope.customer.name;
                    $scope.currentAddress.mobilephone = $scope.currentAddress && $scope.currentAddress.mobilephone ? $scope.currentAddress.mobilephone : $scope.customer.mobilephone;
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
                $scope.selected = function (address) {
                    if (address.checked) {
                        angular.forEach($scope.addresses, function (value) {
                            if (value.id != address.id)
                                value.checked = false;
                        });
                        $rootScope.defaultAddress = address;
                    } else {
                        if ($rootScope.defaultAddress.id = address.id)
                            $rootScope.defaultAddress = null;
                    }
                    $scope.defaultConfig();
                };
                $scope.remove = function (address) {
                    if (address && address.id) {
                        var url = Settings.addressRemove;
                        url += "&id=" + address.id;
                        OhFresh.showIndicator();
                        $http.jsonp(url).success(function (data) {
                            OhFresh.hideIndicator();
                            if (data && data.result == 1) {
                                OhFresh.addNotification({
                                    title: "提示",
                                    message: "删除成功！",
                                    hold: 2000
                                });
                                $scope.list();
                            } else {
                                OhFresh.addNotification({
                                    title: "提示",
                                    message: "删除失败，请稍后重试。。。",
                                    hold: 3000
                                });
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
                $scope.defaultConfig = function () {
                    if ($rootScope.defaultAddress) {
                        OhFresh.showIndicator();
                        $http.jsonp(Settings.addressDefault +
                            "&customerId=" + $scope.customer.id +
                            "&addressId=" + $rootScope.defaultAddress.id)
                            .success(function (data) {
                                OhFresh.hideIndicator();
                                if (data && data.result == 1) {
                                    OhFresh.addNotification({
                                        title: "提示",
                                        message: "设置成功",
                                        hold: 2000
                                    });
                                    $scope.customer.addressId = $rootScope.defaultAddress.id;
                                    $cookieStore.put('customer', $scope.customer);
                                    if ($scope.backUrl)
                                        $location.url($scope.backUrl);
                                } else {
                                    OhFresh.addNotification({
                                        title: "提示",
                                        message: "设置失败！请稍后重试。。。",
                                        hold: 2000
                                    });
                                }
                            }).error(function () {
                                OhFresh.hideIndicator();
                                OhFresh.addNotification({
                                    title: "提示",
                                    message: "系统连接失败！请稍后重试...",
                                    hold: 3000
                                });
                            });
                    } else {
                        OhFresh.addNotification({
                            title: "提示",
                            message: "请选择一个地址，或新建一个地址作为默认地址！",
                            hold: 3000
                        });
                    }
                };
                $scope.cancel = function () {
                    if ($scope.backUrl)
                        $rootScope.$broadcast('back.change', null);
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
                        url += "&mobilephone=" + address.mobilephone;
                        url += "&name=" + address.name;
                        url += "&countryId=" + ($scope.country ? $scope.country.id : '');
                        url += "&provinceId=" + ($scope.province ? $scope.province.id : '');
                        url += "&cityId=" + ($scope.city ? $scope.city.id : '');
                        url += "&countyId=" + ($scope.county ? $scope.county.id : '');
                        url += "&homeaddress=" + ($scope.country ? $scope.country.name : '')
                            + ($scope.province ? $scope.province.name : '')
                            + ($scope.city ? $scope.city.name : '')
                            + ($scope.county ? $scope.county.name : '')
                            + (address.assemblename ? address.assemblename : '');
                        $http.jsonp(url).success(function (data) {
                            OhFresh.hideIndicator();
                            if (data && data.result == 1) {
                                OhFresh.addNotification({
                                    title: "提示",
                                    message: "保存成功！",
                                    hold: 2000
                                });
                                $scope.list();
                                $scope.index = 0;
                                $scope.currentAddress = null;
                            } else {
                                OhFresh.addNotification({
                                    title: "提示",
                                    message: "保存失败，请稍后重试。。。",
                                    hold: 3000
                                });
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