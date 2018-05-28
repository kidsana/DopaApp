App.controller('Search2Ctrl', function ($rootScope, $scope, $ionicModal, $state, $ionicHistory, $filter, Ajax, REST, $ionicPopup, ionicDatePicker) {
  // Clear
  watchSettingToggle();
  watchSearch();

  if (!$rootScope.isLogin) {
    $ionicHistory.nextViewOptions({ disableBack: true });
    $state.go('app.home');
  }

  $scope.data_type = 'send';
  $scope.loadmoreBtn = false;
  $scope.page = 1;

  $scope.Type = function (value) {
    $scope.data_type = value;

    $scope.listBooks = [];
    $scope.message = '';
    //if ($scope.data.search) {
    if ($scope.data.edoc_title) {
      $scope.Search();
    }
  }

  var init = function () {
    $scope.data = {
      search: '',
      start_date: '',
      start_date_title: '',
      end_date: '',
      end_date_title: '',
      rec_id: '',
      edoc_title: ''
    }

    $scope.listBooks = [];
    $scope.message = '';
  }
  init();

  $scope.showAlert = function (title, template) {
    var alertPopup = $ionicPopup.alert({ title: title, template: template, okText: 'ตกลง' });
    alertPopup.then(function (res) { });
  }

  $scope.Search = function (data) {

    if (typeof $scope.modal !== 'undefined') {
      $scope.modal.hide();
    }
    $scope.listBooks = [];
    $scope.message = '';
    // if (!data.start_date && !data.end_date) {
    //   data.start_date = '';
    //   data.start_date_title = '';
    //   data.end_date = '';
    //   data.end_date_title = '';
    // }

    // Filter data from toggle
    // var filter = [];
    // angular.forEach($scope.settingToggle, function (value, key) {
    //   if (value.checked && key != 'edoc_date') {
    //     filter.push(key);
    //   }
    // });
    // console.log('data', data);
    // Post data
    $scope.page = 1;
    var data_post = {
      // auth: 'dopa',
      //search: data.edoc_title,
      //search: data.search,
      start_date: data.start_date,
      finish_date: data.end_date,
      // // type: data_type,
      title: data.edoc_title,
      edoc_number: data.rec_id,
      page: $scope.page
      //filter: filter.join()
    }
    //console.log(data_post);
    var data_filter = $filter('ObjectToParams')(data_post);
    Ajax.post('http://edoc.dopa.go.th/services/getSearch', data_filter, true).then(function (res) {
      //Ajax.post('http://edoc.dopa.go.th/services/getSearch', data, true).then(function(res) {
      console.log('res', res);
      $scope.isSearch = true;
      if (res.statusText == "OK" && res.data) {
        $scope.listBooks = res.data;
        $scope.checkLoadmore(data);
      } else {
        $scope.message = res.data.message;
      }

    }, function (err) {
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

  watchSettingToggle = $scope.$watch('settingToggle', function (value) {
    // init();
    var isChoose = false;
    angular.forEach(value, function (item, key) {
      if (item.checked && key != 'edoc_date') {
        isChoose = true;
      }
    });
    if (!isChoose) {
      value.edoc_code_full.checked = true;
    }
  }, true);

  //watchSearch = $scope.$watch('data.search', function(value) {
  // watchSearch = $scope.$watch('data.edoc_title', function(value) {
  //   if (value) {
  //     $scope.Search();
  //   }
  // });

  $ionicModal.fromTemplateUrl('templates/setting.html', { scope: $scope }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.OpenSetting = function () {
    $scope.modal.show();
  }

  $scope.CloseSetting = function () {
    $scope.modal.hide();
  }

  var dateCallbackStart = function (val) {
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

  var dateCallbackEnd = function (val) {
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
    callback: function (val) {
      $scope.data.start_date = val;
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
    callback: function (val) {
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

  $scope.DatePickerStart = function () {
    ionicDatePicker.openDatePicker($scope.dateObjectStart);
  }

  $scope.DatePickerEnd = function () {
    ionicDatePicker.openDatePicker($scope.dateObjectEnd);
  }

  $scope.checkLoadmore = function (data) {
    var data_post = {
      start_date: data.start_date,
      finish_date: data.end_date,
      title: data.edoc_title,
      edoc_number: data.rec_id,
      page: $scope.page + 1
    }
    var data_filter = $filter('ObjectToParams')(data_post);
    Ajax.post('http://edoc.dopa.go.th/services/getSearch', data_filter, true).then(function (res) {
      $scope.isSearch = true;
      // console.log('ck', res.data);
      if (res.statusText == "OK" && res.data && res.data != '') {
        $scope.loadmoreBtn = true;
      } else {
        $scope.loadmoreBtn = false;
      }

    }, function (err) {
      $scope.loadmoreBtn = false;
      console.log(err);
    });
  }

  $scope.Loadmore = function (data) {
    $scope.page += 1;
    var data_post = {
      start_date: data.start_date,
      finish_date: data.end_date,
      title: data.edoc_title,
      edoc_number: data.rec_id,
      page: $scope.page
    }
    var data_filter = $filter('ObjectToParams')(data_post);
    Ajax.post('http://edoc.dopa.go.th/services/getSearch', data_filter, true).then(function (res) {
      $scope.isSearch = true;
      console.log('ld', $scope.page, res.data);
      if (res.statusText == "OK" && res.data) {

        angular.forEach(res.data, function (item, key) {
          $scope.listBooks.push(res.data[key]);
        })
        $scope.checkLoadmore(data);
        // $scope.loadmoreBtn = true;
      } else {
        // $scope.loadmoreBtn = false;
      }

    }, function (err) {
      $scope.loadmoreBtn = false;
      console.log(err);
    });
  }

});
