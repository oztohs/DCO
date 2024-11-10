import axios from 'axios';

// axios 인스턴스 생성. 모든 요청에 사용됩니다.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
  withCredentials: true, // 인스턴스 레벨에서 withCredentials 설정
});

// ------- User related ------

/**
 * Get all user data.
 * @returns {Promise<Object>} - The response data containing all user data.
 */
export const getAllUser = async () => {
  try {
    const response = await axiosInstance.get('/user/');
    return response.data; // 서버로부터 받은 데이터 반환
  } catch (error: any) {
    throw new Error('Failed to fetch user data');
  }
};

/**
 * Get user Detail
 * @returns {Promise<Object>} - The response data containing user detail.
 */
export const getUserDetail = async () => {
  try {
    const response = await axiosInstance.get('/user/detail');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch user detail');
  }
};

/**
 * Get user Detail by user_id(Admin Only)
 * @param {string} user_id - The user_id to get user detail.
 * @returns {Promise<Object>} - The response data containing user detail.
 * Admin only
*/
export const getUserDetailByUserId = async (user_id: string) => {
  try {
    const response = await axiosInstance.get(`/user/detail/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch user detail');
  }
};

/**
 * Login request function.
 * @param {Object} formData - The form data for login.
 * @returns {Promise<Object>} - The response data containing login status.
 */
export const loginUser = async (formData: any) => {
  try {
    const response = await axiosInstance.post('/user/login', formData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

/**
 * Sign up request function.
 * @param {Object} formData - The form data for sign up.
 * @returns {Promise<Object>} - The response data containing sign up status.
 */
export const signUpUser = async (formData: any) => {
  try {
    const response = await axiosInstance.post('/user/sign-up', formData);
    return response.data; 
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Sign up failed');
    }
  }
};

/**
 * Check login status.
 * @returns {Promise<Object>} - The response data containing login status.
 */
export const getUserStatus = async () => {
  try {
    const response = await axiosInstance.get('/user/auth-status');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to check login status');
  }
};

/**
 * Logout user.
 * @returns {Promise<Object>} - The response data confirming logout.
 */
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post('/user/logout');
    return response.data;
  } catch (error: any) {
    throw new Error('Logout failed');
  }
};

/**
 * Check password.
 * @param {string} password - The password to check.
 * @returns {Promise<Object>} - The response data confirming password check.
 */
export const checkPassword = async (password: string) => {
  try {
    const response = await axiosInstance.post('/user/my-page', { password });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Password check failed');
  }
};

/**
 * Change password.
 * @param {string} newPassword - The new password to change.
 * @returns {Promise<Object>} - The response data confirming password change.
 */
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post('/user/change-password', { oldPassword, newPassword });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Password change failed');
  }
};

/**
 * Change name.
 * @param {string} newName - The new name to change.
 * @returns {Promise<Object>} - The response data confirming name change.
 */
export const changeName = async (newName: string) => {
  try {
    const response = await axiosInstance.post('/user/change-name', { name: newName });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Name change failed');
  }
};

/**
 * Reset password.
 * @param {string} user_id - The user_id to reset.
 * @param {string} password - The new password to reset.
 * @returns {Promise<Object>} - The response data confirming reset.
 */
export const resetPassword = async (user_id: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/user/reset-password/${user_id}`, { password });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to reset password');
  }
};

/**
 * Get user progress by user_id.
 * @param {string} user_id - The user_id to get user progress.
 * @returns {Promise<Object>} - The response data containing user progress.
 * Admin only
 */
export const getUserProgressByUserId = async (user_id: string) => {
  try {
    const response = await axiosInstance.get(`/user/progress/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch user progress');
  }
};

/**
 * Get user progress.
 * @returns {Promise<Object>} - The response data containing user progress.
 */
export const getUserProgress = async () => {
  try {
    const response = await axiosInstance.get('/user/progress');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch user progress');
  }
};

/**
 * Add user exp.
 * @param {number} exp - The exp to add.
 * @returns {Promise<Object>} - The response data confirming exp addition.
 * Admin only
 */
export const addUserExp = async (user_id: string, exp: number) => {
  try {
    const response = await axiosInstance.post(`/user/update/${user_id}/exp`, { exp });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to add user exp');
  }
};

/**
 * Update user level.
 * @param {number} level - The level to update.
 * @returns {Promise<Object>} - The response data confirming level update.
 * Admin only
 */
export const updateUserLevel = async (user_id: string, level: number) => {
  try {
    const response = await axiosInstance.post(`/user/update/${user_id}/level`, { level });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update user level');
  }
};

/**
 * Update user to admin.
 * @param {string} AdminPassword - The admin password to update.
 * @returns {Promise<Object>} - The response data confirming update.
 */
export const updateUsertoAdmin = async (AdminPassword: string) => {
  try {
    const response = await axiosInstance.post('/user/update/to-admin', { AdminPassword });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to update user to admin');
  }
};

/**
 * Reset user progress.
 * @param {string} password - The password to reset.
 * @returns {Promise<Object>} - The response data confirming reset.
 */
export const resetUserProgress = async (password: string) => {
  try {
    const response = await axiosInstance.post('/user/reset', { password });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to reset user progress');
  }
};

/**
 * Reset user progress by user_id.
 * @param {string} user_id - The user_id to reset.
 * @returns {Promise<Object>} - The response data confirming reset.
 * Admin only
 */
export const resetUserProgressByUserId = async (user_id: string) => {
  try {
    const response = await axiosInstance.post(`/user/reset/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to reset user progress');
  }
};

/**
 * Get leaderboard.
 * @returns {Promise<Object>} - The response data containing leaderboard.
 */
export const getLeaderboard = async () => {
  try {
    const response = await axiosInstance.get('/user/leaderboard');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch leaderboard');
  }
};

/**
 * Delete user by user_id.
 * @param {string} user_id - The user_id to delete.
 * @returns {Promise<Object>} - The response data confirming deletion.
 * Admin only
 */
export const deleteUserByUserId = async (user_id: string) => {  
  try {
    const response = await axiosInstance.delete(`/user/${user_id}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to delete user');
  }
};

/**
 * Delete user.
 * @param {string} password - The password to delete.
 * @returns {Promise<Object>} - The response data confirming deletion.
 */
export const deleteUser = async (password: string) => {
  try {
    const response = await axiosInstance.delete('/user', { data: { password } });
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to delete user');
  }
};

// ------- Instance related ------

/**
 * Start a new EC2 instance with the specified machineId.
 * @param {string} machineId - The ID of the machine to start.
 * @returns {Promise<Object>} - The response data containing instance details.
 */
export const startInstance = async (machineId: string) => {
  try {
    const response = await axiosInstance.post(`/inst/start-instance/${machineId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to start instance');
  }
};

/**
 * Get details of all instances(Admin only)
 * @returns {Promise<Object>} - The response data containing instance details.
 * Admin only
 */
export const getAllInstances = async () => {
  try {
    const response = await axiosInstance.get('/inst/');
    return response.data;
  } catch (error: any) {
    throw new Error('Failed to fetch all instances');
  }
};

/**
 * Get details of all instances by machine.
 * @param {string} machineId - The ID of the machine to get instances.
 * @returns {Promise<Object>} - The response data containing instance details.
 */
export const getInstanceByMachine = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/inst/${machineId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch instances');
  }
};

/**
 * Get details of a specific instance.
 * @param {string} instanceId - The ID of the instance to retrieve details for.
 * @returns {Promise<Object>} - The response data containing instance details.
 */
export const getInstanceDetails = async (instanceId: string) => {
  try {
    const response = await axiosInstance.get(`/inst/${instanceId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch instance details');
  }
};

/**
 * Submit a flag for a specific instance.
 * @param {string} machineId - The ID of the machine.
 * @param {string} flag - The flag to submit.
 * @returns {Promise<Object>} - The response data confirming submission.
 */
export const submitFlag = async (machineId: string, flag: string) => {
  try {
    const response = await axiosInstance.post(`/inst/${machineId}/submit-flag`, { flag });
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to submit flag');
  }
};

/**
 * Delete a specific instance.
 * @param {string} instanceId - The ID of the instance to delete.
 * @returns {Promise<Object>} - The response data confirming deletion.
 */
export const deleteInstance = async (instanceId: string) => {
  try {
    const response = await axiosInstance.delete(`/inst/${instanceId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to delete instance');
  }
};

/**
 * Submit VPN IP received by the EC2 instance.
 * Note: This function is typically called from the backend, but including it here for completeness.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} userId - The ID of the user.
 * @param {string} vpnIp - The VPN IP to submit.
 * @returns {Promise<Object>} - The response data confirming VPN IP update.
 */
export const receiveVpnIp = async (instanceId: string, vpnIp: string) => {
  try {
    const response = await axiosInstance.post(`/inst/${instanceId}/receive-vpn-ip`, {
      vpnIp,
    });
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to receive VPN IP');
  }
};

/**
 * Download OpenVPN profile for a specific instance.
 * @returns {Promise<Blob>} - The OpenVPN profile file blob.
 */
export const downloadOpenVPNProfile = async () => {
  try {
    const response = await axiosInstance.get(`/inst/download-ovpn`, {
      responseType: 'blob', // Important for handling binary data
    });
    return response.data; // This is the blob
  } catch (error: any) {
    throw error.response?.data || new Error('Failed to download OpenVPN profile');
  }
};
// ------- Machine related ------

/**
 * Create a new machine.
 * @param {Object} machineData - The data of the machine to create.
 * @returns {Promise<Object>} - The response data containing the created machine.
 */
export const createMachine = async (machineData: any) => {
  try {
    const response = await axiosInstance.post('/machines', machineData);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to create machine');
  }
};

/**
 * Get all machines.
 * @returns {Promise<Object>} - The response data containing all machines.
 * Admin only
 */
export const getAllMachines = async () => {
  try {
    const response = await axiosInstance.get('/machines');
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machines');
  }
};

/**
 * Get active machines.
 * @returns {Promise<Object>} - The response data containing active machines.
 */
export const getActiveMachines = async () => {
  try {
    const response = await axiosInstance.get('/machines/active');
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch active machines');
  }
};

/**
 * Get inactive machines.
 * @returns {Promise<Object>} - The response data containing inactive machines.
 * Admin only
 */
export const getInactiveMachines = async () => {
  try {
    const response = await axiosInstance.get('/machines/inactive');
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch inactive machines');
  }
};

/**
 * Activate a specific machine.
 * @param {string} machineId - The ID of the machine to activate.
 * @returns {Promise<Object>} - The response data confirming activation.
 * Admin only
 */
export const activateMachine = async (machineId: string) => {
  try {
    const response = await axiosInstance.post(`/machines/${machineId}/active`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to activate machine');
  }
};

/**
 * Deactivate a specific machine.
 * @param {string} machineId - The ID of the machine to deactivate.
 * @returns {Promise<Object>} - The response data confirming deactivation.
 * Admin only
 */
export const deactivateMachine = async (machineId: string) => {
  try {
    const response = await axiosInstance.post(`/machines/${machineId}/deactive`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to deactivate machine');
  }
};

/**
 * Get details of a specific machine.
 * @param {string} machineId - The ID of the machine to retrieve.
 * @returns {Promise<Object>} - The response data containing machine details.
 * Admin only
 */
export const getMachineDetails = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/${machineId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine details');
  }
};

/**
 * Get inactive machine details.
 * @param {string} machineId - The ID of the machine to retrieve.
 * @returns {Promise<Object>} - The response data containing machine details.
 * Admin only
 */
export const getInactiveMachineDetails = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/inactive/${machineId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine details');
  }
};

/**
 * Get active machine details.
 * @param {string} machineId - The ID of the machine to retrieve.
 * @returns {Promise<Object>} - The response data containing machine details.
 */
export const getActiveMachineDetails = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/active/${machineId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine details');
  }
};

/**
 * Get machine status.
 * @param {string} machineId - The ID of the machine to retrieve.
 * @returns {Promise<Object>} - The response data containing machine status.
 */
export const getMachineStatus = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/${machineId}/status`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine status');
  }
};

/**
 * Update a specific machine.
 * @param {string} machineId - The ID of the machine to update.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<Object>} - The response data containing the updated machine.
 * Admin only
 */
export const updateMachine = async (machineId: string, updateData: any) => {
  try {
    const response = await axiosInstance.put(`/machines/${machineId}`, updateData);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to update machine');
  }
};

/**
 * Delete a specific machine.
 * @param {string} machineId - The ID of the machine to delete.
 * @returns {Promise<Object>} - The response data confirming deletion.
 * Admin only
 */
export const deleteMachine = async (machineId: string) => {
  try {
    const response = await axiosInstance.delete(`/machines/${machineId}`);
    return response.data; // Return the data received from the server
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to delete machine');
  }
};

/**
 * Get machine hints.
 * @param {string} machineId - The ID of the machine.
 * @returns {Promise<Object>} - The response data containing machine hints.
 */
export const getMachineHints = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/${machineId}/hints`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine hints');
  }
};

/**
 * Submit a flag for a specific machine.
 * @param {string} machineId - The ID of the machine.
 * @param {string} flag - The flag to submit.
 * @returns {Promise<Object>} - The response data confirming submission.
 */
export const submitFlagMachine = async (machineId: string, flag: string) => {
  try {
    const response = await axiosInstance.post(`/machines/${machineId}/submit-flag`, { flag });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to submit flag');
  }
};

/**
 * Post a machine review.
 * @param {string} machineId - The ID of the machine.
 * @param {Object} reviewData - The data of the review to post.
 * @returns {Promise<Object>} - The response data containing the posted review.
 */
export const postMachineReview = async (machineId: string, reviewData: any) => {
  try {
    const response = await axiosInstance.post(`/machines/${machineId}/review`, reviewData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to post machine review');
  }
};

/**
 * Update a machine review.
 * @param {string} machineId - The ID of the machine.
 * @param {string} reviewId - The ID of the review to update.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<Object>} - The response data containing the updated review.
 */
export const updateMachineReview = async (machineId: string, reviewId: string, updateData: any) => {
  try {
    const response = await axiosInstance.put(`/machines/${machineId}/reviews/${reviewId}`, updateData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to update machine review');
  }
};

/**
 * Delete a machine review.
 * @param {string} machineId - The ID of the machine.
 * @param {string} reviewId - The ID of the review to delete.
 * @returns {Promise<Object>} - The response data confirming deletion.
 */
export const deleteMachineReview = async (machineId: string, reviewId: string) => {
  try {
    const response = await axiosInstance.delete(`/machines/${machineId}/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to delete machine review');
  }
};

export const deleteMyMachineReview = async (machineId: string) => {
  try {
    const response = await axiosInstance.delete(`/machines/${machineId}/reviews`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to delete machine review');
  }
};

/**
 * Get a machine review by review ID.
 * @param {string} machineId - The ID of the machine.
 * @param {string} reviewId - The ID of the review to retrieve.
 * @returns {Promise<Object>} - The response data containing the machine review.
 */
export const getMachineReview = async (machineId: string, reviewId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/${machineId}/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine review');
  }
};

/**
 * Get a machine rating.
 * @param {string} machineId - The ID of the machine.
 * @returns {Promise<Object>} - The response data containing the machine rating.
 */
export const getMachineRating = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/${machineId}/rating`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine rating');
  }
};  

/**
 * Get machine reviews.
 * @param {string} machineId - The ID of the machine.
 * @returns {Promise<Object>} - The response data containing machine reviews.
 */
export const getMachineReviews = async (machineId: string) => {
  try {
    const response = await axiosInstance.get(`/machines/${machineId}/reviews`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch machine reviews');
  }
};

/**
 * Delete a machine review forcefully.
 * @param {string} machineId - The ID of the machine.
 * @param {string} reviewId - The ID of the review to delete.
 * @returns {Promise<Object>} - The response data confirming deletion.
 * Admin only
 */
export const deleteMachineReviewForce = async (machineId: string, reviewId: string) => {
  try {
    const response = await axiosInstance.delete(`/machines/${machineId}/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to delete machine review');
  }
};

// ------- Contest related ------

/**
 * Get all contests.
 * @returns {Promise<Object>} - The response data containing all contests.
 * Admin only
 */
export const getContests = async () => {
  try {
    const response = await axiosInstance.get('/contest/');
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch contests');
  }
};

/**
 * Create a new contest.
 * @param {Object} contestData - The data of the contest to create.
 * @returns {Promise<Object>} - The response data containing the created contest.
 */
export const createContest = async (contestData: any) => {
  try {
    const response = await axiosInstance.post('/contest/', contestData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to create contest');
  }
};

/**
 * Participate in a specific contest.
 * @param {string} contestId - The ID of the contest.
 * @param {string} machineId - The ID of the machine.
 * @returns {Promise<Object>} - The response data confirming participation.
 */
export const participateInContest = async (contestId: string, machineId: string) => {
  try {
    const response = await axiosInstance.post(`/contest/${contestId}/participate`, { machineId });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to participate in contest');
  }
};

/**
 * Submit a flag for a specific machine in a contest.
 * @param {string} contestId - The ID of the contest.
 * @param {string} machineId - The ID of the machine.
 * @param {string} flag - The flag to submit.
 * @returns {Promise<Object>} - The response data confirming submission.
 */
export const submitFlagForContest = async (contestId: string, machineId: string, flag: string) => {
  try {
    const response = await axiosInstance.post(`/contest/${contestId}/${machineId}/submit-flag`, { flag });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to submit flag for contest');
  }
};

/**
 * Get hints for a specific machine in a contest.
 * @param {string} contestId - The ID of the contest.
 * @param {string} machineId - The ID of the machine.
 * @returns {Promise<Object>} - The response data containing hints.
 */
export const getHintInContest = async (contestId: string, machineId: string) => {
  try {
    const response = await axiosInstance.get(`/contest/${contestId}/${machineId}/hints`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch hints for contest');
  }
};

/**
 * Update a specific contest.
 * @param {string} contestId - The ID of the contest to update.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<Object>} - The response data containing the updated contest.
 * Admin only
 */
export const updateContest = async (contestId: string, updateData: any) => {
  try {
    const response = await axiosInstance.put(`/contest/${contestId}`, updateData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to update contest');
  }
};

/**
 * Delete a specific contest.
 * @param {string} contestId - The ID of the contest to delete.
 * @returns {Promise<Object>} - The response data confirming deletion.
 * Admin only
 */
export const deleteContest = async (contestId: string) => {
  try {
    const response = await axiosInstance.delete(`/contest/${contestId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to delete contest');
  }
};

/**
 * Get leaderboard by contest.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data containing leaderboard.
 */
export const getLeaderboardByContest = async (contestId: string) => {
  try {
    const response = await axiosInstance.get(`/contest/${contestId}/leaderboard`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch leaderboard by contest');
  }
};

/**
 * Get contest status.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data containing contest status.
 */
export const getContestStatus = async (contestId: string) => {
  try {
    const response = await axiosInstance.get(`/contest/${contestId}/status`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch contest status');
  }
};

/**
 * Get contest details.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data containing contest details.
 * Admin only
 */
export const getContestDetails = async (contestId: string) => {
  try {
    const response = await axiosInstance.get(`/contest/${contestId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch contest details');
  }
};

/**
 * Get user contest participation.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data containing user contest participation.
 */
export const getUserContestParticipation = async (contestId: string) => {
  try {
    const response = await axiosInstance.get(`/contest/${contestId}/participate`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch user contest participation');
  }
};

/**
 * Activate a specific contest.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data confirming activation.
 * Admin only
 */
export const ActivateContest = async (contestId: string) => {
  try {
    const response = await axiosInstance.post(`/contest/${contestId}/active`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to activate contest');
  }
};

/**
 * Deactivate a specific contest.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data confirming deactivation.
 * Admin only
 */
export const DeactivateContest = async (contestId: string) => { 
  try {
    const response = await axiosInstance.post(`/contest/${contestId}/deactive`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to deactivate contest');
  }
};

/**
 * Get active contest details.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data containing active contest details.
 */
export const getActiveContestDetails = async (contestId: string) => {
  try {
    const response = await axiosInstance.get(`/contest/active/${contestId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch active contest details');
  }
};

/**
 * Get all active contests.
 * @returns {Promise<Object>} - The response data containing all active contests.
 */
export const getActiveContests = async () => {
  try {
    const response = await axiosInstance.get('/contest/active');
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch active contests');
  }
};

/**
 * Get all inactive contests.
 * @returns {Promise<Object>} - The response data containing all inactive contests.
 * Admin only
 */
export const getInactiveContests = async () => {
  try {
    const response = await axiosInstance.get('/contest/inactive');
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch inactive contests');
  }
};

/**
 * Get inactive contest details.
 * @param {string} contestId - The ID of the contest.
 * @returns {Promise<Object>} - The response data containing inactive contest details.
 * Admin only
 */
export const getInactiveContestDetails = async (contestId: string) => {
  try {
    const response = await axiosInstance.get(`/contest/inactive/${contestId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : new Error('Failed to fetch inactive contest details');
  }
};



export default axiosInstance;

