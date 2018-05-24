App.controller('HomeCtrl', function($rootScope, $scope, $ionicModal, $timeout, $state, $ionicHistory, $filter, Ajax, REST, $ionicPopup) {
  // Clear
  watchIdcard();

  /*$scope.data = {
    idcard: '1560300118183',
    password: 'jigsaw'
  }*/

  $scope.data = {
    idcard: '',
    password: ''
  }

  $scope.showAlert = function(title, template) {
    var alertPopup = $ionicPopup.alert({title: title, template: template, okText: 'ตกลง'});
    alertPopup.then(function(res) {});
  }

  $ionicModal.fromTemplateUrl('templates/login.html', {scope: $scope}).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.Login = function() {
    //if ($scope.data.idcard != '' && $scope.data.password != '') {
    if ($scope.data.idcard != '') {
      var data_post = {
        'auth': 'dopa',
        'idcard': $scope.data.idcard
       // 'password': $scope.data.password
      }
      var data = $filter('ObjectToParams')(data_post);
      //Ajax.get(REST.login, data, true).then(function(res) {
      Ajax.get('http://edoc.dopa.go.th/services/authen_edoc', data, true).then(function(res) {
		//console.log(res.data.status)  
        //if (res.data.result == true && res.data.data) {
        if (res.data.status == true) {
          $rootScope.isLogin = true;
          $scope.modal.hide();
          //$scope.Go('app.search');
          $scope.Go('app.dashboard');
        } else {
          $scope.showAlert(res.data.message, '');
        }
      }, function(err) {
        console.log(err);
      });
    } else {
      $scope.showAlert('กรอกข้อมูลไม่ครบ', '');
    }
  }

  $scope.LoginShow = function() {
    if (typeof $scope.modal !== 'undefined' && !$rootScope.isLogin) {
      $scope.modal.show();
    }
  }

  $timeout(function() {
    if (typeof $scope.modal !== 'undefined' && !$rootScope.isLogin) {
      $scope.modal.show();
    }
  }, 500);

  $scope.Go = function(stage) {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go(stage);
  }

  watchIdcard = $scope.$watch('data.idcard', function(value) {
    if (value.length > 13) {
      $scope.data.idcard = value.substr(0, 13);
    } else {
      $scope.data.idcard_title = $filter('idcardFormat')(value);
    }
  });
});
