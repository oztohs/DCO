import React, { useState } from 'react';
import { checkPassword } from '../../api/axiosUser';
import PasswordCheckForm from '../../components/mypage/PasswordCheckForm';
import PersonalInfoForm from '../../components/mypage/PersonalInfoForm';
import ToAdmin from '../../components/mypage/toAdmin';
import { useNavigate } from 'react-router-dom';
import Main from '../../components/main/Main';
import { IoMdArrowRoundBack } from 'react-icons/io';
import '../../assets/scss/mypage/toAdmin.scss';

/**
 * Component representing the user's personal page.
 */
const MyPage: React.FC = () => {
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  /**
   * Handles the password verification process.
   * @param password - The password entered by the user.
   */
  const handlePasswordCheck = async (password: string): Promise<void> => {
    try {
      await checkPassword(password);
      setIsPasswordVerified(true);
    } catch (error) {
      console.error('Password check failed:', error);
      alert('비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Main>
      <div className="mypage-container">
        <div className="upper-container">
          <div className="back-btn-container">
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              aria-label="Back to Home"
            >
              <IoMdArrowRoundBack />
            </button>
          </div>
          <h1>Profile</h1>
        </div>
        {!isPasswordVerified ? ( 
          <div className="password-check-wrapper">
            <PasswordCheckForm onSubmit={handlePasswordCheck} /> 
            </div>
        ) : (
          <div className="info-wrapper">
            <PersonalInfoForm />
            <ToAdmin />
          </div>
        )}
      </div>
    </Main>
  );
};

export default MyPage;

