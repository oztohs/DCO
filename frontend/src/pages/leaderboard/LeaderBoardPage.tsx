// frontend/src/pages/leaderboard/LeaderBoardPage.tsx

import React, { useState, useEffect } from 'react';
import { getLeaderboard, getMyRank } from '../../api/axiosUser';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import Main from '../../components/main/Main';
import { User } from '../../types/User';
import { CurrentUser } from '../../types/CurrentUser';
import Loading from '../../components/public/Loading';
import "../../assets/scss/leaderboard/LeaderboardTable.module.scss";
import "../../"


const LeaderBoardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    _id: '',
    myRank: null,
    myLevel: null,
    myExp: null,
    myUsername: null,
    myAvatar: null,
  });

  // Leaderboard 불러오기
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await getLeaderboard();
        if (response && Array.isArray(response.users)) {
          setLeaderboard(response.users);
        } else if (response && Array.isArray(response.data)) {
          setLeaderboard(response.data);
        } else if (Array.isArray(response)) {
          setLeaderboard(response);
        } else {
          console.error('Unexpected leaderboard data structure:', response);
          setLeaderboard([]);
        }
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error.message || error);
        setError('Failed to fetch leaderboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // 내 랭크 불러오기
  useEffect(() => {
    const fetchMyRank = async () => {
      try {
        const response = await getMyRank();
        if (response && response.myRank !== undefined && response.user) {
          setCurrentUser({
            _id: response.user._id,
            myRank: response.myRank,
            myLevel: response.user.level,
            myExp: response.user.exp,
            myUsername: response.user.username,
            myAvatar: response.user.avatar,
          });
        } else {
          console.error('Unexpected myRank data structure:', response);
          setError('Failed to fetch my rank data.');
        }
      } catch (error: any) {
        console.error('Error fetching my rank:', error.message || error);
        setError('Failed to fetch my rank data.');
      }
    };
    fetchMyRank();
  }, []);

  if (loading) {
    return (
      <Main>
        <Loading />
      </Main>
    );
  }

  return (
    <Main title="LeaderBoard" description="LeaderBoard 화면입니다.">
      <div className="leaderboard-page cyberpunk-bg">
        <div className="leaderboard-overlay" />
        <div className="leaderboard-container">
          <h1 className="leaderboard-title">🚀 CYBER LEADERBOARD 🚀</h1>

          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <LeaderboardTable
              leaderboard={leaderboard}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </Main>
  );
};

export default LeaderBoardPage;
