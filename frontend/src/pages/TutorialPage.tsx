import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Main from '../components/main/Main';
import '../assets/scss/etc/TutorialPage.scss';
import logo_dark from '../assets/img/icon/HTO Dark.png';
import logo_light from '../assets/img/icon/HTO Light.png';


const TutorialPage: React.FC = () => {
  const { t, i18n } = useTranslation('manual');
  const [step, setStep] = useState(0);
  const [isGlitch, setIsGlitch] = useState(false);

  // ✅ 언어 전환 함수
  const handleChangeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ko' : 'en'; // ✅ 'ko'로 고정
    i18n.changeLanguage(newLang);

    // ✅ 글리치 + 빛나는 페이드 효과 트리거
    setIsGlitch(true);
    setTimeout(() => setIsGlitch(false), 500);
  };

  // ✅ 단계별 스타일
  const articleClass = (index: number) =>
    `tutorial-article ${step === index ? 'active' : step > index ? 'passed' : ''}`;

  // ✅ 클릭 시 다음 단계로
  const handleNext = () => {
    if (step < 3) setStep(prev => prev + 1);
  };

  const gamingRulesList = [
    t('gamingRules.list.0'),
    t('gamingRules.list.1'),
    t('gamingRules.list.2'),
    t('gamingRules.list.3'),
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Main>
      <div className="tutorial-page-container" onClick={handleNext}>
        {/* === 상단 배너 === */}
        <div className="tutorial-page-top">
          <img
            className={`tutorial-banner ${isGlitch ? 'glitch-flash' : ''}`}
            src={i18n.language === 'en' ? logo_dark : logo_light}
            alt="HTO Banner"
            onClick={(e) => {
              e.stopPropagation();
              handleChangeLanguage();
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* === 본문 === */}
        <section className="tutorial-page-content-container">
          {/* 1️⃣ 소개 */}
          <article className={articleClass(0)}>
            <h2>{t('introduction.title', '튜토리얼 소개')}</h2>
            <Trans
              i18nKey="introduction.content"
              defaults="Hack This Out 플랫폼의 튜토리얼입니다. VPN 연결 후 머신을 생성하고, 힌트를 활용하며 플래그를 제출해보세요."
              components={[<strong key={0}></strong>]}
            />
          </article>

          {/* 2️⃣ 규칙 */}
          <article className={articleClass(1)}>
            <h2>{t('gamingRules.title', '게임 규칙')}</h2>
            <ol>
              {gamingRulesList.map((_item: string, index: number) => (
                <li key={index}>
                  <Trans
                    i18nKey={`gamingRules.list.${index}`}
                    defaults={`규칙 ${index + 1} 설명`}
                    components={[<a href="#" key={0}></a>]}
                  />
                </li>
              ))}
            </ol>
          </article>

          {/* 3️⃣ 게임 모드 */}
          <article className={articleClass(2)}>
            <h2>{t('gameModes.title', '게임 모드')}</h2>
            <p>
              <Trans
                i18nKey="gameModes.machine"
                defaults="Machine Mode에서는 개인이 문제를 풀며 연습할 수 있습니다."
              />
              <br />
              <Trans
                i18nKey="gameModes.contest"
                defaults="Contest Mode에서는 실시간으로 다른 참가자와 경쟁합니다."
              />
            </p>
          </article>

          {/* 4️⃣ 영상 */}
          <article className={articleClass(3)}>
            <div className="tutorial-video-container">
              <h3>{t('additionalGameModes.video.title', '튜토리얼 영상')}</h3>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/videoseries?si=kgEJ4ZhlcCpcSSF6&amp;list=PLUK26CwhrfoZVjnUkSWtrds8nvh4VUY59"
                title="HTO Tutorial Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </article>

          {/* === 끝났을 때 메시지 === */}
          {step >= 3 && (
            <div className="tutorial-end-message">
              {t('button.done', '🎉 Tutorial Complete!')}
            </div>
          )}

          {/* 🔹 클릭 안내 문구 */}
          {step < 3 && <div className="tutorial-hint">Click anywhere to continue...</div>}
        </section>
      </div>
    </Main>
  );
};

export default TutorialPage;
