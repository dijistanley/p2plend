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

            if (response.message && response.modelState) {
                return $q.reject(response.message);
            }
            else {


                return (response.data);
            }
        }
    })

    
    .factory('authService', ['$q', '$injector', 'localStorageService', 'ngAuthSettings', 'ResponseHandler', 'API', function ($q, $injector, localStorageService, ngAuthSettings, ResponseHandler, API)
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
            return $http.post(serviceBase + API.apiCreateAccount, registration)
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
            $http.post(serviceBase + ngAuthSettings.apiOAuthToken, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .success(function (response) {

                if (response.error) {
                    if (response.error_description) {
                        deferred.reject(response.error_description);
                    } else {
                        deferred.reject("Can not log you in right now, please try again later");
                    }
                } else {

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
                }
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
    
    .factory('userInfoFactory', ['$q', '$injector', 'localStorageService','API','ngAuthSettings', 'authService', function ($q, $injector, localStorageService, API, ngAuthSettings) {

        var dataLoaded = false;

        var userInfo = {};
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var $http;

        userInfo.userName = null;
        userInfo.email = null;
        userInfo.emailConfirmed = false;
        userInfo.phoneNumber = null;
        userInfo.phoneNumberConfirmed = false;
        userInfo.firstName = null;
        userInfo.lastName = null;

        userInfo.address = {};
        userInfo.address.text = null;
        userInfo.address.line = null;
        userInfo.address.city = null;
        userInfo.address.district = null;
        userInfo.address.state = null;
        userInfo.address.postalCode = null;
        userInfo.address.country = null;
        userInfo.address.period = null;

        // var loadDummyData = function () {
        //     userInfo.userName = "voiddigits";
        //     userInfo.email = "service@voiddigits.com";
        //     userInfo.emailConfirmed = false;

        //     userInfo.phoneNumber = "(123) 456-7890";
        //     userInfo.phoneNumberConfirmed = true;
        //     userInfo.firstName = "Void";
        //     userInfo.lastName = "Digits";

        //     userInfo.address.text = "123 - 12345 11 Ave SW, Orance City, Province - P2S123";
        //     userInfo.address.line = "123 - 12345 11 Ave";
        //     userInfo.address.district = "SW";
        //     userInfo.address.city = "Orange City";
        //     userInfo.address.state = "Province State";
        //     userInfo.address.country = "Candyland";
        //     userInfo.address.postalCode = "P2S123";
        // };
        var loadData = function () {
            
            if (dataLoaded) {

                // load from local storage
                var x = localStorageService.get('userInfoData');
                if (x) {
                    userInfo.userName = x.userName;
                    userInfo.email = x.email;
                    userInfo.emailConfirmed = x.emailConfirmed;

                    userInfo.phoneNumber = x.phoneNumber;
                    userInfo.phoneNumberConfirmed = x.phoneNumberConfirmed;
                    userInfo.firstName = x.firstName;
                    userInfo.lastName = x.lastName;

                    if (x.Address) {
                        userInfo.address.text = x.address.text;
                        userInfo.address.line = x.address.line;
                        userInfo.address.district = x.address.district;
                        userInfo.address.city = x.address.city;
                        userInfo.address.state = x.address.state;
                        userInfo.address.country = x.address.country;
                        userInfo.address.postalCode = x.address.postalCode;
                    }
                }
            } else {
                loadInfoServer();
            }
        };

        var loadInfoServer = function () {
            var deferred = $q.defer();

            var $http = $http || $injector.get('$http');
            $http.get(API.server + API.apiUserInfo)
            .success(function (response) {
                
                userInfo.userName = response.Username;
                userInfo.email = response.Email;
                userInfo.emailConfirmed = response.EmailConfirmed;

                userInfo.phoneNumber = response.PhoneNumber;
                userInfo.phoneNumberConfirmed = response.PhoneNumberConfirmed;
                userInfo.firstName = response.FirstName;
                userInfo.lastName = response.LastName;

                userInfo.address.text = response.Address.Text;
                userInfo.address.line = response.Address.Line;
                userInfo.address.district = response.Address.District;
                userInfo.address.city = response.Address.City;
                userInfo.address.state = response.Address.State;
                userInfo.address.country = response.Address.Country;
                userInfo.address.postalCode = response.Address.PostalCode;

                dataLoaded = true;
                localStorageService.set('userInfoData',  userInfo);

                deferred.resolve(response);
            })
            .error(function (err, status) {

                deferred.reject(err);
            });

            return deferred.promise;
        };

        var updateEmail=function(form){
            var deferred = $q.defer();
            
            var data= {
                email:    form.email,
                password: form.password

            };
            

            $http = $http || $injector.get('$http');
            $http.post(serviceBase + API.updateemail, data)
            .success(function (response) {
                if (response.message && response.modelState) {
                    deferred.reject(response.message);
                }
                else {
                    deferred.resolve(response);
                }
            })
            .error(function (err, status) {
                
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var updatePassword=function(form){
            var deferred = $q.defer();
            var data={

                currentpassword:    form.password,
                newpassword:        form.newpassword,
                confirmnewpassword: form.confirmnewpassword

            };
            

            $http = $http || $injector.get('$http');
            $http.post(serviceBase + API.updatepassword, data)
            .success(function (response) {
                if (response.message && response.modelState) {
                    deferred.reject(response.message);
                }
                else {
                    deferred.resolve(response);
                }
            })
            .error(function (err, status) {
                
                deferred.reject(err);
            });

            
            
            return deferred.promise;
        };

        var updateAddress=function(form){
            var deferred = $q.defer();
            var data={
                Line:       form.line,
                City:       form.city,
                district:   form.district,
                state:      form.state,
                postalcode: form.postalcode,
                country:    form.country
            };
            

            $http = $http || $injector.get('$http');
            $http.post(serviceBase + API.updateaddress, data)
            .success(function (response) {

                if (response.message && response.modelState) {
                    deferred.reject(response.message);
                }
                else {
                    deferred.resolve(response);
                }
            })
            .error(function (err, status) {
                
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var updatePhonenumber=function(form){
            var deferred = $q.defer();
            var data={
              newphonenumber: form.phonenumber
            };
            

            $http = $http || $injector.get('$http');
            $http.post(serviceBase + API.updatephonenumber, data)
            .success(function (response) {
                if (response.message && response.modelState) {
                    deferred.reject(response.message);
                }
                else {
                    deferred.resolve(response);
                }
            })
            .error(function (err, status) {
                
                deferred.reject(err);
            });
            
            return deferred.promise;
        };

        // loadDummyData();


        return  {
            userInfo:          userInfo,
            loadUserInfo: loadInfoServer,
            loadData: loadData,
            updateEmail:       updateEmail,
            updatePassword:    updatePassword,
            updateAddress:     updateAddress,
            updatePhonenumber: updatePhonenumber
        };

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

