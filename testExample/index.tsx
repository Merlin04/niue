import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createEvent, createState, useRerender } from '../dist';

const [useStore, patchStore, getStore] = createState({ n: 0, g: 0, things: ["test"] });
const [useOnEvent, emit] = createEvent();

function Component1() {
  const state = useStore();

  useOnEvent(() => {
    alert("Hello from component 1!");
  }, []);

  return (
    <>
      <button onClick={() => patchStore({ n: state.n + 1 })}>
        {state.n}
      </button>
      <button onClick={() => patchStore({ g: state.g + 1 })}>
        {state.g}
      </button>
      <button onClick={() => {
        state.things.push("test" + state.n + state.g);
        state.n++;
        state.g++;
        patchStore(["things"]);
        patchStore();
      }}>
         Add a thing
      </button>
      {state.things.map(thing => (
        <div>{thing}</div>
      ))}

      <button onClick={() => {
        alert(JSON.stringify(getStore()));
      }}>
        get store
      </button>
      <button onClick={() => {
        patchStore({ n: state.n + 1, g: state.g + 1}, ["g"]);
        setTimeout(() => {
          patchStore();
        }, 1000);
      }}>
        Another test
      </button>
    </>
  )
}

function RerenderTest() {
  const rerender = useRerender();

  alert("Rerender");

  return (
    <button onClick={() => {
      rerender();
    }}>
      Rerender
    </button>
  );
}

const App = () => {
  // Only rerenders when n changes
  const state = useStore(["n"]);
  return (
    <div>
      <Component1 />
      {state.n}
      <button onClick={() => emit(undefined)}>Dispatch event</button>
      <RerenderTest />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));



