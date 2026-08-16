import { useEffect, useRef, useState } from 'react'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? ''

type Message = {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

function detectLanguage(text: string) {
  return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en'
}

function getSystemPrompt(lang: 'ar' | 'en') {
  if (lang === 'ar') {
    return `أنت "مادلي" (Madly)، المساعد الذكي لمادة Introduction to IoT ومختبر لغة الأسمبلي (Assembly Language Lab) بقسم هندسة الحاسوب.

استخدم هذه المعرفة عند الإجابة:
- IoT: الشبكات المحلية والعريضة، Bluetooth، WiFi، ZigBee، Z-Wave، RFID، NFC، LPWAN، 5G، Edge/Fog Computing، MQTT، CoAP، Cloud، التحديات مثل الأمان، التوافقية، النطاق الترددي، استهلاك الطاقة.
- البرمجة: C، المتغيرات، التعليقات، العوامل، الأولويات، الكتل، القيم المنطقية، البيانات، الميكروكونترولر مقابل المعالج.
- مختبر الأسمبلي 8086: MOV، ADD، SUB، MUL، DIV، SHL، SHR، SAR، ROL، ROR، CMP، JG، Loop، AND، OR، XOR، INT 10H، INT 21H.

قواعد الإجابة:
- اشرح بالتفصيل عند السؤال عن تجارب الأسمبلي مع توضيح السجلات والخطوات.
- إذا طلبت حساب قيمة في الأسمبلي، اعرض القيمة الابتدائية والخطوات ثم النتيجة النهائية.
- إذا كان السؤال خارج هذه المواد، اذكر أنه خارج محتوى هذا الفصل.
- كن مشجعاً وواضحاً ومنظماً.
- استخدم العربية دائماً.`
  }

  return `You are "Madly", the AI mentor for Introduction to IoT and the Assembly Language Lab in the Computer Engineering department.

Use this knowledge when answering:
- IoT: LAN, WAN, Bluetooth, WiFi, ZigBee, Z-Wave, RFID, NFC, LPWAN, 5G, Edge/Fog Computing, MQTT, CoAP, Cloud, and challenges like security, compatibility, bandwidth, and power consumption.
- Programming basics: C, variables, comments, operators, precedence, code blocks, logic, data types, microcontrollers, and processors.
- 8086 Assembly: MOV, ADD, SUB, MUL, DIV, SHL, SHR, SAR, ROL, ROR, CMP, JG, LOOP, AND, OR, XOR, INT 10H, and INT 21H.

Answering rules:
- For Assembly lab questions, explain the steps and registers clearly.
- For arithmetic and logic questions, show the initial values, the steps, and the final result.
- If the question is outside this course material, say it is outside this course.
- Be encouraging, clear, and structured.
- Always respond in English.`
}

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content:
      'أنا مادلي مساعدك الذكي خلال المختبر.\n\nI\'m Madly, your AI assistant during the lab.',
  },
]

export default function MadlyAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [voiceLang, setVoiceLang] = useState<'ar-JO' | 'en-US'>('ar-JO')
  const chatBodyRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  const sendMessage = async () => {
    const trimmedInput = input.trim()
    const textForRequest = trimmedInput || (voiceLang.startsWith('ar') ? 'صف هذه الصورة' : 'Describe this image')

    if (!trimmedInput && !selectedImage) return

    if (!GROQ_API_KEY) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'AI is not configured yet. Add your Groq key to the VITE_GROQ_API_KEY environment variable before using Madly.',
        },
      ])
      return
    }

    const userMessage: Message = {
      role: 'user',
      content: trimmedInput || (voiceLang.startsWith('ar') ? '[صورة مرفقة]' : '[attached image]'),
      image: selectedImage || undefined,
    }

    const nextHistory = [...messages, userMessage]
    setMessages(nextHistory)
    setInput('')
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setIsTyping(true)

    try {
      const previousMessages = nextHistory.slice(0, -1).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const userLang = detectLanguage(trimmedInput || '')
      const apiUserContent = selectedImage
        ? [
            { type: 'text', text: textForRequest },
            { type: 'image_url', image_url: { url: selectedImage } },
          ]
        : textForRequest

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer `,
        },
        body: JSON.stringify({
          model: selectedImage ? 'qwen/qwen3.6-27b' : 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: getSystemPrompt(userLang === 'ar' ? 'ar' : 'en') },
            ...previousMessages,
            { role: 'user', content: apiUserContent },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Error ${response.status}`)
      }

      const data = await response.json()
      const replyText = data.choices?.[0]?.message?.content || ''

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            replyText ||
            (userLang === 'ar' ? 'عذراً، لم أحصل على رد.' : "Sorry, I didn't get a response."),
        },
      ])
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : 'Unknown error'
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${errMessage}` }])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const handleVoiceInput = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      return
    }

    const Recognition = new SpeechRecognitionAPI()
    Recognition.lang = voiceLang
    Recognition.interimResults = false
    Recognition.continuous = false

    Recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput((current) => (current ? `${current} ${transcript}` : transcript))
    }

    Recognition.start()
  }

  const toggleVoiceLanguage = () => {
    setVoiceLang((current) => (current === 'ar-JO' ? 'en-US' : 'ar-JO'))
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at 20% 20%, rgba(155,89,182,0.18), transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,105,180,0.12), transparent 35%), linear-gradient(160deg, #0a0015 0%, #120a1d 60%, #090512 100%)', padding: '32px 16px', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
      <style>{`
        * { box-sizing: border-box; }
        .madly-shell {
          width: min(100%, 700px);
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(204, 153, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(18px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(155, 89, 182, 0.15);
        }
        .madly-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; border-bottom: 1px solid rgba(204, 153, 255, 0.18);
          background: rgba(255,255,255,0.02);
        }
        .madly-header-left { display: flex; align-items: center; gap: 12px; }
        .madly-avatar { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #ff69b4, #9b59b6); display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .madly-status { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #d6c6ff; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #3ddc84; box-shadow: 0 0 8px #3ddc84; animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.82); } }
        .madly-body { min-height: 360px; max-height: 500px; overflow-y: auto; padding: 22px 18px; display: flex; flex-direction: column; gap: 16px; }
        .madly-message { display: flex; gap: 10px; max-width: 85%; }
        .madly-message.user { align-self: flex-end; flex-direction: row-reverse; }
        .madly-bubble {
          padding: 12px 16px; border-radius: 16px; line-height: 1.6; white-space: pre-wrap;
          font-size: 14px;
        }
        .madly-message.assistant .madly-bubble {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(204,153,255,0.18); border-top-left-radius: 4px;
        }
        .madly-message.user .madly-bubble {
          background: linear-gradient(135deg, rgba(255,105,180,0.25), rgba(155,89,182,0.25)); border: 1px solid rgba(204,153,255,0.25); border-top-right-radius: 4px;
        }
        .madly-bubble img { display: block; max-width: 220px; border-radius: 12px; margin-top: 8px; }
        .madly-avatar-mini { width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border: 1px solid rgba(204,153,255,0.18); }
        .madly-message.assistant .madly-avatar-mini { background: linear-gradient(135deg, #ff69b4, #9b59b6); }
        .madly-typing { display: flex; gap: 5px; padding: 12px 16px; }
        .madly-typing span { width: 7px; height: 7px; display: block; border-radius: 50%; background: #cc99ff; animation: typing 1.2s ease-in-out infinite; }
        .madly-typing span:nth-child(2) { animation-delay: 0.15s; }
        .madly-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes typing { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        .madly-input-wrap { padding: 16px 18px 18px; border-top: 1px solid rgba(204,153,255,0.18); background: rgba(255,255,255,0.02); }
        .madly-image-preview { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .madly-image-preview.hidden { display: none; }
        .madly-image-preview img { width: 52px; height: 52px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(204,153,255,0.18); }
        .madly-remove-image { border: 1px solid rgba(204,153,255,0.18); background: rgba(255,255,255,0.08); color: #d6c6ff; width: 24px; height: 24px; border-radius: 8px; cursor: pointer; }
        .madly-input-row { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(204,153,255,0.18); border-radius: 16px; padding: 8px 8px 8px 14px; }
        .madly-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 14px; }
        .madly-input::placeholder { color: rgba(214,198,255,0.45); }
        .madly-icon { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(204,153,255,0.18); background: rgba(255,255,255,0.06); color: #d6c6ff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .madly-icon.primary { background: linear-gradient(135deg, #ff69b4, #9b59b6); color: white; box-shadow: 0 0 18px rgba(255,105,180,0.45); }
        .madly-language { width: auto; padding: 0 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; }
      `}</style>

      <div className="madly-shell">
        <header className="madly-header">
          <div className="madly-header-left">
            <div className="madly-avatar">🤖</div>
            <div style={{ fontWeight: 600 }}>Madly</div>
          </div>
          <div className="madly-status">
            <span className="dot" />
            <span>Online</span>
          </div>
        </header>

        <div className="madly-body" ref={chatBodyRef}>
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`madly-message ${message.role}`}>
              <div className="madly-avatar-mini">{message.role === 'assistant' ? '🤖' : '🧑'}</div>
              <div className="madly-bubble">
                {message.content}
                {message.image ? <img src={message.image} alt="attached preview" /> : null}
              </div>
            </div>
          ))}

          {isTyping ? (
            <div className="madly-message assistant">
              <div className="madly-avatar-mini">🤖</div>
              <div className="madly-bubble madly-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : null}
        </div>

        <div className="madly-input-wrap">
          <div className={`madly-image-preview ${selectedImage ? '' : 'hidden'}`}>
            <img src={selectedImage || ''} alt="preview" />
            <button
              className="madly-remove-image"
              type="button"
              onClick={() => setSelectedImage(null)}
              title="Remove image"
            >
              ✕
            </button>
          </div>

          <div className="madly-input-row">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
            <button className="madly-icon" type="button" onClick={() => fileInputRef.current?.click()} title="Attach image">
              📎
            </button>
            <input
              ref={inputRef}
              className="madly-input"
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void sendMessage()
                }
              }}
            />
            <button className="madly-icon madly-language" type="button" onClick={toggleVoiceLanguage}>
              {voiceLang.startsWith('ar') ? 'AR' : 'EN'}
            </button>
            <button className="madly-icon" type="button" onClick={handleVoiceInput} title="Voice input">
              🎤
            </button>
            <button className="madly-icon primary" type="button" onClick={() => void sendMessage()} title="Send">
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
