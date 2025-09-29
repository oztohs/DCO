import React, { useState, useEffect } from 'react';
import { getLeaderboard, getMyRank } from '../../api/axiosUser';
import LeaderboardTable from './LeaderboardTable';
import Main from '../../components/main/Main';
import { User } from '../../types/User';
import "../../assets/scss/leaderboard/LeaderboardPage.scss";
import "../../assets/scss/leaderboard/LeaderboardTable.module.scss";
import "../../assets/scss/leaderboard/ContestLeaderboard.module.scss";
import "../../assets/scss/leaderboard/CurrentUserInfo.module.scss";

// 테이블에 넘길 표준 타입
export type CurrentUserRow = {
  rank: number;
  username: string;
  level: number;
  exp: number;
};

const LeaderBoardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  //const [myRow, setMyRow] = useState<CurrentUserRow | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        setLeaderboard(leaderboardData);

        const raw = await getMyRank(); // 어떤 형태로 와도 표준화
        const normalized: CurrentUserRow = {
          rank: raw?.rank ?? raw?.myRank ?? 0,
          username:
            raw?.username ??
            raw?.nickname ??
            raw?.user?.username ??
            raw?.user?.nickname ??
            'Me',
          level: raw?.level ?? raw?.user?.level ?? 0,
          exp: raw?.exp ?? raw?.user?.exp ?? 0,
        };
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
                <p>닉네임: {user.username}</p>
                <p>레벨: {user.level}</p>
                <p>EXP: {user.exp}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="expanded-view">
            <h1 className="leaderboard-title">전체 리더보드</h1>
            {/* 표준화된 myRow만 전달 */}
            <LeaderboardTable leaderboard={leaderboard} />
          </div>
        )}
      </div>
    </Main>
  );
};

export default LeaderBoardPage;
