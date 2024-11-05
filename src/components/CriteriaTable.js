import React, { useState } from 'react';

function CriteriaTable({ criteria, setCriteria }) {
  const [errors, setErrors] = useState({}); // 에러 상태 추가
  const [newCriterionName, setNewCriterionName] = useState(''); // 새 고려사항 이름 상태
  const [newCriterionImportance, setNewCriterionImportance] = useState(5); // 새 고려사항 중요도

  // 중요도 변경 핸들러
  const handleImportanceChange = (criterionId, value) => {
    if (value < 1 || value > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [criterionId]: '중요도는 1에서 10 사이여야 합니다.',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [criterionId]: null }));
      const updatedCriteria = criteria.map((criterion) => {
        if (criterion.id === criterionId) {
          return { ...criterion, importance: parseInt(value) || 0 };
        }
        return criterion;
      });
      setCriteria(updatedCriteria);
    }
  };

  // 점수 변경 핸들러
  const handleScoreChange = (criterionId, alternativeIndex, value) => {
    if (value < 1 || value > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${criterionId}-${alternativeIndex}`]: '점수는 1에서 10 사이여야 합니다.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${criterionId}-${alternativeIndex}`]: null,
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

  // 고려사항 추가 핸들러
  const handleAddCriterion = () => {
    if (!newCriterionName.trim()) {
      alert('고려사항 이름을 입력하세요.');
      return;
    }
    const newCriterion = {
      id: criteria.length + 1,
      name: newCriterionName,
      importance: newCriterionImportance,
      scores: [0, 0, 0],
    };
    setCriteria([...criteria, newCriterion]);
    setNewCriterionName('');
    setNewCriterionImportance(5);
  };

  // 고려사항 삭제 핸들러
  const handleRemoveCriterion = (criterionId) => {
    const updatedCriteria = criteria.filter((criterion) => criterion.id !== criterionId);
    setCriteria(updatedCriteria);
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
            <th>삭제</th>
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
              <td>
                <button onClick={() => handleRemoveCriterion(criterion.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 고려사항 추가 입력란 */}
      <div className="add-criterion">
        <input
          type="text"
          placeholder="고려사항 이름"
          value={newCriterionName}
          onChange={(e) => setNewCriterionName(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="10"
          value={newCriterionImportance}
          onChange={(e) => setNewCriterionImportance(parseInt(e.target.value) || 5)}
        />
        <button onClick={handleAddCriterion}>고려사항 추가</button>
      </div>
    </div>
  );
}

export default CriteriaTable;
