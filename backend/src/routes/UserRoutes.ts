import express from 'express';
import { verifyToken } from '../middlewares/Token.js';
import { verifyAdmin } from '../middlewares/Admin.js';
import { validate, signUpValidator, loginValidator } from '../middlewares/Validators.js';
import {
    getAllUser,
    postSignUp,
    postLoginUser,
    verifyUserStatus,
    checkPassword,
    logoutUser,
    changePassword,
    changeName,
    updateUserAvatar,
    updateUsertoAdmin,
    updateUserLevel,
    addUserExp,
    resetUserProgress,
    getUserProgressByUserId,
    resetUserProgressByUserId,
    resetPassword,
    getLeaderboard,
    deleteUserByUserId,
    deleteUser,
    getUserDetail,
    getUserDetailByUserId,
    makeUserAdmin,
    checkAdminPassword,
    makeAdminToUser,
    getMyRank,
    getUserProgress,
    addUserCoin
} from '../controllers/UserController.js';

const UserRoutes = express.Router();

/* ==============================
   ✅ 1. 기본 유저 정보 조회 (추가됨)
   GET /api/user/me
   ============================== */
UserRoutes.get('/me', verifyToken, async (req, res) => {
    try {
        const userData = await getUserDetail(req, res);
        // getUserDetail이 res.json을 이미 리턴하면 위 한 줄로 충분
        // 만약 직접 응답을 안 보내는 함수라면 아래처럼 구조화 가능:
        /*
        const user = await User.findById(res.locals.jwtData.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ user });
        */
    } catch (err) {
        console.error('[UserRoutes] /me error:', err);
        res.status(500).json({ message: 'Failed to fetch user info' });
    }
});

// Get All Users(Admin Only)
UserRoutes.get('/', verifyToken, verifyAdmin, getAllUser);

// Get User Detail(User Only)
UserRoutes.get('/detail', verifyToken, getUserDetail);

// Get User Detail by userId(Admin Only)
UserRoutes.get('/detail/:userId', verifyToken, verifyAdmin, getUserDetailByUserId);

// Sign Up
UserRoutes.post('/sign-up', validate(signUpValidator), postSignUp);

// Verify User Status
UserRoutes.get('/auth-status', verifyToken, verifyUserStatus);

// Login
UserRoutes.post('/login', validate(loginValidator), postLoginUser);

// Logout
UserRoutes.post('/logout', verifyToken, logoutUser);

// Check Password
UserRoutes.post('/my-page', verifyToken, checkPassword);

// Change Password
UserRoutes.post('/change-password', verifyToken, changePassword);

// Change Name
UserRoutes.post('/change-name', verifyToken, changeName);

// Reset Password
UserRoutes.post('/reset-password/:userId', verifyToken, resetPassword);

// Delete User
UserRoutes.delete('/:userId', verifyToken, deleteUser);

// Update User Avatar
UserRoutes.post('/update/avatar', verifyToken, updateUserAvatar);

// Update User to Admin
UserRoutes.post('/update/to-admin', verifyToken, updateUsertoAdmin);

// Update User Level(Admin Only)
UserRoutes.post('/update/:userId/level',
    verifyToken,
    verifyAdmin,
    updateUserLevel
);

// Add User EXP(Admin Only)
UserRoutes.post('/update/:userId/exp',
    verifyToken,
    verifyAdmin,
    addUserExp
);

// Reset User Progress
UserRoutes.post('/reset', verifyToken, resetUserProgress);

// Get User Progress by User ID(Admin Only)
UserRoutes.get('/progress/:userId',
    verifyToken,
    verifyAdmin,
    getUserProgressByUserId
);

// Reset User Progress by User ID(Admin Only)
UserRoutes.post('/reset/:userId',
    verifyToken,
    verifyAdmin,
    resetUserProgressByUserId
);

// Delete User by User ID(Admin Only)
UserRoutes.delete('/:userId/delete',
    verifyToken,
    verifyAdmin,
    deleteUserByUserId
);

// Get Leaderboard
UserRoutes.get('/leaderboard', verifyToken, getLeaderboard);

// Get My Rank
UserRoutes.get('/my-rank', verifyToken, getMyRank);

// Get User Progress
UserRoutes.get('/progress', verifyToken, getUserProgress);

// Check Admin Password(Admin Only)
UserRoutes.post('/verify-admin', verifyToken, verifyAdmin, checkAdminPassword);

// Make User Admin by User ID(Admin Only)
UserRoutes.post('/:userId/to-admin', verifyToken, verifyAdmin, makeUserAdmin);

// Make Admin to User by User ID(Admin Only)
UserRoutes.post('/:userId/to-user', verifyToken, verifyAdmin, makeAdminToUser);

// Add User Coin(Admin Only)
UserRoutes.post('/update/:userId/coin',
    verifyToken,
    verifyAdmin,
    addUserCoin
);

export default UserRoutes;
