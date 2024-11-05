import React from 'react';

function ControlButtons({ onCalculate, onReset }) {
  return (
    <div className="control-buttons">
      <button onClick={onCalculate}>점수 계산</button>
      <button onClick={onReset}>초기화</button>
    </div>
  );
}

export default ControlButtons;
