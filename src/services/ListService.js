"use strict";
exports.__esModule = true;
var ListService = /** @class */ (function () {
    function ListService() {
    }
    /**
     * Return random item in list
     * @param list
     */
    ListService.prototype.getRandomItem = function (list) {
        return list[Math.floor(Math.random() * list.length)];
    };
    return ListService;
}());
exports["default"] = ListService;
