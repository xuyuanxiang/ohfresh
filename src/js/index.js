require(['./application',
    './settings',
    './home/home_routes',
    './customer/customer_routes',
    './order/order_routes',
    './address/address_routes'
], function (OhFresh, Settings) {
    angular.module('ohFresh', ['ohFresh.home', 'ohFresh.customer', 'ohFresh.order', 'ohFresh.address'])
        .controller('RootCtrl', ['$scope', '$cookieStore', '$location', '$http', '$rootScope',
            function ($scope, $cookieStore, $location, $http, $rootScope) {
                $scope.$on('carts.change', function () {
                    $scope.cartItemNum = $cookieStore.get('carts') ? $cookieStore.get('carts').length : 0;
                    OhFresh.sizeNavbars('.view-main');
                });
                $scope.$on('customer.change', function () {
                    $scope.hasLogin = $cookieStore.get('customer');
                    OhFresh.sizeNavbars('.view-main');
                });
                $scope.$on('url.change', function () {
                    $scope.currentHref = $location.url()
                    OhFresh.sizeNavbars('.view-main');
                });
                $scope.$on('back.change', function (scope, data) {
                    $scope.backUrl = data ? data.url : null;
                    OhFresh.sizeNavbars('.view-main');
                });
                $scope.hasLogin = $cookieStore.get('customer');
                $scope.currentHref = $location.path();
                $scope.cartItemNum = $cookieStore.get('carts') ? $cookieStore.get('carts').length : 0;
                OhFresh.sizeNavbars('.view-main');
                $http.jsonp(Settings.locationUrl).success(function (data) {
                    $rootScope.countries = angular.fromJson(data) || [];
                    $rootScope.provinces = $scope.countries.length > 0 ? $scope.countries[0].children : [];
                    $rootScope.cities = $scope.provinces.length > 0 ? $scope.provinces[0].children : [];
                    $rootScope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                });
                $rootScope.countryChange = function (country) {
                    $rootScope.provinces = country.children || [];
                    $rootScope.cities = $scope.provinces.length > 0 ? $scope.provinces[0].children : [];
                    $rootScope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                };
                $rootScope.provinceChange = function (province) {
                    $rootScope.cities = province.children || [];
                    $rootScope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                };
                $rootScope.cityChange = function (city) {
                    $rootScope.counties = city.children || [];
                };
            }
        ]);

    angular.bootstrap(document, ['ohFresh']);
    $('body').removeClass('init');
});
