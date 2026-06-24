import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  User as UserIcon,
  Bot,
  RefreshCw,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';
import { startInterview, submitAnswer, getCandidates } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

function Interview() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState({ name: 'Loading...', role: 'Software Engineer' });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadCandidateAndQuestions();
    setupSpeechRecognition();
    return () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser. Please try Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    if (voiceEnabled) window.speechSynthesis && window.speechSynthesis.cancel();
    setVoiceEnabled((prev) => !prev);
  };

  const loadCandidateAndQuestions = async () => {
    setLoading(true);
    setMessages([]);
    setCurrentQuestion(0);

    try {
      const allCandidates = await getCandidates();
      const found = allCandidates.find((c) => String(c.id) === String(id));
      const currentCandidate = found || { name: 'Unknown Candidate', role: 'Software Engineer' };
      setCandidate(currentCandidate);

      const data = await startInterview(currentCandidate.name, currentCandidate.role);
      setQuestions(data.questions);
      setMessages([{ role: 'ai', text: data.questions[0] }]);
      setLoading(false);

      setTimeout(() => speakText(data.questions[0]), 300);
    } catch (e) {
      setLoading(false);
      setMessages([
        { role: 'ai', text: `Sorry — I couldn't load the interview. ${e.message}` },
      ]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    setLoading(true);
    try {
      const result = await submitAnswer(questions[currentQuestion], userMessage, candidate.role);
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);

      const feedbackText = `Score: ${result.score} out of 10. ${result.feedback}`;
      const nextQuestionText =
        nextQ < questions.length ? questions[nextQ] : 'Interview Complete! Thank you.';

      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: feedbackText },
        { role: 'ai', text: nextQuestionText },
      ]);
      setLoading(false);

      setTimeout(() => speakText(feedbackText + '. ' + nextQuestionText), 300);
    } catch (e) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: `Error scoring your answer: ${e.message}` },
      ]);
    }
  };

  const progress = ((currentQuestion + 1) / 5) * 100;

  return (
    <div className="p-6 md:p-8 min-h-screen animate-fade-in" style={{ background: '#0f0a2e' }}>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-sm text-purple-300 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          {/* Left panel — candidate */}
          <Card className="h-fit">
            <div className="flex flex-col items-center text-center pb-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.20)' }}>
              <Avatar name={candidate.name} size="xl" />
              <h3 className="font-bold text-white mt-3">{candidate.name}</h3>
              <p className="text-sm text-purple-300 inline-flex items-center gap-1 mt-1">
                <Briefcase size={12} />
                {candidate.role}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Progress
                </p>
                <p className="text-xs font-bold" style={{ color: '#a78bfa' }}>
                  {Math.min(currentQuestion + 1, 5)}/5
                </p>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(139,92,246,0.20)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)',
                  }}
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(139,92,246,0.20)' }}>
              <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                AI Voice
              </p>
              <Button
                variant={voiceEnabled ? 'success' : 'ghost'}
                size="md"
                icon={voiceEnabled ? Volume2 : VolumeX}
                onClick={toggleVoice}
                className="w-full"
              >
                {voiceEnabled ? 'Voice ON' : 'Voice OFF'}
              </Button>
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                size="md"
                icon={RefreshCw}
                onClick={loadCandidateAndQuestions}
                className="w-full"
              >
                Restart Interview
              </Button>
            </div>
          </Card>

          {/* Right panel — chat */}
          <Card
            className="flex flex-col h-[calc(100vh-180px)] min-h-[500px]"
            padding="p-0"
          >
            {/* Chat header */}
            <div
              className="px-5 py-4 border-b rounded-t-2xl"
              style={{
                borderColor: 'rgba(139,92,246,0.20)',
                background: 'linear-gradient(90deg, rgba(139,92,246,0.15), transparent)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl text-white flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      boxShadow: '0 4px 15px rgba(139,92,246,0.40)',
                    }}
                  >
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">AI Interviewer</p>
                    <p className="text-xs text-purple-300">Question {Math.min(currentQuestion + 1, 5)} of 5</p>
                  </div>
                </div>
              </div>
              <div
                className="mt-3 w-full h-1 rounded-full overflow-hidden"
                style={{ background: 'rgba(139,92,246,0.20)' }}
              >
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #22c55e, #15803d)',
                  }}
                />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loading && messages.length === 0 && (
                <div className="text-center text-purple-300 mt-10">
                  <div className="inline-block w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-sm">AI Interview loading...</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} onSpeak={speakText} voiceEnabled={voiceEnabled} />
              ))}

              {loading && messages.length > 0 && (
                <div className="flex items-start gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      color: '#ffffff',
                    }}
                  >
                    <Bot size={14} />
                  </div>
                  <div
                    className="px-4 py-2.5 rounded-2xl rounded-tl-sm"
                    style={{
                      background: 'rgba(26,16,64,0.80)',
                      border: '1px solid rgba(139,92,246,0.20)',
                    }}
                  >
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-4 border-t rounded-b-2xl"
              style={{
                borderColor: 'rgba(139,92,246,0.20)',
                background: 'rgba(15,10,46,0.40)',
              }}
            >
              <div className="flex gap-2 items-center">
                <button
                  onClick={toggleListening}
                  disabled={loading}
                  title="Click to speak your answer"
                  className={[
                    'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all',
                    loading ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                  style={
                    isListening
                      ? {
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: '#ffffff',
                          boxShadow: '0 4px 15px rgba(239,68,68,0.40)',
                          animation: 'pulse 1.5s infinite',
                        }
                      : {
                          background: 'rgba(26,16,64,0.80)',
                          color: '#a78bfa',
                          border: '1px solid rgba(139,92,246,0.30)',
                        }
                  }
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <input
                  type="text"
                  className="flex-1 rounded-xl text-white px-4 py-2.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(26,16,64,0.80)',
                    border: '1px solid rgba(139,92,246,0.30)',
                  }}
                  placeholder={isListening ? 'Listening...' : 'Type your answer or use the mic...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                />

                <Button
                  variant="primary"
                  size="md"
                  icon={Send}
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0"
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onSpeak, voiceEnabled }) {
  const isUser = msg.role === 'user';
  return (
    <div className={['flex items-start gap-2', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(139,92,246,0.30)',
          }}
        >
          <Bot size={14} />
        </div>
      )}
      <div
        className={[
          'group relative max-w-md px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-2xl rounded-tr-sm text-white'
            : 'rounded-2xl rounded-tl-sm text-purple-100',
        ].join(' ')}
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                boxShadow: '0 2px 8px rgba(139,92,246,0.30)',
              }
            : {
                background: 'rgba(26,16,64,0.80)',
                border: '1px solid rgba(139,92,246,0.20)',
              }
        }
      >
        {msg.text}
        {!isUser && voiceEnabled && (
          <button
            onClick={() => onSpeak(msg.text)}
            className="ml-2 inline-flex items-center text-purple-400 hover:text-brand-300 transition-colors"
            title="Listen again"
          >
            <Volume2 size={12} />
          </button>
        )}
      </div>
      {isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(236,72,153,0.30)',
          }}
        >
          <UserIcon size={14} />
        </div>
      )}
    </div>
  );
}

export default Interview;
