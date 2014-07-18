require(['./application',
    './home/home_routes',
    './customer/customer_routes',
    './order/order_routes',
    './address/address_routes'
], function (OhFresh) {
    angular.module('ohFresh', ['ohFresh.home', 'ohFresh.customer', 'ohFresh.order', 'ohFresh.address'])
        .controller('RootCtrl', ['$scope', '$cookieStore', '$location',
            function ($scope, $cookieStore, $location) {
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
            }
        ]);
    angular.bootstrap(document, ['ohFresh']);
    $('body').removeClass('init');
});
