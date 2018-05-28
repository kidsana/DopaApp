App.controller('DashboardCtrl', function ($rootScope, $scope, $ionicModal, $stateParams, $filter, Ajax, REST) {
  if (typeof $stateParams.bookType !== 'undefined' && typeof $stateParams.bookId !== 'undefined') {
    var type = $stateParams.bookType;
    var id = $stateParams.bookId;
  } else {
    var id = '';
    var type = '';
  }

  var GetDashboard = function (type, id) {
    $scope.book = {};
    $scope.preivews = [];
    $scope.data_type = type;
    // Post data
    var data_post = {
      type: type,
      id: id,
      org_id: $rootScope.orgIdSelect
    }
    var data = $filter('ObjectToParams')(data_post);
    Ajax.post('http://edoc.dopa.go.th/services/SumEdoc', data, true).then(function (res) {
      //console.log(res.data);
      $scope.send = res.data.send;
      $scope.receive = res.data.receive;

    }, function (err) {
      console.log(err);
    });
  }

  GetDashboard(type, id);

  $ionicModal.fromTemplateUrl('templates/preview.html', { scope: $scope }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.PhotoViewer = function (url) {
    if (typeof PhotoViewer !== 'undefined') {
      PhotoViewer.show(url);
    } else {
      $scope.OpenPreivew();
    }
  }

  $scope.OpenPreivew = function () {
    $scope.modal.show();
  }

  $scope.ClosePreivew = function () {
    $scope.modal.hide();
  }
});
