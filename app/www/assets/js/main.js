/* ============================================================
 * File: main.js
 * Main Controller to set global scope variables. 
 * ============================================================ */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$state', 'bsLoadingOverlayService', function($scope, $rootScope, $state, bsLoadingOverlayService) {

        // App globals
        $scope.app = {
            company: "uberlend",
            name: 'Uberlend',
            domain: 'Uberlend.io',
            description: 'Peer to Peer lending platform',
            layout: {
                menuPin: false,
                menuBehind: false,
                theme: 'pages/css/pages.css',
                style: 'assets/css/style.css'
            },
            author: 'Stanley Diji'
        }
        
        $scope.pages = {
            front:  {
                borrow:         "front.borrow",
                invest:         "front.invest"
            },
            back:   {
                dashboard:      "back.dashboard",
                lend:           "back.lend",
                invest:         "back.invest",
                account:        "back.account"
            },
            access: {
                login:          "access.login",
                signup:         "access.signup"
            }
        }

        // Checks if the given state is the current state
        $scope.is = function(name) {
            return $state.is(name);
        }

        // Checks if the given state/child states are present
        $scope.includes = function(name) {
            return $state.includes(name);
        }

        $scope.goto = function(page){
            $state.go(page);
        }

        $scope.gotologin = function(){
            $scope.goto($scope.pages.access.login);
        }

        $scope.gotodashboard = function(){
            $scope.goto($scope.pages.back.dashboard);
        }
        // Broadcasts a message to pgSearch directive to toggle search overlay
        $scope.showSearchOverlay = function() {
            $scope.$broadcast('toggleSearchOverlay', {
                show: true
            })
        }

        $scope.showLoading = function(refId)
        {
            // if(refId)
            // {
            //     bsLoadingOverlayService.start({
            //         referenceId: refId
            //     });
            // }else
            // {
            //     bsLoadingOverlayService.start();
            // }
        }
        $scope.hideLoading = function(refId)
        {
            // if(refId)
            // {
            //     bsLoadingOverlayService.stop({
            //         referenceId: refId
            //     });
            // }else
            // {
            //     bsLoadingOverlayService.stop();
            // }
        }
    }]);


angular.module('app')
    /*
        Use this directive together with ng-include to include a 
        template file by replacing the placeholder element
    */
    
    .directive('includeReplace', function() {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function(scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    })