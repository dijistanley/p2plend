'use strict';

/* Controllers */

angular.module('app')
    .controller('LoginPageCtrl', ['$scope', 'authService', function($scope, authService) {
        
    	$scope.loginData = {
    	    userName: "",
    	    password: "",
    	    useRefreshTokens: false
    	};

        $scope.signin = function()
        {
            if ($scope.loginData.userName != "" && $scope.loginData.password != "")
            {
                // Show working notification
                authService.login($scope.loginData)
                .then(
                    function(response){
                        if(authService.authentication.isAuth)
                        {
                            // redirect to dashboard
                            $scope.gotodashboard();
                        }
                    },
                    function(err){}
                )
            }
        }
    }]);