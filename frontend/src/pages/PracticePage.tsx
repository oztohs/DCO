import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Main from '../components/main/Main';
import '../assets/scss/etc/PracticePage.scss';

const PracticePage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [focusedStep, setFocusedStep] = useState<number | null>(null);
  const [flagInput, setFlagInput] = useState('');
  const [message, setMessage] = useState('');

  const dummyMachine = {
    ip: '10.0.0.15',
    ovpnUrl: '/dummy/practice.ovpn',
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleUnfocus = () => setFocusedStep(null);
  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(flagInput === 'DCO{correct_flag}' ? '정답입니다! 🎉' : '틀렸습니다. 다시 시도해보세요.');
  };

  // 🔥 Escape 키 리스너 추가
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedStep !== null) {
        handleUnfocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // cleanup
    };
  }, [focusedStep]);

  const renderStep = (i: number) => (
    <div
      key={i}
      className={`flow-step-box ${step >= i ? 'active' : ''} ${focusedStep === i ? 'fullscreen' : ''}`}
      onClick={() => !focusedStep && setFocusedStep(i)}
    >
      {focusedStep === null && (
        <h3>{['머신 생성', 'OVPN 다운로드', '접속 체험', '플래그 제출'][i - 1]}</h3>
      )}

      {focusedStep === i && (
        <div className="fullscreen-content">
          {i === 1 && (
            <>
              <h2>1단계: 머신 생성</h2>
              <p>가상 머신을 시작해보세요!</p>
              <button onClick={() => { handleNext(); handleUnfocus(); }} disabled={step !== 1}>Start</button>
            </>
          )}
          {i === 2 && (
            <>
              <h2>2단계: OVPN 다운로드</h2>
              <p>VPN 연결을 위해 설정 파일을 다운로드하세요.</p>
              <a href={dummyMachine.ovpnUrl} download>
                <button onClick={() => { handleNext(); handleUnfocus(); }} disabled={step !== 2}>Download</button>
              </a>
            </>
          )}
          {i === 3 && (
            <>
              <h2>3단계: 머신 접속 체험</h2>
              <p className="terminal">ssh user@{dummyMachine.ip}</p>
              <p className="terminal">Welcome to Ubuntu 20.04!</p>
              <button onClick={() => { handleNext(); handleUnfocus(); }} disabled={step !== 3}>Continue</button>
            </>
          )}
          {i === 4 && (
            <>
              <h2>4단계: 플래그 제출</h2>
              <form onSubmit={handleSubmitFlag} className="flag-form">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="DCO{...}"
                />
                <button type="submit">Submit</button>
              </form>
              {message && <p className="message">{message}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Main>
      <div className="flowchart-horizontal">
        {[1, 2, 3, 4].map(renderStep)}
      </div>

      {/* ✨ X 버튼은 Portal로 body에 */}
      {focusedStep && ReactDOM.createPortal(
        <button className="close-btn" onClick={handleUnfocus}>✕</button>,
        document.body
      )}
    </Main>
  );
};

export default PracticePage;
