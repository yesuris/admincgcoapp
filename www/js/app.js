angular.module('ciudadgourmetco', ['ionic', 'ciudadgourmetco.controllers', 'ionic-timepicker'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            abstract: true,
            url: '/app'
        })

    .state('login', {
        url: '/app/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    .state('descrip_restaurante', {
        url: '/app/descrip_restaurante',
        templateUrl: 'templates/descrip_restaurante.html',
        controller: 'Descrip_restauranteCtrl'
    });
    $urlRouterProvider.otherwise('/app/login');
})

.directive('standardTimeMeridian', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            etime: '=etime'
        },
        template: "<div>{{stime}}</div>",
        link: function (scope, elem, attrs) {
            scope.stime = epochParser(scope.etime, 'time');

            function prependZero(param) {
                if (String(param).length < 2) {
                    return "0" + String(param);
                }
                return param;
            }

            function epochParser(val, opType) {
                if (val === null) {
                    return "00:00";
                } else {
                    var meridian = ['AM', 'PM'];
                    if (opType === 'time') {
                        var hours = parseInt(val / 3600);
                        var minutes = (val / 60) % 60;
                        var hoursRes = hours > 12 ? (hours - 12) : hours;
                        var currentMeridian = meridian[parseInt(hours / 12)];
                        return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
                    }
                }
            }
            scope.$watch('etime', function (newValue, oldValue) {
                scope.stime = epochParser(scope.etime, 'time');
            });
        }
    };
});