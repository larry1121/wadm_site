import React, { useState } from 'react';
import './CriteriaTable.css'; // CSS 파일을 사용하여 스타일링

function CriteriaTable({ criteria, setCriteria }) {
  const [errors, setErrors] = useState({});
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionImportance, setNewCriterionImportance] = useState(5);
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(false);
  };

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

      {/* 고려사항 추가 버튼 */}
      <button onClick={() => setShowModal(true)} className="add-criterion-button">
        + 고려사항 추가
      </button>

      {/* 고려사항 추가 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>새로운 고려사항 추가</h3>
            <label>고려사항 이름 : </label>
            <input
              type="text"
              // placeholder="예: 비용, 시간, 품질 등"
              value={newCriterionName}
              onChange={(e) => setNewCriterionName(e.target.value)}
            />
            <label>중요도 (1-10) : </label>
            <input
              type="number"
              min="1"
              max="10"
              placeholder="1에서 10 사이의 숫자"
              value={newCriterionImportance}
              onChange={(e) => setNewCriterionImportance(parseInt(e.target.value) || 5)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddCriterion}>추가</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CriteriaTable;
