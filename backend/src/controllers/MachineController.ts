import { Request, Response } from 'express';
import Machine from '../models/Machine';
import User from '../models/User';
import UserProgress from '../models/UserProgress';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
/**
 * Create a new machine.
 */
export const createMachine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, info, exp, hints, amiId, flag } = req.body;

    // Validate required fields
    if (!name || !category || !amiId) {
      res.status(400).json({ msg: 'Please provide name, category, and amiId.' });
      return;
    }

    // Check if machine with the same name already exists
    const existingMachine = await Machine.findOne({ name });
    if (existingMachine) {
      res.status(400).json({ msg: 'Machine with this name already exists.' });
      return;
    }
    const hashedFlag = await bcrypt.hash(flag, 10);

    const newMachine = new Machine({
      name,
      category,
      info,
      exp,
      hints,
      amiId,
      flag: hashedFlag,
    });

    await newMachine.save();
    res.status(201).json({ msg: 'Machine created successfully.', machine: newMachine });
  } catch (error: any) {
    console.error('Error creating machine:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Get all machines.
 */
export const getAllMachines = async (req: Request, res: Response): Promise<void> => {
  try {
    const machines = await Machine.find({});
    res.json({ machines });
  } catch (error: any) {
    console.error('Error fetching machines:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Get a single machine by ID.
 */
export const getMachine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { machineId } = req.params;
    const machine = await Machine.findById(machineId);
    if (!machine) {
      res.status(404).json({ msg: 'Machine not found.' });
      return;
    }
    res.json({ machine });
  } catch (error: any) {
    console.error('Error fetching machine:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Update a machine by ID.
 */
export const updateMachine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { machineId } = req.params;
    const { name, category, info, exp, hints, amiId, flag } = req.body;

    // Find the machine
    const machine = await Machine.findById(machineId);
    if (!machine) {
      res.status(404).json({ msg: 'Machine not found.' });
      return;
    }

    // Update fields if provided
    if (name) machine.name = name;
    if (category) machine.category = category;
    if (info) machine.info = info;
    if (exp !== undefined) machine.exp = exp;
    if (hints) machine.hints = hints;
    if (amiId) machine.amiId = amiId;

    await machine.save();
    res.json({ msg: 'Machine updated successfully.', machine });
  } catch (error: any) {
    console.error('Error updating machine:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Delete a machine by ID.
 */
export const deleteMachine = async (req: Request, res: Response): Promise<void> => {
  try {
    const { machineId } = req.params;

    const machine = await Machine.findByIdAndDelete(machineId);
    if (!machine) {
      res.status(404).json({ msg: 'Machine not found.' });
      return;
    }
    res.json({ msg: 'Machine deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting machine:', error);
    res.status(500).send('Server error');
  }
};

export const MachinesubmitFlag = async (req: Request, res: Response): Promise<void> => {
  try {
      const { machineId, flag } = req.body;
      const userId = res.locals.jwtData.id;
      const machine = await Machine.findById(machineId);
      if (!machine) {
          res.status(404).json({ msg: 'Machine not found.' });
          return;
      }

      // Verify if user hasn't already completed this machine
      const existingCompletion = await UserProgress.findOne({ 
          user: userId, 
          machine: machineId,
          completed: true 
      });
      
      if (existingCompletion) {
          res.status(400).json({ msg: 'Machine already completed.' });
          return;
      }

      // Verify flag
      const isMatch = await bcrypt.compare(flag, machine.flag);
      if (!isMatch) {
          res.status(400).json({ msg: 'Incorrect flag.' });
          return;
      }

      // Calculate EXP based on hints used
      const progress = await UserProgress.findOne({ user: userId, machine: machineId });
      const hintsUsed = progress ? progress.hintsUsed : 0;
      let expEarned = machine.exp;
      expEarned -= hintsUsed * 5; // 5 EXP penalty per hint

      if (expEarned < 0) expEarned = 0;

      // Update user progress and EXP
      await UserProgress.findOneAndUpdate(
          { user: userId, machine: machineId },
          { 
              completed: true,
              completedAt: new Date(),
              expEarned: expEarned
          },
          { upsert: true }
      );

      // Update user's total EXP and level
      const user = await User.findById(userId);
      if (user) {
          user.exp += expEarned;
          await (user as any).updateLevel();
          await user.save();
      }

      res.status(200).json({ 
          msg: 'Flag accepted.',
          expEarned,
          totalExp: user?.exp
      });
  } catch (error) {
      console.error('Error submitting flag:', error);
      res.status(500).send('Server error');
  }
};

export const useHint = async (req: Request, res: Response): Promise<void> => {
    try {
        const { machineId } = req.params;
        const userId = res.locals.jwtData.id;

        // Find or create user progress
        let progress = await UserProgress.findOne({ 
            user: userId, 
            machine: machineId 
        });

        if (!progress) {
            progress = new UserProgress({
                user: userId,
                machine: machineId
            });
        }

        // Increment hints used
        progress.hintsUsed += 1;
        await progress.save();

        // Get the hint content
        const machine = await Machine.findById(machineId);
        if (!machine || !machine.hints || machine.hints.length === 0) {
            res.status(404).json({ msg: 'No hints available for this machine.' });
            return;
        }

        // Get the next hint based on hintsUsed count
        const hintIndex = Math.min(progress.hintsUsed - 1, machine.hints.length - 1);
        const hint = machine.hints[hintIndex];

        res.status(200).json({ 
            msg: 'Hint revealed.',
            hint: hint.content,
            hintsUsed: progress.hintsUsed,
            remainingHints: Math.max(0, machine.hints.length - progress.hintsUsed)
        });
    } catch (error: any) {
        console.error('Error using hint:', error);
        res.status(500).send('Server error');
    }
};

export const downloadOpenVPNProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { machineId } = req.params;
    const machine = await Machine.findById(machineId);
    if (!machine) {
      res.status(404).json({ msg: 'Machine not found.' });
      return;
    }

    // Assuming the OpenVPN profiles are stored in a directory and named after the machine ID
    const profilePath = path.join(__dirname, '../../profiles', `hto_client.ovpn`);
    if (!fs.existsSync(profilePath)) {
      res.status(404).json({ msg: 'OpenVPN profile not found.' });
      return;
    }

    res.download(profilePath, `${machine.name}.ovpn`);
  } catch (error) {
    console.error('Error downloading OpenVPN profile:', error);
    res.status(500).send('Server error');
  }
};
