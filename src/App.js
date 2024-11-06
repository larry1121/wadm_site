import React, { useState, useEffect } from 'react';
import './App.css';
import CriteriaTable from './components/CriteriaTable';
import AlternativeSummary from './components/AlternativeSummary';
import ControlButtons from './components/ControlButtons';
import AlternativeChart from './components/AlternativeChart';
import { fetchCriteriaFromGPT } from './services/gptService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const criteriaSets = {
  취업: [
    { id: 1, name: '집과의 거리', importance: 5, scores: [0, 0, 0] },
    { id: 2, name: '급여', importance: 8, scores: [0, 0, 0] },
    { id: 3, name: '성장 가능성', importance: 7, scores: [0, 0, 0] },
    { id: 4, name: '업무 시간', importance: 6, scores: [0, 0, 0] },
  ],
  차량_구매_임대: [
    { id: 1, name: '차량 가격', importance: 8, scores: [0, 0, 0] },
    { id: 2, name: '연비 및 유지비', importance: 7, scores: [0, 0, 0] },
    { id: 3, name: '브랜드 및 신뢰도', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '주행 거리 및 용도', importance: 5, scores: [0, 0, 0] },
  ],
  여행지_선택: [
    { id: 1, name: '예산', importance: 8, scores: [0, 0, 0] },
    { id: 2, name: '여행지 안전성', importance: 7, scores: [0, 0, 0] },
    { id: 3, name: '문화 및 관광 명소', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '이동 거리 및 교통편', importance: 5, scores: [0, 0, 0] },
  ],
  반려동물_입양: [
    { id: 1, name: '입양 비용', importance: 7, scores: [0, 0, 0] },
    { id: 2, name: '동물의 수명 및 책임', importance: 8, scores: [0, 0, 0] },
    { id: 3, name: '주거 환경 및 공간', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '건강 관리 및 훈련 비용', importance: 5, scores: [0, 0, 0] },
  ],
  대학원_진학: [
    { id: 1, name: '연구 분야 적합성', importance: 8, scores: [0, 0, 0] },
    { id: 2, name: '학교 및 프로그램 평판', importance: 7, scores: [0, 0, 0] },
    { id: 3, name: '장학금 및 재정 지원', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '졸업 후 취업 가능성', importance: 5, scores: [0, 0, 0] },
  ],
  랩실_선택: [
    { id: 1, name: '연구 주제 적합성', importance: 8, scores: [0, 0, 0] },
    { id: 2, name: '지도 교수의 평판 및 지원', importance: 7, scores: [0, 0, 0] },
    { id: 3, name: '연구 장비 및 지원 시설', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '랩 구성원 및 분위기', importance: 5, scores: [0, 0, 0] },
  ],
  전공_선택: [
    { id: 1, name: '개인 흥미와 적성', importance: 8, scores: [0, 0, 0] },
    { id: 2, name: '졸업 후 진로와 취업률', importance: 7, scores: [0, 0, 0] },
    { id: 3, name: '전공 과목의 난이도', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '장학금 및 지원 혜택', importance: 5, scores: [0, 0, 0] },
  ],
  퇴사: [
    { id: 1, name: '퇴사 후 재정 상황', importance: 8, scores: [0, 0, 0] },
    { id: 2, name: '다음 직장 또는 계획', importance: 7, scores: [0, 0, 0] },
    { id: 3, name: '현 직장의 불만 요인', importance: 6, scores: [0, 0, 0] },
    { id: 4, name: '퇴사 후 생활 안정성', importance: 5, scores: [0, 0, 0] },
  ],
  창업: [
    { id: 1, name: '창업 자금 및 투자 비용', importance: 9, scores: [0, 0, 0] },
    { id: 2, name: '사업 아이디어 및 시장성', importance: 8, scores: [0, 0, 0] },
    { id: 3, name: '경쟁 업체 및 리스크', importance: 7, scores: [0, 0, 0] },
    { id: 4, name: '운영 비용 및 수익성', importance: 6, scores: [0, 0, 0] },
  ]
};

const defaultCriteria = [
  { id: 1, name: '비용', importance: 5, scores: [0, 0, 0] },
  { id: 2, name: '시간', importance: 7, scores: [0, 0, 0] },
  { id: 3, name: '편리성', importance: 6, scores: [0, 0, 0] },
  { id: 4, name: '리스크', importance: 8, scores: [0, 0, 0] },
];

function App() {
  const [criteria, setCriteria] = useState(defaultCriteria);
  const [totals, setTotals] = useState([0, 0, 0]);
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [alternativeNames, setAlternativeNames] = useState(["대안 1", "대안 2", "대안 3"]);

  useEffect(() => {
    const savedCriteria = localStorage.getItem('criteria');
    const savedAlternatives = localStorage.getItem('alternativeNames');
    if (savedCriteria) setCriteria(JSON.parse(savedCriteria));
    if (savedAlternatives) setAlternativeNames(JSON.parse(savedAlternatives));
  }, []);

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
    setCriteria(criteriaSets[selectedTopic] || defaultCriteria);
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

   // PDF 다운로드 및 소셜 미디어 공유 관련 함수
   const handleDownloadPDF = () => {
    const content = document.getElementById('pdf-content');
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('WADM_Report.pdf');
    });
  };

  // 소셜 미디어 공유를 위한 이미지 캡처 기능
  const handleShareToSocialMedia = () => {
    const content = document.getElementById('pdf-content');
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const newWindow = window.open();
      newWindow.document.write(
        `<html><body><img src="${imgData}" style="width:100%; height:auto;"/></body></html>`
      );
      newWindow.document.title = "내 평가 결과 공유하기";
    });
  };

  return (
    <div className="App">
      <header>
        <h1>가중평균 의사결정 매트릭스 (Weighted Average Decision Matrix)</h1>
      </header>
      <main>
      <section className="site-description">
          <p>
            가중평균 의사결정 매트릭스(WADM)를 통해 다양한 대안과 기준을 비교하여 최적의 결정을 내릴 수 있는 사이트입니다.
            WADM 도구는 취업, 이직, 창업, 주거지 선택 등 다양한 인생의 중요한 결정에 있어 각 대안의 장단점을 쉽게 분석할 수 있도록 도와줍니다.
          </p>
        </section>
        <div className="topic-selector">
          <label htmlFor="topic">주제를 선택하세요: </label>
          <select id="topic" onChange={handleTopicChange}>
            <option value="">주제 선택</option>
            <option value="취업">취업</option>
            <option value="차량_구매_임대">차량 구매/임대</option>
            <option value="여행지_선택">여행지 선택</option>
            <option value="반려동물_입양">반려동물 입양</option>
            <option value="대학원_진학">대학원 진학</option>
            <option value="랩실_선택">랩실 선택</option>
            <option value="전공_선택">전공 선택</option>
            <option value="퇴사">퇴사</option>
            <option value="창업">창업</option>
          </select>
        </div>

        {/* <div className="custom-topic">
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
        </div> */}

        <div id="pdf-content">
        <CriteriaTable
          criteria={criteria}
          setCriteria={setCriteria}
          alternativeNames={alternativeNames} // 전달된 대안 이름
        />
          <AlternativeSummary totals={totals} alternativeNames={alternativeNames} setAlternativeNames={setAlternativeNames} />
        </div>

        <ControlButtons onCalculate={calculateScores} onReset={resetScores} />

        {/* 그래프 컴포넌트 추가 */}
        <AlternativeChart alternativeNames={alternativeNames} totals={totals} />
        

        {/* PDF 다운로드 버튼 */}
        <button onClick={handleDownloadPDF} style={{ marginTop: '20px' }}>
          PDF로 다운로드
        </button>
      </main>
      <footer className="faq-section">
        <h2>자주 묻는 질문</h2>

        <section>
          <h3>가중평균 의사결정 매트릭스(WADM)란 무엇인가요?</h3>
          <p>WADM은 의사결정을 돕기 위해 다양한 대안과 기준을 평가하고, 각 항목에 가중치를 부여하여 최적의 결정을 내리도록 돕는 도구입니다. 이를 통해 사용자는 객관적인 시각으로 선택지를 비교할 수 있습니다.</p>
        </section>

        <section>
          <h3>어떤 주제에 이 도구를 사용할 수 있나요?</h3>
          <p>WADM 도구는 취업, 이직, 창업, 주거지 선택 등 인생의 중요한 결정을 내릴 때 활용할 수 있으며, 그 외에도 자동차 구매, 여행지 선택 등 다양한 상황에 적용 가능합니다.</p>
        </section>

        <section>
          <h3>가중치를 설정하는 방법은 무엇인가요?</h3>
          <p>각 대안의 중요도를 비교해 상대적으로 중요한 항목에는 높은 가중치를, 덜 중요한 항목에는 낮은 가중치를 부여합니다. 이를 통해 사용자는 각 항목의 중요도에 따른 객관적인 평가를 할 수 있습니다.</p>
        </section>

        <section>
          <h3>이 사이트의 사용법은 어떻게 되나요?</h3>
          <p>사이트에 들어오면 우선 주제를 선택하고, 각 대안과 평가 기준을 설정합니다. 이후 각 대안에 점수를 입력하고, 필요 시 추가적인 고려사항을 추가하여 최종 결과를 얻을 수 있습니다. 평가 결과는 PDF로 저장하거나 그래프 형태로 시각화할 수 있습니다.</p>
        </section>
      </footer>
      <footer className="footer">
        <p>© {new Date().getFullYear()} bugdict. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;