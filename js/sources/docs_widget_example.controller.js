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
  $scope.productsArray = [
    { type:'creditcard', label:'Credit Card', enabled: true},
    { type:'ratepay-installment', label:'Ratepay Installment', enabled: true},
    { type:'paypal', label:'Paypal', enabled: true},
    { type:'ratepay-directdebit', label:'Ratepay Directdebit', enabled: true},
    { type:'paydirekt', label:'Paydirekt', enabled: true},
    { type:'ratepay-invoice', label:'Ratepay Invoice', enabled: true}
    // { type:'sofort', label:'Sofort', enabled: true}
  ];
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
      for (ii = 0; ii < $scope.productsArray.length; ii++) {
        $scope.productsArray[ii].enabled = true;
        $scope.optionalParameters.products.push($scope.productsArray[ii].type);
      }
    }else{
      for (ii = 0; ii < $scope.productsArray.length; ii++) {
        $scope.productsArray[ii].enabled = false;
        var index = $scope.optionalParameters.products.indexOf($scope.productsArray[ii].type);
        $scope.optionalParameters.products.splice(index, 1);
      }
    }
  }

  function onProductSelect(product) {
    if (product.enabled) {
      $scope.optionalParameters.products.push(product.type);
    }else{
      var index = $scope.optionalParameters.products.indexOf(product.type);
      $scope.optionalParameters.products.splice(index, 1);
    }
  }

  function createOrder() {
    var OrderRequest = '{ "initialAmount": 100, "currency": "EUR", "transactionType": "DEBIT", "async": { "successUrl": "https://www.google.de/#newwindow=1&q=success", "failureUrl": "https://www.google.de/#newwindow=1&q=failure", "cancelUrl": "https://www.google.de/#newwindow=1&q=cancel" }}';
    docsWidgetExampleApi.createOrder(OrderRequest, successCallback, failureCallback)
  }

  function changeExampleType(exampleType) {
    $scope.showContainer = false;
    $scope.currExample = exampleType;
    $scope.optionalParameters={};
    if(exampleType==$scope.examplesList.testPIExample){
      $scope.paymentInstrumentId = "paymentinstrument_twnv71bkkb";
    }else{
      $scope.optionalParameters.language = 'en';
      $scope.optionalParameters.products = [];
      $scope.allSelected = false;
      if(exampleType==$scope.examplesList.modalExample){
        onAllProductsSelect();
      }
      if(exampleType==$scope.examplesList.inlineExample){
        onAllProductsSelect();
        $scope.optionalParameters.initCallback = initCallback;
        $scope.showContainer = true;
      }
      if(exampleType==$scope.examplesList.inlinePiExample){
        $scope.productsArray = [
          { type:'creditcard', label:'Credit Card', enabled: true},
          { type:'ratepay-installment', label:'Ratepay Installment', enabled: false},
          { type:'paypal', label:'Paypal', enabled: false},
          { type:'ratepay-directdebit', label:'Ratepay Directdebit', enabled: false},
          { type:'paydirekt', label:'Paydirekt', enabled: false},
          { type:'ratepay-invoice', label:'Ratepay Invoice', enabled: false}
          // { type:'sofort', label:'Sofort', enabled: true}
        ];
        $scope.optionalParameters.products.push('creditcard');
        $scope.optionalParameters.initCallback = initCallback;
        $scope.showContainer = true;
      }
    }
    $scope.currExample = exampleType;
     var container = angular.element("#widgetcontainer")[0];
      if(container.innerHTML){
        container.innerHTML="";
      }
      createOrder();
  }

  function failureCallback(response){
    console.log('Failure callback response');
    console.log(response);
    $('#widgetError').text(response.data.errors[0].message);
  }

  function successCallback(response){
    var orderResponse = response.data;
    $scope.orderId = orderResponse.orderId;
    console.log("createOrderResponse",orderResponse);
  }

  function callback(error, result){
    console.log('error', error);
    console.log('result', result);
  }

  function initExampleResultsCallback(error, results) {
    console.log('Result callback');
    console.log(error);
    console.log(results);
    $scope.widgetError = JSON.stringify(error);
    $scope.widgetResults = JSON.stringify(results);
  }

  function initCallback(error, iframeName) {
    console.log("Init callback");
    console.log(error);
    console.log(iframeName);
    widgetRef = iframeName;
    $('#widgetError').text(JSON.stringify(error));
    $('#widgetResults').text(JSON.stringify(iframeName));
  }

  function initExample(){
    //Init Modal Example
    if ($scope.currExample==$scope.examplesList.modalExample){
      console.log("init Modal example");
      PayEngineWidget.initAsModal(
        $scope.merchantId,
        $scope.orderId,
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

      PayEngineWidget.initAsInlineComponent(
        container,
        $scope.merchantId,
        $scope.orderId,
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
    PayEngineWidget.addValidationListener(widgetRef, onListenerCallback);
  }

  function removeListener() {
    PayEngineWidget.removeValidationListener(widgetRef, onListenerCallback);
  }

  function payExample() {
    function onPayCallback(error, result) {
      console.log("On pay callback");
      console.log(error);
      console.log(result);
      $('#widgetError').text(JSON.stringify(error));
      $('#widgetResults').text(JSON.stringify(result));
    }
    PayEngineWidget.pay(widgetRef, onPayCallback);
  }

  changeExampleType($scope.examplesList.modalExample);

};
