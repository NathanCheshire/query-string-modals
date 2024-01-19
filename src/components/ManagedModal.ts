/**
 * A modal which a ModalManager context will manage.
 */
export interface ManagedModal {
  modalId: string;
  component: React.ReactNode;
  ignoreUrlPattern?: RegExp;
  onlyShowForUrlPattern?: RegExp;
}
