'use strict';

// Declare app level module which depends on views, and components
var cafeteriaApp = angular.module('cafeteriaApp', [
    'ngRoute',
    'cafeteriaControllers',
    'firebase'
]);

cafeteriaApp.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase('https://brilliant-inferno-4759.firebaseio.com/');
        return $firebaseAuth(ref);
    }
]);

cafeteriaApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'partials/login.html',
                resolve: {
                    'currentAuth': ['Auth',
                        function(Auth){
                            return Auth.$waitForAuth();
                        }]
                }
            }).
            when('/pos', {
                templateUrl: 'partials/pos/pos.html',
                controller: 'POSCtrl',
                resolve: {
                    'currentAuth': ['Auth',
                        function(Auth) {
                            return Auth.$requireAuth();
                        }]
                }
            }).
            when('/stores', {
                templateUrl: 'partials/order/stores.html',
                controller: 'StoreCtrl',
                resolve: {
                    'currentAuth': ['Auth',
                        function(Auth){
                            return Auth.$requireAuth();
                        }]
                }
            }).
            when('/stores/:storeId', {
                templateUrl: 'partials/order/food.html',
                controller: 'FoodCtrl',
                resolve: {
                    'currentAuth': ['Auth',
                        function(Auth){
                            return Auth.$requireAuth();
                        }]
                }
            }).
            when('/stores/order/:foodId', {
                templateUrl: 'partials/order/details.html',
                controller: 'DetailsCtrl',
                resolve: {
                    'currentAuth': ['Auth',
                        function(Auth){
                            return Auth.$requireAuth();
                        }]
                }
            }).
            otherwise({
                redirectTo: '/login'
            });
    }
]).run(
    function($rootScope, $location) {
        $rootScope.$on('$routeChangeError',
            function(event, next, previous, error) {
                if(error === 'AUTH_REQUIRED') {
                    $location.path('/login');
                }
            }
        );
    }
);

cafeteriaApp.directive('cafeteriaHeader',
    function() {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'partials/header.html'
        }
    }
);



/*
 POSApp.controller('PhoneListCtrl', function($scope, $http) {
 $scope.phoneURL = 'https://raw.githubusercontent.com/angular/angular-pos/master/app';

 /*
 $http.get($scope.phoneURL + '/phones/phones.json').success(function(data) {
 $scope.phones = data;
 });

 /*
 $scope.phones = [
 {'name' : 'Nexus S',
 'snippet' : 'Fast just got faster with Nexus S',
 'age' : 1},
 {'name' : 'Motorola XOOM with Wi-Fi',
 'snippet' : 'The Next, Next Generation tablet.',
 'age' : 2},
 {'name' : 'Motorola XOOM',
 'snippet' : 'The Next, Next Generation tablet.',
 'age' : 3}
 ];

 $scope.orderProp = 'age';
 });
 */