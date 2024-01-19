import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ManagedModal } from "./ManagedModal";
import { ModalCallbacks } from "./ModalCallbacks";

interface ModalContextType {
  /**
   * Opens the modal with the provided ID if registered.
   *
   * @param modalId the ID of the modal to show
   * @param callbacks the pre/post callbacks to invoke before/after opening the modal
   * @param dataForModal the data to set for the modal to access
   */
  openModal: (
    modalId: string,
    callbacks?: ModalCallbacks,
    dataForModal?: Record<string, any>
  ) => void;

  /**
   * Closes the currently open modal if present.
   *
   * @param callbacks the pre/post callbacks to invoke before/after closing the modal
   */
  closeModals: (callbacks?: ModalCallbacks) => void;

  /**
   * The data/props for the current active modal if any.
   */
  currentModalProps?: Record<string, any>;

  /**
   * Registers the provided ManagedModal, overriding any previously managed modal with the same ID.
   *
   * @param modal the modal to register
   */
  registerModal: (modal: ManagedModal) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * The modal context allowing a caller to access the following properties:
 * - the function to open a modal
 * - the function to close a modal
 * - the current props for the current modal
 * - the modal registration function
 *
 * @returns this modal context
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
export default function ModalProvider({
  children,
  modals,
  modalQueryStringParameter = "modal",
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
  function closeModals(callbacks?: ModalCallbacks) {
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
    const currentModal = registeredModals.get(currentModalId)!;

    if (shouldIgnoreShowingCurrentModal()) return;
    if (onlyShowForUrlPatternPresentAndFails()) return;

    return currentModal.component;
  }

  return (
    <ModalContext.Provider
      value={{ openModal, closeModals, currentModalProps, registerModal }}
    >
      {getCurrentModal()}
      {children}
    </ModalContext.Provider>
  );
}
