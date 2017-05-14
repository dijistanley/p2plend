/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('app')

    .run(function (bsLoadingOverlayService) {
        bsLoadingOverlayService.setGlobalConfig({
            delay: 0, // Minimal delay to hide loading overlay in ms.
            activeClass: undefined, // Class that is added to the element where bs-loading-overlay is applied when the overlay is active.
            templateUrl: undefined, // Template url for overlay element. If not specified - no overlay element is created.
            templateOptions: undefined // Options that are passed to overlay template (specified by templateUrl option above).
        });

        console.log(".run successful")
    })

    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $urlRouterProvider
            .otherwise('/front/borrow');

        $stateProvider
            // Access/ Authorization States
            .state('access', {
                url: '/access',
                template: '<div class="full-height" ui-view></div>',
                controller: "AccessCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/access/access.js'
                                ]);
                            });
                    }]
                }
            })

            .state("access.login", {
                url: "/login",
                templateUrl: "tpl/access/login.html",
                controller: "LoginPageCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/access/login.js'
                                ]);
                            });
                    }]
                }
            })

            .state("access.signup", {
                url: "/signup",
                templateUrl: "tpl/access/signup.html",
                controller: "SignupPageCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/access/signup.js'
                                ]);
                            });
                    }]
                }
            })

            //------------- Front App States ---------------------------------------//
            .state('front', {
                abstract: true,
                url: "/front",
                templateUrl: "tpl/front/app.html",
                controller: "FrontCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/front/front.js'
                                ]);
                            });
                    }]
                }
            })

            .state("front.borrow", {
                url: "/borrow",
                templateUrl: "tpl/front/borrow.html",
                controller: "FrontPageBorrowCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            /* 
                                Load any ocLazyLoad module here
                                ex: 'wysihtml5'
                                Open config.lazyload.js for available modules
                            */

                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/front/borrow.js'
                                ]);
                            });
                    }]
                }
            })

            .state("front.invest", {
                url: "/invest",
                templateUrl: "tpl/front/invest.html",
                controller: "FrontPageInvestCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            /* 
                                Load any ocLazyLoad module here
                                ex: 'wysihtml5'
                                Open config.lazyload.js for available modules
                            */

                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/front/invest.js'
                                ]);
                            });
                    }]
                }
            })
            
            //---------------------------- Back App States ---------------------------------------------//
            .state('back', {
                abstract: true,
                url: "/back",
                templateUrl: "tpl/back/app.html"
            })

            .state('back.dashboard', {
                url: "/dashboard",
                templateUrl: "tpl/back/dashboard.html",
                controller: 'HomeCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            /* 
                                Load any ocLazyLoad module here
                                ex: 'wysihtml5'
                                Open config.lazyload.js for available modules
                            */
                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/back/dashboard.js'
                                ]);
                            });
                    }]
                }
            })

            .state('back.account', {
                url: "/account",
                templateUrl: "tpl/back/account.html",
                controller: 'AccountCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            /* 
                                Load any ocLazyLoad module here
                                ex: 'wysihtml5'
                                Open config.lazyload.js for available modules
                            */
                        ], {
                            insertBefore: '#lazyload_placeholder'
                        })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/back/account.js'
                                ]);
                            });
                    }]
                }
            })

            .state("access.logout", {
                url: "/login",
                templateUrl: "tpl/access/login.html",
                controller: "LoginPageCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function () {
                                return $ocLazyLoad.load([
                                    'assets/js/controllers/access/login.js'
                                ]);
                            });
                    }]
                }
            })
        ;

        console.log(".config route successful");
    }])


    .config(['$authProvider', function ($authProvider) {
        //$authProvider.baseUrl = 'http://uberlend.io';
        // $authProvider.loginUrl = 'http://api.uberlend.io/v1/auth/login';
        // $authProvider.signupUrl = 'http://api.uberlend.io/v1/auth/signup';
        //$authProvider.baseUrl = 'http://localhost:54194';
        //$authProvider.loginUrl = 'http://localhost:54194/oauth2/token';
        //$authProvider.signupUrl = 'http://localhost:54194/api/account';

        console.log(".config authProvider successful");
    }])

    .constant('ngAuthSettings', {
        //apiServiceBaseUri: 'http://localhost:54194/',
        apiServiceBaseUri: 'http://35.185.109.148/',
        apiOAuthToken: 'oauth2/token',
        clientId: 'ngAuthApp'
    })

    .factory('allHttpInterceptor', function (bsLoadingOverlayHttpInterceptorFactoryFactory) {
        return bsLoadingOverlayHttpInterceptorFactoryFactory();
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('allHttpInterceptor');
        $httpProvider.interceptors.push('authInterceptorService');
        console.log(".config httpProvider successful");
    })

    .run(['authService', function (authService) {
        authService.fillAuthData();
    }])
;