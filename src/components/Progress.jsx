import React from 'react';

const Progress = ({ index, numQuestions, points, totalPoints }) => {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={index}
      />
      <p>
        <strong>
          Question {index} / {numQuestions}
        </strong>
      </p>
      <p>
        <strong>
          {points} / {totalPoints} points
        </strong>
      </p>
    </header>
  );
};

export default Progress;
