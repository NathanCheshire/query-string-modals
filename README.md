# Query String Modals

## By Nathan Cheshire

### Introduction

Query-string-modals is a React library designed for seamlessly managing modals using query strings. This library integrates with React Router to provide a unique approach to modal management, leveraging URL query parameters to control modal visibility. It is optimal for applications that require modal states to be reflected in the URL, enabling deep linking and state persistence across components and page reloads.

### Installation

`npm install query-string-modals`

### Usage

First, ensure your application is using React Router. Then, wrap your application with the `ModalProvider` from. Provide the initial modals you want to manage:

```ts
import ModalProvider, { ManagedModal } from "query-string-modals";

// Define your modals
const modals: ManagedModal[] = [
  {
    modalId: "exampleModal",
    component: <YourModalComponent />,
    // Optional URL patterns
    ignoreUrlPattern: /pattern-to-ignore/,
    onlyShowForUrlPattern: /pattern-to-show/,
  },
  // ... other modals
];

function App() {
  return (
    <Router>
      <ModalProvider modals={modals}>
        {/* Your routes and components */}
      </ModalProvider>
    </Router>
  );
}
```

Now you may utilize the `useModal` hook from any component below the context to open a particular modal, close a particular modal, and access the current modal state/props.

```ts
import { useModal } from "query-string-modals";

function YourComponent() {
  const MODAL_ID_TO_OPEN = "exampleModal";
  const { openModal, closeModal } = useModal();

  const openExampleModal = () => {
    openModal(MODAL_ID_TO_OPEN, {
      preAction: () => console.log("Modal opening."),
      postAction: () => console.log("Modal opened."),
    });
  };

  const closeModal = () => {
    closeModal({
      preAction: () => console.log("Modal closing."),
      postAction: () => console.log("Modal closed."),
    });
  };

  return (
    <div>
      <button onClick={openExampleModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  );
}
```

### Contributing

### License

`query-string-modals` is licensed under the MIT License. See the LICENSE file for more details.

### Resources

### Credits
