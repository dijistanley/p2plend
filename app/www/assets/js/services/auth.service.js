angular.module('app')

    .service("ResponseHandler", function ($http, $q) {

        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        this.HandleError = function(response) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can. 
            if ( !angular.isObject(response.data) || !response.data.message ) {
                return ($q.reject("An unknown error occurred."));
            }

            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));
        }

        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        this.HandleSuccess = function(response) 
        {
            return (response.data);
        }
    })

    //.service("AuthService", function ($q, $http, $auth, API, ResponseHandler) {

    //    this.signin = function (username, password) {
    //        var user = {
    //            email: username, 
    //            password: password
    //        }

    //        return $auth.authenticate('p2plend',user) // pass grant_type in post request
    //            .then(function(response){
    //                // fetch user information based on auth token received
    //                $http.post()
                    
    //            }, ResponseHandler.HandleError);

    //    }

    //    this.signout = function(){
    //        return $auth.logout();
    //    }

    //    this.isAuthenticated = function(){
    //        return $auth.isAuthenticated();
    //    }
    //})

    .factory('authService', ['$q', '$injector', 'localStorageService', 'ngAuthSettings', 'ResponseHandler', function ($q, $injector, localStorageService, ngAuthSettings, ResponseHandler)
    {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var $http;
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false
        };

        var _saveRegistration = function (registration) {

            _logOut();

            var deferred = $q.defer();

            $http = $http || $injector.get('$http');
            return $http.post(serviceBase + 'api/account/register', registration)
            .success(function (response){
                // successfully registered user
                deferred.resolve(response);
            })
            .error(function(err, status){
                // failed to register new user
                deferred.reject(err);
            });
            
            return deferred.promise;
        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId;
            }

            var deferred = $q.defer();

            $http = $http || $injector.get('$http');
            $http.post(serviceBase + 'oauth2/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function (response) {

                if (loginData.useRefreshTokens) {
                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                }
                else {
                    localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                }
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                _authentication.useRefreshTokens = loginData.useRefreshTokens;

                deferred.resolve(response);
            })
            .error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.useRefreshTokens = false;

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
            }

        };

        var _refreshToken = function () {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData && authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http = $http || $injector.get('$http');
                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;

        return authServiceFactory;
    }])
    
    .factory('userInfoFactory', ['$q', 'localStorageService', function ($q, localStorageService) {

        var userInfo = {};

        userInfo.userName = "";
        userInfo.email = "";
        userInfo.firstName = "";
        userInfo.lastname = "";

        return  userInfo;

    }])

    .factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService){

        var authInterceptorServiceFactory = {};
        var $http;

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        var _responseError = function (rejection) {
            var deferred = $q.defer();
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                authService.refreshToken().then(function (response) {
                    _retryHttpRequest(rejection.config, deferred);
                }, function () {
                    authService.logOut();
                    $location.path('/login');
                    deferred.reject(rejection);
                });
            } else {
                deferred.reject(rejection);
            }
            return deferred.promise;
        }

        var _retryHttpRequest = function (config, deferred) {
            $http = $http || $injector.get('$http');
            $http(config).then(function (response) {
                deferred.resolve(response);
            }, function (response) {
                deferred.reject(response);
            });
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }])

    .factory('tokensManagerService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var tokenManagerServiceFactory = {};

        var _getRefreshTokens = function () {

            return $http.get(serviceBase + 'api/refreshtokens').then(function (results) {
                return results;
            });
        };

        var _deleteRefreshTokens = function (tokenid) {

            return $http.delete(serviceBase + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
                return results;
            });
        };

        tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
        tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;

        return tokenManagerServiceFactory;

    }])

;

