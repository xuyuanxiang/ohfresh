define([], function () {
    var baseUrl = 'http://192.168.0.103:8080/tjpowermgm/';
    return {
        loginUrl: baseUrl + 'customers?callback=JSON_CALLBACK',
        registerUrl: baseUrl + 'customer/save?callback=JSON_CALLBACK',
        homeUrl: baseUrl + 'productins/getFrontPageMessage?callback=JSON_CALLBACK',
        orderCreateUrl: baseUrl + 'eorder/save?callback=JSON_CALLBACK',
        locationUrl: baseUrl + 'customer/getArea?callback=JSON_CALLBACK',
        addressQuery: baseUrl + 'eaddress/getReceversByCustomerId?callback=JSON_CALLBACK',
        addressUpdate: baseUrl + 'eaddress/updateAddress?callback=JSON_CALLBACK',
        addressCreate: baseUrl + 'eaddress/saveAddress?callback=JSON_CALLBACK',
        addressRemove: baseUrl + 'eaddress/deleteAddress?callback=JSON_CALLBACK',
        addressDefault: baseUrl + 'customer/changeAddressId?callback=JSON_CALLBACK'
    }
});
