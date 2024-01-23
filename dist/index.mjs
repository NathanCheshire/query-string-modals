// src/components/ModalManager.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
var ModalContext = createContext(void 0);
var useModal = () => {
  const context = useContext(ModalContext);
  if (context === void 0) {
    throw new Error("useModal must be used within a ModalProvider component");
  }
  return context;
};
var registeredModals = /* @__PURE__ */ new Map();
function registerModal(modal) {
  registeredModals.set(modal.modalId, modal);
}
function ModalProvider({
  children,
  modals,
  modalQueryStringParameter = "modal"
}) {
  const [currentModalId, setCurrentModalId] = useState(
    void 0
  );
  const [currentModalProps, setCurrentModalProps] = useState(void 0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => refreshModalIdFromUrlParameter(), [searchParams]);
  useEffect(() => reRegisterModals(), [modals]);
  function reRegisterModals() {
    modals.forEach((modal) => {
      registeredModals.set(modal.modalId, modal);
    });
  }
  function closeModal(callbacks) {
    callbacks?.preAction?.();
    removeModalIdFromUrlParameters();
    callbacks?.postAction?.();
  }
  function openModal(modalId, callbacks, dataForModal) {
    setCurrentModalProps(dataForModal);
    callbacks?.preAction?.();
    setModalIdUrlParameter(modalId);
    callbacks?.postAction?.();
  }
  function removeModalIdFromUrlParameters() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(modalQueryStringParameter);
    navigate(`${window.location.pathname}?${newSearchParams.toString()}`, {
      replace: true
    });
  }
  function setModalIdUrlParameter(modalId) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(modalQueryStringParameter, modalId);
    navigate(`${window.location.pathname}?${newSearchParams.toString()}`, {
      replace: true
    });
  }
  function refreshModalIdFromUrlParameter() {
    const modalId = searchParams.get(modalQueryStringParameter);
    setCurrentModalId(modalId ?? void 0);
  }
  function getUrlForComparisonAgainstRegex() {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    return pathname + search + hash;
  }
  function shouldIgnoreShowingCurrentModal() {
    if (currentModalId === void 0)
      return true;
    const currentModal = registeredModals.get(currentModalId);
    const shouldIgnorePattern = currentModal?.ignoreUrlPattern;
    if (!shouldIgnorePattern)
      return false;
    return shouldIgnorePattern.test(getUrlForComparisonAgainstRegex());
  }
  function onlyShowForUrlPatternPresentAndFails() {
    if (currentModalId === void 0)
      return false;
    const currentModal = registeredModals.get(currentModalId);
    const onlyForUrlPattern = currentModal?.onlyShowForUrlPattern;
    if (!onlyForUrlPattern)
      return false;
    return !onlyForUrlPattern.test(getUrlForComparisonAgainstRegex());
  }
  function getCurrentModal() {
    if (currentModalId === void 0)
      return /* @__PURE__ */ React.createElement(React.Fragment, null);
    const currentModal = registeredModals.get(currentModalId);
    if (shouldIgnoreShowingCurrentModal())
      return;
    if (onlyShowForUrlPatternPresentAndFails())
      return;
    return currentModal.component;
  }
  return /* @__PURE__ */ React.createElement(
    ModalContext.Provider,
    {
      value: { openModal, closeModal, currentModalProps, registerModal }
    },
    getCurrentModal(),
    children
  );
}
export {
  ModalProvider,
  useModal
};
//# sourceMappingURL=index.mjs.map