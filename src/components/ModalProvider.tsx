import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ManagedModal } from "./ManagedModal";
import { ModalCallbacks } from "./ModalCallbacks";

/**
 * Type definition for the modal context.
 * Provides functions to open and close modals, access current modal props, and register new modals.
 */
interface ModalContextType {
  /**
   * Opens a modal with the specified ID.
   *
   * @param modalId - The ID of the modal to open
   * @param callbacks - Optional callbacks to run before and after opening the modal
   * @param dataForModal - Optional data to pass to the modal
   */
  openModal: (
    modalId: string,
    callbacks?: ModalCallbacks,
    dataForModal?: Record<string, any>
  ) => void;

  /**
   * Closes the currently open modal, if any
   *
   * @param callbacks - Optional callbacks to run before and after closing the modal
   */
  closeModal: (callbacks?: ModalCallbacks) => void;

  /**
   * Contains the data/props for the currently active modal.
   */
  currentModalProps?: Record<string, any>;

  /**
   * Registers a modal for management by the context.
   *
   * @param modal - The modal to register
   */
  registerModal: (modal: ManagedModal) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Custom hook for accessing the modal context.
 * This hook provides functions to open and close modals, as well as the ability to register new modals.
 * It should be used within components that are children of `ModalProvider`.
 *
 * @returns An object containing:
 * - `openModal`: Function to open a modal by its ID. It can take optional callbacks and data for the modal.
 * - `closeModal`: Function to close the currently open modal. It can take optional callbacks.
 * - `currentModalProps`: An object containing the current active modal's props.
 * - `registerModal`: Function to register a new modal with the context.
 *
 * @throws Error if used outside of a `ModalProvider` component.
 */
export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider component");
  }

  return context;
};

const registeredModals = new Map<string, ManagedModal>();

/**
 * Registers the provided ManagedModal, overriding any previously managed modal with the same ID.
 *
 * @param modal the modal to register
 */
function registerModal(modal: ManagedModal) {
  registeredModals.set(modal.modalId, modal);
}

interface ModalProviderProps {
  children: React.ReactNode;
  modals: ManagedModal[];
  modalQueryStringParameter?: string;
  modalIdNotFoundFallback?: React.ReactNode;
  removeModalIdIfNotFound?: boolean;
}

/**
 * Component providing the modal context to its children.
 * Manages the registration, opening, and closing of modals based on modal IDs.
 *
 * @param children - The child components that will have access to the modal context
 * @param modals - An array of `ManagedModal` objects to be initially registered
 * @param modalQueryStringParameter - The URL query string parameter used to control modals. Defaults to "modal"
 * @param modalIdNotFoundFallback - The fallback modal to show if no modal with the current ID is found
 * @param removeModalIdFromUrlParameters - Whether to remove the invalid modal ID if an invalid modal
 *  ID is found in the URL. Note this trumps the fallback element if provided
 * @returns A `ModalContext.Provider` wrapping the children
 */
export default function ModalProvider({
  children,
  modals,
  modalQueryStringParameter = "modal",
  modalIdNotFoundFallback = <></>,
  removeModalIdIfNotFound = true,
}: ModalProviderProps) {
  const [currentModalId, setCurrentModalId] = useState<string | undefined>(
    undefined
  );
  const [currentModalProps, setCurrentModalProps] = useState<
    Record<string, any> | undefined
  >(undefined);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => refreshModalIdFromUrlParameter(), [searchParams]);
  useEffect(() => reRegisterModals(), [modals]);

  function reRegisterModals() {
    modals.forEach((modal) => {
      registeredModals.set(modal.modalId, modal);
    });
  }

  /**
   * Closes the currently open modal if present.
   *
   * @param callbacks the pre/post callbacks to invoke before/after closing the modal
   */
  function closeModal(callbacks?: ModalCallbacks) {
    callbacks?.preAction?.();
    removeModalIdFromUrlParameters();
    callbacks?.postAction?.();
  }

  /**
   * Opens the modal with the provided ID if registered.
   *
   * @param modalId the ID of the modal to show
   * @param callbacks the pre/post callbacks to invoke before/after opening the modal
   * @param dataForModal the data to set for the modal to access
   */
  function openModal(
    modalId: string,
    callbacks?: ModalCallbacks,
    dataForModal?: Record<string, any>
  ) {
    setCurrentModalProps(dataForModal);

    callbacks?.preAction?.();
    setModalIdUrlParameter(modalId);
    callbacks?.postAction?.();
  }

  function removeModalIdFromUrlParameters() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(modalQueryStringParameter);
    navigate(`${window.location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  }

  function setModalIdUrlParameter(modalId: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(modalQueryStringParameter, modalId);
    navigate(`${window.location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  }

  function refreshModalIdFromUrlParameter() {
    const modalId = searchParams.get(modalQueryStringParameter);
    setCurrentModalId(modalId ?? undefined);
  }

  function getUrlForComparisonAgainstRegex() {
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    return pathname + search + hash;
  }

  function shouldIgnoreShowingCurrentModal(): boolean {
    // No ID so obviously no modal will show
    if (currentModalId === undefined) return true;
    const currentModal = registeredModals.get(currentModalId);
    const shouldIgnorePattern = currentModal?.ignoreUrlPattern;
    // No pattern so so proceed to next checks from caller
    if (!shouldIgnorePattern) return false;
    return shouldIgnorePattern.test(getUrlForComparisonAgainstRegex());
  }

  function onlyShowForUrlPatternPresentAndFails(): boolean {
    // No ID so this should have no affect
    if (currentModalId === undefined) return false;
    const currentModal = registeredModals.get(currentModalId);
    const onlyForUrlPattern = currentModal?.onlyShowForUrlPattern;
    // No pattern so so proceed to next checks from caller
    if (!onlyForUrlPattern) return false;
    // if pattern is present and fails, we cannot show the current modal
    return !onlyForUrlPattern.test(getUrlForComparisonAgainstRegex());
  }

  function getCurrentModal() {
    if (currentModalId === undefined) return <></>;
    if (!registeredModals.has(currentModalId)) {
      if (removeModalIdIfNotFound) {
        removeModalIdFromUrlParameters();
        return;
      } else {
        return modalIdNotFoundFallback;
      }
    }
    const currentModal = registeredModals.get(currentModalId);
    if (currentModal === undefined) {
      return modalIdNotFoundFallback;
    }

    if (shouldIgnoreShowingCurrentModal()) return;
    if (onlyShowForUrlPatternPresentAndFails()) return;

    return currentModal.component;
  }

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, currentModalProps, registerModal }}
    >
      {getCurrentModal()}
      {children}
    </ModalContext.Provider>
  );
}
