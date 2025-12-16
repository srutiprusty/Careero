import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  startInterview,
  sendAnswer,
  getSummary,
  getNextQuestion,
  finishInterview as finishInterviewApi,
} from "../Interview/api";
import { speakText } from "../Interview/tts";

const SILENCE_TIME = 3500;
const INTERVIEW_DURATION = 2 * 60; // 2 minutes

const Interview = () => {
  const [role, setRole] = useState("React Developer");
  const [level, setLevel] = useState("Junior");

  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  const [manualText, setManualText] = useState("");
  const [manualMode, setManualMode] = useState(false);

  const [answerObj, setAnswerObj] = useState(null);
  const [summary, setSummary] = useState(null);
  /* blob */
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  /* ⏱️ TIMER */
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_DURATION);
  const timerRef = useRef(null);

  const silenceTimer = useRef(null);
  const isSubmitting = useRef(false);

  /* VIDEO */
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ continuous: true, language: "en-US" });

  /* ---------------- SUPPORT CHECK ---------------- */
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition not supported in this browser");
    }
  }, [browserSupportsSpeechRecognition]);

  /* ---------------- CAMERA ---------------- */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      console.error("Camera permission denied");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  /* ---------------- TIMER ---------------- */
  const startTimer = () => {
    setTimeLeft(INTERVIEW_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finishInterview();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  /* 🔥 Start timer ONLY when interviewId exists */
  useEffect(() => {
    if (!interviewId) return;
    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interviewId]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  /* ---------------- SILENCE → AUTO SUBMIT ---------------- */
  useEffect(() => {
    if (!listening || manualMode || !interviewId) return;

    clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      if (!isSubmitting.current && transcript.trim()) {
        autoSubmitSpeech();
      }
    }, SILENCE_TIME);
  }, [transcript, listening, manualMode, interviewId]);

  /* ---------------- MIC ---------------- */
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  /* ---------------- START INTERVIEW ---------------- */
  const handleStartInterview = async () => {
    try {
      const res = await startInterview({ role, level });
      const { interviewId, questions } = res;

      if (!interviewId || !questions?.length) {
        alert("Invalid interview response");
        return;
      }

      setInterviewId(interviewId);
      setQuestions([questions[0]]);
      setIndex(0);
      setSummary(null);

      await startCamera();
      /*  await speakText(questions[0].text);
      startListening(); */
      setIsAISpeaking(true);
      await speakText(questions[0].text);
      setIsAISpeaking(false);
      startListening();
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    }
  };

  /* ---------------- SUBMIT ANSWERS ---------------- */
  const submitAnswer = async (answerText) => {
    isSubmitting.current = true;
    SpeechRecognition.stopListening();

    const q = questions[index];
    try {
      const res = await sendAnswer({
        interviewId,
        questionIndex: index,
        questionText: q.text,
        answerText,
        role,
        level,
      });
      setAnswerObj(res);
      setIsAISpeaking(true);
      await speakText(res.shortFeedback);
      setIsAISpeaking(false);
      await nextStep();
    } catch (err) {
      console.error("submitAnswer failed", err);
      // if interview already finished on server, fetch summary
      await finishInterview();
    } finally {
      isSubmitting.current = false;
    }
  };
  const handleCancelEdit = () => {
    setManualText("");
    setManualMode(false);
    resetTranscript();
    startListening();
  };

  const autoSubmitSpeech = () => submitAnswer(transcript);
  const handleTextSubmit = () => {
    if (manualText.trim()) submitAnswer(manualText);
  };

  /* ---------------- NEXT QUESTION ---------------- */
  const nextStep = async () => {
    resetTranscript();
    setManualText("");
    setManualMode(false);
    setAnswerObj(null);
    try {
      const res = await getNextQuestion({ interviewId });
      const nextQ = res?.question;

      if (!nextQ) {
        await finishInterview();
        return;
      }

      setQuestions((prev) => [...prev, nextQ]);
      setIndex((i) => i + 1);

      setIsAISpeaking(true);
      await speakText(nextQ.text);
      setIsAISpeaking(false);
      startListening();
    } catch (err) {
      console.error("nextStep error", err);
      await finishInterview();
    }
  };

  /* ---------------- FINISH INTERVIEW ---------------- */
  const finishInterview = async () => {
    SpeechRecognition.stopListening();
    stopCamera();
    if (!interviewId) return;

    try {
      const sum = await finishInterviewApi({ interviewId });
      setSummary(sum);
      /*  await speakText(
        `Interview completed. Score ${sum.overallScore} out of 10`
      ); */
      setIsAISpeaking(true);
      await speakText(
        `Interview completed. Score ${sum.overallScore} out of 10`
      );
      setIsAISpeaking(false);
      // prevent further interactions
      if (timerRef.current) clearInterval(timerRef.current);
      setInterviewId(null);
    } catch (err) {
      console.error("Summary error", err);
    }
  };

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const q = questions[index];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <style>{`
@keyframes ai-blob-animate {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  20% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  40% {
    border-radius: 50% 50% 20% 80% / 25% 70% 30% 75%;
  }
  60% {
    border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
  }
  80% {
    border-radius: 40% 60% 60% 40% / 60% 50% 50% 60%;
  }
}

.ai-blob-speaking {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, 
  rgba(255, 255, 255, 0.3) 0%,    /* white with 30% opacity */
  rgba(255, 255, 255, 0.15) 100%  /* white with 15% opacity */
);
box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.4);  /* white border at 40% opacity */
  animation: ai-blob-animate 8s ease-in-out infinite;
  filter: blur(1px);
  z-index: 0;
}

@media (max-width: 640px) {
  .ai-blob-speaking {
    width: 150px;
    height: 150px;
  }
}

.ai-content-wrapper {
  position: relative;
  z-index: 10;
}
`}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            AI Interview
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Practice your interview skills with our AI-powered assistant
          </p>
        </div>

        {/* Setup Screen */}
        {!interviewId && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-6 sm:px-8 py-5 sm:py-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Configure Interview
                </h2>
                <p className="text-purple-100 text-sm sm:text-base mt-1 sm:mt-2">
                  Set your role and experience level
                </p>
              </div>

              {/* Form Section */}
              <div className="p-6 sm:p-8 space-y-5 sm:space-y-6">
                {/* Role Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., React Developer"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-gray-700 text-sm sm:text-base"
                  />
                </div>

                {/* Level Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    Experience Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-gray-700 text-sm sm:text-base bg-white"
                  >
                    <option>Junior</option>
                    <option>Intermediate</option>
                    <option>Senior</option>
                  </select>
                </div>

                {/* Info Banner */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-purple-900">
                        📹 Camera & Microphone Required
                      </p>
                      <p className="text-xs sm:text-sm text-purple-700">
                        Duration: 2 minutes • Camera for self-view only • No
                        recording
                      </p>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartInterview}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Start Interview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timer Display */}
        {interviewId && (
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-md ${
                timeLeft < 30
                  ? "bg-red-100 text-red-700 border-2 border-red-300"
                  : "bg-white text-gray-700 border-2 border-purple-200"
              }`}
            >
              <svg
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  timeLeft < 30 ? "text-red-600" : "text-purple-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-base sm:text-lg">
                ⏳ Time Left: {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Interview Active Screen */}
        {interviewId && q && !summary && (
          <div className="space-y-4 sm:space-y-6">
            {/* Main Interview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* AI Question Panel */}
              {/* <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 text-white order-1"> */}
              {/* AI Question Panel */}
              <div className="relative bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 text-white order-1 overflow-hidden z-0">
                {/* AI Speaking Blob */}
                {isAISpeaking && <div className="ai-blob-speaking z-80" />}

                <div className="ai-content-wrapper">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">
                        AI Interviewer
                      </h3>
                      <p className="text-purple-200 text-xs sm:text-sm">
                        Question {index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="bg-white backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 mb-4 sm:mb-5 z-50">
                    <p className="text-base sm:text-lg leading-relaxed">
                      {q.text}
                    </p>
                  </div>

                  {/* AI Feedback */}
                  {answerObj && (
                    <div className="bg-green-500/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 border border-green-400/30">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-semibold text-green-300 text-sm sm:text-base">
                          AI Feedback
                        </span>
                      </div>

                      {/* Score */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-green-200 text-xs sm:text-sm font-medium">
                            Score:
                          </span>
                          <span className="text-white font-bold text-lg sm:text-xl">
                            {answerObj.score}/{answerObj.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-green-800/30 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-green-400 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                (answerObj.score / answerObj.maxScore) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Short Feedback */}
                      <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                        {answerObj.shortFeedback}
                      </p>

                      {/* Strengths */}
                      {answerObj.strengths &&
                        answerObj.strengths.length > 0 && (
                          <div className="mb-3 sm:mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                className="w-4 h-4 text-green-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-green-200 text-xs sm:text-sm font-medium">
                                Strengths:
                              </span>
                            </div>
                            <ul className="list-disc list-inside text-white/80 text-xs sm:text-sm space-y-1 ml-2">
                              {answerObj.strengths.map((strength, idx) => (
                                <li key={idx}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Improvements */}
                      {answerObj.improvements &&
                        answerObj.improvements.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                className="w-4 h-4 text-yellow-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              <span className="text-yellow-200 text-xs sm:text-sm font-medium">
                                Areas for Improvement:
                              </span>
                            </div>
                            <ul className="list-disc list-inside text-white/80 text-xs sm:text-sm space-y-1 ml-2">
                              {answerObj.improvements.map(
                                (improvement, idx) => (
                                  <li key={idx}>{improvement}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* User Video & Response Panel */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-purple-100 shadow-lg p-4 sm:p-5 lg:p-6 order-2">
                {/* Video */}
                <div className="relative mb-4 sm:mb-5">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full aspect-video bg-gray-900 rounded-lg sm:rounded-xl object-cover"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg backdrop-blur-md bg-purple-600/90 flex items-center gap-2">
                    {listening ? (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-white">
                          Listening
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-xs font-medium text-white">
                          Paused
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Transcript */}
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                      Your Response
                    </span>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 min-h-[100px] sm:min-h-[120px]">
                    <p
                      className={`text-sm sm:text-base text-gray-700 ${
                        !transcript && "text-gray-400 italic"
                      }`}
                    >
                      {transcript || "Speak to answer the question..."}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Camera for self-view only. No recording.
                  </p>
                </div>
              </div>
            </div>

            {/* Text Input Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-purple-100 shadow-lg p-4 sm:p-5 lg:p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Type Your Answer (Optional)
              </label>
              <textarea
                rows={4}
                value={manualText}
                onChange={(e) => {
                  setManualText(e.target.value);
                  setManualMode(true);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 resize-none text-sm sm:text-base"
                placeholder="Prefer typing? Enter your answer here (disables voice)..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Typing will pause voice recognition. Submit manually when ready.
              </p>

              {/* Submit Button */}
              {manualMode && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleTextSubmit}
                    disabled={!manualText.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Submit Typed Answer
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary Screen */}
        {summary && (
          <div className="max-w-3xl mx-auto mt-5">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 sm:px-8 py-8 sm:py-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Interview Complete!
                </h2>
                <p className="text-purple-100 text-sm sm:text-base">
                  Great job completing the interview
                </p>
              </div>

              {/* Results Content */}
              <div className="p-6 sm:p-8 space-y-5 sm:space-y-6">
                {/* Score Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                  <p className="text-xs sm:text-sm font-semibold text-purple-700 uppercase tracking-wider mb-2">
                    Your Score
                  </p>
                  <div className="text-5xl sm:text-6xl font-bold text-purple-600 mb-3 sm:mb-4">
                    {summary.overallScore}
                    <span className="text-2xl sm:text-3xl text-purple-400">
                      /10
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(summary.overallScore / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Feedback Card */}
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mt-1 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <div className="w-full">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-3">
                        Feedback Summary
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                        {summary.overallComment}
                      </p>

                      {/* Strengths */}
                      {summary.strengths && summary.strengths.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-green-700 text-sm sm:text-base font-medium">
                              Strengths:
                            </span>
                          </div>
                          <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1 ml-6">
                            {summary.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Weaknesses */}
                      {summary.weaknesses && summary.weaknesses.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-orange-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            <span className="text-orange-700 text-sm sm:text-base font-medium">
                              Areas for Improvement:
                            </span>
                          </div>
                          <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1 ml-6">
                            {summary.weaknesses.map((weakness, idx) => (
                              <li key={idx}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvement Plan */}
                      {summary.improvementPlan &&
                        summary.improvementPlan.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                className="w-4 h-4 text-purple-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                              <span className="text-purple-700 text-sm sm:text-base font-medium">
                                Improvement Plan:
                              </span>
                            </div>
                            <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1 ml-6">
                              {summary.improvementPlan.map((plan, idx) => (
                                <li key={idx}>{plan}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => {
                      setInterviewId(null);
                      setSummary(null);
                      setIndex(0);
                      setQuestions([]);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Start New Interview
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-white hover:bg-gray-50 text-purple-700 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-purple-200 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;

/* ---------------- UI ---------------- */
/*  return (

    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Interview</h1>

      {!interviewId && (
        <div className="flex gap-3">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Junior</option>
            <option>Intermediate</option>
            <option>Senior</option>
          </select>
          <button
            onClick={handleStartInterview}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Start Interview
          </button>
        </div>
      )}

      {interviewId && (
        <div className="text-red-600 font-semibold">
          ⏳ Time Left: {formatTime(timeLeft)}
        </div>
      )}

      {interviewId && q && !summary && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-5 rounded">
              <p>{q.text}</p>
              {answerObj && (
                <p className="mt-3 text-green-400">{answerObj.shortFeedback}</p>
              )}
            </div>

            <div className="border p-5 rounded">
              <video ref={videoRef} autoPlay muted className="w-full rounded" />
              <div className="mt-3 p-3 bg-gray-50 rounded min-h-[120px]">
                {transcript || "Speak to answer…"}
              </div>
            </div>
          </div>

          <textarea
            rows={4}
            value={manualText}
            onChange={(e) => {
              setManualText(e.target.value);
              setManualMode(true);
            }}
            className="w-full border p-3 rounded"
            placeholder="Type answer (disables voice)"
          />

          {manualMode && (
            <button
              onClick={handleTextSubmit}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Submit Typed Answer
            </button>
          )}
        </>
      )}

      {summary && (
        <div className="bg-green-50 p-5 rounded">
          <h2 className="text-xl font-bold">Summary</h2>
          <p>Score: {summary.overallScore}/10</p>
          <p>{summary.overallComment}</p>
        </div>
      )}
    </div>
  );
};

export default Interview;
 */

/*  */
