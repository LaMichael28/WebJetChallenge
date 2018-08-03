(function () {
	'use strict';

    angular.module('retry_request', ['ng'])
        .factory('RetryRequest', ['$http', '$q', function ($http, $q) {
            return function (url, params) {
                var MAX_REQUESTS = 3,
                    counter = 1,
                    results = $q.defer();

                var request = function () {
                    $http.get(url, params)
                        .then(function (response) {
                            results.resolve(response)
                        }, function () {
                            if (counter < MAX_REQUESTS) {
                                request();
                                counter++;
                            } else {
                                results.reject("Could not load after multiple tries");
                            }
                        });
                };

                request();

                return results.promise;
            }
        }]);

    angular.module('app', ['retry_request']);

    //angular.module('app').config(function ($sceDelegateProvider) {
    //    $sceDelegateProvider.resourceUrlWhitelist(['http://webjetapitest.azurewebsites.net/api/**']);
    //});
})();


(function () {
    'use strict';

    angular.module('app').filter('orderObjectBy', function () {
    return function (input, attribute, reverse) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        if (reverse) array.reverse();
        return array;
    }
    });
})();