# Niue

### A tiny shared state and event library for React

Niue is a small library (less than **800 bytes** before compression) that provides a simple way to manage your React app's shared state and send events between components. I've used it for a while in my own projects and I find it simplifies the architecture of React apps significantly.

## Why Niue?

### State
- Easily create state that's shared across components without any hierarchy
- Storing application state in a single place makes it very easy to save and restore it
- Simple API supports state patching and imperative state updates
- Components only subscribe to the state they need
- You can stop making [a bunch of React contexts](https://github.com/kobra-dev/better-react-spreadsheet/blob/main/src/state.tsx#L33) which [store return values from useState](https://github.com/kobra-dev/better-react-spreadsheet/blob/main/src/Spreadsheet.tsx#L128)
- You don't need to use any provider components

### Events
- You don't need to keep setting up event listeners in `useEffect`s
- You don't need to remember the names of events - just import the event's hook and use it
- In many cases, using events instead of a mess of callback props can greatly simplify cross-component communication

## Installation

```bash
yarn add niue
```

## Managing shared state

To create a store (a thing to hold an object of state), use the `createState` function outside of a component:

```ts
import { createState } from 'niue';

const [useStore, patchStore, getStore] = createState(
    // Initial value
    { count: 0, name: "foo" }
);
```

The resulting `useStore` hook can be called in your component to get the latest state value:

```tsx
function Counter() {
    const state = useStore();

    return (
        <div>
            <p>Hello, {state.name}!</p>
            {state.count}
        </div>
    );
}
```

`useStore` also accepts an optional parameter to specify which properties of the state object to "subscribe" to. Changes of these properties will cause a re-render of the component. If you don't specify anything, the entire state object will be watched; if you specify `null`, nothing will be watched and no re-renders will occur when state changes.

```ts
// Subscribe to only the `count` property
const state = useStore(["count"]);

// Don't subscribe to anything
const state = useStore(null);
```

Here's an example of subscribing to a single property (so the component won't rerender when `state.name` changes):

```tsx
import { useStore } from "./Counter";

function CountDisplay() {
    const state = useStore(["count"]);

    return (
        <p>{state.count}</p>
    );
}
```

The `patchStore` function can be called to update the state:

```tsx
function Counter() {
    const state = useStore();

    return (
        <div>
            <p>Hello, {state.name}!</p>
            {state.count}
            <button onClick={() => patchStore({ count: state.count + 1 })}>Increment</button>
        </div>
    );
}
```

As you can see in the example, the value passed to `patchStore` does not need to contain all of the properties in the state object. If you leave one out, it will not be modified.

You can also call `patchStore` with no parameters to use mutations to the existing state object:

```ts
state.name = "Test";
patchStore();
```

In addition, you can provide an array of changed keys to override Niue's default shallow comparison for detecting changes:

```ts
state.things[1].name = "Test";
patchStore(["things"]);
```

The `getStore` function can be used to access the store outside a React component, which is useful in callback functions where you don't want the entire component to rerender whenever the state changes:

```tsx
<Button onClick={() => {
    download(JSON.stringify(getStore()));
}}>Download</Button>
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