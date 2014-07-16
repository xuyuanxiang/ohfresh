require(['./home/home_routes',
    './customer/customer_routes',
    './order/order_routes'
], function () {
    angular.module('ohFresh', ['ohFresh.home', 'ohFresh.customer', 'ohFresh.order']);
    angular.bootstrap(document, ['ohFresh']);
});

function ToolbarCtrl($scope, $rootScope, $cookieStore, $location) {
    $rootScope.$on('carts.change', function () {
        $scope.cartItemNum = $cookieStore.get('carts') ? $cookieStore.get('carts').length : 0;
    });
    $rootScope.$on('customer.change', function () {
        $scope.hasLogin = $cookieStore.get('customer');
    });
    $rootScope.$on('url.change', function () {
        $scope.currentHref = $location.url();
    });
    $rootScope.$on('back.change', function (scope, data) {
        $scope.backUrl = data ? data.url : null;
    });
    $scope.hasLogin = $cookieStore.get('customer');
    $scope.currentHref = $location.path();
    $scope.cartItemNum = $cookieStore.get('carts') ? $cookieStore.get('carts').length : 0;
}
