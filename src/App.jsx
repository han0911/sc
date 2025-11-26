import React, { useState } from 'react';
import { Activity, User, Heart, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    apiKey: '',
    height: '',
    weight: '',
    bodyFat: '',
    muscleMass: '',
    painAreas: '',
    diseases: '',
    personality: ''
  });
  
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRecommendation = async () => {
    if (!formData.apiKey) {
      setError('Gemini API 키를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const prompt = `
당신은 노인 건강 전문가입니다. 다음 정보를 바탕으로 안전하고 효과적인 맞춤형 운동 프로그램을 추천해주세요.

**노인 정보:**
- 키: ${formData.height}cm
- 몸무게: ${formData.weight}kg
- 체지방량: ${formData.bodyFat}%
- 골격근량: ${formData.muscleMass}kg
- 아픈 곳: ${formData.painAreas || '없음'}
- 질병: ${formData.diseases || '없음'}
- 성격: ${formData.personality || '일반적'}

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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${formData.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('API 요청 실패. API 키를 확인해주세요.');
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setRecommendation(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error('응답 데이터를 처리할 수 없습니다.');
      }
    } catch (err) {
      setError(err.message || '운동 추천을 생성하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">노인 맞춤형 운동 추천</h1>
          </div>

          {/* API Key Input */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gemini API 키 *
            </label>
            <input
              type="password"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Gemini API 키를 입력하세요"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 mt-2">
              API 키는 저장되지 않으며, 이번 세션에만 사용됩니다.
            </p>
          </div>

          {/* User Info Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                키 (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="예: 165"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                몸무게 (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="예: 60"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                체지방량 (%)
              </label>
              <input
                type="number"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleChange}
                placeholder="예: 25"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                골격근량 (kg)
              </label>
              <input
                type="number"
                name="muscleMass"
                value={formData.muscleMass}
                onChange={handleChange}
                placeholder="예: 20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                아픈 곳
              </label>
              <input
                type="text"
                name="painAreas"
                value={formData.painAreas}
                onChange={handleChange}
                placeholder="예: 무릎 관절, 허리 통증"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Heart className="inline w-4 h-4 mr-1" />
                질병
              </label>
              <input
                type="text"
                name="diseases"
                value={formData.diseases}
                onChange={handleChange}
                placeholder="예: 고혈압, 당뇨"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                성격/활동 성향
              </label>
              <input
                type="text"
                name="personality"
                value={formData.personality}
                onChange={handleChange}
                placeholder="예: 활동적, 조용한 편"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={generateRecommendation}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                추천 생성 중...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                맞춤 운동 추천 받기
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}
        </div>

        {recommendation && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              맞춤형 운동 추천 결과
            </h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {recommendation}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}