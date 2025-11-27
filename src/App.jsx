import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    bodyFat: "",
    muscleMass: "",
    painAreas: "",
    diseases: "",
    personality: "",
    currentExercise: "",
    preferredTime: "",
  });

  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateRecommendation = async () => {
    setLoading(true);
    setError("");
    setRecommendation("");

    try {
      const prompt = `
당신은 노인 건강 전문가입니다. 다음 정보를 바탕으로 안전하고 효과적인 맞춤형 운동 프로그램을 추천해주세요.

**노인 정보:**
- 나이: ${formData.age}세
- 키: ${formData.height}cm
- 몸무게: ${formData.weight}kg
- 체지방량: ${formData.bodyFat}%
- 골격근량: ${formData.muscleMass}kg
- 아픈 곳: ${formData.painAreas || "없음"}
- 질병: ${formData.diseases || "없음"}
- 성격: ${formData.personality || "일반적"}
- 현재 운동량: ${formData.currentExercise || "정보 없음"}
- 선호 운동 시간: ${formData.preferredTime || "정보 없음"}

**다음 형식으로 추천해주세요:**

1. **전반적인 건강 평가**
   - BMI 및 체성분 분석
   - 주의사항

2. **추천 운동 프로그램**
   - 유산소 운동 (구체적인 운동, 시간, 빈도)
   - 근력 운동 (구체적인 운동, 세트, 횟수)
   - 유연성/균형 운동
   - 각 운동별 안전 수칙

3. **운동 시 주의사항**
   - 통증이나 질병 관련 주의점
   - 금지 동작

4. **생활 습관 조언**
   - 영양 관리
   - 수면 및 휴식

한국어로 친절하고 이해하기 쉽게 작성해주세요.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API 요청 실패. API 키를 확인해주세요.");
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setRecommendation(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error("응답 데이터를 처리할 수 없습니다.");
      }
    } catch (err) {
      setError(err.message || "운동 추천을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="card main-card">
          <div className="header">
            <svg
              className="icon-large"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <h1>노인 맞춤형 운동 추천</h1>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="label">나이</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="예: 70"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">키 (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="예: 165"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">몸무게 (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="예: 60"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">체지방량 (%)</label>
              <input
                type="number"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleChange}
                placeholder="예: 25"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">골격근량 (kg)</label>
              <input
                type="number"
                name="muscleMass"
                value={formData.muscleMass}
                onChange={handleChange}
                placeholder="예: 20"
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">아픈 곳</label>
            <select
              name="painAreas"
              value={formData.painAreas}
              onChange={handleChange}
              className="input"
            >
              <option value="">선택해주세요</option>
              <option value="없음">없음</option>
              <option value="무릎 관절">무릎 관절</option>
              <option value="허리">허리</option>
              <option value="어깨">어깨</option>
              <option value="손목/팔꿈치">손목/팔꿈치</option>
              <option value="발목">발목</option>
              <option value="목">목</option>
              <option value="고관절">고관절</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">질병</label>
            <input
              type="text"
              name="diseases"
              value={formData.diseases}
              onChange={handleChange}
              placeholder="예: 고혈압, 당뇨"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">성격/활동 성향</label>
            <select
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              className="input"
            >
              <option value="">선택해주세요</option>
              <option value="매우 활동적">매우 활동적</option>
              <option value="활동적">활동적</option>
              <option value="보통">보통</option>
              <option value="조용한 편">조용한 편</option>
              <option value="매우 조용함">매우 조용함</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">현재 운동량</label>
            <select
              name="currentExercise"
              value={formData.currentExercise}
              onChange={handleChange}
              className="input"
            >
              <option value="">선택해주세요</option>
              <option value="운동 안함">운동 안함</option>
              <option value="주 1회 미만">주 1회 미만</option>
              <option value="주 1-2회">주 1-2회</option>
              <option value="주 3-4회">주 3-4회</option>
              <option value="주 5회 이상">주 5회 이상</option>
              <option value="매일">매일</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">선호 운동 시간</label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="input"
            >
              <option value="">선택해주세요</option>
              <option value="새벽 (05:00-07:00)">새벽 (05:00-07:00)</option>
              <option value="오전 (07:00-12:00)">오전 (07:00-12:00)</option>
              <option value="오후 (12:00-18:00)">오후 (12:00-18:00)</option>
              <option value="저녁 (18:00-21:00)">저녁 (18:00-21:00)</option>
              <option value="상관없음">상관없음</option>
            </select>
          </div>

          <button
            onClick={generateRecommendation}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                추천 생성 중...
              </>
            ) : (
              <>
                <svg
                  className="btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                맞춤 운동 추천 받기
              </>
            )}
          </button>

          {error && (
            <div className="error-message">
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}
        </div>

        {recommendation && (
          <div className="card result-card">
            <h2 className="result-title">
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              맞춤형 운동 추천 결과
            </h2>
            <div className="recommendation">{recommendation}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
