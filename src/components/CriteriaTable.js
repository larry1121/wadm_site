import React, { useState } from 'react';

function CriteriaTable({ criteria, setCriteria }) {
  const [errors, setErrors] = useState({}); // 에러 상태 추가

  const handleImportanceChange = (criterionId, value) => {
    if (value < 1 || value > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [criterionId]: '중요도는 1에서 10 사이여야 합니다.',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [criterionId]: null })); // 유효한 값 입력 시 오류 제거
      const updatedCriteria = criteria.map((criterion) => {
        if (criterion.id === criterionId) {
          return { ...criterion, importance: parseInt(value) || 0 };
        }
        return criterion;
      });
      setCriteria(updatedCriteria);
    }
  };

  const handleScoreChange = (criterionId, alternativeIndex, value) => {
    if (value < 1 || value > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${criterionId}-${alternativeIndex}`]: '점수는 1에서 10 사이여야 합니다.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${criterionId}-${alternativeIndex}`]: null, // 유효한 값 입력 시 오류 제거
      }));
      const updatedCriteria = criteria.map((criterion) => {
        if (criterion.id === criterionId) {
          const newScores = [...criterion.scores];
          newScores[alternativeIndex] = parseInt(value) || 0;
          return { ...criterion, scores: newScores };
        }
        return criterion;
      });
      setCriteria(updatedCriteria);
    }
  };

  return (
    <div className="criteria-table">
      <h2>고려사항</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>고려사항</th>
            <th>중요도</th>
            <th>대안 1</th>
            <th>대안 2</th>
            <th>대안 3</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((criterion) => (
            <tr key={criterion.id}>
              <td>{criterion.id}</td>
              <td>{criterion.name}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={criterion.importance}
                  onChange={(e) =>
                    handleImportanceChange(criterion.id, e.target.value)
                  }
                />
                {errors[criterion.id] && (
                  <span className="error-message">{errors[criterion.id]}</span>
                )}
              </td>
              {criterion.scores.map((score, index) => (
                <td key={index}>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={score}
                    onChange={(e) =>
                      handleScoreChange(criterion.id, index, e.target.value)
                    }
                  />
                  {errors[`${criterion.id}-${index}`] && (
                    <span className="error-message">
                      {errors[`${criterion.id}-${index}`]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CriteriaTable;
