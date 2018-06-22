App.controller('BookCtrl', function ($rootScope, $scope, $ionicModal, $stateParams, $filter, Ajax, REST) {
  if (typeof $stateParams.bookType !== 'undefined' && typeof $stateParams.bookId !== 'undefined') {
    var type = $stateParams.bookType;
    var id = $stateParams.bookId;
  } else {
    var id = '';
    var type = '';
  }

  var GetBook = function (type, id) {
    $scope.book = {};
    $scope.preivews = [];
    $scope.data_type = type;
	
	 if(type == 'send'){
		type = 1; 
	 }else{
		 type = ''; 
	 }
    // Post data
    var data_post = {
      type: type,
      edoc_id: id,
      org_id: $rootScope.orgIdSelect
    }
    // console.log('book', ' id ', id, ' type ', type);
    var data = $filter('ObjectToParams')(data_post);
	var url = 'http://edoc.dopa.go.th/services/getDetail';
    Ajax.post(url, data, true).then(function (res) {
 
      //console.log(res.data);
      var check_data = false;
	  angular.forEach(res.data, function (value, key) {
		  console.log(value.edoc_id+'|'+value.rec_id);
        if (value.edoc_id == id || value.rec_id == id) {
          $scope.book = value;
		  check_data = true;
        }
      });

    }, function (err) {
      console.log(err);
    });
  }

  GetBook(type, id);

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
