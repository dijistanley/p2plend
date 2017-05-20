'use strict';

/* Controllers */

angular.module('app')
    .controller('AccountCtrl', ['$scope','$injector','$q', 'userInfoFactory','API','ngAuthSettings', function ($scope, $injector, $q, userInfoFactory,API,ngAuthSettings) {
    	var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var $http;
        var deferred = $q.defer();

        $scope.userInfo = userInfoFactory.userInfo;
        $scope.form = {};
        
        $scope.updateemail=function(){

        	// form.email=userInfoFactory.userInfo.email;
        	// form.password=userInfoFactory.userInfo.password;
        	if($scope.email != "" && $scope.password != ""){

        		$http = $http || $injector.get('$http');
        		$http.post(serviceBase + ngAuthSettings.apiOAuthToken, $scope.form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        		.success(function (response) {

        		   console.log('editted');

        		    deferred.resolve(response);
        		})
        		.error(function (err, status) {
        		    console.log('something went wrong');
        		    deferred.reject(err);
        		});

        	};
        	
        	return deferred.promise;
        };
        


    }])

;
