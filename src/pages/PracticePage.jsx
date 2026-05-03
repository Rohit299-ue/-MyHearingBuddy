import { useState } from "react";
import BottomNav from "../components/layout/BottomNav";

const PracticePage = () => {
  const [mode, setMode] = useState("learn");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [flashWrong, setFlashWrong] = useState(false);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const generateQuizQuestion = () => {
    const correctLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const options = [correctLetter];
    while (options.length < 4) {
      const r = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!options.includes(r)) options.push(r);
    }
    return { correct: correctLetter, options: options.sort(() => Math.random() - 0.5) };
  };

  const [currentQuestion, setCurrentQuestion] = useState(generateQuizQuestion());
  const [questionNumber, setQuestionNumber] = useState(1);
  const totalQuestions = 10;

  const handleNext = () => { if (currentIndex < alphabet.length - 1) setCurrentIndex(currentIndex + 1); };
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  const handleStartQuiz = () => {
    setQuizStarted(true); setScore(0); setQuestionNumber(1);
    setAnswered(false); setSelectedAnswer(null);
    setCurrentQuestion(generateQuizQuestion());
  };

  const handleAnswer = (answer) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === currentQuestion.correct) {
      setScore(s => s + 1);
      setFlashCorrect(true);
      setTimeout(() => setFlashCorrect(false), 600);
    } else {
      setFlashWrong(true);
      setTimeout(() => setFlashWrong(false), 600);
    }
  };

  const handleNextQuestion = () => {
    if (questionNumber < totalQuestions) {
      setQuestionNumber(q => q + 1); setAnswered(false);
      setSelectedAnswer(null); setCurrentQuestion(generateQuizQuestion());
    } else {
      setQuizStarted(false);
    }
  };

  const progress = ((currentIndex + 1) / alphabet.length) * 100;
  const quizProgress = (questionNumber / totalQuestions) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syne+Mono&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pp-root {
          min-height: 100vh;
          background: #060a12;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          padding-bottom: 80px;
          position: relative;
          overflow-x: hidden;
        }

        /* Grid BG */
        .pp-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none; z-index: 0;
        }

        .pp-glow-top {
          position: fixed; top: -180px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .pp-inner {
          max-width: 560px;
          margin: 0 auto;
          padding: 32px 18px 20px;
          position: relative; z-index: 5;
        }

        /* ── HEADER ── */
        .pp-header { margin-bottom: 28px; }

        .pp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.22);
          border-radius: 100px;
          padding: 4px 12px;
          font-family: 'Syne Mono', monospace;
          font-size: 10px;
          color: rgba(52,211,153,0.8);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .pp-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #34d399;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        .pp-title {
          font-family: 'Syne', sans-serif;
          font-size: 34px; font-weight: 800;
          color: #f8fafc; letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .pp-title span {
          background: linear-gradient(135deg, #34d399, #059669);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pp-subtitle {
          font-size: 13px; color: rgba(148,163,184,0.6);
          margin-top: 6px;
        }

        /* ── MODE TABS ── */
        .pp-tabs {
          display: flex; gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 6px;
          margin-bottom: 24px;
        }

        .pp-tab {
          flex: 1; padding: 11px;
          border-radius: 10px; border: none;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: all 0.22s ease;
          display: flex; align-items: center; justify-content: center; gap: 7px;
        }

        .pp-tab.inactive {
          background: transparent;
          color: rgba(148,163,184,0.5);
        }

        .pp-tab.inactive:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(148,163,184,0.8);
        }

        .pp-tab.active-learn {
          background: linear-gradient(135deg, rgba(52,211,153,0.2), rgba(5,150,105,0.12));
          border: 1px solid rgba(52,211,153,0.25);
          color: #34d399;
        }

        .pp-tab.active-quiz {
          background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.12));
          border: 1px solid rgba(139,92,246,0.25);
          color: #a78bfa;
        }

        /* ── CARD ── */
        .pp-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px;
          padding: 28px 24px;
          margin-bottom: 14px;
          transition: border-color 0.3s;
        }

        .pp-card:hover { border-color: rgba(52,211,153,0.1); }

        /* ── LEARN MODE ── */
        .pp-letter-display {
          text-align: center;
          padding: 10px 0 20px;
        }

        .pp-sign-emoji {
          font-size: 72px; line-height: 1;
          margin-bottom: 18px;
          display: block;
          animation: floatAnim 3s ease-in-out infinite;
        }

        @keyframes floatAnim {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .pp-big-letter {
          font-family: 'Syne', sans-serif;
          font-size: 110px; font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, #34d399, #6ee7b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(52,211,153,0.25));
          transition: all 0.2s ease;
        }

        .pp-letter-counter {
          font-family: 'Syne Mono', monospace;
          font-size: 12px; letter-spacing: 2px;
          color: rgba(148,163,184,0.4);
          margin-top: 10px;
        }

        /* Alphabet dots */
        .pp-alpha-dots {
          display: flex; flex-wrap: wrap; gap: 5px;
          justify-content: center;
          margin-bottom: 16px;
        }

        .pp-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.07);
          transition: all 0.2s;
        }

        .pp-dot.visited { background: rgba(52,211,153,0.35); }
        .pp-dot.current { background: #34d399; box-shadow: 0 0 8px rgba(52,211,153,0.5); }

        /* Nav buttons */
        .pp-nav-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 14px;
        }

        .pp-nav-btn {
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }

        .pp-nav-btn.prev {
          background: rgba(255,255,255,0.03);
          color: rgba(148,163,184,0.7);
        }

        .pp-nav-btn.prev:hover:not(:disabled) {
          background: rgba(255,255,255,0.06);
          color: #f1f5f9;
        }

        .pp-nav-btn.next {
          background: linear-gradient(135deg, #059669, #34d399);
          color: #060a12;
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(52,211,153,0.2);
        }

        .pp-nav-btn.next:hover:not(:disabled) {
          box-shadow: 0 8px 28px rgba(52,211,153,0.35);
          transform: translateY(-1px);
        }

        .pp-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none !important; }

        /* Progress bar */
        .pp-progress-wrap { padding: 4px 0; }

        .pp-progress-top {
          display: flex; justify-content: space-between;
          margin-bottom: 10px;
        }

        .pp-progress-label {
          font-family: 'Syne Mono', monospace;
          font-size: 11px; letter-spacing: 1px;
          color: rgba(148,163,184,0.45);
          text-transform: uppercase;
        }

        .pp-progress-pct {
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #34d399;
        }

        .pp-bar-bg {
          height: 6px; border-radius: 100px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .pp-bar-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #059669, #34d399);
          transition: width 0.35s ease;
          box-shadow: 0 0 8px rgba(52,211,153,0.3);
        }

        .pp-bar-fill.quiz-fill {
          background: linear-gradient(90deg, #7c3aed, #a78bfa);
          box-shadow: 0 0 8px rgba(139,92,246,0.3);
        }

        /* ── QUIZ MODE ── */
        .pp-quiz-start {
          text-align: center;
          padding: 16px 0;
        }

        .pp-quiz-icon {
          font-size: 64px;
          display: block; margin-bottom: 20px;
          animation: floatAnim 3s ease-in-out infinite;
        }

        .pp-quiz-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px; font-weight: 800;
          color: #f8fafc; margin-bottom: 8px;
        }

        .pp-quiz-desc {
          font-size: 13px; color: rgba(148,163,184,0.6);
          margin-bottom: 28px; line-height: 1.6;
        }

        .pp-start-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: white; border: none; cursor: pointer;
          padding: 14px 36px; border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 28px rgba(124,58,237,0.3);
          transition: all 0.2s;
        }

        .pp-start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(124,58,237,0.4);
        }

        /* Quiz header */
        .pp-quiz-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 24px;
        }

        .pp-q-num {
          font-family: 'Syne Mono', monospace;
          font-size: 11px; letter-spacing: 2px;
          color: rgba(148,163,184,0.45);
          text-transform: uppercase;
        }

        .pp-score-badge {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 100px;
          padding: 4px 12px;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 700;
          color: #34d399;
        }

        .pp-question-area {
          text-align: center; margin-bottom: 28px;
        }

        .pp-q-emoji {
          font-size: 64px; display: block;
          margin-bottom: 14px;
          animation: floatAnim 3s ease-in-out infinite;
        }

        .pp-q-text {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 700;
          color: rgba(148,163,184,0.7);
        }

        /* Answer grid */
        .pp-options {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 16px;
        }

        .pp-option {
          padding: 22px 10px;
          border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          font-family: 'Syne', sans-serif;
          font-size: 36px; font-weight: 800;
          color: #f1f5f9;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: center;
        }

        .pp-option:hover:not(:disabled) {
          border-color: rgba(139,92,246,0.3);
          background: rgba(139,92,246,0.07);
          transform: translateY(-2px);
        }

        .pp-option:disabled { cursor: not-allowed; }

        .pp-option.correct {
          background: rgba(52,211,153,0.15) !important;
          border-color: #34d399 !important;
          color: #34d399 !important;
          box-shadow: 0 0 20px rgba(52,211,153,0.2);
        }

        .pp-option.wrong {
          background: rgba(239,68,68,0.12) !important;
          border-color: rgba(239,68,68,0.4) !important;
          color: #f87171 !important;
        }

        .pp-option.dim { opacity: 0.3; }

        /* Flash feedback overlay */
        .pp-flash {
          position: fixed; inset: 0; z-index: 50;
          pointer-events: none;
          opacity: 0; transition: opacity 0.1s;
        }

        .pp-flash.show { opacity: 1; }
        .pp-flash.correct-flash { background: rgba(52,211,153,0.06); }
        .pp-flash.wrong-flash { background: rgba(239,68,68,0.06); }

        /* Next btn */
        .pp-next-btn {
          width: 100%; padding: 14px;
          border-radius: 14px; border: none;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: white; cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(124,58,237,0.25);
        }

        .pp-next-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(124,58,237,0.35); }

        /* Result card */
        .pp-result {
          text-align: center; padding: 12px 0;
        }

        .pp-result-emoji {
          font-size: 60px; display: block; margin-bottom: 16px;
          animation: floatAnim 2s ease-in-out infinite;
        }

        .pp-result-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800; color: #f8fafc;
          margin-bottom: 6px;
        }

        .pp-result-score {
          font-family: 'Syne', sans-serif;
          font-size: 54px; font-weight: 800; line-height: 1;
          background: linear-gradient(135deg, #34d399, #6ee7b7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .pp-result-msg {
          font-size: 13px; color: rgba(148,163,184,0.6);
          margin-bottom: 24px;
        }

        .pp-retry-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
          color: #34d399; cursor: pointer;
          padding: 12px 28px; border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          transition: all 0.2s;
        }

        .pp-retry-btn:hover {
          background: rgba(52,211,153,0.16);
          border-color: rgba(52,211,153,0.4);
        }
      `}</style>

      {/* Flash feedback */}
      <div className={`pp-flash correct-flash ${flashCorrect ? "show" : ""}`} />
      <div className={`pp-flash wrong-flash ${flashWrong ? "show" : ""}`} />

      <div className="pp-root">
        <div className="pp-glow-top" />

        <div className="pp-inner">

          {/* Header */}
          <div className="pp-header">
            <div className="pp-badge">
              <div className="pp-badge-dot" />
              ISL Practice
            </div>
            <h1 className="pp-title">
              {mode === "learn" ? <>Learn <span>Signing</span></> : <>Take a <span>Quiz</span></>}
            </h1>
            <p className="pp-subtitle">
              {mode === "learn" ? "Browse all 26 ASL letters" : "Test your sign language knowledge"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="pp-tabs">
            <button
              className={`pp-tab ${mode === "learn" ? "active-learn" : "inactive"}`}
              onClick={() => setMode("learn")}
            >
              📚 Learn
            </button>
            <button
              className={`pp-tab ${mode === "quiz" ? "active-quiz" : "inactive"}`}
              onClick={() => setMode("quiz")}
            >
              🎯 Quiz
            </button>
          </div>

          {/* ── LEARN MODE ── */}
          {mode === "learn" && (
            <>
              <div className="pp-card">
                <div className="pp-letter-display">
                  <span className="pp-sign-emoji">🤟</span>
                  <div className="pp-big-letter">{alphabet[currentIndex]}</div>
                  <p className="pp-letter-counter">
                    {String(currentIndex + 1).padStart(2, "0")} / {alphabet.length}
                  </p>
                </div>

                {/* Alphabet dots */}
                <div className="pp-alpha-dots">
                  {alphabet.map((_, i) => (
                    <div
                      key={i}
                      className={`pp-dot ${i < currentIndex ? "visited" : ""} ${i === currentIndex ? "current" : ""}`}
                    />
                  ))}
                </div>
              </div>

              {/* Nav */}
              <div className="pp-nav-row">
                <button className="pp-nav-btn prev" onClick={handlePrev} disabled={currentIndex === 0}>
                  ← Prev
                </button>
                <button className="pp-nav-btn next" onClick={handleNext} disabled={currentIndex === alphabet.length - 1}>
                  Next →
                </button>
              </div>

              {/* Progress */}
              <div className="pp-card pp-progress-wrap">
                <div className="pp-progress-top">
                  <span className="pp-progress-label">Progress</span>
                  <span className="pp-progress-pct">{Math.round(progress)}%</span>
                </div>
                <div className="pp-bar-bg">
                  <div className="pp-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </>
          )}

          {/* ── QUIZ MODE ── */}
          {mode === "quiz" && (
            <>
              {!quizStarted ? (
                <>
                  <div className="pp-card">
                    <div className="pp-quiz-start">
                      <span className="pp-quiz-icon">🎯</span>
                      <h2 className="pp-quiz-title">ISL Sign Quiz</h2>
                      <p className="pp-quiz-desc">
                        {totalQuestions} questions · Multiple choice<br />
                        Test your sign language recognition
                      </p>
                      <button className="pp-start-btn" onClick={handleStartQuiz}>
                        ▶ Start Quiz
                      </button>
                    </div>
                  </div>

                  {/* Last result */}
                  {score > 0 && (
                    <div className="pp-card">
                      <div className="pp-result">
                        <span className="pp-result-emoji">
                          {score >= 8 ? "🏆" : score >= 5 ? "👍" : "💪"}
                        </span>
                        <h3 className="pp-result-title">Quiz Complete!</h3>
                        <div className="pp-result-score">{score}/{totalQuestions}</div>
                        <p className="pp-result-msg">
                          {score >= 8 ? "Excellent performance!" : score >= 5 ? "Good job, keep it up!" : "Keep practicing!"}
                        </p>
                        <button className="pp-retry-btn" onClick={handleStartQuiz}>
                          ↺ Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="pp-card">
                    <div className="pp-quiz-header">
                      <span className="pp-q-num">Question {questionNumber} / {totalQuestions}</span>
                      <span className="pp-score-badge">✦ {score} pts</span>
                    </div>

                    <div className="pp-question-area">
                      <span className="pp-q-emoji">🤟</span>
                      <p className="pp-q-text">Which letter does this sign represent?</p>
                    </div>

                    <div className="pp-options">
                      {currentQuestion.options.map((option) => {
                        const isCorrect = option === currentQuestion.correct;
                        const isSelected = option === selectedAnswer;
                        let cls = "pp-option";
                        if (answered) {
                          if (isCorrect) cls += " correct";
                          else if (isSelected) cls += " wrong";
                          else cls += " dim";
                        }
                        return (
                          <button
                            key={option}
                            className={cls}
                            onClick={() => handleAnswer(option)}
                            disabled={answered}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <button className="pp-next-btn" onClick={handleNextQuestion}>
                        {questionNumber < totalQuestions ? "Next Question →" : "See Results"}
                      </button>
                    )}
                  </div>

                  {/* Quiz progress bar */}
                  <div className="pp-card pp-progress-wrap">
                    <div className="pp-progress-top">
                      <span className="pp-progress-label">Quiz Progress</span>
                      <span className="pp-progress-pct" style={{ color: "#a78bfa" }}>
                        {Math.round(quizProgress)}%
                      </span>
                    </div>
                    <div className="pp-bar-bg">
                      <div className="pp-bar-fill quiz-fill" style={{ width: `${quizProgress}%` }} />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>

    </>
  );
};

export default PracticePage;