import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createEvent, createState } from '../dist';

const [useState, setState] = createState({ n: 0, g: 0 });
const [useOnEvent, emit] = createEvent();

function Component1() {
  const state = useState();

  useOnEvent(() => {
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
  return (
    <div>
      <Component1 />
      {state.n}
      <button onClick={() => emit(undefined)}>Dispatch event</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));



