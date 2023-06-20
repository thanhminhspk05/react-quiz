import { useEffect, useReducer } from 'react';
import Error from './Error';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Header from './Header';
import Loader from './Loader';
import Main from './Main';
import NextButton from './NextButton';
import Progress from './Progress';
import Question from './Question';
import StartScreen from './StartScreen';
import Timer from './Timer';

const initalState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

export const reducer = (state, action) => {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      };
    case 'nextQuestion':
      if (state.index === state.questions.length - 1)
        return {
          ...state,
          status: 'finished',
          highscore: state.points > state.highscore ? state.points : state.highscore,
        };
      return { ...state, index: state.index + 1, answer: null };
    case 'restart':
      return { ...initalState, questions: state.questions, status: 'ready', highscore: state.highscore };
    case 'tick':
      if (state.secondsRemaining === 0) return { ...state, status: 'finished' };
      return { ...state, secondsRemaining: state.secondsRemaining - 1 };

    default:
      throw new Error('Action unknow');
  }
};

function App() {
  const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(
    reducer,
    initalState
  );
  const numQuestions = questions.length;
  const totalPoints = questions.reduce((acc, question) => acc + question.points, 0);

  useEffect(() => {
    fetch('http://localhost:8010/questions')
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((error) => dispatch({ type: 'dataFailed' }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
          />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              totalPoints={totalPoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
              />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
