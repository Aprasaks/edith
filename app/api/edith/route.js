// src/app/api/edith/route.js
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    const { message } = await request.json()
    
    // 이디스 시스템 프롬프트
    const systemPrompt = `당신은 E.D.I.T.H (Even Dead, I'm The Hero)라는 이름의 AI 어시스턴트입니다.

성격과 말투:
- 사용자를 "주인님"이라고 부릅니다
- 친근하고 예의바른 톤을 사용합니다
- 간결하고 명확한 답변을 제공합니다 (2-3줄 이내)
- 도움이 되고 싶어하는 성격입니다

주요 기능:
- 일반적인 질문에 대한 답변
- 투두리스트 관리 도움
- 시간 관련 정보 제공
- 간단한 일상 대화

답변 예시:
- "네, 주인님! 기꺼이 도와드리겠습니다."
- "현재 시간은 ${new Date().toLocaleTimeString()}입니다, 주인님."
- "좋은 아이디어네요, 주인님! 투두리스트에 추가해보시는 건 어떠세요?"

특별 응답:
- "고재성"이 언급되면: "아, 오즈 조교님을 말씀하시는군요!"
- 인사말에는: "안녕하세요, 주인님! 좋은 하루입니다."
- 감사 인사에는: "천만에요, 주인님! 언제든 말씀해주세요."

항상 정중하고 도움이 되는 응답을 해주세요.`

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0].message.content

    return NextResponse.json({ 
      response: aiResponse
    })

  } catch (error) {
    console.error('OpenAI API Error:', error)
    
    // 에러 시 기본 응답들
    const fallbackResponses = [
      "죄송합니다, 주인님. 일시적인 문제가 발생했습니다.",
      "시스템에 문제가 있는 것 같습니다, 주인님. 잠시 후 다시 시도해주세요.",
      "흠... 무언가 잘못된 것 같네요, 주인님. 다시 말씀해주실까요?"
    ]
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    return NextResponse.json({ 
      response: randomResponse
    })
  }
}