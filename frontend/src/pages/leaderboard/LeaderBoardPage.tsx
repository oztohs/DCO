import React, { useState } from "react";
import { User } from "../../types/User";
import Main from "../../components/main/Main";
import "../../assets/scss/leaderboard/LeaderBoardPage.scss";

const LeaderBoardPage: React.FC = () => {
  const [language, setLanguage] = useState<"en" | "ko">("en");
  const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "ko" : "en"));

  // 🎯 더미 유저 데이터 (보여주기용)
  const leaderboard: Partial<User>[] = [
    { username: "Alpha", level: 10, exp: 1250 },
    { username: "Beta", level: 9, exp: 980 },
    { username: "Gamma", level: 8, exp: 870 },
    { username: "Delta", level: 8, exp: 850 },
    { username: "RockSteel", level: 6, exp: 480 },
    { username: "Kaiser", level: 6, exp: 420 },
    { username: "Eve", level: 5, exp: 400 },
    { username: "Nova", level: 5, exp: 370 },
    { username: "Orion", level: 4, exp: 320 },
    { username: "Sigma", level: 3, exp: 260 },
  ];

  return (
    <Main>
      <div className="leaderboard-cyber">
        {/* 🔹 노이즈 오버레이 (상단용) */}
        <div className="overlay-noise" />

        {/* 헤더 */}
<header className="cyber-header">
  <h1 className="title-glitch" data-text="RANKING">
    <span className="text">RANKING</span>
  </h1>
  <div className="header-right">
    <button className="lang-toggle" onClick={toggleLanguage}>
      {language === "en" ? "🇺🇸 EN" : "🇰🇷 KR"}
    </button>
  </div>
</header>


        {/* 메인 콘텐츠 */}
        <div className="leaderboard-grid">
          {/* 좌측 패널 */}
          <aside className="user-hud">
            <h2>{language === "en" ? "PLAYER STATUS" : "플레이어 상태"}</h2>
            <div className="hud-info">
              <p>
                USERNAME: <span>RockSteel</span>
              </p>
              <p>
                LEVEL: <span>6</span>
              </p>
              <p>
                EXP: <span>480</span>
              </p>
              <div className="hud-bar">
                <div className="fill" style={{ width: "70%" }} />
              </div>
            </div>
          </aside>

          {/* 중앙 랭킹 */}
          <section className="main-board">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>{language === "en" ? "RANK" : "순위"}</th>
                  <th>{language === "en" ? "USER" : "사용자"}</th>
                  <th>{language === "en" ? "LEVEL" : "레벨"}</th>
                  <th>EXP</th>
                  <th>{language === "en" ? "PROGRESS" : "진행도"}</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr key={idx} className={user.username === "RockSteel" ? "you" : ""}>
                    <td>{idx + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.level}</td>
                    <td>{user.exp}</td>
                    <td>
                      <div className="exp-bar">
                        <div
                          className="fill"
                          style={{ width: `${Math.min((user.exp || 0) / 15, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 우측 로그 */}
          <aside className="activity-log">
            <h2>{language === "en" ? "RECENT ACTIVITY" : "최근 활동"}</h2>
            <ul>
              <li>[+250 EXP] COMPLETE</li>
              <li>[+180 EXP] RockSteel won “ARENA”</li>
              <li>[+90 EXP] ARENA</li>
              <li>[+300 EXP] ARENA WIN</li>
            </ul>
          </aside>
        </div>
      </div>
    </Main>
  );
};

export default LeaderBoardPage;
