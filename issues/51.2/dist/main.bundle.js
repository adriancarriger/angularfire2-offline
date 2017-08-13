webpackJsonp([1,4],{

/***/ 148:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 148;


/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(157);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(45);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(afDatabase) {
        this.afDatabase = afDatabase;
        this.processing = false;
        this.max = 49;
        this.currentId = 1;
        this.totalToAdd = 50;
        this.type = 'af';
        this.groceriesList = this.afDatabase.list('groceries');
        this.groceriesObject = this.afDatabase.object('groceries');
        this.groceriesList = this.afDatabase.list('groceries');
        this.groceriesObject = this.afDatabase.object('groceries');
    }
    AppComponent.prototype.removeAll = function () {
        var _this = this;
        var startTime = performance.now();
        this.processing = true;
        this.groceriesList.remove()
            .then(function () {
            _this.processing = false;
            _this.updateTime(startTime);
        });
    };
    AppComponent.prototype.usingPush = function () {
        var _this = this;
        var startTime = performance.now();
        this.processing = true;
        var updates = [];
        var max = this.max + this.currentId;
        for (this.currentId; this.currentId <= max; ++this.currentId) {
            updates.push(this.groceriesList.push({ text: 'Milk' }));
        }
        Promise.all(updates)
            .then(function () {
            _this.processing = false;
            _this.updateTime(startTime);
        });
    };
    AppComponent.prototype.usingUpdate = function () {
        var _this = this;
        var startTime = performance.now();
        this.processing = true;
        var updates = [];
        var max = this.max + this.currentId;
        for (this.currentId; this.currentId <= max; ++this.currentId) {
            updates.push(this.groceriesList.update("" + this.currentId, { text: 'Milk' }));
        }
        Promise.all(updates)
            .then(function () {
            _this.processing = false;
            _this.updateTime(startTime);
        });
    };
    AppComponent.prototype.usingSet = function () {
        var _this = this;
        var startTime = performance.now();
        this.processing = true;
        var max = this.max + this.currentId;
        var updateData = {};
        for (this.currentId; this.currentId <= max; ++this.currentId) {
            updateData[this.currentId] = { text: 'Milk' };
        }
        this.groceriesObject.set(updateData)
            .then(function () {
            _this.processing = false;
            _this.updateTime(startTime);
        });
    };
    AppComponent.prototype.updateTime = function (startTime) {
        var total = performance.now() - startTime;
        this.totalTime = Math.round(total * 100) / 100;
    };
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(227),
        styles: [__webpack_require__(220)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["b" /* AngularFireDatabase */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["b" /* AngularFireDatabase */]) === "function" && _a || Object])
], AppComponent);

var _a;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_offline__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(155);
/* unused harmony export firebaseConfig */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







// Must export the config
var firebaseConfig = {
    apiKey: 'AIzaSyBIsrtVNmZJ9dDQleuItDsz3ZXtvzhiWv8',
    authDomain: 'https://angularfire2-offline.firebaseio.com',
    databaseURL: 'https://angularfire2-offline.firebaseio.com',
    storageBucket: 'gs://angularfire2-offline.appspot.com'
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_2_angularfire2__["a" /* AngularFireModule */].initializeApp(firebaseConfig),
            __WEBPACK_IMPORTED_MODULE_3_angularfire2_offline__["a" /* AngularFireOfflineModule */],
            __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabaseModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormsModule */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(82)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 227:
/***/ (function(module, exports) {

module.exports = "<h1>51.2 - AngularFire2 Only</h1>\nAlso, try this demo using <a target=\"_blank\" href=\"https://adriancarriger.github.io/angularfire2-offline/issues/51.1/dist\">AngularFire2 Offline</a>\n\n<h2>Add milk ({{max + 1}} items) using AngularFire2<span *ngIf=\"offline\"> Offline</span></h2>\n<button [disabled]=\"processing\" (click)=\"removeAll()\">Remove all</button>\n<button [disabled]=\"processing\" (click)=\"usingPush()\">Use multiple pushes</button>\n<button [disabled]=\"processing\" (click)=\"usingUpdate()\">Use multiple update</button>\n<button [disabled]=\"processing\" (click)=\"usingSet()\">Use single set</button>\n\n\n<div *ngIf=\"totalTime\">\n  <h2>Last operation took</h2>\n  <p>{{totalTime}} milliseconds</p>\n</div>\n\n<h2>Amount to add</h2>\n<input #inputItem type=\"number\" step=\"50\" value=\"50\" (input)=\"max = inputItem.value - 1\">\n\n<h2>List Size</h2>\n<p>{{(groceriesList | async)?.length}}</p>\n\n<h2>List Example</h2>\n<ul>\n  <li *ngFor=\"let item of groceriesList | async\">\n    {{item.text}}\n  </li>\n</ul>\n"

/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(149);


/***/ })

},[500]);
//# sourceMappingURL=main.bundle.js.map