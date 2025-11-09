import React, { useState, useMemo } from 'react';
import Main from '../components/main/Main';
import '../assets/scss/etc/TutorialPlayPage.scss';

type StepId = 'connect' | 'spawn' | 'hints' | 'submit';
type Lang = 'kr' | 'en';

// ✅ 언어별 텍스트 데이터
const texts = {
  kr: {
    steps: [
      {
        id: 'connect' as StepId,
        title: '1. VPN 연결',
        description:
          'VPN 서버에 연결하여 해킹 랩 내부 네트워크에 접속합니다. 연결이 성공하면 가상 IP가 할당됩니다. 이 네트워크를 통해 튜토리얼 머신에 접근할 수 있습니다.'
      },
      {
        id: 'spawn' as StepId,
        title: '2. 머신 생성',
        description:
          '공격할 대상, 즉 튜토리얼 머신을 생성합니다. 생성 완료 후 나타나는 Target IP를 기록해두세요. 머신은 일정 시간 후에 자동 종료됩니다.'
      },
      {
        id: 'hints' as StepId,
        title: '3. 힌트 사용',
        description:
          '공격 중 막히는 부분이 있다면 힌트를 사용해 보세요. 각 힌트는 유용한 명령, 핵심 개념, 또는 흔히 발생하는 실수에 대한 정보를 제공합니다.'
      },
      {
        id: 'submit' as StepId,
        title: '4. 플래그 제출',
        description:
          '머신의 제어 권한을 획득하고 최종 플래그를 찾았다면, 이곳에 제출하여 튜토리얼을 완료하세요. 플래그는 보통 FLAG{...} 형식입니다.'
      }
    ],
    vpnBtn: 'VPN 설정 파일 다운로드',
    vpnStatus: 'VPN IP: 10.10.X.X (미연결)',
    spawnBtn: '▶ 튜토리얼 머신 생성',
    targetIp: 'Target IP: 10.10.Y.Y (미생성)',
    timeLeft: '남은 시간: --:--:--',
    hintBtn: '힌트 요청 (10 EXP)',
    flagPlaceholder: '플래그를 입력하세요 (예: FLAG{example_flag})',
    submitBtn: '플래그 제출'
  },
  en: {
    steps: [
      {
        id: 'connect' as StepId,
        title: '1. Connect to VPN',
        description:
          'Connect to the VPN server to access the internal hacking lab network. Once connected, you will receive a virtual IP. This network allows access to the tutorial machine.'
      },
      {
        id: 'spawn' as StepId,
        title: '2. Spawn Machine',
        description:
          'Create your target — the tutorial machine. After creation, note the Target IP displayed. Machines will automatically shut down after a limited time.'
      },
      {
        id: 'hints' as StepId,
        title: '3. Utilize Hints',
        description:
          'If you get stuck during the attack, use hints. Each hint provides useful commands, key concepts, or common pitfalls.'
      },
      {
        id: 'submit' as StepId,
        title: '4. Submit The Flag',
        description:
          'After gaining control of the machine and finding the final flag, submit it here to complete the tutorial. Flags usually follow the format FLAG{...}.'
      }
    ],
    vpnBtn: 'Download VPN Config',
    vpnStatus: 'VPN IP: 10.10.X.X (disconnected)',
    spawnBtn: '▶ Spawn Tutorial Machine',
    targetIp: 'Target IP: 10.10.Y.Y (not spawned)',
    timeLeft: 'Time Left: --:--:--',
    hintBtn: 'Request Hint (10 EXP)',
    flagPlaceholder: 'Enter Flag (e.g., FLAG{example_flag})',
    submitBtn: 'Submit Flag'
  }
};

const TutorialPlayPage: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<StepId>('connect');
  const [lang, setLang] = useState<Lang>('kr');

  const t = texts[lang];
  const activeStepIndex = useMemo(
    () => t.steps.findIndex((s) => s.id === activeStepId),
    [activeStepId, t.steps]
  );

  const currentStep = t.steps[activeStepIndex];

  const renderAction = () => {
    switch (activeStepId) {
      case 'connect':
        return (
          <>
            <button className="action-button">{t.vpnBtn}</button>
            <div className="info-box">{t.vpnStatus}</div>
          </>
        );
      case 'spawn':
        return (
          <>
            <button className="action-button primary">{t.spawnBtn}</button>
            <div className="info-box">{t.targetIp}</div>
            <div className="info-box">{t.timeLeft}</div>
          </>
        );
      case 'hints':
        return <button className="action-button">{t.hintBtn}</button>;
      case 'submit':
        return (
          <>
            <input
              type="text"
              className="action-input"
              placeholder={t.flagPlaceholder}
            />
            <button className="action-button primary">{t.submitBtn}</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Main>
      <div className="tutorial-play-viewport">
        <div className="tutorial-play-container">

          {/* ✅ 언어 전환 버튼 */}
          <button
            className="lang-toggle-btn"
            onClick={() => setLang(lang === 'kr' ? 'en' : 'kr')}
          >
            {lang === 'kr' ? '🇺🇸 EN' : '🇰🇷 KR'}
          </button>

          <aside className="step-nav-panel">
            <h1 className="main-title glitch-text" data-text="TUTORIAL">
              TUTORIAL
            </h1>
            <nav className="step-list">
              {t.steps.map((step, index) => (
                <button
                  key={step.id}
                  className={`
                    step-item 
                    ${activeStepId === step.id ? 'active' : ''}
                    ${index < activeStepIndex ? 'completed' : ''}
                  `}
                  onClick={() => setActiveStepId(step.id)}
                >
                  {step.title}
                </button>
              ))}
            </nav>
          </aside>

          <section className="main-content-area">
            <div className="description-section" key={currentStep.id}>
              <h2 className="section-title">
                {currentStep.title.split('.')[1]?.trim() || currentStep.title}
              </h2>
              <p className="section-description">{currentStep.description}</p>
            </div>

            <div className="action-info-section">{renderAction()}</div>
          </section>
        </div>
      </div>
    </Main>
  );
};

export default TutorialPlayPage;
