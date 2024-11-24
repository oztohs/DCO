import React, { useEffect, useState } from 'react';
import Main from '../../components/main/Main';
import { useParams } from 'react-router-dom';
import { ContestDetail as ContestDetailType } from '../../types/Contest';
import { getContestDetails, participateInContest } from '../../api/axiosContest';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import Modal from '../../components/modal/Modal'; // Importing the Modal component
import styles from '../../assets/scss/contest/PreContestPage.module.scss';
import Loading from '../../components/public/Loading';
import { MdOutlineRule } from "react-icons/md";

const PreContestPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [contestDetail, setContestDetail] = useState<ContestDetailType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control Modal visibility
  const navigate: NavigateFunction = useNavigate();

  /**
   * Fetches the contest details from the API.
   */
  useEffect(() => {
    const fetchContestDetail = async () => {
      if (!contestId) {
        setError('Contest ID is missing.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true); // Start loading
        const response = await getContestDetails(contestId);
        setContestDetail(response.contest);
      } catch (error: any) {
        console.error('Error fetching contest details:', error.message || error);
        setError('Failed to fetch contest details.');
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchContestDetail();
  }, [contestId]);

  if (isLoading) {
    return (
      <Main title="Contest Detail" description="Loading contest details.">
        <div className="contest-detail-page loading">
          <Loading />
        </div>
      </Main>
    );
  }

  if (error || !contestDetail) {
    return (
      <Main title="Contest Detail" description="Failed to load contest details.">
        <div className="contest-detail-page error">
          <p className="error-message">{error || 'Contest not found.'}</p>
        </div>
      </Main>
    );
  }

  const handleStartContest = async () => {
    try {
      if (!contestId) {
        setError('Contest ID is missing.');
        return;
      }

      const participation = await participateInContest(contestId);
      if (participation) {
        navigate(`/contest/${contestId}/play`);
      } else {
        setError(participation.msg);
      }
    } catch (error: any) {
      if (error.message === "FOUND") {
        // User has already participated and completed the contest
        setIsModalOpen(true); // Open the modal instead of redirecting immediately
        return;
      }
      // Check if the error response exists
      if (error.message === "COMPLETED") {
        // User has already completed the contest
        setIsModalOpen(true); // Open the modal instead of redirecting immediately
        return;
      }
      // Handle other specific status codes if needed
      setError(error.response.data.msg || 'Failed to start contest.');
      console.error('Error starting contest:', error.message || error);
      setError('Failed to start contest.');

    }
  };

  // Handler to close the modal and redirect to main
  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(`/contest`);
  };
  
  const handleJoinContest = () => {
    setIsModalOpen(false);
    navigate(`/contest/${contestId}/play`);
  };

  const handleCompletedContest = () => {
    setIsModalOpen(false);
    navigate(`/contest/${contestId}`);
  };

  return (
    <Main title="Pre Contest" description="Pre Contest 화면입니다.">
      <div className={styles.pre_contest_page}>
        <div className={styles.contest_basic_info}>
          <h1 className={styles.contest_name}>{contestDetail.name}</h1>
          <h2 className={styles.contest_description}>{contestDetail.description}</h2>
          <h3 className={styles.contest_exp}> Reward: {contestDetail.contestExp} EXP</h3>
        </div>
        <div className={styles.under_box}>
          <div className={styles.contest_rules}>
            <div className={styles.contest_rules_title}>
              <p><MdOutlineRule size={25} /> Rules</p>
            </div>
            <ul>
              <li>1. You can only play one machine at a time.</li>
              <li>2. While playing, hints are provided for the machine.</li>
              <li>3. You must submit the flag of the machine you are playing.</li>
              <li>4. To clear the contest, you must complete all machines.</li>
              <li>5. The reward decreases over time.</li>
              <li>6. The contest ends when the time runs out.</li>
              <li>7. If you finished the contest, you can earn experience points (EXP).</li>
              <li>8. Good luck!</li>
            </ul>
          </div>
          <button className={styles.contest_start} onClick={handleStartContest}>Join Contest</button>
        </div>
      </div>
      {/* When user participated in the contest */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className={styles.modal_body}>
          <div className={styles.contest_warning}>
            <div className={styles.contest_warning_title}>
              Warning
            </div>
            <p>
              Once you join the contest, progress will be recorded.
              <br />
              If you leave the contest, you will be disqualified.
            </p>
          </div>
          <button onClick={handleJoinContest} className={styles.modal_button}>
            Join Contest
          </button>
          </div>
      </Modal>
      {/* When user already completed the contest */}
      {error === "COMPLETED" && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className={styles.modal_body}>
          <div className={styles.contest_warning}>
            <p>
              You have already completed the contest.
            </p>
          </div>
          <button onClick={handleCompletedContest} className={styles.modal_button}>
            Back to Contests
          </button>
        </div>
        </Modal>
      )}
    </Main>
  );
};

export default PreContestPage;
