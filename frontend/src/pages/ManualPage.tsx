import React, { useState } from 'react';
import Main from '../components/main/Main';
import '../assets/scss/etc/ManualPage.scss';
import { FaCheck } from "react-icons/fa";
import { TbBrandOpenvpn } from "react-icons/tb";
import { AiOutlineCloudServer } from "react-icons/ai";
import { IoIosPlay } from "react-icons/io";
import manualSteps from '../data/manualPageData';
import '../assets/scss/play/DownloadVPNProfile.scss';

const ManualPage: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [flagResult, setFlagResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpawned, setIsSpawned] = useState(false);

  const handleFakeSpawn = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setIsSpawned(true);
        setStep(2); // 다음 단계로
    }, 1500);
  };


  const handleNext = () => setStep(prev => prev + 1);
  const handleShowHint = () => {
    setHintShown(true);
    handleNext();
  };

  const handleSubmitFlag = () => {
    if (flagInput === 'HTO{correct_flag}') {
        setFlagResult('정답입니다!');
    } else {
        setFlagResult('틀렸습니다. 다시 시도해보세요.');
    }
  };

  return (
    <Main>
      <div className="manual-page-container">
        <h1 className="main-title">처음 방문하셨나요? 전체 이용 흐름을 안내합니다</h1>

        <section className="learning-outcomes">
          <h3>이 페이지를 통해 할 수 있는 것</h3>
          <ul>
            <li><FaCheck className="check-icon" /> 해킹 랩을 어떻게 이용해야 하는지 전체 흐름을 시각적으로 파악할 수 있습니다.</li>
            <li><FaCheck className="check-icon" /> 각 단계의 설명을 클릭하면 자세한 안내를 팝업 또는 확대 창으로 볼 수 있습니다.</li>
            <li><FaCheck className="check-icon" /> 메뉴얼을 따라 단계적으로 진행하며 자연스럽게 서비스를 익힐 수 있습니다.</li>
            <li><FaCheck className="check-icon" /> 튜토리얼 머신을 실행하여 실제 흐름을 체험해볼 수 있습니다.</li>
          </ul>
        </section>

        <section className="description">
          <p>
            이 페이지는 처음 웹사이트에 접속한 사용자들이 어떤 순서로 서비스를 이용하면 되는지 이해할 수 있도록 구성되어 있습니다.
            다이어그램 형태의 흐름을 통해 전체 과정을 직관적으로 확인하고, 각 단계에 대한 설명을 통해 막막함을 해소할 수 있습니다.
            튜토리얼 머신도 제공되어 직접 실습하며 흐름을 익힐 수 있으니, 편하게 따라와 보세요.
          </p>
        </section>

        <div className="flow-container">
          {manualSteps.map((step, index) => (
            <div
              key={index}
              className={`flow-box ${selectedStep === index ? 'active' : ''}`}
              onClick={() => setSelectedStep(index)}
            >
              {step.title}
            </div>
          ))}
        </div>

        {selectedStep !== null && (
          <div className="step-detail-overlay" onClick={() => setSelectedStep(null)}>
            <div className="step-detail" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedStep(null)}>X</button>
              <h1>{manualSteps[selectedStep].title}</h1>
              <p>{manualSteps[selectedStep].description}</p>
            </div>
          </div>
        )}
        <br></br>
        이제 직접 튜토리얼을 진행해 머신을 플레이하는 방법을 알아보세요
        <div className='tutorial'>
            <h2>Now Playing: 튜토리얼 머신</h2>

            {/* Connect */}
            <div className={`step-card ${step >= 0 ? 'active' : ''}`}>
                <div className="upper-text">
                    <TbBrandOpenvpn color="white" size={40} />
                    <h2><b>Connect</b></h2>
                </div>
                <h3>
                    Connect using OpenVPN
                    <br />Download your VPN configuration
                    <br />and connect from your own environment.
                </h3>
                <div className='download-btn'>
                    <label className={`download-label ${step > 0 ? 'clicked' : ''}`}>
                        <input
                        type="checkbox"
                        className="download-input"
                        onClick={handleNext}
                        disabled={step !== 0}
                        checked={step > 0}
                        readOnly
                        />
                        <span className="download-circle">
                        <svg
                            className="download-icon"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 19V5m0 14-4-4m4 4 4-4"
                            ></path>
                        </svg>
                        </span>
                        <p className="download-title">Download</p>
                        <p className="download-title">Downloaded</p>
                    </label>
                </div>
            </div>


            {/* Spawn Machine */}
            <div className={`step-card ${step >= 1 ? 'active' : ''}`}>
            <div className="upper-text">
                <AiOutlineCloudServer size={40} color="white" />
                <h2><b>Spawn Machine</b></h2>
            </div>
            <p>Create a machine and start hacking.</p>

            <div className={`start-instance-btn ${loading ? 'disabled' : ''}`}>
                <label className={`download-label ${isSpawned ? 'clicked' : ''}`}>
                <input
                    type="checkbox"
                    className="download-input"
                    onClick={handleFakeSpawn}
                    disabled={loading || step !== 1}
                    checked={isSpawned}
                    readOnly
                />
                <span className="download-circle">
                    {loading ? (
                    <span className="loading-spinner" />
                    ) : (
                    <IoIosPlay size={20} color="white" />
                    )}
                    <div className="download-square"></div>
                </span>
                <p className="download-title">{loading ? "Starting..." : "Start Instance"}</p>
                <p className="download-title">{loading ? "Please wait..." : "Instance Started"}</p>
                </label>
            </div>
            </div>


            {/* Hints */}
            <div className={`step-card ${step >= 2 ? 'active' : ''}`}>
            <h3>❓ Hints</h3>
            <p>If you need a hint, press the button.</p>
            <button onClick={handleShowHint} disabled={step !== 2 || hintShown}>View Hint</button>
            {hintShown && <p className="hint-text">💡 nmap을 먼저 사용해보세요!</p>}
            </div>

            {/* Submit Flag */}
            <div className={`step-card ${step >= 3 ? 'active' : ''}`}>
            <h3>🚩 Submit Flag</h3>
            <input
                type="text"
                placeholder="Enter flag here"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                disabled={step !== 3}
            />
            <button onClick={handleSubmitFlag} disabled={step !== 3}>Submit</button>
            {flagResult && <p>{flagResult}</p>} 
            </div>
        </div>
      </div>
    </Main>
  );
};

export default ManualPage;
