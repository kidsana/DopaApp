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
    // Post data
    var data_post = {
      type: type,
      id: id,
      org_id: $rootScope.orgIdSelect
    }
    // console.log('book', ' id ', id, ' type ', type);
    var data = $filter('ObjectToParams')(data_post);
    if (type == 'send') {
      var url = 'http://edoc.dopa.go.th/services/getEdocSend';
    } else {
      var url = 'http://edoc.dopa.go.th/services/getEdocReceive';
    }
	
    //console.log(url);
    // console.log(data);
    Ajax.post(url, data, true).then(function (res) {
      //Ajax.get(REST.book, data, true).then(function(res) {
      //console.log(id);	
      //console.log(res.data);
      var check_data = false;
	  angular.forEach(res.data, function (value, key) {
        if (value.edoc_id == id || value.rec_id == id) {
          $scope.book = value;
		  check_data = true;
          //console.log('book', value);
        }
      });
	  
	  
	   //console.log('A='+check_data);
	    if(check_data == false){
		 var data_post = {
		  rec_id: id
		}
		var data_filter = $filter('ObjectToParams')(data_post);
		Ajax.post('http://edoc.dopa.go.th/services/getSearch', data_filter, true).then(function (res) {
		  if (res.statusText == "OK" && res.data) {
			  angular.forEach(res.data, function (value, key) {
				if (value.edoc_id == id || value.rec_id == id) {
				  $scope.book = value;
				}
			  });
		  } 

		}, function (err) {
		  console.log(err);
		});
	  }
	  
      //console.log(res.data);	
      /*if (res.data.result == 1 && res.data.data) {
		console.log(res.data);
        $scope.book = res.data.data;
        $scope.previews = res.data.data.files;
      }
	  */
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
