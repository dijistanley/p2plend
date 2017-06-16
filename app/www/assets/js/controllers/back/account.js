'use strict';

/* Controllers */

angular.module('app')
    .controller('AccountCtrl', ['$scope', 'userInfoFactory', function ($scope, userInfoFactory) {

        $scope.form = {};
        $scope.form.data = {unit: "", line: "", district: "", city: "", state: "", country: "", postalcode: "" };

        $scope.updateEmail = function () {

            if ($scope.form.email != "" && $scope.form.password != "") {

                $scope.userInfoFactory.updateEmail($scope.form)
        		.then(function (response) {
        		    console.log("editted");
        		    $scope.notifySuccess("Your email has been updated", "#modelEditEmailPassword");
        		},
		        	function (err) {
		        	    console.log("Something went wrong");
		        	    $scope.notifyError("We could not update your email at this time", "#modelEditEmailPassword");
		        	});
            }

        };

        $scope.updatePassword = function () {

            if ($scope.form.newpassword != "" && $scope.form.confirmnewpassword != "") {

                $scope.userInfoFactory.updatePassword($scope.form)
        		.then(function (response) {
        		    console.log("editted");
        		    $scope.notifySuccess("Your password has been changed", "#modelEditEmailPassword");
        		},
		        	function (err) {

		        	    console.log("Something went wrong");
		        	    $scope.notifyError("We could not update your password at this time", "#modelEditEmailPassword");
		        	});

            }

        };

        $scope.updateAddress = function () {

            if ($scope.form.data.unit != "" && !$scope.form.data.line.startsWith($scope.form.data.unit))
            {
                $scope.form.data.line = $scope.form.data.unit + " " + $scope.form.data.line;
            }
            
            $scope.userInfoFactory.updateAddress($scope.form.data)
            .then(function (response) {
                console.log("editted");
                // update current user info
                $scope.notifySuccess("Your address has been changed", "#modelEditAddress");

                $scope.refreshUserInfo();
            },
                function (err) {

                    console.log("Something went wrong");
                    $scope.notifyError("We could not update your address at this time", "#modelEditAddress");
                });

        };

        $scope.updatePhonenumber = function () {

            $scope.userInfoFactory.updatePhonenumber($scope.form)
            .then(function (response) {

                console.log("editted");
                $scope.notifySuccess("Your phone number has been changed", "#modelEditPhonenumber");
            },
                function (err) {

                    console.log("Something went wrong");
                    $scope.notifyError("We could not update your phone number at this time", "#modelEditPhonenumber");
                });
        };
    }])

;
