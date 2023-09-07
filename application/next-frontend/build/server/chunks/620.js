"use strict";
exports.id = 620;
exports.ids = [620];
exports.modules = {

/***/ 1620:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ serversideApiUri),
/* harmony export */   t: () => (/* binding */ clientsideApiUri)
/* harmony export */ });
if (false) {}
if (false) {}
/**
 * For use in clientside functionality.
 * In dev mode, api is routed through nginx with path /api
 */ const clientsideApiUri =  false ? 0 : "https://api.www.pizzabot.app".replace(/\/+$/, "");
/**
 * For use in serverside functionality.
 * In dev mode, next serverside fetch calls is not routed with nginx and goes directly to backend
 */ const serversideApiUri = "https://api.www.pizzabot.app".replace(/\/+$/, "") + "/api";


/***/ })

};
;