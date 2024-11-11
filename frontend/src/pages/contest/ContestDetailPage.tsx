import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom';
import ContestDetail from '../../components/contest/ContestDetail';
import Main from '../../components/main/Main';
import { getContestDetails, getMyRankinContest } from '../../api/axiosContest';
import { ContestDetail as ContestDetailType } from '../../types/Contest';
import ContestLeaderboard from '../../components/contest/ContestLeaderboard';
import { CurrentUser } from '../../types/CurrentUser';
import CurrentUserInfo from '../../components/leaderboard/CurrentUserInfo';
//import '../../assets/scss/contest/ContestDetailPage.scss';

/**
 * Interface to represent the contest's status.
 */
interface ContestStatus {
  isActive: boolean;
  isStarted: boolean;
}

/**
 * Component representing the Contest Detail Page.
 * 
 * @returns {JSX.Element} The rendered ContestDetailPage component.
 */
const ContestDetailPage: React.FC = () => {
  const [contestDetail, setContestDetail] = useState<ContestDetailType | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    myRank: null,
    myLevel: null,
    myExp: null,
    myUsername: null,
    myAvatar: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { contestId } = useParams<{ contestId: string }>();
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
        const response = await getContestDetails(contestId);
        const fetchedContest = response.contest;

        // **Parse `startTime` and `endTime` as Date objects**
        const parsedContest: ContestDetailType = {
          ...fetchedContest,
          startTime: new Date(fetchedContest.startTime),
          endTime: new Date(fetchedContest.endTime),
        };

        setContestDetail(parsedContest);
      } catch (error: any) {
        console.error('Error fetching contest details:', error.message || error);
        setError('Failed to fetch contest details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestDetail();
  }, [contestId]);

  useEffect(() => {
    const fetchMyRank = async () => {
      setIsLoading(true);
      try {
        const response = await getMyRankinContest(contestId || '');
        setCurrentUser({
          myRank: response.rank,
          myLevel: response.level,
          myExp: response.exp,
          myUsername: response.username,
          myAvatar: response.avatar,
        });
      } catch (error: any) {
        console.error('Error fetching current user:', error.message || error);
        setError('Failed to fetch current user.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyRank();
  }, [contestId]);

  /**
   * Handles navigation to the participate page.
   */
  const handlePlay = () => {
    if (!contestDetail) return;

    const { isActive, startTime, endTime, _id } = contestDetail;

    const now = Date.now();

    const isContestActive =
      isActive &&
      new Date(startTime).getTime() <= now &&
      new Date(endTime).getTime() >= now;

    if (isContestActive) {
      navigate(`/contest/${_id}/pre`);
    } else {
      navigate(`/contest/${_id}/pending`);
    }
  };

  /**
   * Determines the contest status based on current time and active state.
   * 
   * @returns {ContestStatus} The status of the contest.
   */
  const getContestStatus = (): ContestStatus => {
    if (!contestDetail) {
      return { isActive: false, isStarted: false };
    }

    const { isActive, startTime } = contestDetail;
    const now = Date.now();

    return {
      isActive,
      isStarted: new Date(startTime).getTime() <= now,
    };
  };

  if (isLoading) {
    return (
      <Main title="Contest Detail" description="Loading contest details.">
        <div className="contest-detail-page loading">
          <p>Loading...</p>
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

  const contestStatus = getContestStatus();

  return (
    <Main title="Contest Detail" description="Contest Detail 화면입니다.">
      <div className="contest-detail-page">
        <ContestDetail contestDetail={contestDetail} />
        <button onClick={handlePlay} className="participate-button">
          Play
        </button>
      </div>
      {/* Pass contestId and contestStatus as props to ContestLeaderboard */}
      <CurrentUserInfo currentUser={currentUser} />
      <ContestLeaderboard 
        contestId={contestId || ''} 
        contestStatus={contestStatus} 
      />
    </Main>
  );
};

export default ContestDetailPage;