import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArena } from '../../api/axiosArena';
import '../../assets/scss/arena/AddArenaForm.scss';

const formSteps = [
  { id: 'name', label: 'ROOM NAME', placeholder: 'Enter Room Name', type: 'text' },
  { id: 'maxParticipants', label: 'MAX PARTICIPANTS', type: 'number', min: 2, max: 4 },
  { id: 'duration', label: 'DURATION', type: 'number', min: 10, max: 60, step: 5 },
  { id: 'category', label: 'MACHINE TYPE', type: 'select', options: ['Web', 'Network', 'Crypto', 'OS', 'Database', 'Cloud', 'AI', 'Random'] },
];

const AddArenaForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', category: 'Web', maxParticipants: 2, duration: 10 });
  const [error, setError] = useState('');

  const filledCount = Object.values(formData).filter(v => v !== '' && v !== 0).length;
  const progress = (filledCount / formSteps.length) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Arena callsign is required.');
      setTimeout(() => setError(''), 2000);
      return;
    }

    const flash = document.createElement("div");
    flash.classList.add("screen-flash");
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 250);

    try {
      const arena = await createArena(formData);
      navigate(`/arena/${arena._id}`);
    } catch (err: any) {
      const msg = err?.msg || 'Failed to create arena';
      setError(msg);
    }
  };

  // 엔터로 바로 제출
  useEffect(() => {
    const onEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit(e as any);
    };
    window.addEventListener('keydown', onEnter);
    return () => window.removeEventListener('keydown', onEnter);
  }, [formData]);

  return (
    <div className="terminal-form-container">
      <div className="terminal-module">
        <div className="progress-bar-container">
          <div className="progress-label">SYSTEM READY</div>
          <div className="progress-bar-track">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-percent">{Math.round(progress)}%</div>
        </div>

        <div className="create-title">CREATE ROOM</div>

        {/* ✅ 한 화면 전체 입력 */}
        <form className="step-content" onSubmit={handleSubmit}>
          {formSteps.map(step => (
            <div key={step.id} className="form-section">
              <div className="crt-label-line">
                <span className="crt-label-text">{step.label}</span>
              </div>

              {step.type === 'select' ? (
                <select
                  id={step.id}
                  name={step.id}
                  value={formData[step.id as keyof typeof formData]}
                  onChange={handleChange}
                >
                  {step.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={step.type}
                  id={step.id}
                  name={step.id}
                  value={formData[step.id as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={step.placeholder}
                  min={step.min}
                  max={step.max}
                  step={step.step}
                  autoComplete="off"
                />
              )}
            </div>
          ))}

          {!!error && <p className="form-error">{error}</p>}

          <div className="navigation-controls">
            <button type="submit" className="nav-button create" data-text="[ COMPLETE ]">
              [ COMPLETE ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArenaForm;
