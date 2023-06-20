import React, { useEffect } from 'react';

const Timer = ({ dispatch, secondsRemaining }) => {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining - mins * 60;

  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(timerId);
  }, [dispatch]);

  return (
    <div className="timer">
      {mins < 10 && '0'}
      {mins} : {seconds < 10 && '0'}
      {seconds}
    </div>
  );
};

// const Timer = () => {
//   const [timer, setTimer] = useState(10);

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       setTimer((timer) => timer - 1);
//     }, 1000);
//     return () => clearInterval(timerId);
//   }, [timer]);
//   return <div className="timer">{timer}</div>;
// };

export default Timer;
