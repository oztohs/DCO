import React, { useState } from 'react';
import Main from '../components/main/Main';
import '../assets/scss/etc/PracticePage.scss';

const PracticePage: React.FC = () => {
  const [machineSpawned, setMachineSpawned] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [message, setMessage] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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

  return (
    <Main>
      <div className="practice-page-container">
        

        {/* 1. Connect */}
        <div
          className={`card ${expandedCard === 0 ? 'expanded' : ''}`}
          onClick={() => expandedCard === null && setExpandedCard(0)}
        >
          {expandedCard === 0 && (
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard(null);
              }}
            >
              ✕
            </button>
          )}
          <h2>🔗 Connect</h2>
          <p>
            Connect using OpenVPN<br />
            Download your VPN configuration and connect from your own environment.
          </p>
          <a href={dummyMachine.ovpnUrl} download>
            <button>Download</button>
          </a>
        </div>

        {/* 2. Spawn Machine */}
        <div
          className={`card ${expandedCard === 1 ? 'expanded' : ''}`}
          onClick={() => expandedCard === null && setExpandedCard(1)}
        >
          {expandedCard === 1 && (
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard(null);
              }}
            >
              ✕
            </button>
          )}
          <h2>💻 Spawn Machine</h2>
          <p>Create machine and start hacking.</p>
          <button onClick={handleSpawnMachine} disabled={machineSpawned}>
            {machineSpawned ? 'Machine Running...' : 'Start Instance'}
          </button>
          {machineSpawned && (
            <div className="fake-terminal">
              <p>user@dco:~$ ssh user@{dummyMachine.ip}</p>
              <p>user@{dummyMachine.ip}'s password:</p>
              <p>Welcome to Ubuntu 20.04!</p>
              <p>user@machine:~$</p>
            </div>
          )}
        </div>

        {/* 3. Hints */}
        <div
          className={`card ${expandedCard === 2 ? 'expanded' : ''}`}
          onClick={() => expandedCard === null && setExpandedCard(2)}
        >
          {expandedCard === 2 && (
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard(null);
              }}
            >
              ✕
            </button>
          )}
          <h2>❓ Hints</h2>
          <p>If you need a hint, press the button</p>
          <button onClick={handleShowHint} disabled={!machineSpawned || hintShown}>
            {hintShown ? 'Hint Revealed' : 'Show Hint'}
          </button>
          {hintShown && (
            <p className="hint-text">
              💡 Try checking open ports with <code>nmap</code>.
            </p>
          )}
        </div>

        {/* 4. Submit Flag */}
        <div
          className={`card ${expandedCard === 3 ? 'expanded' : ''}`}
          onClick={() => expandedCard === null && setExpandedCard(3)}
        >
          {expandedCard === 3 && (
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard(null);
              }}
            >
              ✕
            </button>
          )}
          <h2>🏁 Submit Flag</h2>
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
        </div>
      </div>
    </Main>
  );
};

export default PracticePage;
