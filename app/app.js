var TargetsCollection = require('./lib/TargetsCollection');
var ADBDeviceBrowser = require('./lib/ADBDeviceBrowser');

var app = angular.module('app', ['ngAnimate', 'ngMaterial', 'LocalStorageModule', 'ng.group']);
var baseUrl = 'http://localhost:9222';
var discoverUrl = baseUrl + '/json';

app.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('pink');
});

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('app');
});

app.filter('regex', function () {

  return function (input, field, regex) {
    var patt = new RegExp(regex);
    var out = [];

    if (input) {
      for (var i = 0; i < input.length; i++) {
        if (patt.test(input[i][field])) {
          out.push(input[i]);
        }
      }
    }

    return out;
  };

});

app.directive('devtools', function () {

  return {
    restrict: 'E',
    replace: true,
    template: '<div class="devtools-wrapper"><iframe src="{{src | trustAsResourceUrl}}"></iframe></div>',
    scope: {
      'src': '@'
    },
    link: function ($scope, element, attr) {

    }
  };

});

app.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

app.controller('home', function ($scope, $http, $location, localStorageService, $timeout, $mdDialog, $window) {

  $scope.REDISCOVERY_DELAY = 5000;
  $scope.filter = '^page$';
  $scope.targetsFilterSelectedIndex = 1;
  $scope.devtoolsUrl = '';
  $scope.targets = new TargetsCollection();
  $scope.adbDeviceBrowser = new ADBDeviceBrowser($scope.targets);

  $scope.connect = function (target) {
    var webSocketUrl = target.webSocketDebuggerUrl.replace(/(ws|wss)\:\/\//, '');

    if (!target.devtoolsFrontendUrl) {
	    $scope.devtoolsUrl = 'devtools/front_end/inspector.html?ws=' + webSocketUrl + '&remoteFrontend=true';
    } 
    else {
	    $scope.devtoolsUrl = baseUrl + target.devtoolsFrontendUrl;
    }
    $scope.currentTarget = target;
  };
  $scope.setTargetFilter = function (filter) {

    switch (filter) {
      case 'apps':
        $scope.filter = '^app$';
        $scope.targetsFilterSelectedIndex = 0;
        break;
      case 'pages':
        $scope.filter = '^page$';
        $scope.targetsFilterSelectedIndex = 1;
        break;
      case 'background_page':
        $scope.filter = '^background_page$';
        $scope.targetsFilterSelectedIndex = 2;
        break;
      case 'webviews':
        $scope.filter = '^webview$';
        $scope.targetsFilterSelectedIndex = 3;
        break;
    }

    localStorageService.set('currentFilter', filter)
  };

  $scope.discover = function() {

        // $scope.targets.clear();

        // Local chrome devices
        $http.get('http://localhost:9222/json').success(function(data, status, headers, config) {
            data.forEach(function(item) {
                item.group = 'Chrome (desktop)';
                if (!item.type) {
                  item.type = 'webview';
                }
                if (!item.id) {
                  item.id = 'item.appId';
                }
                $scope.targets.add(item.id, item);
            });
        });

        // ADB / Android devices
        //$scope.adbDeviceBrowser.discover();

    };

  $scope.showTargets = function () {
    $scope.devtoolsUrl = '';
  };

  $scope.showConnectPrompt = function (ev) {

    $mdDialog.show({
      controller: ConnectPromptController,
      templateUrl: 'connectPrompt.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
    })
      .then(function (url) {
        discoverUrl = url;
      }, function () {

      });
  };

  $scope.startDiscoveryChecks = function rediscover() {
    $timeout(function () {
      $scope.discover();
      rediscover();
    }, $scope.REDISCOVERY_DELAY);
  };

  // Initialize
  $scope.discover();
  // $scope.startDiscoveryChecks()
  $scope.setTargetFilter(localStorageService.get('currentFilter') || 'pages');

});

function ConnectPromptController($scope, $mdDialog) {
  $scope.url = 'http://localhost:9222';

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

  $scope.connect = function (url) {
    $mdDialog.hide(url);
  };

}
