import React, { useState } from 'react';
import Main from '../components/main/Main';
import '../assets/scss/etc/PracticePage.scss';
import { PiComputerTowerBold } from 'react-icons/pi';
import AddIcon from '@mui/icons-material/Add';

const PracticePage: React.FC = () => {
  const [machineSpawned, setMachineSpawned] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [message, setMessage] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [isInstanceStarted, setIsInstanceStarted] = useState(false);
  const [isVPNConnected, setIsVPNConnected] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [submittedFlag, setSubmittedFlag] = useState('');
  const [flagResult, setFlagResult] = useState('');
  const [isFlagCorrect, setIsFlagCorrect] = useState(false);
  const [isHintOpened, setIsHintOpened] = useState(false);


  const dummyMachine = {
    name: 'PracticeMachine-01',
    ip: '10.0.0.15',
    ovpnUrl: '/dummy/practice.ovpn',
  };

  const handleCommand = (command: string) => {
    let newOutput = [...terminalOutput];
  
    if (command.startsWith('sudo openvpn practice.ovpn')) {
      newOutput.push(`Connecting to VPN using ${dummyMachine.name}.ovpn...`);
      newOutput.push(`VPN connected successfully.`);
      setIsVPNConnected(true); // VPN 연결됨 표시
    } else if (command.startsWith('ping 10.0.0.15')) {
      newOutput.push(`Pinging ${dummyMachine.ip}...`);
      newOutput.push(`64 bytes from ${dummyMachine.ip}: icmp_seq=1 ttl=64 time=0.123 ms`);
    } else {
      newOutput.push(`Command not found: ${command}`);
    }
  
    setTerminalOutput(newOutput);
  };

  return (
    <Main>
      <div className="practice-page-wrapper">
        <div className="practice-page-container">
          
          {/* 1. 머신 생성하기 카드 */}
          {(expandedCard === null || expandedCard === 0) && (
            <div className={`card ${expandedCard === 0 ? 'expanded' : ''}`} onClick={() => expandedCard === null && setExpandedCard(0)}>
              {expandedCard === 0 && (
                <button className="close-button" onClick={(e) => { e.stopPropagation(); setExpandedCard(null); }}>
                  ✕
                </button>
              )}
              <h2>💻 머신 생성하기</h2>

              {expandedCard === 0 && (
                <>
                  {showSuccessMessage ? (
                    <div className="machine-added-message">
                      <p>머신 생성 완료가 되었으며, 관리자의 승인이 완료되면 머신이 보이게 됩니다.</p>
                      <div className="success-title">✅ Machine Added!</div>
                      <div className="success-description">Machine is registered successfully.<br />Please wait for approval from the admin.</div>
                      <button className="primary-button" onClick={() => { setShowForm(false); setShowSuccessMessage(false); }}>
                        Back to Machine
                      </button>
                    </div>
                  ) : (
                    <>
                      {!showForm ? (
                        <div className="add-machine-button" onClick={() => setShowForm(true)}>
                          <div className="add-machine-icons">
                            <PiComputerTowerBold className="machine-icon" />
                            <AddIcon className="plus-icon" />
                          </div>
                          <div className="add-machine-text">Add Machine</div>
                        </div>
                      ) : (
                        <div className="add-machine-form">
                          체험을 위해 미리 작성된 예시입니다.
                          <input type="text" value="Practice" className="input-field" readOnly />
                          <select className="input-field" disabled>
                            <option>Network</option>
                          </select>
                          <input type="text" value="ami-1234567890abcdef0" className="input-field" readOnly />
                          <input type="text" value="HTO{practice_flag}" className="input-field" readOnly />
                          <input type="text" value="This is a practice machine for network hacking." className="input-field" readOnly />
                          <input type="text" value="50" className="input-field" readOnly />
                          <button className="primary-button" onClick={() => setShowSuccessMessage(true)}>
                            Add Machine
                          </button>
                        </div>
                      )}

                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* 2. 머신 플레이 카드 */}
          {(expandedCard === null || expandedCard === 1) && (
            <div className={`card ${expandedCard === 1 ? 'expanded' : ''}`} onClick={() => expandedCard === null && setExpandedCard(1)}>
              {expandedCard === 1 && (
                <button className="close-button" onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCard(null);
                  setShowSimulator(false);
                  setIsInstanceStarted(false);
                  setIsVPNConnected(false); 
                  setTerminalInput('');
                  setTerminalOutput([]);
                  setFlagInput('');
                  setIsFlagCorrect(false);
                  setIsHintOpened(false);
                }}>
                  ✕
                </button>
              )}
              <h2>💻 머신 플레이</h2>

              {expandedCard === 1 && (
                <>
                  {!showSimulator ? (
                    <div className="start-banner">
                    <div className="thumbnail">
                      <span>P</span>
                    </div>
                  
                    <div className="machine-info">
                      <p className="machine-name"><b>Practice</b></p>
                      <p className="machine-category"><b>Category:</b> Network</p>
                      <p className="description">"이 머신을 플레이하세요."</p>
                    </div>
                  
                    <div className="machine-meta">
                      <div className="reward-box">
                        <p className="label">Reward</p>
                        <p className="reward">50 EXP</p>
                      </div>
                  
                      <button className="primary-button" onClick={() => setShowSimulator(true)}>
                        Play
                      </button>
                    </div>
                  </div>
                  
                  ) : (
                    <div className="play-area">
                      {/* 왼쪽 메뉴 */}
                      <div className="left-menu">
                        <h1 className="playing-title">Now Playing: Test</h1>
                        <div className="stage-section">
                          <div className="stage-box">
                            <h2>🔒 Connect</h2>
                            <p>Connect using OpenVPN<br />Download your VPN configuration and connect.</p>
                            <br></br>
                            <a href={dummyMachine.ovpnUrl} download className="stage-button">
                              ⬇️ Download
                            </a>

                          </div>
                          <div className="stage-box">
                            <h2>🏠 Spawn Machine</h2>
                            <p>Create machine and Start hacking.</p>
                            <button className="stage-button" onClick={() => setIsInstanceStarted(true)}>
                              {isVPNConnected ? dummyMachine.ip : '▶️ Start Instance'}
                            </button>

                          </div>
                          <div className="stage-box">
                            <h2>❓ Hints</h2>
                            <p>If you need a hint, Press the button</p>
                            
                            {!isHintOpened ? (
                              <button className="stage-button" onClick={() => setIsHintOpened(true)}>
                                🔒
                              </button>
                            ) : (
                              <div className="hint-box">
                                <p>🔓 Hint: HTO!</p>
                              </div>
                            )}
                          </div>

                          <div className="submit-flag-form">
                            <h2>🚩 Submit Flag</h2>
                            <input type="text" placeholder="Enter your flag" value={submittedFlag} onChange={(e) => setSubmittedFlag(e.target.value)} />
                            <button onClick={() => {
                              if (submittedFlag.trim() === 'HTO{practice_flag}') {
                                setFlagResult('✅ Correct! Well done.');
                              } else {
                                setFlagResult('❌ Incorrect flag. Try again.');
                              }
                            }}>
                              Submit
                            </button>
                            {flagResult && (
                              <div className={`submit-result ${flagResult.startsWith('✅') ? 'correct' : 'incorrect'}`}>
                                {flagResult}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 오른쪽 터미널 */}
                      <div className="right-terminal">
                        {isInstanceStarted ? (
                          <div className="terminal-container">
                            <div className="terminal-output">
                              {terminalOutput.length > 0 
                                ? terminalOutput.join('\n') 
                                : `Welcome to your instance!\n\nType "sudo openvpn <profile>.ovpn" to connect VPN.\nThen "ping ${dummyMachine.ip}" to test.`}
                            </div>
                            <input
                              type="text"
                              className="terminal-input"
                              value={terminalInput}
                              onChange={(e) => setTerminalInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleCommand(terminalInput);
                                  setTerminalInput('');
                                }
                              }}
                              placeholder="Enter command..."
                            />
                          </div>
                        ) : (
                          <div className="terminal-waiting">
                            Click ▶️ Start Instance to begin.
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
};

export default PracticePage;
