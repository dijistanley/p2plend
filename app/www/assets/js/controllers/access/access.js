'use strict';

/* Controllers */

angular.module('app')
    .controller('AccessCtrl', ['$scope', function($scope) {
        $scope.app.layout.theme = "pages/css/pages.css";

    }]);