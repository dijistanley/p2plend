﻿'use strict';

/* Controllers */

angular.module('app')
    .controller('AccountCtrl', ['$scope', 'userInfoFactory', function ($scope, userInfoFactory) {
        $scope.userInfo = userInfoFactory.userInfo;
        $scope.form = {};

    }])

;
