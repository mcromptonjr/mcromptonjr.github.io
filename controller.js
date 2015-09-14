'use strict';

var cafeteriaControllers = angular.module('cafeteriaControllers', []);


cafeteriaControllers.controller('IndexCtrl', ['$scope', '$location', '$firebaseAuth', '$firebaseObject', '$firebaseArray',
    function($scope, $location, $firebaseAuth, $firebaseObject, $firebaseArray) {

        $scope.firebase = 'https://brilliant-inferno-4759.firebaseio.com/';
        console.log("index");

        var ref = new Firebase($scope.firebase);
        var auth = $firebaseAuth(ref);
        $scope.signOut = auth.$unauth;

        auth.$onAuth(
            function(authData) {
                if(authData === null) {
                    $scope.user = null;
                    $scope.cashier = null;
                    $location.path('/login');
                } else {
                    var userRef = new Firebase($scope.firebase + '/users/' + authData.uid);
                    $scope.user = $firebaseObject(userRef);

                    var cashRef = new Firebase($scope.firebase + '/cashiers/' + authData.uid);
                    $scope.cashier = $firebaseObject(cashRef);

                    var orderRef = new Firebase($scope.firebase + '/orders');
                    $scope.orders = $firebaseArray(orderRef);

                    if($scope.cashier === null) {
                        $scope.cashier = false;
                    }
                    $location.path('/stores')
                }
            }
        )
    }
]);

cafeteriaControllers.controller('LoginSubmitCtrl' , ['$scope', '$location', '$window', '$firebaseAuth',
    function($scope, $location, $window, $firebaseAuth) {
        /* Force use of HTTPS when logging in */
        if ($location.protocol() !== 'https') {
            $window.location.href = $location.absUrl().replace('http', 'https');
        }

        $scope.submit = function() {
            var ref = new Firebase($scope.firebase);
            var auth = $firebaseAuth(ref);

            var email = $("#form-signin #email").val();
            var password = $("#form-signin #password").val();

            $scope.authData = null;
            $scope.error = null;

            auth.$authWithPassword({
                email: email,
                password: password
            }).then(
                function(authData) {
                    $scope.authData = authData;
                }
            ).catch(
                function(error) {
                    $scope.error = 'You have entered an invalid email/password combination.';
                }
            );
        };
    }
]);

cafeteriaControllers.controller('OrderSubmitCtrl' , ['$scope', '$location', '$firebaseArray',
    function($scope, $location, $firebaseArray) {
        $scope.order = function() {
            var food = $scope.details.name;
            var name = $scope.user.first + ' ' + $scope.user.last;
            var time = $("#detailsForm #timepicker").val();
            var img = $scope.user.img;
            var status = "Ready";

            /* Get a sortable format of the input time value */
            time = time.replace(' ', ':');
            var pieces = time.split(':');
            var date = new Date();
            if(pieces[0] === '12' && pieces[2] === 'AM') {
                pieces[0] = '00';
            } else if(pieces[0] !== '12' && pieces[2] === 'PM') {
                pieces[0] = Number(pieces[0]) + 12;
            }
            date.setHours(pieces[0]);
            date.setMinutes(pieces[1]);

            $scope.orders.$add({
                food: food,
                name: name,
                time: time,
                sortTime: date.getTime(),
                img: img,
                status: status
            });
            $scope.ordered = true;
        };
    }
]);

cafeteriaControllers.controller('POSCtrl', ['$scope', '$firebaseArray',
    function($scope, $firebaseArray) {
        $scope.pickUp = function(id) {
            $scope.orders.$remove($scope.orders.$getRecord(id));
        };

        $scope.missed = function(id) {
            var order = $scope.orders.$getRecord(id);
            order.status = 'Missed';
            $scope.orders.$save(order);
        };
    }
]);

cafeteriaControllers.controller('StoreCtrl', ['$scope', '$firebaseArray',
    function($scope, $firebaseArray) {
        var ref = new Firebase($scope.firebase + '/stores');
        $scope.stores = $firebaseArray(ref);
    }
]);

cafeteriaControllers.controller('FoodCtrl', ['$scope', '$routeParams', '$firebaseArray',
    function($scope, $routeParams, $firebaseArray) {
        var ref = new Firebase($scope.firebase + '/food');
        var query = ref.orderByChild('store').equalTo(Number($routeParams.storeId));
        $scope.food = $firebaseArray(query);
    }
]);

cafeteriaControllers.controller('DetailsCtrl', ['$scope', '$routeParams', '$firebaseObject',
    function($scope, $routeParams, $firebaseObject) {
        var ref = new Firebase($scope.firebase + '/food/' + $routeParams.foodId);
        $scope.details = $firebaseObject(ref);
        $('#timepicker').timepicker({
            appendWidgetTo: 'body'
        });
    }
]);

/*
 posControllers.controller('PhoneListCtrl', ['$scope', 'Phone', function($scope, Phone) {
 $scope.phones = Phone.query();
 $scope.orderProp = 'age';
 }]);

 posControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', function($scope, $routeParams, Phone) {
 $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
 $scope.mainImageUrl = phone.images[0];
 });

 $scope.setImage = function(imageUrl) {
 $scope.mainImageUrl = imageUrl;
 }
 }]);
 */

/*
 posControllers.controller('PhoneListCtrl', ['$scope', '$http', function($scope, $http) {
 $scope.phoneURL = 'https://raw.githubusercontent.com/angular/angular-pos/master/app';
 $http.get($scope.phoneURL + '/phones/phones.json').success(function(data) {
 $scope.phones = data;
 });

 $scope.orderProp = 'age';
 }]);


 posControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', '$http',
 function($scope, $routeParams, $http) {
 $scope.phoneURL = 'https://raw.githubusercontent.com/angular/angular-pos/master/app';
 $http.get($scope.phoneURL + '/phones/' + $routeParams.phoneId + '.json').success(
 function(data) {
 $scope.phone = data;
 $scope.mainImageUrl = data.images[0];
 }
 );
 $scope.setImage = function(imageUrl) {
 $scope.mainImageUrl = imageUrl;
 };
 }
 ]);
 */