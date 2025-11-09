import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import connectDB from './config/db';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';

import userRoutes from './routes/UserRoutes';
import InstRoutes from './routes/InstRoutes';
import MachineRoutes from './routes/MachineRoutes';
import ContestRoutes from './routes/ContestRoutes';
import ArenaRoutes from './routes/ArenaRoutes';
import ShopRoutes from './routes/ShopRoutes'; // ✅ 이름 통일 (ItemRoutes → ShopRoutes)
import InventoryRoutes from './routes/InventoryRoutes';
import LearningRoutes from './routes/LearningRoutes';
import { initializeSocket } from './config/socket';

// ✅ Instance Cleanup Scheduler
import './middlewares/instanceCleanup';

// ✅ 환경변수 로드 (.env)
dotenv.config();

const app = express();

// ✅ DB 연결
connectDB();

// ✅ 미들웨어 설정
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());

// ✅ CORS 설정
app.use(
  cors({
    origin: process.env.ORIGIN_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// ✅ 라우터 등록
app.use('/api/user', userRoutes);
app.use('/api/inst', InstRoutes);
app.use('/api/machines', MachineRoutes);
app.use('/api/contest', ContestRoutes);
app.use('/api/arena', ArenaRoutes);
app.use('/api/shop', ShopRoutes); // ✅ 상점 라우터
app.use('/api/inventory', InventoryRoutes);
app.use('/api/learning', LearningRoutes);

// ✅ 루트 엔드포인트
app.get('/', (req: Request, res: Response): void => {
  res.send('🚀 API is running');
});

// ✅ 404 처리
app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'Not Found' });
});

// ✅ 글로벌 에러 핸들러
app.use(
  (err: any, req: Request, res: Response, _next: NextFunction): void => {
    console.error('🔥 Global Error Handler:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
);

// ✅ 서버 생성 및 실행
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ✅ 소켓 초기화
initializeSocket(server, app);

// ✅ 서버 시작
server.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
