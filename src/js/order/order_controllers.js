define(['../application',
    '../settings'
], function (OhFresh, Settings) {
    angular.module('ohFresh.order.controllers', ['ngCookies', 'ngRoute'])
        .controller('OrderCreateCtrl', ['$scope', '$cookieStore', '$rootScope', '$location', '$routeParams', '$http',
            function ($scope, $cookieStore, $rootScope, $location, $routeParams, $http) {
                $scope.customer = $cookieStore.get('customer');
                if ($scope.customer) {
                    $http.jsonp(Settings.addressQuery + "&customerId=" + $scope.customer.id).success(function (data) {
                        $scope.addresses = data || [];
                        if (!$rootScope.defaultAddress) {
                            for (var i = 0; i < $scope.addresses.length; i++) {
                                if ($scope.addresses[i].id = $scope.customer.addressId)
                                    $rootScope.defaultAddress = $scope.addresses[i];
                            }
                        }
                    });
                }
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
                            product.freight = $scope.freight ? Number($scope.freight) : 0;
                            totalPrice += Number(product.num) * Number(product.price) + Number(product.freight);
                            totalNum += 1;
                            products.push(product);
                        }
                    });
                    return {
                        price: totalPrice + ($scope.freight ? Number($scope.freight) : 0),
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
                };
                $scope.checkOut = function (products) {
                    var address = $rootScope.defaultAddress;
                    var url = Settings.orderCreateUrl;
                    url += "&products=" + angular.toJson(products);
                    url += "&name=" + ($scope.name ? $scope.name : address.name);
                    url += "&mobilephone=" + ($scope.mobilephone ? $scope.mobilephone : address.mobilephone);
                    url += "&customerId=" + ($scope.customer && $scope.customer.id ? $scope.customer.id : '');
                    var locationIds = address && address.locationId ? address.locationId.split('|') : [];
                    var countryId = $scope.country && $scope.country.id ? $scope.country.id : "";
                    var provinceId = $scope.province && $scope.province.id ? $scope.province.id : "";
                    var cityId = $scope.city && $scope.city.id ? $scope.city.id : "";
                    var countyId = $scope.county && $scope.county.id ? $scope.county.id : "";
                    if (locationIds.length == 4) {
                        countryId = locationIds[0];
                        provinceId = locationIds[1];
                        cityId = locationIds[2];
                        countyId = locationIds[3];
                    }
                    if (locationIds.length == 3) {
                        countryId = locationIds[0];
                        provinceId = locationIds[1];
                        cityId = locationIds[2];
                    }
                    if (locationIds.length == 2) {
                        countryId = locationIds[0];
                        provinceId = locationIds[1];
                    }
                    if (locationIds.length == 1) {
                        countryId = locationIds[0];
                    }
                    url += "&countryId=" + countryId;
                    url += "&provinceId=" + provinceId;
                    url += "&cityId=" + cityId;
                    url += "&countyId=" + countyId;
                    url += "&memo=" + ($scope.memo ? $scope.memo : '');
                    var homeaddress = $scope.assemblename ? $scope.assemblename : address.assemblename;
                    if (countryId && !$scope.country) {
                        angular.forEach($rootScope.countries, function (value) {
                            if (value.id = countryId)
                                $scope.country = value;
                        });
                    }
                    if (provinceId && !$scope.province) {
                        angular.forEach($rootScope.provinces, function (value) {
                            if (value.id = provinceId)
                                $scope.province = value;
                        });
                    }
                    if (cityId && !$scope.city) {
                        angular.forEach($rootScope.cities, function (value) {
                            if (value.id = cityId)
                                $scope.city = value;
                        });
                    }
                    if (countyId && !$scope.county) {
                        angular.forEach($rootScope.counties, function (value) {
                            if (value.id = countyId)
                                $scope.county = value;
                        });
                    }
                    homeaddress = (countryId ? $scope.country.name : "")
                        + (provinceId ? $scope.province.name : "")
                        + (cityId ? $scope.city.name : "")
                        + (countyId ? $scope.county.name : "") + homeaddress;
                    url += "&homeaddress=" + homeaddress;
                    OhFresh.showIndicator();
                    $http.jsonp(url).success(function (data) {
                        OhFresh.hideIndicator();
                        if (data && data.result == 1) {
                            OhFresh.addNotification({
                                title: "提示",
                                message: data.message,
                                hold: 3000
                            });
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
                        }
                    }).error(function () {
                        OhFresh.addNotification({
                            title: "提示",
                            message: "系统连接失败！请稍后重试...",
                            hold: 3000
                        });
                        OhFresh.hideIndicator();
                    });
                };
                $scope.goToSetp3 = function () {
                    if (!$rootScope.defaultAddress) {
                        var country = $scope.country ? $scope.country.name : '';
                        var province = $scope.province ? $scope.province.name : '';
                        var city = $scope.city ? $scope.city.name : '';
                        var county = $scope.county ? $scope.county.name : '';
                        $scope.currentAddress = {};
                        $scope.currentAddress.assemblename = country + province + city + county + ($scope.assemblename ? $scope.assemblename : '');
                        $scope.currentAddress.mobilephone = $scope.mobilephone ? $scope.mobilephone : "";
                        $scope.currentAddress.name = $scope.name ? $scope.name : "";
                    } else {
                        $scope.currentAddress = $rootScope.defaultAddress;
                    }
                    if (!$scope.currentAddress.assemblename || !$scope.currentAddress.mobilephone || !$scope.currentAddress.name) {
                        OhFresh.addNotification({
                            title: "提示",
                            message: "请先填写并完善配送信息！",
                            hold: 3000
                        });
                    } else {
                        $scope.step = 3;
                    }

                }
            }
        ]);
});