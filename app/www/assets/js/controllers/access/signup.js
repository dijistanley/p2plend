'use strict';

/* Controllers */

angular.module('app')
    .controller('SignupPageCtrl', ['$scope', 'authService', function($scope, authService) {
        
    	$scope.user = {firstname: "", lastname: "", username: "", email : "", password : "", confirmpassword : ""};
        
        $scope.signup = function()
        {
            if($scope.user.email != "" && $scope.user.password != "" && $scope.user.confirmpassword != ""  && 
                $scope.user.confirmpassword == $scope.user.password)
            {
                $scope.username = $scope.email;
                authService.saveRegistration($scope.user)
                    .then(
                        function(response){
                            return authService.signin($scope.email, $scope.password);
                        }
                    )
            }
        }
    }]);