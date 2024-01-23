"use strict";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function(to, from, except, desc) {
    if (from && typeof from === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toESM = function(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod);
};
var __toCommonJS = function(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/index.ts
var src_exports = {};
__export(src_exports, {
    ModalProvider: function() {
        return ModalProvider;
    },
    useModal: function() {
        return useModal;
    }
});
module.exports = __toCommonJS(src_exports);
// src/components/ModalManager.tsx
var import_react = __toESM(require("react"));
var import_react_router_dom = require("react-router-dom");
var ModalContext = (0, import_react.createContext)(void 0);
var useModal = function() {
    var context = (0, import_react.useContext)(ModalContext);
    if (context === void 0) {
        throw new Error("useModal must be used within a ModalProvider component");
    }
    return context;
};
var registeredModals = /* @__PURE__ */ new Map();
function registerModal(modal) {
    registeredModals.set(modal.modalId, modal);
}
function ModalProvider(param) {
    var children = param.children, modals = param.modals, _param_modalQueryStringParameter = param.modalQueryStringParameter, modalQueryStringParameter = _param_modalQueryStringParameter === void 0 ? "modal" : _param_modalQueryStringParameter;
    var _ref = _sliced_to_array((0, import_react.useState)(void 0), 2), currentModalId = _ref[0], setCurrentModalId = _ref[1];
    var _ref1 = _sliced_to_array((0, import_react.useState)(void 0), 2), currentModalProps = _ref1[0], setCurrentModalProps = _ref1[1];
    var navigate = (0, import_react_router_dom.useNavigate)();
    var _ref2 = _sliced_to_array((0, import_react_router_dom.useSearchParams)(), 1), searchParams = _ref2[0];
    (0, import_react.useEffect)(function() {
        return refreshModalIdFromUrlParameter();
    }, [
        searchParams
    ]);
    (0, import_react.useEffect)(function() {
        return reRegisterModals();
    }, [
        modals
    ]);
    function reRegisterModals() {
        modals.forEach(function(modal) {
            registeredModals.set(modal.modalId, modal);
        });
    }
    function closeModal(callbacks) {
        var _callbacks_preAction, _callbacks_postAction;
        callbacks === null || callbacks === void 0 ? void 0 : (_callbacks_preAction = callbacks.preAction) === null || _callbacks_preAction === void 0 ? void 0 : _callbacks_preAction.call(callbacks);
        removeModalIdFromUrlParameters();
        callbacks === null || callbacks === void 0 ? void 0 : (_callbacks_postAction = callbacks.postAction) === null || _callbacks_postAction === void 0 ? void 0 : _callbacks_postAction.call(callbacks);
    }
    function openModal(modalId, callbacks, dataForModal) {
        var _callbacks_preAction, _callbacks_postAction;
        setCurrentModalProps(dataForModal);
        callbacks === null || callbacks === void 0 ? void 0 : (_callbacks_preAction = callbacks.preAction) === null || _callbacks_preAction === void 0 ? void 0 : _callbacks_preAction.call(callbacks);
        setModalIdUrlParameter(modalId);
        callbacks === null || callbacks === void 0 ? void 0 : (_callbacks_postAction = callbacks.postAction) === null || _callbacks_postAction === void 0 ? void 0 : _callbacks_postAction.call(callbacks);
    }
    function removeModalIdFromUrlParameters() {
        var newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(modalQueryStringParameter);
        navigate("".concat(window.location.pathname, "?").concat(newSearchParams.toString()), {
            replace: true
        });
    }
    function setModalIdUrlParameter(modalId) {
        var newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(modalQueryStringParameter, modalId);
        navigate("".concat(window.location.pathname, "?").concat(newSearchParams.toString()), {
            replace: true
        });
    }
    function refreshModalIdFromUrlParameter() {
        var modalId = searchParams.get(modalQueryStringParameter);
        setCurrentModalId(modalId !== null && modalId !== void 0 ? modalId : void 0);
    }
    function getUrlForComparisonAgainstRegex() {
        var pathname = window.location.pathname;
        var search = window.location.search;
        var hash = window.location.hash;
        return pathname + search + hash;
    }
    function shouldIgnoreShowingCurrentModal() {
        if (currentModalId === void 0) return true;
        var currentModal = registeredModals.get(currentModalId);
        var shouldIgnorePattern = currentModal === null || currentModal === void 0 ? void 0 : currentModal.ignoreUrlPattern;
        if (!shouldIgnorePattern) return false;
        return shouldIgnorePattern.test(getUrlForComparisonAgainstRegex());
    }
    function onlyShowForUrlPatternPresentAndFails() {
        if (currentModalId === void 0) return false;
        var currentModal = registeredModals.get(currentModalId);
        var onlyForUrlPattern = currentModal === null || currentModal === void 0 ? void 0 : currentModal.onlyShowForUrlPattern;
        if (!onlyForUrlPattern) return false;
        return !onlyForUrlPattern.test(getUrlForComparisonAgainstRegex());
    }
    function getCurrentModal() {
        if (currentModalId === void 0) return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null);
        var currentModal = registeredModals.get(currentModalId);
        if (shouldIgnoreShowingCurrentModal()) return;
        if (onlyShowForUrlPatternPresentAndFails()) return;
        return currentModal.component;
    }
    return /* @__PURE__ */ import_react.default.createElement(ModalContext.Provider, {
        value: {
            openModal: openModal,
            closeModal: closeModal,
            currentModalProps: currentModalProps,
            registerModal: registerModal
        }
    }, getCurrentModal(), children);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    ModalProvider: ModalProvider,
    useModal: useModal
});
//# sourceMappingURL=index.js.map