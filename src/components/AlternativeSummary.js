import React from 'react';

function AlternativeSummary({ totals, alternativeNames, setAlternativeNames }) {
  const handleNameChange = (index, value) => {
    const updatedNames = [...alternativeNames];
    updatedNames[index] = value;
    setAlternativeNames(updatedNames);
  };

  return (
    <div className="alternative-summary">
      <h2>대안 요약</h2>
      <table>
        <thead>
          <tr>
            <th>분류</th>
            <th>내용</th>
            <th>총점</th>
          </tr>
        </thead>
        <tbody>
          {totals.map((total, index) => (
            <tr key={index}>
              <td>{`대안 ${index + 1}`}</td>
              <td>
                <input
                  type="text"
                  value={alternativeNames[index]}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
              </td>
              <td>{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlternativeSummary;
