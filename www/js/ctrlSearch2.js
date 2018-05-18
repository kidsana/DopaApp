App.controller('Search2Ctrl', function($rootScope, $scope, $ionicModal, $state, $ionicHistory, $filter, Ajax, REST, $ionicPopup, ionicDatePicker) {
  // Clear
  watchSettingToggle();
  watchSearch();

  if (!$rootScope.isLogin) {
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.home');
  }

  $scope.data_type = 'send';

  $scope.Type = function(value) {
    $scope.data_type = value;

    $scope.listBooks = [];
    $scope.message = '';
    //if ($scope.data.search) {
    if ($scope.data.edoc_title) {
      $scope.Search();
    }
  }

  var init = function() {
    $scope.data = {
      search: '',
      start_date: '',
      start_date_title: '',
      end_date: '',
      end_date_title: ''
    }

    $scope.listBooks = [];
    $scope.message = '';
  }
  init();

  $scope.showAlert = function(title, template) {
    var alertPopup = $ionicPopup.alert({title: title, template: template, okText: 'ตกลง'});
    alertPopup.then(function(res) {});
  }

  $scope.Search = function() {
    if (typeof $scope.modal !== 'undefined') {
      $scope.modal.hide();
    }
    $scope.listBooks = [];
    $scope.message = '';
    if (!$scope.data.start_date && !$scope.data.end_date) {
      $scope.data.start_date = '';
      $scope.data.start_date_title = '';
      $scope.data.end_date = '';
      $scope.data.end_date_title = '';
    }

    // Filter data from toggle
    var filter = [];
    angular.forEach($scope.settingToggle, function(value, key) {
      if (value.checked && key != 'edoc_date') {
        filter.push(key);
      }
    });

    // Post data
    var data_post = {
      auth: 'dopa',
      search: $scope.data.edoc_title,
      //search: $scope.data.search,
      start_date: $scope.data.start_date,
      end_date: $scope.data.end_date,
      type: $scope.data_type,
      filter: filter.join()
    }
	console.log(data_post);
    var data = $filter('ObjectToParams')(data_post);
    //Ajax.get(REST.search, data, true).then(function(res) {
    Ajax.get(REST.search, data, true).then(function(res) {
      $scope.isSearch = true;
      if (res.data.result == 1 && res.data.data) {
        $scope.listBooks = res.data.data;
      } else {
        $scope.message = res.data.message;
      }
    }, function(err) {
      console.log(err);
    });
    // $scope.showAlert('กรุณากรอกข้อมูลที่ต้องการค้นหา', '');
  }

  $scope.settingToggle = {
    edoc_code_full: {
      name: 'เลขที่เอกสาร',
      checked: true
    },
    rec_id: {
      name: 'เลขทะเบียนรับเอกสาร',
      checked: true
    },
    edoc_date: {
      name: 'วันที่',
      checked: false
    },
    edoc_title: {
      name: 'หัวเรื่องเอกสาร',
      checked: true
    },
    edoc_speed: {
      name: 'ชั้นความเร็วเอกสาร',
      checked: true
    }
  }

  watchSettingToggle = $scope.$watch('settingToggle', function(value) {
    // init();
    var isChoose = false;
    angular.forEach(value, function(item, key) {
      if (item.checked && key != 'edoc_date') {
        isChoose = true;
      }
    });
    if (!isChoose) {
      value.edoc_code_full.checked = true;
    }
  }, true);

  //watchSearch = $scope.$watch('data.search', function(value) {
  watchSearch = $scope.$watch('data.edoc_title', function(value) {
    if (value) {
      $scope.Search();
    }
  });

  $ionicModal.fromTemplateUrl('templates/setting.html', {scope: $scope}).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.OpenSetting = function() {
    $scope.modal.show();
  }

  $scope.CloseSetting = function() {
    $scope.modal.hide();
  }

  var dateCallbackStart = function(val) {
    if (typeof val === 'undefined') {
      console.log('No date selected');
    } else if (val != 'Invalid Date') {
      $scope.dateObjectStart.inputDate = new Date(val);
      $scope.dateObjectEnd.from = new Date(val);
      $scope.data.start_date = $filter('date')(val, 'yyyy-MM-dd');
      $scope.data.start_date_title = $filter('dateThaiMin')($scope.data.start_date);
      if ($scope.data.start_date > $scope.data.end_date) {
        $scope.dateObjectEnd.inputDate = new Date(val);
        $scope.data.end_date = $filter('date')(val, 'yyyy-MM-dd');
        $scope.data.end_date_title = $filter('dateThaiMin')($scope.data.end_date);
      }
    }
  }

  var dateCallbackEnd = function(val) {
    if (typeof val === 'undefined') {
      console.log('No date selected');
    } else if (val != 'Invalid Date') {
      $scope.dateObjectEnd.inputDate = new Date(val);
      $scope.data.end_date = $filter('date')(val, 'yyyy-MM-dd');
      $scope.data.end_date_title = $filter('dateThaiMin')($scope.data.end_date);
    }
  }

  $scope.dateObjectStart = {
    inputDate: new Date(),
    templateType: 'popup',
    showTodayButton: 'true',
    callback: function(val) {
      dateCallbackStart(val);
    },
    to: new Date(),
    dateFormat: 'dd-MM-yyyy',
    closeOnSelect: false,
    titleLabel: 'เลือกวันที่',
    todayLabel: 'วันนี้',
    closeLabel: 'ปิด',
    setLabel: 'เลือก',
    weeksList: [
      'อา',
      'จ',
      'อ',
      'พ',
      'พฤ',
      'ศ',
      'ส'
    ],
    monthsList: [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ]
  }

  $scope.dateObjectEnd = {
    inputDate: new Date(),
    templateType: 'popup',
    showTodayButton: 'true',
    callback: function(val) {
      dateCallbackEnd(val);
    },
    to: new Date(),
    dateFormat: 'dd-MM-yyyy',
    closeOnSelect: false,
    titleLabel: 'เลือกวันที่',
    todayLabel: 'วันนี้',
    closeLabel: 'ปิด',
    setLabel: 'เลือก',
    weeksList: [
      'อา',
      'จ',
      'อ',
      'พ',
      'พฤ',
      'ศ',
      'ส'
    ],
    monthsList: [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ]
  }

  $scope.DatePickerStart = function() {
    ionicDatePicker.openDatePicker($scope.dateObjectStart);
  }

  $scope.DatePickerEnd = function() {
    ionicDatePicker.openDatePicker($scope.dateObjectEnd);
  }
});
