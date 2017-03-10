'use strict';

/* Controllers */

angular.module('app')

.controller('SearchCtrl', ['$scope', function($scope) {

    $scope.liveSearch = function() {
        console.log("Live search for: " + $scope.search.query);
        // fetch results from server based on search.query and location
    }

    $scope.search = { 
        query: '',
        location : {},
        locationOptions: {
            componentRestrictions: {country: 'ng'},
            types: ['regions']    
        },
        results: []
     };


}]);