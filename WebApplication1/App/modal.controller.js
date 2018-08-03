(function () {
    'use strict';

    angular.module('app').controller('ModalController', ["$http", "$rootScope", "$window", "$scope", "$interval", "RetryRequest", modalController]);

    function modalController($http, $rootScope, $window, $scope, $interval, RetryRequest) {
        var vm = this;
        var dataService = $http;

        var interval = $interval;
        var scope = $scope;

        vm.selectedItem = {};

        vm.message = "";
        vm.isIdle = true;

        vm.isShowDetailPic = false;

        vm.details = function details(item) {
            //event.preventDefault();
            vm.isItemLoaded = false;
            vm.message = "Loading...";

            var itemId = item.ID;
            var site = item.site;

            //vm.selectedItem = {};
            //vm.selectedItem.Title = item.Title;
            //vm.selectedItem.Year = item.Year;

            //dataService.get("http://webjetapitest.azurewebsites.net/api/" + site + "/movie/" + itemId,

            RetryRequest("api/MovieApi?source=" + site + "&id=" + itemId).then(function (result) {
                interval.cancel(scope.timer);

                //vm.items[itemId] = result.data;
                //vm.selectedItem = vm.items[itemId];
                vm.selectedItem = result.data;

                vm.isItemLoaded = true;

                vm.message = "Item loaded successfully.";
                vm.isIdle = true;
            }, function (error) {
                interval.cancel(scope.timer);

                vm.message = error.statusText + ": " + error.data + ", Failed to load details. Please try again later.";
                vm.isIdle = true;
            });
        }

        vm.showDetailPic = function showDetailPic(isShow) {
            vm.isShowDetailPic = isShow;
            scope.$apply();
        }
    }
})();