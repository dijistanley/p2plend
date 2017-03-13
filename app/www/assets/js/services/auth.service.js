angular.module('app')

    .service("ResponseHandler", function ($http, $q) {
        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        this.HandleError = function(response) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                !angular.isObject(response.data) ||
                !response.data.message
            ) {
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

    .service("AuthService", function ($q, $http, $auth, ResponseHandler) {

        this.signin = function (username, password) {
            var user = {
                email: username, 
                password: password
            }

            return $auth.login(user) 
                .then(function(response){
                    // fetch user information based on auth token received
                }, ResponseHandler.HandleError);

        }

        this.signout = function(){
            return $auth.logout();
        }

        this.isAuthenticated = function(){
            return $auth.isAuthenticated();
        }
    })