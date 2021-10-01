import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createEvent, createState } from '../dist';

const { useState, useSetState, Zone } = createState({ n: 0, g: 0 });
const { useReceiver, emit } = createEvent();

function Component1() {
  const state = useState();
  const setState = useSetState();

  useReceiver(() => {
    alert("Hello from component 1!");
  }, []);

  return (
    <>
      <button onClick={() => setState({ n: state.n + 1 })}>
        {state.n}
      </button>
      <button onClick={() => setState({ g: state.g + 1 })}>
        {state.g}
      </button>
    </>
  )
}

const App = () => {
  // Only rerenders when n changes
  const state = useState(["n"]);
  const setState = useSetState();

  return (
    <div>
      <Zone>
        <Component1 />
      </Zone>
      <p>Main component</p>
      {state.n}
      <button onClick={() => emit(undefined)}>Dispatch event</button>
      <button onClick={() => setState({ n: state.n + 2 })}>Increase by 2</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));



