# react-use-context-selector

Context selector hook for React

## Introduction

There is currently no native way in React to subscribe to a part of context using hooks. That means changing a small part of context, can result in re-rendering every single component that uses the context.

There also exists another package, [use-context-selector](https://github.com/dai-shi/use-context-selector), for the same purpose, but it does not allow you to use the conventional `Consumer` anymore, and it also does not have type declarations.

## Usage

For a working demo, please take a look at [this code sandbox](https://codesandbox.io/s/react-use-context-selector-demo-7p6id)

```
npm install --save react-use-context-selector
```

```js
import { createContext } from 'react';
import {
  createSelectorProvider,
  useContextSelector
} from "react-use-context-selector";

const context = createContext({
  name: 'Mike',
  age: 25,
});
const ProviderWithSelector = createSelectorProvider(context);

// Root Component
function Root() {
  return (
    <ProviderWithSelector>
      <MyComponent />
    </ProviderWithSelector>
  );
}

// The component that consumes the context
function MyComponent() {
  // This component will re-render only if the name within the context object change.
  const name = useContextSelector(context, value => value.name);

  return <div>{name}</div>;
}
```
