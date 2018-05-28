App.controller('HomeCtrl', function ($rootScope, $scope, $ionicModal, $timeout, $state, $ionicHistory, $filter, Ajax, REST, $ionicPopup, $http) {
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
  $scope.selectOrg = [];
  $rootScope.orgIdSelect = '';

  $scope.showAlert = function (title, template) {
    var alertPopup = $ionicPopup.alert({ title: title, template: template, okText: 'ตกลง' });
    alertPopup.then(function (res) { });
  }

  $ionicModal.fromTemplateUrl('templates/login.html', { scope: $scope }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.Login = function () {
    //if ($scope.data.idcard != '' && $scope.data.password != '') {
    if ($scope.data.idcard != '') {
      var data_post = {
        'auth': 'dopa',
        'pid': $scope.data.idcard
        // 'password': $scope.data.password
      }

      var data = $filter('ObjectToParams')(data_post);
      Ajax.post('http://edoc.dopa.go.th/services/authen_edoc', data, true).then(function (res) {
        //console.log(res.data)
        if (res.data.status == true && res.data) {

          if (res.data.status == true) {
            $rootScope.isLogin = true;
            $rootScope.ProfileData = res.data;

            $scope.modal.hide();
            // console.log('data', res.data)
            // console.log('count', res.data.org_id.length);
            if (Array.isArray(res.data.org_id)) {
              $scope.orgData = res.data.org_id;
              $rootScope.orgIdSelect = res.data.org_id;
              $scope.modal_org.show();
            } else {
              $rootScope.userData = res.data;
              $rootScope.orgIdSelect = res.data.org_id;
              $scope.Go('app.dashboard');
            }
          } else {
            $scope.showAlert(res.data.message, '');
          }
        }
      }, function (err) {
        console.log(err);
      });
    } else {
      $scope.showAlert('กรอกข้อมูลไม่ครบ', '');
    }
  }

  $scope.LoginShow = function () {
    if (typeof $scope.modal !== 'undefined' && !$rootScope.isLogin) {
      $scope.modal.show();
    }
  }

  $timeout(function () {
    if (typeof $scope.modal !== 'undefined' && !$rootScope.isLogin) {
      $scope.modal.show();
    }
  }, 500);

  $scope.Go = function (stage) {
    $ionicHistory.nextViewOptions({ disableBack: true });
    $state.go(stage);
  }

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal_org = modal;
  });
  $scope.openModalOrg = function () {
    $scope.modal_org.show();
  };
  $scope.closeModalOrg = function () {
    $scope.modal_org.hide();
    $scope.modal.show();
  };


  $scope.selectOrg = function (data) {
    $rootScope.orgIdSelect = data.org_id;
    $scope.modal_org.hide();
    $scope.Go('app.dashboard');
  }
  watchIdcard = $scope.$watch('data.idcard', function (value) {
    if (value.length > 13) {
      $scope.data.idcard = value.substr(0, 13);
    } else {
      $scope.data.idcard_title = $filter('idcardFormat')(value);
    }
  });
});
