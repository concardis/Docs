/**
 * @ngdoc function
 * @name docsWidgetExample.factory:docsWidgetExampleApi
 * @description
 * # docsWidgetExample
 * Factory for Widget Example
 */
angular.module('docsWidgetExample')
  .factory('docsWidgetExampleApi', docsWidgetExampleApi);

function docsWidgetExampleApi($http) {
  return {
    createOrder: function(order, successCallback, failureCallback){
      $http({
        method: 'POST',
        url: "https://apitest.payengine.de/v1/orders",
        data: order,
        headers: {
          'Content-Type': "application/json",
          'Authorization': 'Basic TWVyY2hhbnQtMDAwY2YyYzktNjZmZS00NzMwLWFjOWUtNjc0ZjdjNTUyZDQyOkV3bURmNlhtd0dOVmNGVUY='
        }
      })
      .then(
        function(response) {
          successCallback(response);
        },
        function(response) {
          failureCallback(response);
        }
      );
    },
    testPI: function(order, successCallback, failureCallback){
      $http({
        method: 'POST',
        url: "https://apitest.payengine.de/v1/orders/debit",
        data: order,
        headers: {
          'Content-Type': "application/json",
          'Authorization': 'Basic TWVyY2hhbnQtMDAwY2YyYzktNjZmZS00NzMwLWFjOWUtNjc0ZjdjNTUyZDQyOkV3bURmNlhtd0dOVmNGVUY='
        }
      })
      .then(
        function(response) {
          successCallback(response);
        },
        function(response) {
          failureCallback(response);
        }
      );
    }
  };
}
