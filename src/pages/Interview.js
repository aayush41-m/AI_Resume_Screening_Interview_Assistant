import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { startInterview, submitAnswer, getCandidates } from '../services/api';

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

  useEffect(() => {
    loadCandidateAndQuestions();
    setupSpeechRecognition();
    return () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line
  }, [id]);

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

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

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
    if (!voiceEnabled) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      window.speechSynthesis && window.speechSynthesis.cancel();
    }
    setVoiceEnabled((prev) => !prev);
  };

  const loadCandidateAndQuestions = async () => {
    setLoading(true);
    setMessages([]);
    setCurrentQuestion(0);

    const allCandidates = await getCandidates();
    const found = allCandidates.find((c) => String(c.id) === String(id));
    const currentCandidate = found || { name: 'Unknown Candidate', role: 'Software Engineer' };
    setCandidate(currentCandidate);

    const data = await startInterview(currentCandidate.name, currentCandidate.role);
    setQuestions(data.questions);
    setMessages([{ role: 'ai', text: data.questions[0] }]);
    setLoading(false);

    setTimeout(() => speakText(data.questions[0]), 300);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    setLoading(true);
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
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex gap-6">
      {/* Left Panel */}
      <div className="bg-white rounded-xl shadow p-6 w-64">
        <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
          👤
        </div>
        <h3 className="text-center font-bold text-blue-900">{candidate.name}</h3>
        <p className="text-center text-gray-500 text-sm">{candidate.role}</p>

        <div className="mt-4">
          <p className="text-gray-500 text-sm">Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: (currentQuestion / 5) * 100 + '%' }}
            />
          </div>
          <p className="text-right text-sm text-blue-600 mt-1">{currentQuestion}/5</p>
        </div>

        {/* Voice Toggle Button */}
        <div className="mt-6 border-t pt-4">
          <p className="text-gray-500 text-sm mb-2">AI Voice</p>
          <button
            onClick={toggleVoice}
            className={
              'w-full py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ' +
              (voiceEnabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-200 text-gray-500 hover:bg-gray-300')
            }
          >
            {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
          </button>
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 bg-white rounded-xl shadow flex flex-col">
        {/* Progress Bar */}
        <div className="p-4 border-b">
          <p className="text-sm text-gray-500 mb-1">Question {currentQuestion + 1} of 5</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: ((currentQuestion + 1) / 5) * 100 + '%' }}
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 h-96">
          {loading && messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">AI Interview loading...</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div
                className={
                  'px-4 py-2 rounded-xl max-w-md text-sm flex items-center gap-2 ' +
                  (msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800')
                }
              >
                <span>{msg.text}</span>
                {msg.role === 'ai' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-gray-400 hover:text-blue-600 flex-shrink-0"
                    title="Listen again"
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm text-gray-500">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2 items-center">
          <button
            onClick={toggleListening}
            disabled={loading}
            className={
              'px-4 py-2 rounded-lg font-bold disabled:opacity-50 ' +
              (isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }
            title="Click to speak your answer"
          >
            {isListening ? '🎤 Listening...' : '🎤'}
          </button>

          <input
            type="text"
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="Type your answer or use the mic..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interview;