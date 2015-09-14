var cafeteriaServices = angular.module('cafeteriaServices', ['ngResource']);

cafeteriaServices.factory('POS', ['$resource',
    function($resource){
        return $resource('localhost:8000/hello/', {}, {
            query: {method:'GET', params:{}, isArray:true}
        });
    }
]);