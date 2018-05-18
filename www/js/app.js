var watchSettingToggle = function() {};
var watchSearch = function() {};
var watchIdcard = function() {};

var App = angular.module('starter', ['ionic', 'ionic-datepicker']);
//var HOST = 'http://jigsawinnovation.com/project/edoc_dopa/api/';
//var HOST = 'http://localhost:8888/dopaapi/index.php/api/';
var HOST = 'http://localhost/dopaapi/index.php/api/';

angular.module('starter.controllers', []);
angular.module('starter.services', []);

App.run(function($ionicPlatform, $rootScope, $ionicSideMenuDelegate, $state, $ionicHistory, LoadingAjax, $ionicPopup) {
  $rootScope.isLogin = false;
  $rootScope.callAjax = 0;
  $rootScope.ionicLoading = 'hide';

  $rootScope.$watch('callAjax', function(value) {
    if (value == 0) {
      LoadingAjax.hide();
    } else {
      if ($rootScope.ionicLoading == 'hide') {
        LoadingAjax.show();
      }
    }
  });

  $rootScope.Logout = function() {
    var confirmPopup = $ionicPopup.confirm({title: 'คุณต้องการออกจากระบบหรือไม่', template: '', okText: 'ตกลง', cancelText: 'ยกเลิก'});
    confirmPopup.then(function(res) {
      if (res) {
        // $ionicSideMenuDelegate.toggleLeft();
        // $ionicViewService.clearHistory();
        $ionicHistory.nextViewOptions({disableBack: true});
        $state.go('app.home');
        //$state.go('app.footer');
        $rootScope.isLogin = false;
      }
    });
  }

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

App.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    //templateUrl: 'templates/menu.html',
    templateUrl: 'templates/footer.html',
    controller: 'AppCtrl'
  }).state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  }).state('app.footer', {
    url: '/footer',
    views: {
      'menuContent': {
        templateUrl: 'templates/footer.html',
        controller: 'FooterCtrl'
      }
    }
  }).state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    }
  }).state('app.search2', {
    url: '/search2',
    views: {
      'menuContent': {
        templateUrl: 'templates/search2.html',
        controller: 'Search2Ctrl'
      }
    }
  }).state('app.book', {
    url: '/book/:bookType/:bookId',
    views: {
      'menuContent': {
        templateUrl: 'templates/book.html',
        controller: 'BookCtrl'
      }
    }
  }).state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  }).state('app.bookmain', {
	url: '/bookmain/:bookType',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmain.html',
        controller: 'BookmainCtrl'
      }
    }
  })
  $urlRouterProvider.otherwise('/app/home');
  //$urlRouterProvider.otherwise('/app/footer');
});

App.config(function($ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back');
});

App.constant('REST', {
  'login': HOST + 'login',
  'search': HOST + 'search',
  'book': HOST + 'book'
});

App.controller('AppCtrl', function($scope, $ionicModal, $timeout) {});
