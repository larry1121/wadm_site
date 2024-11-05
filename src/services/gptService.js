// src/services/gptService.js
export async function fetchCriteriaFromGPT(topic) {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // .env 파일에 API 키를 저장하고 불러옵니다.
    
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `주제 "${topic}"에 대한 고려사항 항목을 4가지 제시해줘.`,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
    return data.choices[0].text.trim().split('\n').map((text, index) => ({
      id: index + 1,
      name: text,
      importance: 5, // 기본 중요도 설정, 필요 시 사용자 수정 가능
      scores: [0, 0, 0],
    }));
  }
  