// src/pages/contest/ContestList.tsx
import React, { useState, useEffect } from 'react';
import { getActiveContests } from '../../api/axiosContest';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

import styles from '../../assets/scss/contest/ContestList.module.scss';
import { Avatar } from '@mui/material';
import { avatarBackgroundColors, getAvatarColorIndex } from '../../utils/avatars';
import LoadingIcon from '../public/LoadingIcon';
import { IoMdArrowRoundForward } from 'react-icons/io';

interface Contest {
  _id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  contestExp: number;
  isActive: boolean;
}

interface ContestsResponse {
  ongoingContests: Contest[];
  notStartedContests: Contest[];
  endedContests: Contest[];
}

const ContestList: React.FC = () => {
  const [ongoingContests, setOngoingContests] = useState<Contest[]>([]);
  const [notStartedContests, setNotStartedContests] = useState<Contest[]>([]);
  const [endedContests, setEndedContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] =
    useState<'ongoing' | 'notStarted' | 'ended'>('ongoing');

  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      const data: ContestsResponse = await getActiveContests();
      setOngoingContests(data.ongoingContests);
      setNotStartedContests(data.notStartedContests);
      setEndedContests(data.endedContests);
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleContestClick = (contestId: string) => {
    navigate(`/contest/${contestId}`);
  };

  const listForTab = () => {
    if (activeTab === 'ongoing') return ongoingContests;
    if (activeTab === 'notStarted') return notStartedContests;
    return endedContests;
  };

  if (loading) return <LoadingIcon />;

  return (
    <div className={styles.contest_list_container}>
      <div className={styles.contest_list_title}>Contests</div>

      {/* 🌟 플로팅 Add Contest 버튼 */}
      <button
        className={styles.floating_add_button}
        onClick={() => navigate('/contest/add')}
      >
        <span className={styles.icon}>🏆</span>
        <span className={styles.text}>Add Contest</span>
      </button>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab_button} ${activeTab === 'ongoing' ? styles.active : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          <p>Ongoing</p>
        </button>

        <button
          className={`${styles.tab_button} ${activeTab === 'notStarted' ? styles.active : ''}`}
          onClick={() => setActiveTab('notStarted')}
        >
          <p>Not Started</p>
        </button>

        <button
          className={`${styles.tab_button} ${activeTab === 'ended' ? styles.active : ''}`}
          onClick={() => setActiveTab('ended')}
        >
          <p>Ended</p>
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className={styles.card_grid}>
        {listForTab().map((contest) => (
          <div
            key={contest._id}
            className={styles.card_item}
            onClick={() => handleContestClick(contest._id)}
          >
            <Avatar
              variant="rounded"
              className={styles.card_avatar}
              sx={{
                backgroundColor:
                  avatarBackgroundColors[getAvatarColorIndex(contest.name)],
              }}
            >
              {contest.name.charAt(0).toUpperCase()}
            </Avatar>

            <div className={styles.card_title}>
              {contest.name.charAt(0).toUpperCase() + contest.name.slice(1)}
            </div>

            <div className={styles.card_info}>
              <p>📅 Start: {formatDate(contest.startTime)}</p>
              <p>⏳ End: {formatDate(contest.endTime)}</p>
              <p>⭐ Reward: {contest.contestExp} EXP</p>
            </div>

            <button className={styles.details_button}>
              <IoMdArrowRoundForward size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestList;
