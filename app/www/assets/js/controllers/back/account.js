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
                        $scope.notification( "flip", "Editted", "success", "top-right", "#modelEditEmailPassword");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
                        $scope.notification("flip", "Something went wrong", "danger", "top-right", "#modelEditEmailPassword");
		        	});

        	}

        };

        $scope.updatePassword=function(){

        	if($scope.form.newpassword != "" && $scope.form.confirmnewpassword!= ""){

        		userInfoFactory.updatePassword($scope.form)
        		.then(function(response){

		        		console.log("editted");
                         $scope.notification("bar","Editted", "success", "top-right", "#modelEditEmailPassword");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
                        $scope.notification("bar","Something went wrong", "danger", "top-right", "#modelEditEmailPassword");
		        	});

        	}

        };

        $scope.updateAddress=function(){


        		userInfoFactory.updateAddress($scope.form)
        		.then(function(response){

		        		console.log("editted");
                        $scope.notification("flip","Editted", "success", "top-right", "#modelEditAddress");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
                        $scope.notification("flip","Something went wrong", "danger", "top-right", "#modelEditAddress");
		        	});

        



        };

        $scope.updatePhonenumber=function(){


        		userInfoFactory.updatePhonenumber($scope.form)
        		.then(function(response){

		        		console.log("editted");
                        $scope.notification("bar","Editted", "success", "top", "#modelEditPhonenumber");
		        	},
		        	function(err){

		        		console.log("Something went wrong");
                        $scope.notification("bar","Something went wrong", "danger", "top-right", "#modelEditPhonenumber");
		        	});

        



        };






        
        
      
        


    }])

;
