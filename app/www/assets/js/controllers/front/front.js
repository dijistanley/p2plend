'use strict';

/* Controllers */

angular.module('app')
    .controller('FrontCtrl', ['$scope', function($scope) {
        $scope.app.layout.theme = "pages/css/pages-front.css";

    }]);