App.controller('BookmainCtrl', function($rootScope, $scope, $ionicModal, $stateParams, $filter, Ajax, REST) {
  if (typeof $stateParams.bookType !== 'undefined') {
    var type = $stateParams.bookType;
  } else {
    var type = '';
  }

  var GetBook = function(type) {
    $scope.book = {};
    $scope.preivews = [];
    $scope.data_type = type;
	$scope.listBooks = [];
    // Post data
    var data_post = {
      type: type
    }
    var data = $filter('ObjectToParams')(data_post);
	if(type=='send'){
		var url = 'http://edoc.dopa.go.th/services/getEdocSend';	
	}else{
		var url = 'http://edoc.dopa.go.th/services/getEdocReceive';
	}
    Ajax.get(url, data, true).then(function(res) {
		console.log(res.data);
		$scope.listBooks = res.data;
		//$scope.send = res.data.send;
		//$scope.receive = res.data.receive;

    }, function(err) {
      console.log(err);
    });
  }

  GetBook(type);
});

