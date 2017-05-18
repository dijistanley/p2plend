'use strict';

/* Controllers */

angular.module('app')
    .controller('LoginPageCtrl', ['$scope', 'authService','userInfoFactory', function($scope, authService,userInfoFactory) {
        
        
        
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
                            userInfoFactory.loadUserInfo()
                            .then(
                                function(response){
                                    $scope.refreshUserInfo();
                                     // redirect to dashboard
                                     $scope.gotodashboard();
                                },
                                function(err){
                                    var x= 0;
                                })
                            
                        }
                    },
                    function(err){}
                )
            }
        }
    }]);