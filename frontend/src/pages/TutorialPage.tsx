import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Main from '../components/main/Main';
import logo_dark from "../assets/img/icon/HTO DARK RECOLORED_crop_filled.png";
import logo_light from "../assets/img/icon/HTO LIGHT RECOLORED_crop_filled.png";
import '../assets/scss/etc/TutorialPage.scss';

const TutorialPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const gamingRulesList: string[] = t('gamingRules.list', { returnObjects: true }) as string[];

  return (
    <Main>
      <div className="tutorial-page-container">
        <div className="tutorial-page-top">
          <img 
            id="tutorialImg" 
            className="tutorial-page-img-dark" 
            alt="" 
            src={i18n.language === 'en' ? logo_dark : logo_light}
            onClick={() => handleChangeLanguage(i18n.language === 'en' ? 'ko' : 'en')}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <section className="tutorial-page-content-container">
          <article className="tutorial-page-content-intro">
            <h2>{t('introduction.title')}</h2>
            <Trans
              i18nKey="introduction.content"
              components={[
                <strong key={0}></strong>,
                <a href="#" key={1}></a>,
                <a href="#" key={2}></a>,
                <a href="#" key={3}></a>,
                <a className="intro-red" href="#" key={4}></a>,
                <a className="intro-red" href="#" key={5}></a>,
                <a href="#" key={6}></a>,
              ]}
            />
          </article>
          <article className="tutorial-page-content-rules">
            <h2>{t('gamingRules.title')}</h2>
            <ol>
              {gamingRulesList.map((_item: string, index: number) => (
                <li key={index}>
                  <Trans
                    i18nKey={`gamingRules.list.${index}`}
                    components={[
                      <a href="#" key={0}></a>,
                      <a href="#" key={1}></a>
                    ]}
                  />
                </li>
              ))}
            </ol>
          </article>
          <article className="tutorial-page-content-gamemode">
            <h2>{t('gameModes.title')}</h2>
            <Trans
              i18nKey="gameModes.machine"
              components={[
                <strong key={0}></strong>,
                <a href="#" key={1}></a>,
                <a href="#" key={2}></a>,
              ]}
            />
            <Trans
              i18nKey="gameModes.contest"
              components={[
                <strong key={0}></strong>,
                <a href="#" key={1}></a>,
                <a href="#" key={2}></a>,
                <a href="#" key={3}></a>,
                <a href="#" key={4}></a>,
              ]}
            />
          </article>

          <article className="tutorial-page-content-add">
            <div className="tutorial-video-container">
              <h3>{t('additionalGameModes.video.title')}</h3>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?si=GmzEgvi07yp_-kU-&amp;list=PLUK26Cwhrfoaq323273vJl13rBw8pAnb4" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>
          </article>
        </section>
      </div>
    </Main>
  );
};

export default TutorialPage;