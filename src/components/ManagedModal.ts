/**
 * A modal which a ModalProvider context will manage.
 */
export interface ManagedModal {
  modalId: string;
  component: React.ReactNode;
  ignoreUrlPattern?: RegExp;
  onlyShowForUrlPattern?: RegExp;
}
