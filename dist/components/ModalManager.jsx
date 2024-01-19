var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
var ModalContext = createContext(undefined);
/**
 * The modal context allowing a caller to access the following properties:
 * - the function to open a modal
 * - the function to close a modal
 * - the current props for the current modal
 * - the modal registration function
 *
 * @returns this modal context
 */
export var useModal = function () {
    var context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider component");
    }
    return context;
};
var registeredModals = new Map();
/**
 * Registers the provided ManagedModal, overriding any previously managed modal with the same ID.
 *
 * @param modal the modal to register
 */
function registerModal(modal) {
    registeredModals.set(modal.modalId, modal);
}
/**
 * A context provider providing children the ability to register modals with this manager,
 *  open them, close them, register additional modals, and access current modal state data.
 *
 * @param children the children of this provider
 * @param modals the initial modals this manager will manage
 * @param the queryStringParameter which controls which if any modal this manager is showing
 * @returns this provider
 */
export default function ModalProvider(_a) {
    var children = _a.children, modals = _a.modals, _b = _a.modalQueryStringParameter, modalQueryStringParameter = _b === void 0 ? "modal" : _b;
    var _c = __read(useState(undefined), 2), currentModalId = _c[0], setCurrentModalId = _c[1];
    var _d = __read(useState(undefined), 2), currentModalProps = _d[0], setCurrentModalProps = _d[1];
    var navigate = useNavigate();
    var _e = __read(useSearchParams(), 1), searchParams = _e[0];
    useEffect(function () { return refreshModalIdFromUrlParameter(); }, [searchParams]);
    useEffect(function () { return reRegisterModals(); }, [modals]);
    function reRegisterModals() {
        modals.forEach(function (modal) {
            registeredModals.set(modal.modalId, modal);
        });
    }
    /**
     * Closes the currently open modal if present.
     *
     * @param callbacks the pre/post callbacks to invoke before/after closing the modal
     */
    function closeModals(callbacks) {
        var _a, _b;
        (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.preAction) === null || _a === void 0 ? void 0 : _a.call(callbacks);
        removeModalIdFromUrlParameters();
        (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.postAction) === null || _b === void 0 ? void 0 : _b.call(callbacks);
    }
    /**
     * Opens the modal with the provided ID if registered.
     *
     * @param modalId the ID of the modal to show
     * @param callbacks the pre/post callbacks to invoke before/after opening the modal
     * @param dataForModal the data to set for the modal to access
     */
    function openModal(modalId, callbacks, dataForModal) {
        var _a, _b;
        setCurrentModalProps(dataForModal);
        (_a = callbacks === null || callbacks === void 0 ? void 0 : callbacks.preAction) === null || _a === void 0 ? void 0 : _a.call(callbacks);
        setModalIdUrlParameter(modalId);
        (_b = callbacks === null || callbacks === void 0 ? void 0 : callbacks.postAction) === null || _b === void 0 ? void 0 : _b.call(callbacks);
    }
    function removeModalIdFromUrlParameters() {
        var newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(modalQueryStringParameter);
        navigate("".concat(window.location.pathname, "?").concat(newSearchParams.toString()), {
            replace: true,
        });
    }
    function setModalIdUrlParameter(modalId) {
        var newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(modalQueryStringParameter, modalId);
        navigate("".concat(window.location.pathname, "?").concat(newSearchParams.toString()), {
            replace: true,
        });
    }
    function refreshModalIdFromUrlParameter() {
        var modalId = searchParams.get(modalQueryStringParameter);
        setCurrentModalId(modalId !== null && modalId !== void 0 ? modalId : undefined);
    }
    function getUrlForComparisonAgainstRegex() {
        var pathname = window.location.pathname;
        var search = window.location.search;
        var hash = window.location.hash;
        return pathname + search + hash;
    }
    function shouldIgnoreShowingCurrentModal() {
        // No ID so obviously no modal will show
        if (currentModalId === undefined)
            return true;
        var currentModal = registeredModals.get(currentModalId);
        var shouldIgnorePattern = currentModal === null || currentModal === void 0 ? void 0 : currentModal.ignoreUrlPattern;
        // No pattern so so proceed to next checks from caller
        if (!shouldIgnorePattern)
            return false;
        return shouldIgnorePattern.test(getUrlForComparisonAgainstRegex());
    }
    function onlyShowForUrlPatternPresentAndFails() {
        // No ID so this should have no affect
        if (currentModalId === undefined)
            return false;
        var currentModal = registeredModals.get(currentModalId);
        var onlyForUrlPattern = currentModal === null || currentModal === void 0 ? void 0 : currentModal.onlyShowForUrlPattern;
        // No pattern so so proceed to next checks from caller
        if (!onlyForUrlPattern)
            return false;
        // if pattern is present and fails, we cannot show the current modal
        return !onlyForUrlPattern.test(getUrlForComparisonAgainstRegex());
    }
    function getCurrentModal() {
        if (currentModalId === undefined)
            return <></>;
        var currentModal = registeredModals.get(currentModalId);
        if (shouldIgnoreShowingCurrentModal())
            return;
        if (onlyShowForUrlPatternPresentAndFails())
            return;
        return currentModal.component;
    }
    return (<ModalContext.Provider value={{ openModal: openModal, closeModals: closeModals, currentModalProps: currentModalProps, registerModal: registerModal }}>
      {getCurrentModal()}
      {children}
    </ModalContext.Provider>);
}
