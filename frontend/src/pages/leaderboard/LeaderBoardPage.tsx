import React, { useState, useEffect } from 'react';
import { getLeaderboard, getMyRank } from '../../api/axiosUser';
import LeaderboardTable from './LeaderboardTable';
import Main from '../../components/main/Main';
import { User } from '../../types/User';
import "../../assets/scss/leaderboard/LeaderboardPage.scss";
import "../../assets/scss/leaderboard/LeaderboardTable.module.scss";
import "../../assets/scss/leaderboard/ContestLeaderboard.module.scss";
import "../../assets/scss/leaderboard/CurrentUserInfo.module.scss";

// 🔹 홀로그램 카드 이미지 import (이미지 경로에 맞게 수정)
import holo1 from '../../assets/img/leaderboard/holo1.png';
import holo2 from '../../assets/img/leaderboard/holo2.png';
import holo3 from '../../assets/img/leaderboard/holo3.png';

// 표준 타입
export type CurrentUserRow = {
  rank: number;
  username: string;
  level: number;
  exp: number;
};

const LeaderBoardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboardData = await getLeaderboard();

        // ✅ 배열 형태로 정제
        const list = Array.isArray(leaderboardData)
          ? leaderboardData
          : leaderboardData?.data || [];

        setLeaderboard(list);
      } catch (err) {
        console.error("리더보드 데이터를 불러오는 중 오류 발생:", err);
      }
    };

    fetchData();
  }, []);

  const topThree = Array.isArray(leaderboard) ? leaderboard.slice(0, 3) : [];

  return (
    <Main>
      <div
        className={`leaderboard-container ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        {!expanded ? (
          // ---------------- 첫 화면 (상위 3명 카드) ----------------
          <div className="top-three">
            {topThree.map((user, idx) => (
              <div key={idx} className={`rank-card rank-${idx + 1}`}>
                {/* 홀로그램 배경 */}
                <img
                  src={
                    idx === 0 ? holo1 : idx === 1 ? holo2 : holo3
                  }
                  alt={`rank-${idx + 1}-background`}
                  className="holo-bg"
                />
                {/* 정보 영역 */}
                <div className="rank-info">
                  <h2>{idx + 1}위</h2>
                  <p>닉네임: {user.username}</p>
                  <p>레벨: {user.level}</p>
                  <p>EXP: {user.exp}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ---------------- 두 번째 화면 (전체 리더보드) ----------------
          <div className="expanded-view">
            <h1 className="leaderboard-title">전체 리더보드</h1>
            <LeaderboardTable leaderboard={leaderboard} />
          </div>
        )}
      </div>
    </Main>
  );
};

export default LeaderBoardPage;
