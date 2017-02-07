(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .controller('DirectiveController', DirectiveController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')
        .directive('foundItems', FoundItems);

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var narrowItDown = this;
        narrowItDown.searchTerm = '';

        narrowItDown.searchItems = function() {
            var promise = MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm);

            promise.then(function(response) {
                    narrowItDown.message = response.length > 0 ? '' : 'Nothing found';
                    narrowItDown.found = response;
                })
                .catch(function(error) {
                    console.log(error);
                })
        };

        narrowItDown.removeItem = function(itemIndex) {
            narrowItDown.found.splice(itemIndex, 1);
        };

    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function(result) {
                var foundItems = [];
                if (searchTerm.length > 0) {
                    for (var i = 0; i < result.data.menu_items.length; i++) {
                        result.data.menu_items[i].description
                        if (result.data.menu_items[i].description.indexOf(searchTerm) !== -1) {
                            foundItems.push(result.data.menu_items[i])
                        }
                    }
                }
                return foundItems;
            });
        };
    }

    function FoundItems() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                message: '<',
                onRemove: '&'
            },
            controller: DirectiveController,
            controllerAs: 'dirCtrl',
            bindToController: true
        };
        return ddo;
    }

    function DirectiveController() {
        var dirCtrl = this;
    }

})();
