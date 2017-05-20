'use strict';

/* Controllers */

angular.module('app')
    .controller('AccountCtrl', ['$scope', 'userInfoFactory', function ($scope, userInfoFactory) {
    	

        $scope.userInfo = userInfoFactory.userInfo;
        $scope.form = {};
       

        $scope.updateemail=function(){

        	if($scope.form.email != "" && $scope.form.password != ""){

        		userInfoFactory.updateemail($scope.form)
        		.then(function(response){

		        		console.log("editted");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
		        	});

        	}

        };





        
        
      
        


    }])

;
