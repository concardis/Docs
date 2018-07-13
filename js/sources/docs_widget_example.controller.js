/**
 * @ngdoc function
 * @name docsWidgetExample.controller:widgetCtrl
 * @description
 * # docsWidgetExampleController
 * Controller of the Documentation Widget Example
 */
angular.module('docsWidgetExample')
  .controller('docsWidgetExampleCtrl', docsWidgetExampleCtrl);

function docsWidgetExampleCtrl ($rootScope, $scope, $http, backendService, $timeout, docsWidgetExampleApi) {
  $scope.merchantId = "Merchant-000cf2c9-66fe-4730-ac9e-674f7c552d42";
  $scope.examplesList = {
    modalExample: 'modalExample', //default
    inlineExample: 'inlineExample',
    inlinePiExample: 'inlinePiExample',
    testPIExample: 'testPIExample'
  };
  $scope.exampleThemes = [
    { type:'dark', label:'Dark'},
    { type:'light', label:'Light'}
  ];
  $scope.layoutsInline = [
    { type:'dropdown', label:'Dropdown'},
    { type:'full-list', label:'Full list'}
  ];
  $scope.showContainer = false;
  $scope.productsArray = {
    'creditcard':{label:'Credit Card', enabled: false},
    'ratepay-installment':{label:'Ratepay Installment', enabled: false},
    'paypal':{label:'Paypal', enabled: false},
    'ratepay-directdebit':{label:'Ratepay Directdebit', enabled: false},
    'paydirekt':{label:'Paydirekt', enabled: false},
    'ratepay-invoice':{label:'Ratepay Invoice', enabled: false},
    'sofort':{label:'Sofort', enabled: false},
    'sepa':{label:'SEPA', enabled: false},
    'prepayment':{label:'Prepayment', enabled: false}
  };
  $scope.createOrder = createOrder;
  $scope.changeExampleType = changeExampleType;
  $scope.initExample = initExample;
  $scope.payWithPi = payWithPi;
  $scope.validateExample = validateExample;
  $scope.addListener = addListener;
  $scope.removeListener = removeListener;
  $scope.payExample = payExample;
  $scope.onProductSelect = onProductSelect;
  $scope.onAllProductsSelect = onAllProductsSelect;
  var widgetRef;

  function onAllProductsSelect() {
    $scope.allSelected = !$scope.allSelected
    if ($scope.allSelected) {
      for (var ii in $scope.order.allowedProducts) {
        $scope.productsArray[$scope.order.allowedProducts[ii]].enabled = true;
        var index = $scope.optionalParameters.products.indexOf($scope.order.allowedProducts[ii]);
        if(index<0){
          $scope.optionalParameters.products.push($scope.order.allowedProducts[ii]);
        }
      }
    }else{
      for (var ii in $scope.order.allowedProducts) {
        $scope.productsArray[$scope.order.allowedProducts[ii]].enabled = false;
        var index = $scope.optionalParameters.products.indexOf($scope.order.allowedProducts[ii]);
        $scope.optionalParameters.products.splice(index, 1);
      }
    }
  }

  function onProductSelect(product) {
    if ($scope.productsArray[product].enabled) {
      $scope.optionalParameters.products.push(product);
    }else{
      var index = $scope.optionalParameters.products.indexOf(product);
      $scope.optionalParameters.products.splice(index, 1);
    }
  }

  function changeExampleType(exampleType) {
    $scope.showContainer = false;
    $scope.currExample = exampleType;
    $scope.optionalParameters={};

    var container = angular.element("#widgetcontainer")[0];
    if(container.innerHTML){
    container.innerHTML="";
    }

    if(exampleType==$scope.examplesList.testPIExample){
      $scope.paymentInstrumentId = "paymentinstrument_twnv71bkkb";
    }else{
      createOrder();
    }
  }

  function createOrder() {
    var OrderRequest = '{ "initialAmount": 100, "currency": "EUR", "transactionType": "DEBIT", "async": { "successUrl": "https://www.google.de/#newwindow=1&q=success", "failureUrl": "https://www.google.de/#newwindow=1&q=failure", "cancelUrl": "https://www.google.de/#newwindow=1&q=cancel" }}';
    docsWidgetExampleApi.createOrder(OrderRequest, successCallback, failureCallback)
  }

  function failureCallback(response){
    console.log('Failure callback response');
    console.log(response);
    $('#widgetError').text(response.data.errors[0].message);
  }

  function successCallback(response){
    var orderResponse = response.data;
    $scope.order = orderResponse;

    $scope.optionalParameters.products = [];
    $scope.allSelected = false;
    $scope.optionalParameters.language = 'en';

    if($scope.currExample==$scope.examplesList.inlineExample){
      $scope.optionalParameters.initCallback = initCallback;
      $scope.showContainer = true;
    }
    if($scope.currExample==$scope.examplesList.inlinePiExample){
      $scope.allSelected = true;
      $scope.optionalParameters.initCallback = initCallback;
      $scope.showContainer = true;
    }

    onAllProductsSelect();
    console.log("createOrderResponse",orderResponse);
  }

  function callback(error, result){
    console.log('error', error);
    console.log('result', result);
  }

  function initExampleResultsCallback(error, results) {
    console.log('Result callback');
    console.log(error);
    $('#widgetError').text(JSON.stringify(error));
    console.log(results);
    $('#widgetResults').text(JSON.stringify(results));
  }

  function initCallback(error, iframeName) {
    console.log("Init callback");
    console.log(error);
    $('#widgetError').text(JSON.stringify(error));
    widgetRef = iframeName;
    $('#widgetResults').text(JSON.stringify(iframeName));
  }

  function initExample(){

    var requestContainer = angular.element("#widgetRequest")[0];
    if(requestContainer.innerHTML){
      requestContainer.innerHTML="";
    }
    var errorContainer = angular.element("#widgetError")[0];
    if(errorContainer.innerHTML){
      errorContainer.innerHTML="";
    }
    var resultsContainer = angular.element("#widgetResults")[0];
    if(resultsContainer.innerHTML){
      resultsContainer.innerHTML="";
    }

    //Init Modal Example
    if ($scope.currExample==$scope.examplesList.modalExample){

      console.log("init Request");
      $('#widgetRequest').text(
        "PayEngineWidget.initAsModal(" +
        JSON.stringify($scope.merchantId) + "," +
        JSON.stringify($scope.order.orderId) + "," +
        JSON.stringify($scope.optionalParameters) + "," +
        "initExampleResultsCallback);");

      console.log("init Modal example");
      PayEngineWidget.initAsModal(
        $scope.merchantId,
        $scope.order.orderId,
        $scope.optionalParameters,
        initExampleResultsCallback
      );
    }
    //Init Inline Example
    if ($scope.currExample==$scope.examplesList.inlineExample){

      $scope.showContainer = true;
      console.log("init inline example");
      var container = angular.element("#widgetcontainer")[0];
      if(container.innerHTML){
        container.innerHTML="";
      }

      console.log("init Request");
      $('#widgetRequest').text(
        "PayEngineWidget.initAsInlineComponent(" +
        JSON.stringify(container) + "," +
        JSON.stringify($scope.merchantId) + "," +
        JSON.stringify($scope.order.orderId) + "," +
        JSON.stringify($scope.optionalParameters) + "," +
        "initExampleResultsCallback);");

      PayEngineWidget.initAsInlineComponent(
        container,
        $scope.merchantId,
        $scope.order.orderId,
        $scope.optionalParameters,
        initExampleResultsCallback
      );
    }

    //Init Inline PI Example
    if ($scope.currExample==$scope.examplesList.inlinePiExample){

      $scope.showContainer = true;
      console.log("init PI example");
      var container = angular.element("#widgetcontainer")[0];
      if(container.innerHTML){
        container.innerHTML="";
      }

      console.log("init Request");
      $('#widgetRequest').text(
        "PayEngineWidget.initAsModal(" +
        JSON.stringify(container) + "," +
        JSON.stringify($scope.merchantId) + "," +
        JSON.stringify($scope.optionalParameters) + "," +
        "initExampleResultsCallback);");

      PayEngineWidget.initAsInlineComponentPi(
        container,
        $scope.merchantId,
        $scope.optionalParameters,
        initExampleResultsCallback
      );
    }
  }

  function payWithPi(){
    var OrderPiRequest = '{ "initialAmount": 100, "currency": "EUR", "product": "creditcard", "payment" : { "paymentInstrumentId" : "' + $scope.paymentInstrumentID + '"}, "async": { "successUrl": "https://www.google.de/#newwindow=1&q=success", "failureUrl": "https://www.google.de/#newwindow=1&q=failure", "cancelUrl": "https://www.google.de/#newwindow=1&q=cancel" }}';
    docsWidgetExampleApi.testPI(OrderPiRequest, successCallback, failureCallback)
  }

  function validateExample() {
    console.log("init Request");
    $('#widgetRequest').text(
      "PayEngineWidget.validate(" +
      JSON.stringify(widgetRef) + "," +
      "onValidationCallback);");
    PayEngineWidget.validate(widgetRef, onValidationCallback);
  }

  function onValidationCallback(error, result) {
    console.log('Validate callback response');
    console.log(error);
    console.log(result);
    $('#widgetError').text('Validate callback response: '+JSON.stringify(error));
    $('#widgetResults').text('Validate callback response: '+JSON.stringify(result));
  }

  function onListenerCallback(data) {
    console.log('Validation listener callback response');
    console.log(data);
    $('#widgetError').text('');
    $('#widgetResults').text(JSON.stringify(data));
  }

  function addListener() {
    console.log("init Request");
    $('#widgetRequest').text(
      "PayEngineWidget.addValidationListener(" +
      JSON.stringify(widgetRef) + "," +
      "onListenerCallback);");
    PayEngineWidget.addValidationListener(widgetRef, onListenerCallback);
  }

  function removeListener() {
    console.log("init Request");
    $('#widgetRequest').text(
      "PayEngineWidget.removeValidationListener(" +
      JSON.stringify(widgetRef) + "," +
      "onListenerCallback);");
    PayEngineWidget.removeValidationListener(widgetRef, onListenerCallback);
  }

  function onPayCallback(error, result) {
    console.log("On pay callback");
    console.log(error);
    console.log(result);
    $('#widgetError').text(JSON.stringify(error));
    $('#widgetResults').text(JSON.stringify(result));
  }

  function payExample() {
    console.log("init Request");
    $('#widgetRequest').text(
      "PayEngineWidget.pay(" +
      JSON.stringify(widgetRef) + "," +
      "onPayCallback);");
    PayEngineWidget.pay(widgetRef, onPayCallback);
  }

  changeExampleType($scope.examplesList.modalExample);

};
