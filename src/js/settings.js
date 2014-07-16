define([], function () {
    var baseUrl = 'http://localhost:8080/tjpowermgm/';
    return {
        loginUrl: baseUrl + 'customers?callback=JSON_CALLBACK',
        registerUrl: baseUrl + 'customer/save?callback=JSON_CALLBACK',
        homeUrl: baseUrl + 'productins/getFrontPageMessage?callback=JSON_CALLBACK',
        orderCreateUrl: baseUrl + 'eorder/save?callback=JSON_CALLBACK',
        locationUrl: baseUrl + 'customer/getArea?callback=JSON_CALLBACK'
    }
});