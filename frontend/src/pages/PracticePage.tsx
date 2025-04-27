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
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [submittedFlag, setSubmittedFlag] = useState('');
  const [flagResult, setFlagResult] = useState('');

  const dummyMachine = {
    name: 'PracticeMachine-01',
    ip: '10.0.0.15',
    ovpnUrl: '/dummy/practice.ovpn',
  };

  const handleSpawnMachine = () => {
    setMachineSpawned(true);
    setMessage('가상 머신이 생성되었습니다.');
  };

  const handleShowHint = () => {
    setHintShown(true);
  };

  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagInput === 'DCO{correct_flag}') {
      setMessage('정답입니다! 🎉');
    } else {
      setMessage('틀렸습니다. 다시 시도해보세요.');
    }
  };

  function handleCommand(cmd: string) {
    if (cmd.trim() === '') return;
    let response = '';
    const command = cmd.toLowerCase().trim();

    if (command === 'help') {
      response = 'Available commands: help, ls, cat [filename], clear';
    } else if (command === 'ls') {
      response = 'flag.txt\nnotes.txt';
    } else if (command === 'cat flag.txt') {
      response = 'FLAG{practice_flag}';
    } else if (command === 'cat notes.txt') {
      response = 'Nothing useful here.';
    } else if (command === 'clear') {
      setTerminalOutput([]);
      return;
    } else {
      response = `Command not recognized: ${cmd}`;
    }

    setTerminalOutput(prev => [...prev, `$ ${cmd}`, response]);
  }

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
                      <p>머신 생성 완료가 되었으며 관리자의 승인이 완료되면 머신이 보입니다.</p>
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
                          <input type="text" placeholder="Machine Name" className="input-field" />
                          <select className="input-field">
                            <option>--Select Category--</option>
                            <option>Web</option>
                            <option>Crypto</option>
                            <option>Pwn</option>
                          </select>
                          <input type="text" placeholder="AMI ID" className="input-field" />
                          <input type="text" placeholder="Flag" className="input-field" />
                          <input type="text" placeholder="Description" className="input-field" />
                          <input type="text" placeholder="Reward" className="input-field" />
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
                  setTerminalInput('');
                  setTerminalOutput([]);
                }}>
                  ✕
                </button>
              )}
              <h2>💻 머신 플레이</h2>

              {expandedCard === 1 && (
                <>
                  {!showSimulator ? (
                    <div className="start-banner">
                      <div className="machine-info">
                        <strong>Machine name:</strong> Test<br />
                        <strong>Description:</strong> 이 머신을 플레이하세요.
                      </div>
                      <button className="primary-button" onClick={() => setShowSimulator(true)}>
                        ▶️ Play
                      </button>
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
                            <button className="stage-button">⬇️ Download</button>
                          </div>
                          <div className="stage-box">
                            <h2>🏠 Spawn Machine</h2>
                            <p>Create machine and Start hacking.</p>
                            <button className="stage-button" onClick={() => setIsInstanceStarted(true)}>
                              ▶️ Start Instance
                            </button>
                          </div>
                          <div className="stage-box">
                            <h2>❓ Hints</h2>
                            <p>If you need a hint, Press the button</p>
                            <button className="stage-button" disabled>🔒</button>
                          </div>
                          <div className="submit-flag-form">
                            <h2>🚩 Submit Flag</h2>
                            <input type="text" placeholder="Enter your flag" value={submittedFlag} onChange={(e) => setSubmittedFlag(e.target.value)} />
                            <button onClick={() => {
                              if (submittedFlag.trim() === 'FLAG{practice_flag}') {
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
                              {terminalOutput.length > 0 ? terminalOutput.join('\n') : 'Welcome to your instance!\nType a command...'}
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
                          <div className="terminal-placeholder">
                            Start the instance to begin hacking!
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
