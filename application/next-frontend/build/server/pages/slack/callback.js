"use strict";
(() => {
var exports = {};
exports.id = 712;
exports.ids = [712];
exports.modules = {

/***/ 7165:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_page_2Fslack_2Fcallback_preferredRegion_absolutePagePath_private_next_pages_2Fslack_2Fcallback_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_),
  getServerSideProps: () => (/* binding */ next_route_loaderkind_PAGES_page_2Fslack_2Fcallback_preferredRegion_absolutePagePath_private_next_pages_2Fslack_2Fcallback_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_getServerSideProps),
  getStaticPaths: () => (/* binding */ getStaticPaths),
  getStaticProps: () => (/* binding */ getStaticProps),
  reportWebVitals: () => (/* binding */ reportWebVitals),
  routeModule: () => (/* binding */ routeModule),
  unstable_getServerProps: () => (/* binding */ unstable_getServerProps),
  unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),
  unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),
  unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),
  unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)
});

// NAMESPACE OBJECT: ./pages/slack/callback.tsx
var callback_namespaceObject = {};
__webpack_require__.r(callback_namespaceObject);
__webpack_require__.d(callback_namespaceObject, {
  "default": () => (callback),
  getServerSideProps: () => (getServerSideProps)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages/module.js
var pages_module = __webpack_require__(3185);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(5244);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/helpers.js
var helpers = __webpack_require__(7182);
// EXTERNAL MODULE: ./pages/_document.tsx
var _document = __webpack_require__(3162);
// EXTERNAL MODULE: ./pages/_app.tsx
var _app = __webpack_require__(4178);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./src/api/endpoints.ts
var endpoints = __webpack_require__(1620);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./pages/slack/callback.tsx



const getServerSideProps = async ({ query })=>{
    const code = query.code;
    if (!query.code || typeof query.code !== "string") return {
        props: {
            success: false
        }
    };
    const res = await fetch(`${endpoints/* serversideApiUri */.U}/slack/callback`, {
        method: "POST",
        body: JSON.stringify({
            code: code
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch((err)=>{
        console.error(err);
    });
    return {
        props: {
            success: res?.ok
        }
    };
};
const SlackInstallCallback = ({ success })=>{
    if (!success) {
        return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "flex w-full flex-col justify-center gap-8",
            children: [
                /*#__PURE__*/ jsx_runtime.jsx("h1", {
                    className: "text-center text-xl font-bold",
                    children: "Error adding to workspace "
                }),
                /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                    className: "m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300",
                    href: "/",
                    children: "Try again"
                })
            ]
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: "flex w-full flex-col justify-center gap-8",
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("h1", {
                className: "text-center text-xl font-bold",
                children: "Bot added to workspace! "
            }),
            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                className: "text-center font-bold",
                children: "Login to administrate the bot "
            }),
            /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                href: "/login",
                className: "m-auto w-fit border border-black px-8 py-2 hover:bg-slate-300",
                children: "Go to login"
            })
        ]
    });
};
/* harmony default export */ const callback = (SlackInstallCallback);

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2Fslack%2Fcallback&preferredRegion=&absolutePagePath=private-next-pages%2Fslack%2Fcallback.tsx&absoluteAppPath=private-next-pages%2F_app.tsx&absoluteDocumentPath=private-next-pages%2F_document.tsx&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



// Import the app and document modules.
// @ts-expect-error - replaced by webpack/turbopack loader

// @ts-expect-error - replaced by webpack/turbopack loader

// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

const PagesRouteModule = pages_module.PagesRouteModule;
// Re-export the component (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_page_2Fslack_2Fcallback_preferredRegion_absolutePagePath_private_next_pages_2Fslack_2Fcallback_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(callback_namespaceObject, "default"));
// Re-export methods.
const getStaticProps = (0,helpers/* hoist */.l)(callback_namespaceObject, "getStaticProps");
const getStaticPaths = (0,helpers/* hoist */.l)(callback_namespaceObject, "getStaticPaths");
const next_route_loaderkind_PAGES_page_2Fslack_2Fcallback_preferredRegion_absolutePagePath_private_next_pages_2Fslack_2Fcallback_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_getServerSideProps = (0,helpers/* hoist */.l)(callback_namespaceObject, "getServerSideProps");
const config = (0,helpers/* hoist */.l)(callback_namespaceObject, "config");
const reportWebVitals = (0,helpers/* hoist */.l)(callback_namespaceObject, "reportWebVitals");
// Re-export legacy methods.
const unstable_getStaticProps = (0,helpers/* hoist */.l)(callback_namespaceObject, "unstable_getStaticProps");
const unstable_getStaticPaths = (0,helpers/* hoist */.l)(callback_namespaceObject, "unstable_getStaticPaths");
const unstable_getStaticParams = (0,helpers/* hoist */.l)(callback_namespaceObject, "unstable_getStaticParams");
const unstable_getServerProps = (0,helpers/* hoist */.l)(callback_namespaceObject, "unstable_getServerProps");
const unstable_getServerSideProps = (0,helpers/* hoist */.l)(callback_namespaceObject, "unstable_getServerSideProps");
// Create and export the route module that will be consumed.
const routeModule = new PagesRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES,
        page: "/slack/callback",
        pathname: "/slack/callback",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    components: {
        App: _app["default"],
        Document: _document["default"]
    },
    userland: callback_namespaceObject
});

//# sourceMappingURL=pages.js.map

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 4140:
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 9716:
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 3100:
/***/ ((module) => {

module.exports = require("next/dist/server/render.js");

/***/ }),

/***/ 6368:
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 3280:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 6724:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 8743:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 1109:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-local-url.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 7782:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-href.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [769,664,163,620], () => (__webpack_exec__(7165)));
module.exports = __webpack_exports__;

})();