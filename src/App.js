import React, { useState, useEffect } from 'react';
import './App.css';
import CriteriaTable from './components/CriteriaTable';
import AlternativeSummary from './components/AlternativeSummary';
import ControlButtons from './components/ControlButtons';
import { fetchCriteriaFromGPT } from './services/gptService';

const criteriaSets = {
  취업: [
    { id: 1, name: '집과의 거리', importance: 5, scores: [0, 0, 0] },
    { id: 2, name: '급여', importance: 8, scores: [0, 0, 0] },
    { id: 3, name: '성장 가능성', importance: 7, scores: [0, 0, 0] },
    { id: 4, name: '업무 시간', importance: 6, scores: [0, 0, 0] },
  ],
  이직: [
    { id: 1, name: '현재 직장과 비교한 급여', importance: 8, scores: [0, 0, 0] },
    { id: 2, name: '경력 발전 가능성', importance: 7, scores: [0, 0, 0] },
    { id: 3, name: '업무와 생활의 균형', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '회사 문화와 분위기', importance: 5, scores: [0, 0, 0] },
  ],
  창업: [
    { id: 1, name: '초기 투자 비용', importance: 9, scores: [0, 0, 0] },
    { id: 2, name: '시장 경쟁력', importance: 8, scores: [0, 0, 0] },
    { id: 3, name: '개인 역량 및 준비', importance: 7, scores: [0, 0, 0] },
    { id: 4, name: '예상 수익성', importance: 6, scores: [0, 0, 0] },
  ],
};

function App() {
  const [criteria, setCriteria] = useState([]);
  const [totals, setTotals] = useState([0, 0, 0]);
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [alternativeNames, setAlternativeNames] = useState(["대안 1", "대안 2", "대안 3"]);

  // 로컬 스토리지에서 데이터를 불러오는 함수
  useEffect(() => {
    const savedCriteria = localStorage.getItem('criteria');
    const savedAlternatives = localStorage.getItem('alternativeNames');
    if (savedCriteria) setCriteria(JSON.parse(savedCriteria));
    if (savedAlternatives) setAlternativeNames(JSON.parse(savedAlternatives));
  }, []);

  // criteria와 alternativeNames가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('criteria', JSON.stringify(criteria));
    localStorage.setItem('alternativeNames', JSON.stringify(alternativeNames));
  }, [criteria, alternativeNames]);

  const calculateScores = () => {
    const newTotals = [0, 0, 0];
    criteria.forEach((criterion) => {
      criterion.scores.forEach((score, index) => {
        newTotals[index] += score * criterion.importance;
      });
    });
    setTotals(newTotals);
  };

  const resetScores = () => {
    const confirmed = window.confirm("모든 데이터를 초기화하시겠습니까?");
    if (!confirmed) return;

    const resetCriteria = criteria.map((criterion) => ({
      ...criterion,
      scores: [0, 0, 0],
    }));
    setCriteria(resetCriteria);
    setAlternativeNames(["대안 1", "대안 2", "대안 3"]);
    setTotals([0, 0, 0]);

    localStorage.removeItem('criteria');
    localStorage.removeItem('alternativeNames');
  };

  const handleTopicChange = (event) => {
    const selectedTopic = event.target.value;
    setCriteria(criteriaSets[selectedTopic] || []);
    setTotals([0, 0, 0]);
  };

  const handleCustomTopicChange = (event) => {
    setCustomTopic(event.target.value);
  };

  const generateCriteriaFromGPT = async () => {
    if (!customTopic) {
      alert("주제를 입력하세요.");
      return;
    }

    setLoading(true);
    try {
      const generatedCriteria = await fetchCriteriaFromGPT(customTopic);
      setCriteria(generatedCriteria);
      setTotals([0, 0, 0]);
    } catch (error) {
      console.error("고려사항 생성 중 오류 발생:", error);
      alert("고려사항을 생성하는데 문제가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header>
        <h1>가중평균 의사결정 매트릭스 (Weighted Average Decision Matrix)</h1>
      </header>
      <main>
        <div className="topic-selector">
          <label htmlFor="topic">주제를 선택하세요: </label>
          <select id="topic" onChange={handleTopicChange}>
            <option value="">주제 선택</option>
            <option value="취업">취업</option>
            <option value="이직">이직</option>
            <option value="창업">창업</option>
          </select>
        </div>

        <div className="custom-topic">
          <label htmlFor="custom-topic">직접 주제를 입력하세요: </label>
          <input
            type="text"
            id="custom-topic"
            value={customTopic}
            onChange={handleCustomTopicChange}
          />
          <button onClick={generateCriteriaFromGPT} disabled={loading}>
            {loading ? "생성 중..." : "고려사항 생성"}
          </button>
        </div>

        <CriteriaTable criteria={criteria} setCriteria={setCriteria} />
        <AlternativeSummary totals={totals} alternativeNames={alternativeNames} setAlternativeNames={setAlternativeNames} />
        <ControlButtons onCalculate={calculateScores} onReset={resetScores} />
      </main>
    </div>
  );
}

export default App;
