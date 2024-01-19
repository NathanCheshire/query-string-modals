/**
 * Callbacks invoked before/after a modal event such as an open or close.
 */
export interface ModalCallbacks {
  preAction?: () => void;
  postAction?: () => void;
}
