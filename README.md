# Niue

### A tiny shared state and event library for React

Niue is a small library (~1.0kb before compression) that provides a simple way to manage your React app's shared state and send events between components.

## Why Niue?

- You can stop making [a bunch of React contexts](https://github.com/kobra-dev/better-react-spreadsheet/blob/main/src/state.tsx#L33) which [store return values from useState](https://github.com/kobra-dev/better-react-spreadsheet/blob/main/src/Spreadsheet.tsx#L128)
- You don't need to use any provider components
- You don't need to keep setting up event listeners in `useEffect`s
- You don't need to remember the names of events - just import the event's hook and use it

## Installation

```bash
yarn add niue
```

## Managing shared state

To create a store (a thing to hold an object of state), use the `createState` function outside of a component:

```ts
import { createState } from 'niue';

const [useState, setState] = createState(
    // Initial value
    { count: 0, name: "foo" },
);
```

The resulting `useState` hook can be called in your component to get the latest state value:

```tsx
function Counter() {
    const state = useState();

    return (
        <div>
            <p>Hello, {state.name}!</p>
            {state.count}
        </div>
    );
}
```

`useState` also accepts an optional parameter to specify which properties of the state object to "subscribe" to. Changes of these properties will cause a re-render of the component. If you don't specify anything, the entire state object will be watched; if you specify `null`, nothing will be watched and no re-renders will occur when state changes.

```ts
// Subscribe to only the `count` property
const state = useState(["count"]);

// Don't subscribe to anything
const state = useState(null);
```

Here's an example of subscribing to a single property:

```tsx
import { useState } from "./Counter";

function CountDisplay() {
    const state = useState("count");

    return (
        <p>{state.count}</p>
    );
}
```

The `setState` function can be called to update the state:

```tsx
function Counter() {
    const state = useState();

    return (
        <div>
            <p>Hello, {state.name}!</p>
            {state.count}
            <button onClick={() => setState({ count: state.count + 1 })}>Increment</button>
        </div>
    );
}
```

As you can see in the example, the value passed to `setState` does not need to contain all of the properties in the state object. If you leave one out, it will not be modified.

You can also call `setState` with no parameters to use mutations to the existing state object:

```ts
state.name = "Test";
setState();
```

## Events

Events work similarly to state stores. You can create an event with the createEvent function:

```ts
import { createEvent } from 'niue';

const [useOnEvent, emit] = createEvent<string>();
```

The `createEvent` function doesn't accept any parameters, however it does have a type parameter for the message type.

The `useOnEvent` hook can be used in a component to subscribe to the event, and the `emit` function can be used to send the event:

```tsx
function EventDemo() {
    useOnEvent((message) => {
        alert(`Hello, ${message}!`);
    }, []);

    return (
        <div>
            Event demo
            <EventEmitter />
        </div>
    )
}

function EventEmitter() {
    return (
        <button onClick={() => emit(prompt("Enter your name"))}>Send event</button>
    );
}
```