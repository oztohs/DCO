import React, { useState, useEffect } from 'react';
import Main from '../../components/main/Main';
import { useParams, useNavigate } from 'react-router-dom';
import { getContestDetails, participateInContest } from '../../api/axiosContest';
import { ContestDetail as ContestDetailType } from '../../types/Contest';
import Modal from '../../components/modal/Modal';
import Loading from '../../components/public/Loading';
import { MdOutlineRule } from "react-icons/md";
import styles from '../../assets/scss/contest/PreContestPage.module.scss';

const PreContestPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  const [contestDetail, setContestDetail] = useState<ContestDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!contestId) return setError('Missing contest ID');
      try {
        setIsLoading(true);
        const res = await getContestDetails(contestId);
        setContestDetail(res.contest);
      } catch (err) {
        setError("Failed to load contest details.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [contestId]);

  if (isLoading) return <Main title="Loading"><Loading /></Main>;
  if (error || !contestDetail) return <Main title="Contest Detail"><p>{error || "Contest not found."}</p></Main>;

  const handleStartContest = () => setIsModalOpen(true);

  const handleJoinContest = async () => {
    setIsModalOpen(false);
    setIsBuffering(true);

    try {
      const result = await participateInContest(contestId!);
      console.log('participateInContest result:', result); // 서버 응답 확인용

      setTimeout(() => {
        setIsBuffering(false);

        if (result && typeof result === 'object') {
          switch (result.status) {
            case "FOUND":
              setIsFound(true);
              break;
            case "COMPLETED":
              setIsCompleted(true);
              break;
            case "OK":
            case "SUCCESS":
              navigate(`/contest/${contestId}/play`);
              break;
            default:
              setError(result.msg || "Failed to join contest.");
          }
        } else {
          // 예상치 못한 구조
          setError("Unexpected server response.");
        }
      }, 1800);
    } catch (err: any) {
      setIsBuffering(false);
      setError(err?.message || "Failed to join contest.");
    }
  };

  const closeModal = () => { setIsModalOpen(false); setIsFound(false); setIsCompleted(false); };
  const continueContest = () => navigate(`/contest/${contestId}/play`);
  const goBackToDetail = () => navigate(`/contest/${contestId}`);

  return (
    <Main title="Pre Contest">
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>{contestDetail.name}</h1>
          <h2 className={styles.subtitle}>{contestDetail.description}</h2>
          <h3 className={styles.reward}>Reward: {contestDetail.contestExp} EXP</h3>

          <div className={styles.divider} />

          <div className={styles.rules}>
            <p className={styles.rules_title}><MdOutlineRule size={25} /> Contest Rules</p>
            <ul>
              <li>1. You can only play one machine at a time.</li>
              <li>2. Hints are provided while playing.</li>
              <li>3. Submit the flag of the machine you are playing.</li>
              <li>4. Complete all machines to finish the contest.</li>
              <li>5. The reward decreases over time.</li>
              <li>6. The contest ends when the time runs out.</li>
              <li>7. Earn EXP when you finish the contest.</li>
              <li>8. Good luck!</li>
            </ul>
          </div>

          <button className={styles.join_btn} onClick={handleStartContest}>Join Contest</button>
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className={styles.modal}>
            <h3 className={styles.modal_title}>⚠️ Warning</h3>
            <p>Once you join, your progress will be recorded!</p>
            <button className={styles.modal_btn} onClick={handleJoinContest}>Let's Go!</button>
          </div>
        </Modal>
      )}

      {isFound && (
        <Modal isOpen={isFound} onClose={closeModal}>
          <div className={styles.modal}>
            <p>You are already participating in this contest.</p>
            <button className={styles.modal_btn} onClick={continueContest}>Continue</button>
          </div>
        </Modal>
      )}

      {isCompleted && (
        <Modal isOpen={isCompleted} onClose={closeModal}>
          <div className={styles.modal}>
            <p>You have already completed this contest.</p>
            <button className={styles.modal_btn} onClick={goBackToDetail}>Go Back</button>
          </div>
        </Modal>
      )}

      {isBuffering && (
        <div className={styles.buffering_overlay}>
          <div className={styles.buffering_text}>Joining contest...</div>
        </div>
      )}
    </Main>
  );
};

export default PreContestPage;
