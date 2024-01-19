import React from "react";
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
    openModal: (modalId: string, callbacks?: ModalCallbacks, dataForModal?: Record<string, any>) => void;
    /**
     * Closes the currently open modal if present.
     *
     * @param callbacks the pre/post callbacks to invoke before/after closing the modal
     */
    closeModal: (callbacks?: ModalCallbacks) => void;
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
/**
 * The modal context allowing a caller to access the following properties:
 * - the function to open a modal
 * - the function to close a modal
 * - the current props for the current modal
 * - the modal registration function
 *
 * @returns this modal context
 */
export declare const useModal: () => ModalContextType;
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
export default function ModalProvider({ children, modals, modalQueryStringParameter, }: ModalProviderProps): React.JSX.Element;
export {};
