import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';

const initalState = {
  question: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, question: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };

    default:
      throw new Error('Action unknow');
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initalState);

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((error) => dispatch({ type: 'dataFailed' }));
  }, []);

  console.log(state);
  return (
    <div className="app">
      <Header />

      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}

export default App;
