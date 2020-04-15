angular.module('StudyCraneApp',[
	'ui.bootstrap',
	'ngRoute',
  'swaggerUi',
	'docsWidgetExample'
	])
.config(['$routeProvider', '$httpProvider', '$locationProvider', '$compileProvider', function($routeProvider, $httpProvider, $locationProvider, $compileProvider) {

  new WOW().init();

	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|ftp|blob):|data:image\//);

  $locationProvider.html5Mode(true);
  $locationProvider.html5Mode(true).hashPrefix('!');

	$routeProvider
	.when('/', {templateUrl: 'partials/selectSolution.html', controller:'selectSolutionCtrl'})
  .when('/search', {templateUrl: 'partials/search.html', controller:'searchCtrl'})
  .when('/search/:term', {templateUrl: 'partials/search.html', controller:'searchCtrl'})
  .when('/buildyourown', {templateUrl: 'partials/buildyourown.html'})
 // .when('/buildyourown/restApi', {templateUrl: 'partials/api.html', controller:'apiCtrl'})
//.when('/buildyourown/restapi', {templateUrl: 'partials/api.html', controller:'apiCtrl'})
//	.when('/buildyourown/staticredoc', {templateUrl: 'assets/redoc/redoc-static.html'})
  .when('/buildyourown/apidocs', {templateUrl: 'assets/redoc/redoc-static.html'})
  .when('/redoc', {templateUrl: 'partials/redocrest.html', controller:'redocCtrl'})
  .when('/buildyourown/restdoc', {templateUrl: 'partials/restDoc.html', controller:'restdocCtrl'})
  .when('/buildyourown/restdoc/:id', {templateUrl: 'partials/restDoc.html', controller:'restdocCtrl'})
  .when('/buildyourown/bridge', {templateUrl: 'partials/bridge.html', controller:'bridgeCtrl'})
  .when('/buildyourown/bridge/:id', {templateUrl: 'partials/bridge.html', controller:'bridgeCtrl'})
  .when('/outofthebox', {templateUrl: 'partials/outofthebox.html'})
  .when('/outofthebox/widgetmenu', {templateUrl: 'partials/widgetMenu.html', controller:'widgetmenuCtrl'})
  .when('/outofthebox/widgetmenu/:id', {templateUrl: 'partials/widgetMenu.html', controller:'widgetmenuCtrl'})
  .when('/outofthebox/paylink', {templateUrl: 'partials/paylink.html'})
  .when('/outofthebox/paymentpage', {templateUrl: 'partials/paymentpage.html'})
  .when('/outofthebox/plugins', {templateUrl: 'partials/shopware.html'})
  .when('/systemurl', {templateUrl: 'partials/systemUrl.html', controller:'systemurlCtrl'})
  .when('/systemurl/:id', {templateUrl: 'partials/systemUrl.html', controller:'systemurlCtrl'})
  .when('/faq', {templateUrl: 'partials/faq.html'})
  .when('/contact', {templateUrl: 'partials/contact.html'})
	.when('/batch', {templateUrl: 'partials/batch.html', controller:'batchCtrl'})
	.when('/batch/:id', {templateUrl: 'partials/batch.html', controller:'batchCtrl'})
	.when('/notifications', {templateUrl: 'partials/notifications.html', controller:'notificationsCtrl'})
	.when('/notifications/:id', {templateUrl: 'partials/notifications.html', controller:'notificationsCtrl'})
  .when('/merchantcenter', {templateUrl: 'partials/merchantcenter.html', controller:'merchantcenterCtrl'})
  .when('/merchantcenter/:id', {templateUrl: 'partials/merchantcenter.html', controller:'merchantcenterCtrl'})
	.when('/3dsecure', {templateUrl: 'partials/3dsecure.html', controller:'3dsecureCtrl'})
  .when('/3dsecure/:id', {templateUrl: 'partials/3dsecure.html', controller:'3dsecureCtrl'})
  .when('/faq_pm_paypal', {templateUrl: '/partials/faq_pm_Checkout_from_the_Payment_Page.html', controller:'faqCtrl'})
  .when('/faq_pm_paypal_whithout_initial_payment', {templateUrl: '/partials/faq_pm_PayPal_Referenc_Transaction_Without_Initial_Payment.html', controller:'faqCtrl'})
  .when('/faq_pm_paypal_with_initial_payment', {templateUrl: '/partials/faq_pm_PayPal_Referenc_Transaction_With_Initial_Payment.html', controller:'faqCtrl'})
  .when('/faq_pm_paypal_checkout_from_the_product_pasket_page', {templateUrl: '/partials/faq_pm_paypal_checkout_from_the_product_basket_page.html', controller:'faqCtrl'})
  .when('/faq_pm_sepa_direct_debit', {templateUrl: '/partials/faq_pm_sepa_direct_debit.html', controller:'faqCtrl'})
  .when('/faq_pm_sepa_single_order', {templateUrl: '/partials/faq_pm_sepa_single_order.html', controller:'faqCtrl'})
  .when('/faq_pm_sepa_ro_with_Initial_payment', {templateUrl: '/partials/faq_pm_sepa_ro_with_Initial_payment.html', controller:'faqCtrl'})
  .when('/faq_pm_sepa_ro_without_initial_payment', {templateUrl: '/partials/faq_pm_sepa_ro_without_initial_payment.html', controller:'faqCtrl'})

  

	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.filter('searchFor', function(){

  return function(arr, searchString){

    if(!searchString){
      return arr;
    }

    var result = [];

    searchString = searchString.toLowerCase();
    var searches = searchString.split(" ");

    // Using the forEach helper method to loop through the array
    angular.forEach(arr, function(item){
      var searchvar = item.title.toLowerCase() + " " + item.tags.toLowerCase() + " " + item.content.toLowerCase();
      /*if(searchvar.indexOf(searchString) !== -1){
        result.push(item);
      }*/
      var counter = 0;
      for(var i=0; i < searches.length; i++){
        if(searchvar.indexOf(searches[i]) !== -1)
          counter++;
      }
      if(counter == searches.length)
        result.push(item);

    });

    return result;
  };

})
.factory('backendService', ['$http', function($http) {
	// queryService function body
	return {
		getCitys: function()
		{
			return $http.get("/content/swagger.json");
		},
    getSearch: function()
    {
      return $http.get("/content/searchIndex.json");
    },
    getFilters: function()
    {
      return $http.get("/content/searchFilters.json");
    }
	}
}])
.controller('redocCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', function($rootScope, $scope, $http, backendService, $timeout) {

console.log("trying start REDOCS");
  Redoc.init('content/swagger.json', {
  scrollYOffset: 0,
  requiredPropsFirst: true,
  hideDownloadButton: true

}, document.getElementById('redoc-container'))

}])
.controller('apiCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', function($rootScope, $scope, $http, backendService, $timeout) {

  const ui = SwaggerUIBundle({
    url: "content/swagger.json",
    dom_id: '#swagger-ui',
    deepLinking: false,
    docExpansion: "none",
    operationsSorter: "alpha"
  })

}])
.controller('searchCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', '$filter', function($rootScope, $scope, $http, backendService, $timeout, $routeParams, $filter) {
  $rootScope.site = "search";

  $scope.activefilter = '';

  if($routeParams.term)
    $scope.searchString = $routeParams.term;

  /*$scope.setfilter = function(string){
    $scope.activefilter = string;
    console.log($scope.activefilter);
  }*/

  backendService.getFilters().then(function(result){
    $scope.filters = result.data;
  });

  backendService.getSearch().then(function(result){
    $scope.items = result.data;
  });


}])
.controller('shopCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', function($rootScope, $scope, $http, backendService, $timeout) {
	$scope.json = {};

}])
.controller('customerCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', function($rootScope, $scope, $http, backendService, $timeout) {
	$scope.customerId = "none";
	$scope.createdAt = "none";
	$scope.modifiedAt = "none";
	$scope.customerJSON = {};

	//$scope.customerJSONstring = JSON.stringify($scope.customerJSON, undefined, 2);

}])
.controller('buildyourownCtrl', ['$rootScope', '$scope', '$http','backendService', 'apitest', '$timeout', function($rootScope, $scope, $http, backendService, apitest, $timeout) {
	$rootScope.site = "byo";

  backendService.getCitys().then(function(result){
    $scope.swag = result.data;
  });


	$scope.json = {};
	$scope.json.merchantId = "Merchant-5f7d27c6-258c-4bcd-9171-20b6f447d96b";
	$scope.json.apikey = "KgIazFxQBWTx1Ese";

	$scope.encode = function(){
		$scope.auth = btoa($scope.json.merchantId + ":" + $scope.json.apikey);
	};

	$scope.testAuth = function(){
		apitest.setSettings($scope.auth);
		apitest.getCustomer()
			.then(function successCallback(response) {
				$scope.requeststatus = response.status;
				$scope.requeststatusText = response.statusText;
			}, function errorCallback(response) {
				$scope.requeststatus = response.status;
				$scope.requeststatusText = response.statusText;
			});
	};

  $scope.getCustomers = function(){
    apitest.setSettings($scope.auth);
    apitest.getCustomer()
      .then(function successCallback(response) {
        $scope.response = response.data;
      }, function errorCallback(response) {
        $scope.requeststatus = response.status;
        $scope.requeststatusText = response.statusText;
      });
  };

  $scope.getOrders = function(){
    apitest.setSettings($scope.auth);
    apitest.getOrders()
      .then(function successCallback(response) {
        $scope.response = response.data;
      }, function errorCallback(response) {
        $scope.requeststatus = response.status;
        $scope.requeststatusText = response.statusText;
      });
  };

}])
.controller('outoftheboxCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', function($rootScope, $scope, $http, backendService, $timeout) {
	$rootScope.site = "oob";
}])
.controller('merchantcenterCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
	$rootScope.site = "mc";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="registration";

}])
.controller('batchCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
	$rootScope.site = "batch";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="overview";


}])
.controller('notificationsCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
	$rootScope.site = "notifications";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="notifications_api";


}])

.controller('3dsecureCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
	$rootScope.site = "3dsecure";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="3dsecure_v1";


}])

.controller('faqCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
	$rootScope.site = "faq_pm_paypal";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="faq_paypal";


}])

.controller('faqCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
	$rootScope.site = "pm_sepa_direct_debit";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="pm_sepa_direct_debit";


}])

.controller('restdocCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
  $rootScope.site = "rd";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="aboutourapi";
}])
.controller('bridgeCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
  $rootScope.site = "bridge";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="ourbridge";
}])
.controller('widgetmenuCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
  $rootScope.site = "widget";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="ourwidget";
}])
.controller('systemurlCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$routeParams', function($rootScope, $scope, $http, backendService, $timeout, $routeParams) {
  $rootScope.site = "widget";

  if($routeParams.id)
    $scope.cur = $routeParams.id;
  else
    $scope.cur ="urls";
}])
.controller('selectSolutionCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', function($rootScope, $scope, $http, backendService, $timeout) {
	$scope.select = function(solution){
		$rootScope.selectedSolution = solution;
	};
	$rootScope.site = "home";

}])
.controller('mainCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$location',  function($rootScope, $scope, $http, backendService, $timeout, $location) {
	$rootScope.site = "home";


	$scope.openSearch = function(){
    $location.path("/search/" + $scope.searchString);
  };
}])
