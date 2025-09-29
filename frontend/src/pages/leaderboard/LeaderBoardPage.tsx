import React, { useState, useEffect } from 'react';
import { getLeaderboard, getMyRank } from '../../api/axiosUser';
import LeaderboardTable from '../../components/leaderboard/LeaderboardTable';
import Main from '../../components/main/Main';
import { User } from '../../types/User';
import { CurrentUser } from '../../types/CurrentUser';

import "../../assets/scss/leaderboard/LeaderboardPage.scss";
import "../../assets/scss/leaderboard/LeaderboardTable.module.scss";
import "../../assets/scss/leaderboard/ContestLeaderboard.module.scss";
import "../../assets/scss/leaderboard/CurrentUserInfo.module.scss";

const LeaderBoardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [myRank, setMyRank] = useState<CurrentUser | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        setLeaderboard(leaderboardData);

        const myRankData = await getMyRank();
        setMyRank(myRankData);
      } catch (err) {
        console.error("리더보드 데이터를 불러오는 중 오류 발생:", err);
      }
    };

    fetchData();
  }, []);

  const topThree = leaderboard.slice(0, 3);

  return (
    <Main>
      <div
        className={`leaderboard-container ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        {!expanded ? (
          <div className="top-three">
            {topThree.map((user, idx) => (
              <div key={idx} className={`rank-card rank-${idx + 1}`}>
                <h2>{idx + 1}위</h2>
                <p>닉네임: {user.nickname}</p>
                <p>레벨: {user.level}</p>
                <p>EXP: {user.exp}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="expanded-view">
            <h1 className="leaderboard-title">전체 리더보드</h1>
            <LeaderboardTable leaderboard={leaderboard} myRank={myRank} />
          </div>
        )}
      </div>
    </Main>
  );
};

export default LeaderBoardPage;
