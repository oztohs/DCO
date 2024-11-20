import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import { ContestDetail as ContestDetailType } from '../../types/Contest';
import styles from '../../assets/scss/contest/ContestDetail.module.scss';
import { Avatar } from '@mui/material';
import { getAvatarColorIndex } from '../../utils/avatars';
import { avatarBackgroundColors } from '../../utils/avatars';

/**
 * Props interface for ContestDetail component.
 */
interface ContestDetailProps {
  contestDetail: ContestDetailType;
}

/**
 * A component to display the details of a contest.
 * 
 * @param {ContestDetailProps} props - The props for the ContestDetail component.
 * @returns {JSX.Element} The rendered ContestDetail component.
 */
const ContestDetail: React.FC<ContestDetailProps> = ({ contestDetail }) => {
  const { name, contestExp, machines, description, startTime, endTime } = contestDetail;
  const avatarColorIndex = getAvatarColorIndex(name);
  const avatarBgColor = avatarBackgroundColors[avatarColorIndex];
  return (
    <div className={styles.contest_detail_container}>
      <div className={styles.contest_detail_content}>
        <div className={styles.box_upper_content}>
          <div style={{ width: '150px' }}>
            {<Avatar
              variant="rounded"
              sx={{
                backgroundColor: avatarBgColor,
                width: 150,
                height: 150,
                fontSize: '5rem',
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>}
          </div>
          <div className={styles.contest_textbox}>
            <div className={styles.contest_name}><b>{name.charAt(0).toUpperCase() + name.slice(1) || 'N/A'}</b></div>
            <div className={styles.contest_description}><b>Description: </b>{description || 'N/A'}</div>
            {machines.length > 0 ? (
              <ul className={styles.contest_machines}>
                <p><b>Machines: </b></p>
                {machines.map((machine) => (
                  <li key={machine._id}>{machine.name}</li>
                ))}
              </ul>
            ) : (
              <p>N/A</p>
            )}
          </div>

          <div className={styles.right_part}>
            <div className={styles.time_text}>{startTime ? formatDate(startTime) : 'N/A'} ~ {endTime ? formatDate(endTime) : 'N/A'}</div>
            <div className={styles.contest_reward_box}>
              <p className={styles.text}>Reward</p>
              <p className={styles.reward_text}>{contestExp || 0} EXP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetail;

