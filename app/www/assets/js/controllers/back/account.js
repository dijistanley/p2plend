'use strict';

/* Controllers */

angular.module('app')
    .controller('AccountCtrl', ['$scope', 'userInfoFactory', function ($scope, userInfoFactory) {
    	

        $scope.userInfo = userInfoFactory.userInfo;
        $scope.form = {};
       

        $scope.updateEmail=function(){

        	if($scope.form.email != "" && $scope.form.password != ""){

        		userInfoFactory.updateEmail($scope.form)
        		.then(function(response){

		        		console.log("editted");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
		        	});

        	}

        };

        $scope.updatePassword=function(){

        	if($scope.form.newpassword != "" && $scope.form.confirmnewpassword!= ""){

        		userInfoFactory.updatePassword($scope.form)
        		.then(function(response){

		        		console.log("editted");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
		        	});

        	}

        };

        $scope.updateAddress=function(){


        		userInfoFactory.updateAddress($scope.form)
        		.then(function(response){

		        		console.log("editted");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
		        	});

        



        };

        $scope.updatePhonenumber=function(){


        		userInfoFactory.updatePhonenumber($scope.form)
        		.then(function(response){

		        		console.log("editted");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
		        	});

        



        };






        
        
      
        


    }])

;
