import React from 'react';
import Main from '../../components/main/Main';
import '../../assets/scss/arena/MachinePracticePage.scss';

const MachinePracticePage: React.FC = () => {
  return (
    <Main>
      <div className="arena-page-wrapper">

        {/* =======================================
            설명 Annotation #1
        ======================================= */}
        <div className="annotation" style={{ top: "120px", left: "180px" }}>
          <div className="annotation-number">1</div>
          <span className="annotation__label">ARENA LIST — 현재 생성된 대기방 목록</span>
          <div className="annotation__line"></div>
        </div>

        {/* =======================================
            설명 Annotation #2
        ======================================= */}
        <div className="annotation" style={{ top: "200px", left: "1500px" }}>
          <div className="annotation-number">2</div>
          <span className="annotation__label">NEW CONNECTION — 새 방 생성 패널</span>
          <div className="annotation__line"></div>
        </div>

        {/* =======================================
            설명 Annotation #3 (vertical + horizontal line)
        ======================================= */}
        <div className="annotation annotation--status" style={{ top: "420px", left: "520px" }}>
          <div className="annotation-number">3</div>

          <div className="annotation__line-vertical"></div>
          <div className="annotation__line-horizontal"></div>

          <div className="annotation__label">
            STATUS — WAITING / STARTED / ENDED 표시
          </div>
        </div>

        {/* =======================================
            Arena UI (정적 화면)
        ======================================= */}
        <div className="blueprint-container">
          <div className="blueprint-container__scanline"></div>

          {/* 왼쪽 패널 */}
          <div className="blueprint-panel blueprint-panel--list">
            <div className="blueprint-panel__header">
              <h2 className="blueprint-panel__title">ARENA LIST</h2>
            </div>

            <div className="blueprint-panel__body">
              <div className="arena-list">

                <div className="arena-list__row arena-list__row--header">
                  <div className="arena-list__col">ID</div>
                  <div className="arena-list__col">ROOM NAME</div>
                  <div className="arena-list__col">PARTICIPATIONS</div>
                  <div className="arena-list__col">STATUS</div>
                </div>

                <p className="arena-list__message">NO SIGNAL DETECTED</p>
              </div>
            </div>
          </div>

          {/* 오른쪽 패널 */}
          <div className="blueprint-panel blueprint-panel--create">
            <div className="blueprint-panel__header">
              <h2 className="blueprint-panel__title">NEW CONNECTION</h2>
            </div>

            <div className="blueprint-panel__body blueprint-panel__body--center">
              <button className="blueprint-button">
                <span className="blueprint-button__text">CREATE ROOM</span>
              </button>
              <p className="blueprint-panel__subtext">Create a new arena</p>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default MachinePracticePage;
