angular.module('StudyCraneApp',[
	'ui.bootstrap',
	'ngRoute',
  'swaggerUi'
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
  .when('/buildyourown/restApi', {templateUrl: 'partials/api.html'})
  .when('/buildyourown/restapi', {templateUrl: 'partials/api.html'})
  .when('/buildyourown/restdoc', {templateUrl: 'partials/restDoc.html', controller:'restdocCtrl'})
  .when('/buildyourown/restdoc/:id', {templateUrl: 'partials/restDoc.html', controller:'restdocCtrl'})
  .when('/buildyourown/bridge', {templateUrl: 'partials/bridge.html', controller:'bridgeCtrl'})
  .when('/buildyourown/bridge/:id', {templateUrl: 'partials/bridge.html', controller:'bridgeCtrl'})
  .when('/outofthebox', {templateUrl: 'partials/outofthebox.html'})
  .when('/outofthebox/widgetExample', {templateUrl: 'partials/widget.html', controller:'widgetCtrl'})
  .when('/outofthebox/widgetexample', {templateUrl: 'partials/widget.html', controller:'widgetCtrl'})
  .when('/outofthebox/widgetmenu', {templateUrl: 'partials/widgetMenu.html', controller:'widgetmenuCtrl'})
  .when('/outofthebox/widgetmenu/:id', {templateUrl: 'partials/widgetMenu.html', controller:'widgetmenuCtrl'})
  .when('/outofthebox/paylink', {templateUrl: 'partials/paylink.html'})
  .when('/outofthebox/paymentpage', {templateUrl: 'partials/paymentpage.html'})
  .when('/outofthebox/plugins', {templateUrl: 'partials/shopware.html'})
  .when('/systemurl', {templateUrl: 'partials/systemUrl.html', controller:'systemurlCtrl'})
  .when('/systemurl/:id', {templateUrl: 'partials/systemUrl.html', controller:'systemurlCtrl'})
  .when('/faq', {templateUrl: 'partials/faq.html'})
  .when('/merchantcenter', {templateUrl: 'partials/merchantcenter.html', controller:'merchantcenterCtrl'})
  .when('/merchantcenter/:id', {templateUrl: 'partials/merchantcenter.html', controller:'merchantcenterCtrl'});

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
.factory('apitest', ['$http', function($http) {
	var apitest = {};
	
	//@Chris: Setzt den header Authorisation, ist ALLGEMEIN gültig (cookies)
	apitest.setSettings = function(token){
		$http.defaults.headers.common['Authorization'] = 'Basic ' + token;
	};

  //
  apitest.getOrders = function(){
    return $http.get("https://apitest.payengine.de/v1/orders");
  };

	apitest.getCustomer = function(){
		return $http.get("https://apitest.payengine.de/v1/customers");
	};


	return apitest;
}])
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
.controller('widgetCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout',  function($rootScope, $scope, $http, backendService, $timeout) {

  $scope.payWithPi = function (){
    console.log("payWithPi Test");
    var paymentInstrumentID =  $('#payPi').val();
    console.log("paymentInstrumentID: " + paymentInstrumentID);

    console.log("Calling API");
  var OrderPiRequest; 
  OrderPiRequest = '{ "initialAmount": 100, "currency": "EUR", "product": "creditcard", "payment" : { "paymentInstrumentId" : "' + paymentInstrumentID + '"}, "async": { "successUrl": "https://www.google.de/#newwindow=1&q=success", "failureUrl": "https://www.google.de/#newwindow=1&q=failure", "cancelUrl": "https://www.google.de/#newwindow=1&q=cancel" }}'; 
  var PiURL = "https://apitest.payengine.de/v1/orders/debit"; 
  console.log(OrderPiRequest);
  var xmlhttp = new XMLHttpRequest(); 
  xmlhttp.onreadystatechange = callbackFunction(xmlhttp); 
  xmlhttp.open("POST", PiURL, false); 
  xmlhttp.setRequestHeader("Content-Type", "application/json"); 
  xmlhttp.setRequestHeader('Authorization', 'Basic TWVyY2hhbnQtMDAwY2YyYzktNjZmZS00NzMwLWFjOWUtNjc0ZjdjNTUyZDQyOkwwekxDZGZaeGlFT2MwdmM='); 
  xmlhttp.onreadystatechange = callbackFunction(xmlhttp); 
  xmlhttp.send(OrderPiRequest); 
  OrderRequest= JSON.parse(xmlhttp.responseText);
  console.log(OrderRequest);
  initOrderID = OrderRequest.orderId;
  console.log(initOrderID);
     document.getElementById("orderIdInline").value = initOrderID;
     document.getElementById("orderIdModal").value = initOrderID;
  
  }

  $scope.mm = function (){
    console.log("initAsModal");
    var optionalParameters = {};
    if ($('#languageModal').val()) {
      optionalParameters.language = $('#languageModal').val();
    }
    var themeModal = $('input[name=themeModal]:checked').val();
console.log('theme',themeModal);
    if (themeModal) {
      optionalParameters.colorTheme = themeModal;
    }
    if (!$('#productsAllModal').is(":checked")) {
      optionalParameters.products = [];
      for (ii = 0; ii < productsArray.length; ii++) {
        if ($('#products'+productsArray[ii]+'Modal').is(":checked")) {
          optionalParameters.products.push(productsArray[ii]);
        }
      }
    }
    console.log("optionalParameters: ", optionalParameters);
    PayEngineWidget.initAsModal(
      $('#merchantIdModal').val(),
      $('#orderIdModal').val(),
      optionalParameters,
      resultsCallback
    );
  }

    function loadWidget() {
    console.log('Try to load widget');
    var scriptTag;
    var reload = false;
    var widgetUrl = 'https://pptest.payengine.de/widgetjs/payengine.widget.min.js';
    var scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.src = widgetUrl;
    scriptElem.onload = scriptElem.onreadystatechange = function() {
     if ( !reload && (!this.readyState || this.readyState == 'complete') )
     {
       callback(null, true);
       reload = true;
       $('#widgetconfig').show();
     }
    };
    scriptElem.onerror = function() {
      callback(true);
    };
    scriptTag = document.getElementsByTagName('script')[0];
    scriptTag.parentNode.insertBefore(scriptElem, scriptTag);
  }
  loadWidget();
  createOrder();


  var widgetRef;
    var productsArray = ['creditcard','paypal','paydirekt',
                       'ratepay-installment','ratepay-directdebit','ratepay-invoice','sofort'];
  var initOrderID;
  function createOrder() { 
  var OrderRequest; 
  OrderRequest = '{ "initialAmount": 100, "currency": "EUR", "transactionType": "DEBIT", "async": { "successUrl": "https://www.google.de/#newwindow=1&q=success", "failureUrl": "https://www.google.de/#newwindow=1&q=failure", "cancelUrl": "https://www.google.de/#newwindow=1&q=cancel" }}'; 
    URL = "https://apitest.payengine.de/v1/orders"; 
  var xmlhttp = new XMLHttpRequest(); 
  xmlhttp.onreadystatechange = callbackFunction(xmlhttp); 
  xmlhttp.open("POST", URL, false); 
  xmlhttp.setRequestHeader("Content-Type", "application/json"); 
  xmlhttp.setRequestHeader('Authorization', 'Basic TWVyY2hhbnQtMDAwY2YyYzktNjZmZS00NzMwLWFjOWUtNjc0ZjdjNTUyZDQyOkwwekxDZGZaeGlFT2MwdmM='); 
  xmlhttp.onreadystatechange = callbackFunction(xmlhttp); 
  xmlhttp.send(OrderRequest); 
  OrderRequest= JSON.parse(xmlhttp.responseText);
  initOrderID = OrderRequest.orderId;
  console.log(initOrderID);
     document.getElementById("orderIdInline").value = initOrderID;
     document.getElementById("orderIdModal").value = initOrderID;
  } 
  function callbackFunction(xmlhttp){
  //blah
  }

  function callback(error, result){
    console.log('error', error);
    console.log('result', result);
  }
  function resultsCallback(error, results) {
    console.log('Result callback');
    console.log(error);
    console.log(results);
    $('#widgetError').text(JSON.stringify(error));
    $('#widgetResults').text(JSON.stringify(results));
  }
  function initCallback(error, iframeName) {
    console.log("Init callback");
    console.log(error);
    console.log(iframeName);
    widgetRef = iframeName;
    $('#widgetError').text(JSON.stringify(error));
    $('#widgetResults').text(JSON.stringify(iframeName));
  }
  function validate() {
    function onValidationCallback(error, result) {
      console.log('Validate callback response');
      console.log(error);
      console.log(result);
      $('#widgetError').text(JSON.stringify(error));
      $('#widgetResults').text(JSON.stringify(result));
    }
    PayEngineWidget.validate(widgetRef, onValidationCallback);
  }
  function onListenerCallback(data) {
    console.log('Validation listener callback response');
    console.log(data);
    $('#widgetError').text('');
    $('#widgetResults').text(JSON.stringify(data));
  }
  function addListener() {
    PayEngineWidget.addValidationListener(widgetRef, onListenerCallback);
  }
  function removeListener() {
    PayEngineWidget.removeValidationListener(widgetRef, onListenerCallback);
  }
  function pay() {
    function onPayCallback(error, result) {
      console.log("On pay callback");
      console.log(error);
      console.log(result);
      $('#widgetError').text(JSON.stringify(error));
      $('#widgetResults').text(JSON.stringify(result));
    }
    PayEngineWidget.pay(widgetRef, onPayCallback);
  }

  $scope.initInline = function() {
    if(document.getElementById('windgetcontainer').innerHTML){
      document.getElementById('windgetcontainer').innerHTML = "";
    }
    var container = document.getElementById('windgetcontainer');
    console.log("container", container);
    var optionalParameters = {
      initCallback: initCallback,
      redirectUser: $('#redirectUserInline').is(":checked"),
      hidePayButton: $('#hideButtonInline').is(":checked"),
      hideTitleIcons: $('#hideTitleIconsInline').is(":checked")
    };
    if ($('#languageInline').val()) {
      optionalParameters.language = $('#languageInline').val();
    }
    if (!$('#productsAllInline').is(":checked")) {
      optionalParameters.products = [];
      for (ii = 0; ii < productsArray.length; ii++) {
        if ($('#products'+productsArray[ii]+'Inline').is(":checked")) {
          optionalParameters.products.push(productsArray[ii]);
        }
      }
    }
    if ($('#layoutInline').val()) {
      optionalParameters.layout = $('#layoutInline').val();
    }
    if ($('#customStyleInline').val()) {
      optionalParameters.customStyleId = $('#customStyleInline').val();
    }
    console.log('Init Optional Params');
    console.log(optionalParameters);

    PayEngineWidget.initAsInlineComponent(
      container,
      $('#merchantIdInline').val(),
      $('#orderIdInline').val(),
      optionalParameters,
      resultsCallback
    );
  }

  $scope.initInlinePi = function() {
    if(document.getElementById('windgetcontainer').innerHTML){
      document.getElementById('windgetcontainer').innerHTML = "";
    }
    var container = document.getElementById('windgetcontainer');
    var optionalParameters = {
      initCallback: initCallback,
      hidePayButton: $('#hideButtonInlinePi').is(":checked"),
      hideTitleIcons: $('#hideTitleIconsInlinePi').is(":checked")
    };
    if ($('#languageInlinePi').val()) {
      optionalParameters.language = $('#languageInlinePi').val();
    }
    if (!$('#productsAllInlinePi').is(":checked")) {
      optionalParameters.products = [];
      for (ii = 0; ii < productsArray.length; ii++) {
        if ($('#products'+productsArray[ii]+'InlinePi').is(":checked")) {
          optionalParameters.products.push(productsArray[ii]);
        }
      }
    }
    if ($('#layoutInlinePi').val()) {
      optionalParameters.layout = $('#layoutInlinePi').val();
    }
    if ($('#customStyleInlinePi').val()) {
      optionalParameters.customStyleId = $('#customStyleInlinePi').val();
    }
    console.log('Init Optional Params');
    console.log(optionalParameters);
    PayEngineWidget.initAsInlineComponentPi(
      container,
      $('#merchantIdInlinePi').val(),
      optionalParameters,
      resultsCallback
    );
  }
  function toggleCheckbox(id) {
   if($(id).is(":checked")){
     $(id).removeAttr('checked');
   }else{
     $(id).attr('checked', true);
   }
  }
  function toggleCheckboxAll(id, tab) {
   if($(id).is(":checked")){
     $(id).removeAttr('checked');
     for (ii = 0; ii < productsArray.length; ii++) {
      $('#products'+productsArray[ii]+tab).removeAttr('disabled');
     }
   }else{
     $(id).attr('checked', true);
     for (ii = 0; ii < productsArray.length; ii++) {
       if ($('#products'+productsArray[ii]+tab).is(":checked")) {
         $('#products'+productsArray[ii]+tab).removeAttr('checked');
       }
       $('#products'+productsArray[ii]+tab).attr('disabled', true);
     }
   }
  }
  function toggleRadio(newId, otherIds) {
    $('#themeModal'+newId).attr('checked', true);
    for (ii = 0; ii < otherIds.length; ii++) {
      $('#themeModal'+otherIds[ii]).removeAttr('checked');
    }
  }
  function validate() {
    function onValidationCallback(error, result) {
      console.log('Validate callback response');
      console.log(error);
      console.log(result);
      $('#widgetError').text(JSON.stringify(error));
      $('#widgetResults').text(JSON.stringify(result));
    }
    PayEngineWidget.validate(widgetRef, onValidationCallback);
  }
  function onListenerCallback(data) {
    console.log('Validation listener callback response');
    console.log(data);
    $('#widgetError').text('');
    $('#widgetResults').text(JSON.stringify(data));
  }
  function addListener() {
    PayEngineWidget.addValidationListener(widgetRef, onListenerCallback);
  }
  function removeListener() {
    PayEngineWidget.removeValidationListener(widgetRef, onListenerCallback);
  }
  function pay() {
    function onPayCallback(error, result) {
      console.log("On pay callback");
      console.log(error);
      console.log(result);
      $('#widgetError').text(JSON.stringify(error));
      $('#widgetResults').text(JSON.stringify(result));
    }
    PayEngineWidget.pay(widgetRef, onPayCallback);
  }
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
.controller('mainCtrl', ['$rootScope', '$scope', '$http','backendService', '$timeout', '$location', function($rootScope, $scope, $http, backendService, $timeout, $location) {
	$rootScope.site = "home";

	$scope.openSearch = function(){
    $location.path("/search/" + $scope.searchString);
  };
}])