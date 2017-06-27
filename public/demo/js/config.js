/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(3600); // in seconds

    $urlRouterProvider.otherwise("/tool/gantt");
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        data: { pageTitle: 'Login', specialClass: 'gray-bg', access: {isFree: true}},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'piApp',
                        files:[
                            'js/services/system/userServices.js',
                            'js/controllers/loginCtrl.js']
                    }
                ]);
            }
        }
    })
    .state('tool', {
        abstract: true,
        url: "/tool",
        templateUrl: "demo/views/common/content.html"
    })
    .state('tool.gantt', {
        url: "/gantt",
        templateUrl: "demo/views/page/solution.html",
        data: { pageTitle: 'Gantt', access: {isFree: false}},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'piApp',
                        files: [
                            'demo/js/services/ganttServices.js',
                            'demo/js/controllers/ganttCtrl.js'
                        ]
                    }
                ]);
            }
        }
    })
    .state('tool.orders', {
        url: "/orders",
        templateUrl: "demo/views/page/order.html",
        data: { pageTitle: '订单', access: {isFree: false}},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'piApp',
                        files: [
                            'demo/js/services/orderServices.js',
                            'demo/js/controllers/orderCtrl.js',
                        ]
                    }
                ]);
            }
        }

    })
    .state('tool.lineStatic', {
        url: "/line-static",
        templateUrl: "demo/views/page/line-static.html",
        data: { pageTitle: '生产线计划', access: {isFree: false}},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'piApp',
                        files: [
                            'demo/js/services/lineStaticServices.js',
                            'demo/js/controllers/lineStaticCtrl.js',
                        ]
                    }
                ]);
            }
        }

    })
    .state('tool.productStatic', {
        url: "/product-static",
        templateUrl: "demo/views/page/product-static.html",
        data: { pageTitle: '产品计划', access: {isFree: false}},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'piApp',
                        files: [
                            'demo/js/services/productStaticServices.js',
                            'demo/js/controllers/productStaticCtrl.js',
                        ]
                    }
                ]);
            }
        }

    })
    .state('tool.kpi', {
        url: "/kpi",
        templateUrl: "demo/views/page/kpi.html",
        data: { pageTitle: 'KPI', access: {isFree: false}},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'piApp',
                        files: [
                            'demo/js/services/kpiServices.js',
                            'demo/js/controllers/kpiCtrl.js',
                        ]
                    }
                ]);
            }
        }

    })
    .state('tool.parameter', {
        url: "/parameter",
        templateUrl: "demo/views/route/parameter.html",
        data: { pageTitle: 'Parameters', access: {isFree: false}},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        name: 'datePicker',
                        files: [
                            '/resources/css/plugins/datapicker/angular-datapicker.css',
                            '/resources/js/plugins/datapicker/angular-datepicker.js'
                        ]
                    },
                    {
                        serie: true,
                        files: [
                            '/resources/js/plugins/moment/moment.min.js',
                            '/resources/js/plugins/daterangepicker/daterangepicker.js',
                            '/resources/css/plugins/daterangepicker/daterangepicker-bs3.css'
                        ]
                    },
                    {
                        name: 'daterangepicker',
                        files: ['/resources/js/plugins/daterangepicker/angular-daterangepicker.js']
                    },

                    {
                        name: 'piApp',
                        files: [
                            'demo/js/services/parameterServices.js',
                            'demo/js/controllers/parameterCtrl.js',
                        ]
                    }
                ])
            }
        }
    })

    ;

}

function stateChangeListener($rootScope, Idle, $location, authService){
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //check user authorization, redirect to login page if not authorized
        if(!toState.data.access.isFree && (authService.getAuthorizedUser() == undefined || authService.getAuthorizedUser() == "")) {
            $location.path("/login");
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if(toState.url != "/login"){
            Idle.watch();
            $rootScope.$on('IdleTimeout', function () {
                authService.userInvalid();
                $rootScope.$apply(function() {
                    $location.path("/login");
                });
            });
        }
    });
}

angular
    .module('piApp')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    })
    .run(function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    })
    //.run(stateChangeListener);
