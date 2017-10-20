"use strict";
exports.__esModule = true;
var DatabaseService_1 = require("../services/DatabaseService");
var ListService_1 = require("../services/ListService");
var mongodb_1 = require("mongodb");
var DatabaseServiceFactory = /** @class */ (function () {
    function DatabaseServiceFactory() {
    }
    DatabaseServiceFactory.create = function (url, logger) {
        return new DatabaseService_1["default"](url, new mongodb_1.MongoClient(), logger, new ListService_1["default"]());
    };
    return DatabaseServiceFactory;
}());
exports["default"] = DatabaseServiceFactory;
