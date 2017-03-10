'use strict';

/* Controllers */

angular.module('app')
    .controller('LoginPageCtrl', ['$scope', 'AuthService', function($scope, AuthService) {
        
    	$scope.user = {username : "", password : ""};
        
        $scope.signin = function()
        {
            if($scope.username != "" && $scope.password != "" )
            {
                AuthService.signin($scope.username, $scope.password)
                .then(
                    function(response){
                        if(AuthService.isAuthenticated())
                        {
                            // redirect to dashboard
                            $scope.goto($scope.pages.dashboard);
                        }
                    },
                    function(err){}
                )
            }
        }
    }]);