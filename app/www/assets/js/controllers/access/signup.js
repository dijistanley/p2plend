'use strict';

/* Controllers */

angular.module('app')
    .controller('SignupPageCtrl', ['$scope', 'AuthService', function($scope, AuthService) {
        
    	$scope.user = {email : "", password : ""};
        
        $scope.signin = function()
        {
            if($scope.email != "" && $scope.password != "" )
            {
                AuthService.signup($scope.email, $scope.password)
                    .then(
                        function(response){
                            return AuthService.signin($scope.email, $scope.password);
                        }
                    )
            }
        }
    }]);