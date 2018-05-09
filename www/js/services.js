App.factory('LoadingAjax', [
  '$ionicLoading',
  '$rootScope',
  function($ionicLoading, $rootScope) {
    return {
      show: function() {
        loading = {
          Backdrop: true
        };
        $rootScope.ionicLoading = 'show';
        return $ionicLoading.show(loading);
      },
      hide: function() {
        $rootScope.ionicLoading = 'hide';
        return $ionicLoading.hide();
      }
    }
  }
]);

App.filter('ObjectToParams', function() {
  return function(obj) {
    var p = [];
    for (var key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return p.join('&');
  }
});

App.factory('Ajax', [
  '$q',
  '$http',
  '$rootScope',
  function($q, $http, $rootScope) {
    return {
      get: function(url, data, loading) {
        if (loading) {
          $rootScope.callAjax++;
        }
        var deferred = $q.defer();
        $http({
          method: "post",
          url: url,
          data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function successCallback(response) {
          if (loading) {
            $rootScope.callAjax--;
          }
          deferred.resolve(response);
        }, function errorCallback(response) {
          if (loading) {
            $rootScope.callAjax--;
          }
          deferred.reject(response);
        });
        return deferred.promise;
      },
      json: function(url, loading) {
        if (loading) {
          $rootScope.callAjax++;
        }
        var deferred = $q.defer();
        $http({method: "get", url: url}).then(function successCallback(response) {
          if (loading) {
            $rootScope.callAjax--;
          }
          deferred.resolve(response);
        }, function errorCallback(response) {
          if (loading) {
            $rootScope.callAjax--;
          }
          deferred.reject(response);
        });
        return deferred.promise;
      }
    }
  }
]);

App.filter('dateThai', [
  '$filter',
  function($filter) {
    return function(input) {
      if (input) {
        input = $filter('date')(input, 'yyyy-MM-dd hh:mm:ss');
        var day = '';
        var month = '';
        var year = '';
        var hour = '';
        var minus = '';
        if (typeof input !== 'undefined' && input != '') {
          var arr = input.split(/[- :]/);
          day = arr[2];
          months = [
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
          ];
          month = months[arr[1] - 1];
          year = parseInt(arr[0]) + 543;
          hour = arr[3];
          minus = arr[4];
        }
        return day + ' ' + month + ' ' + year + ' ' + hour + ':' + minus;
      } else {
        return '';
      }
    }
  }
]);

App.filter('dateThaiMin', [
  '$filter',
  function($filter) {
    return function(input) {
      if (input) {
        input = $filter('date')(input, 'yyyy-MM-dd');
        var day = '';
        var month = '';
        var year = '';
        if (typeof input !== 'undefined' && input != '') {
          var arr = input.split(/[- :]/);
          day = arr[2];
          months = [
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
          ];
          month = months[arr[1] - 1];
          year = parseInt(arr[0]) + 543;
        }
        return day + ' ' + month + ' ' + year;
      } else {
        return '';
      }
    }
  }
]);

App.filter('idcardFormat', [
  '$filter',
  function($filter) {
    return function(input) {
      if (input) {
        if (input.length > 12) {
          return input.slice(0, 1) + '-' + input.slice(1, 5) + '-' + input.slice(5, 10) + '-' + input.slice(10, 12) + '-' + input.slice(12);
        } else if (input.length > 10) {
          return input.slice(0, 1) + '-' + input.slice(1, 5) + '-' + input.slice(5, 10) + '-' + input.slice(10);
        } else if (input.length > 5) {
          return input.slice(0, 1) + '-' + input.slice(1, 5) + '-' + input.slice(5);
        } else if (input.length > 1) {
          return input.slice(0, 1) + '-' + input.slice(1);
        } else {
          return input;
        }
      } else {
        return '';
      }
    }
  }
]);

App.directive('validNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      if (!ngModelCtrl) {
        return;
      }
      ngModelCtrl.$parsers.push(function(val) {
        if (angular.isUndefined(val)) {
          var val = '';
        }
        var clean = val.replace(/[^0-9]+/g, '');
        if (val !== clean) {
          ngModelCtrl.$setViewValue(clean);
          ngModelCtrl.$render();
        }
        return clean;
      });
      element.bind('keypress', function(event) {
        if (event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  }
});
