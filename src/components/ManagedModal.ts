export interface ManagedModal {
  modalId: string;
  component: React.ReactNode;
  ignoreUrlPattern?: RegExp;
  onlyShowForUrlPattern?: RegExp;
}
