import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { giveUpMachine } from '../../api/axiosMachine';
import { TerminateInstance } from '../../api/axiosInstance';
import '../../assets/scss/etc/GiveUpModal.scss';

interface GiveUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineId: string;
  contestId?: string;
  machineName: string;
  mode : "machine" | "contest";
}

const GiveUpModal: React.FC<GiveUpModalProps> = ({
  isOpen,
  onClose,
  machineId,
  contestId,
  machineName,
  mode
}) => {
  const navigate = useNavigate();

  const handleGiveUp = async () => {
    try {
      const terminateResponse = await TerminateInstance(machineId);
      if (terminateResponse) {
        const machineResponse = await giveUpMachine(machineId);
        if (machineResponse) {
          if (mode === "contest") {
            navigate(`/contest/${contestId}`);
          } else if (mode === "machine") {
            navigate(`/machine/${machineId}`);
          }
        } else {
          alert(machineResponse.msg);
        }
      } else {
        alert(terminateResponse.msg);
      }
    } catch (error) {
      console.error('Failed to give up:', error);
      alert('Failed to give up. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="give-up-modal">
        <h2>Give Up Confirmation</h2>
        <p>Are you sure you want to give up on <strong>{machineName}</strong>?</p>
        <p className="warning-text">Warning: All your progress will be lost!</p>
        
        <div className="button-group">
          <button 
            onClick={handleGiveUp}
            className="give-up-button"
          >
            Yes, Give Up
          </button>
          <button 
            onClick={onClose}
            className="cancel-button"
          >
            No, Continue Playing
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GiveUpModal;