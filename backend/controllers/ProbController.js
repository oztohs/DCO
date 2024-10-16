import Example from '../models/Example.js';
import Counter from '../models/Counter.js';
import Machine from '../models/Machine.js'; // Ensure Machine model is imported

// 문제 번호 할당
const getNextSequence = async (name) => {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// 문제 업로드 POST
export const postProb = async (req, res) => {
    try {
        const { title, content, answer, theme } = req.body;
        const numericId = await getNextSequence('challengeId');
        const newChallenge = new Example({ numericId, title, content, answer, theme });
        await newChallenge.save();
        res.json(newChallenge);
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).send('Server error');
    }
};

// 전체 문제 GET
export const getAllProb = async (req, res) => {
    try {
        const challenges = await Example.find({});

        const formattedChallenges = challenges.map(challenge => ({
            id: challenge.numericId,
            title: challenge.title,
            content: challenge.content,
            answer: challenge.answer,
            theme: challenge.theme
        }));

        res.json(formattedChallenges);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).send('Server error');
    }
};

// 문제 GET
export const getProb = async (req, res) => {
    const challenge = await Example.findOne({ numericId: req.params.numericId });
    res.json(challenge);
};

// 문제 삭제 DELETE
export const deleteProb = async (req, res) => {
    try {
        const { numericId } = req.params;
        const result = await Example.findOneAndDelete({ numericId });

        if (!result) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        res.json({ msg: 'Challenge deleted successfully' });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        res.status(500).send('Server error');
    }
};

// 머신 업로드 POST
export const postMachine = async (req, res) => {
    console.log('Request body:', req.body);

    try {
        const { name, category, info, exp, amiId } = req.body; // Include amiId
        if (!amiId) {
            return res.status(400).json({ msg: 'AMI ID is required' });
        }
        const newMachine = new Machine({ name, category, info, exp, amiId });
        await newMachine.save();
        res.json(newMachine);
    } catch (error) {
        console.error('Error creating machine:', error);
        res.status(500).send('Server error');
    }
};

// name이 "TEST"인 Machine 데이터 GET
export const getMachine = async (req, res) => {
    try {
        // name이 'TEST'인 Machine 찾기
        const machine = await Machine.findOne({ name: 'TEST' });

        if (!machine) {
            return res.status(404).json({ message: 'Machine not found', success: false });
        }

        // 성공적으로 찾았을 경우
        res.json({
            success: true,
            data: machine
        });
    } catch (err) {
        console.error('Error fetching machine data:', err);
        res.status(500).json({ message: 'Server error', success: false });
    }
};