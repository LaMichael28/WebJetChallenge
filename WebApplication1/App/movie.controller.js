(function () {
    'use strict';

    angular.module('app').controller('MovieController', ["$http", "$rootScope", "$window", "$scope", "$interval", "RetryRequest", movieController]);

    function movieController($http, $rootScope, $window, $scope, $interval, RetryRequest) {
        var vm = this;
        var dataService = $http;

        var interval = $interval;
        var scope = $scope;

        vm.message = [];
        vm.isIdle = true;

        vm.collections = {};
        vm.items = [];

        vm.sortBy = 'Year';
        vm.sortReverse = false;

        vm.click = function click() {
            vm.message = [];
            vm.isIdle = false;
            vm.collections = {};

            scope.startTime = Date.now();
            scope.timer = interval(function () { scope.clock = Date.now() - scope.startTime; }, 1000);
            
            RetryRequest("api/MoviesApi?source=" + "cinemaworld").then(function (result) {
                interval.cancel(scope.timer);

                addItems(result.data.Movies, "cinemaworld");

                //vm.collections = vm.collections.concat(result.data.Movies);
                vm.message.push("Found " + Object.keys(vm.collections).length + " movies from Cinema World Site");
                vm.isIdle = true;
            }, function (error) {
                interval.cancel(scope.timer);

                //vm.collections = [];
                vm.message.push("Loading failed from Film World Site. " + error.statusText + ": " + error.data);
                vm.isIdle = true;
                });

            RetryRequest("api/MoviesApi?source=" + "filmworld").then(function (result) {
                interval.cancel(scope.timer);

                addItems(result.data.Movies, "filmworld");

                //vm.collections = vm.collections.concat(result.data.Movies);
                vm.message.push("Found " + Object.keys(vm.collections).length + " movies from Film World Site");
                vm.isIdle = true;
            }, function (error) {
                interval.cancel(scope.timer);

                //vm.collections = [];
                vm.message.push("Loading failed from Film World Site. " + error.statusText + ": " + error.data);
                vm.isIdle = true;
            });
        }

        var addItems = function (items, site) {
            items.forEach(function (item) {
                var superkey = item.ID.slice(2);
                var oldItem = vm.collections[superkey];

                if (oldItem == null) {
                    oldItem = {
                        ID: superkey,
                        Title: item.Title,
                        Year: item.Year,
                        Type: item.Type,
                        Subs: [], 
                    };
                }

                oldItem.Subs = oldItem.Subs.concat({ID: item.ID, Poster: item.Poster, site: site, isDisplay: false});

                vm.collections[superkey] = oldItem;
            });
        } 

        vm.checkDisplay = function checkDisplay(element) {
            var superId = element.id;
            var id = element.name;

            var target = vm.collections[superId];
            for (var i = 0; i < target.Subs.length; i++) {
                var item = target.Subs[i];

                if (item.isDisplay) {
                    break;
                }

                if (item.ID == id) {
                    vm.collections[superId].Subs[i].isDisplay = true;
                    break;
                }
            }

            scope.$apply();
        }

        vm.sortTable = function sortTable(orderBy) {
            if (vm.sortBy == orderBy) {
                vm.sortReverse = !vm.sortReverse;
            } else {
                vm.sortBy = orderBy;
                vm.sortReverse = false;
            } 
        }

        vm.searchFilter = function searchFilter() {
            return function (item) {
                return item.Title.toLowerCase().indexOf(vm.searchInput.toLowerCase()) !== -1
                    || item.Year.toLowerCase().indexOf(vm.searchInput.toLowerCase()) !== -1;
            };
        }
    }
})();