import { 
  EC2Client, 
  RunInstancesCommand, 
  TerminateInstancesCommand, 
  _InstanceType as EC2InstanceType 
} from '@aws-sdk/client-ec2';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Instance from '../models/Instance';
import Machine from '../models/Machine';
import User from '../models/User';
import config from '../config/config';
import stream from 'stream';
import { promisify } from 'util';

// Configure AWS SDK v3
const ec2Client = new EC2Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId!,
    secretAccessKey: config.aws.secretAccessKey!,
  },
});

// Configure AWS SDK v3
const s3Client = new S3Client({ // Initialize S3 client
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId!,
    secretAccessKey: config.aws.secretAccessKey!,
  },
});

/**
 * Start an EC2 instance based on user's machine selection.
 */
export const startInstance = async (req: Request, res: Response) => {
  try {
    const { machineId } = req.params;
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
      return res.status(401).json("User not registered / token malfunctioned");
    }

    // Fetch the machine from the database to get the AMI ID
    const machine = await Machine.findById(machineId);
    if (!machine) {
      res.status(400).json({ msg: 'Invalid machine ID selected' });
      return;
    }
    const instance = await Instance.findOne({ user: user.id });
    if (instance) {
      res.status(400).json({ msg: 'Instance already exists' });
      return;
    }

    const ImageId = machine.amiId;
    const params = {
      ImageId,
      InstanceType: EC2InstanceType.t2_micro,
      MinCount: 1,
      MaxCount: 1,
      SecurityGroupIds: [config.aws.securityGroupId!],
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [{ Key: 'User', Value: user.id }],
        },
      ],
    };

    const runCommand = new RunInstancesCommand({
      ...params,
      TagSpecifications: [
        {
          ResourceType: 'instance' as const,
          Tags: [{ Key: 'User', Value: user.id }],
        },
      ],
    });
    const data = await ec2Client.send(runCommand);

    if (!data.Instances || data.Instances.length === 0 || !data.Instances[0].InstanceId) {
      res.status(500).json({ msg: 'Failed to create instance' });
      return;
    }

    const instanceId = data.Instances[0].InstanceId;

    // Save instance info to DB
    const newInstance = new Instance({
      user: user.id,
      instanceId,
      machineType: machine.name,
    });
    await newInstance.save();

    res.json({ msg: 'Instance is being created', instanceId });
  } catch (error) {
    console.error('Error starting instance:', error);
    res.status(500).send('Failed to create instance.');
  }
};

/**
 * Handle receiving VPN IP and updating instance status to 'running'.
 */
export const receiveVpnIp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instanceId, vpnIp } = req.body;
    console.log(instanceId, vpnIp);

    // Find the instance
    const instance = await Instance.findOne({ instanceId });
    if (!instance) {
      res.status(404).json({ msg: 'Instance not found' });
      return;
    }

    // Update instance with VPN IP and status
    instance.vpnIp = vpnIp;
    instance.status = 'running';
    await instance.save();

    res.json({ msg: 'VPN IP updated successfully' });
  } catch (error) {
    console.error('Error receiving VPN IP:', error);
    res.status(500).send('Failed to receive VPN IP.');
  }
};

/**
 * Handle flag submission, terminate instance, and clean up.
 */
export const submitFlag = async (req: Request, res: Response) => {
  try {
    const { machineId } = req.params;
    const { flag } = req.body;
    const user = await User.findById(res.locals.jwtData.id);

    if (!user) {
			return res.status(401).json("User not registered / token malfunctioned");
		}
    // Validate flag
    const isValidFlag = await validateFlag(flag, user.id, machineId);
    if (!isValidFlag) {
      res.status(400).json({ msg: 'Invalid flag' });
      return;
    }
    //find machine
    const machine = await Machine.findById(machineId);
    if (!machine) {
      res.status(400).json({ msg: 'Invalid machine ID selected' });
      return;
    }

    // Find the instance
    const instance = await Instance.findOne({ machineType: machine.name, user: user.id });
    if (!instance) {
      res.status(404).json({ msg: 'Instance not found' });
      return;
    }

    // Terminate the instance
    const terminateParams = {
      InstanceIds: [instance.instanceId],
    };
    const terminateCommand = new TerminateInstancesCommand(terminateParams);
    await ec2Client.send(terminateCommand);

    // Update instance status in DB
    instance.status = 'terminated';
    await instance.save();

    // Optionally, delete the instance record from DB
    await Instance.deleteOne({ instanceId: instance.instanceId });

    res.json({ msg: 'Flag accepted. Instance terminated.' });
  } catch (error) {
    console.error('Error submitting flag:', error);
    res.status(500).send('Failed to submit flag.');
  }
};

/**
 * Get details of all instances by machine.
 */
export const getInstanceByMachine = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwtData.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json("User not registered / token malfunctioned");
    }
    const { machineId } = req.params;
    const machine = await Machine.findById(machineId);
    if (!machine) {
      res.status(400).json({ msg: 'Invalid machine ID selected' });
      return;
    }
    const instance = await Instance.find({ user: user.id, machineType: machine.name });
    res.json({ instance });
  } catch (error) {
    console.error('Error fetching all instances:', error);  
    res.status(500).send('Server error');
  }
};

/**
 * Get all instances(Admin only)
 */
export const getAllInstances = async (req: Request, res: Response) => {
  try {
    const instances = await Instance.find();
    res.json({ instances });
  } catch (error) {
    console.error('Error fetching all instances:', error);  
    res.status(500).send('Server error');
  }
};

/**
 * Get details of a specific instance.
 */
export const getInstanceDetails = async (req: Request, res: Response) => {
  try {
    const { instanceId } = req.params;
    const userId = res.locals.jwtData.id;
    if (!userId) {
      return res.status(401).json("User not registered / token malfunctioned");
    }
    // Find the instance
    const instance = await Instance.findOne({ instanceId, user: userId });
    if (!instance) {
      res.status(404).json({ msg: 'Instance not found' });
      return;
    }

    res.json(instance);
  } catch (error) {
    console.error('Error fetching instance details:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Delete a specific instance.
 */
export const deleteInstance = async (req: Request, res: Response) => {
  try {
    const { instanceId } = req.params;
    const userId = res.locals.jwtData.id;

    if (!userId) {
      return res.status(401).json("User not registered / token malfunctioned");
    }

    // Find the instance
    const instance = await Instance.findOne({ instanceId, user: userId });
    if (!instance) {
      res.status(404).json({ msg: 'Instance not found' });
      return;
    }

    // Terminate the instance
    const terminateParams = {
      InstanceIds: [instanceId],
    };
    const terminateCommand = new TerminateInstancesCommand(terminateParams);
    await ec2Client.send(terminateCommand);

    // Update instance status in DB
    instance.status = 'terminated';
    await instance.save();

    // Optionally, delete the instance record from DB
    await Instance.deleteOne({ instanceId });

    res.json({ msg: 'Instance terminated and deleted successfully.' });
  } catch (error) {
    console.error('Error deleting instance:', error);
    res.status(500).send('Server error');
  }
};

/**
 * Validate the submitted flag.
 */
const validateFlag = async (flag: string, userId: string, machineId: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return false;
    }

    // Find the machine associated with the instance
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return false;
    }

    // Compare the submitted flag with the stored hashed flag
    const isMatch = await bcrypt.compare(flag, machine.flag);
    return isMatch;
  } catch (error) {
    console.error('Error validating flag:', error);
    return false;
  }
};

/**
 * Download OpenVPN Profile for a specific instance.
 */
export const downloadOpenVPNProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwtData.id;

    if (!userId) {
      return res.status(401).json({ msg: "User not registered / token malfunctioned" });
    }

    const bucketName = config.aws.s3BucketName;
    const key = config.aws.keyName;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const data = await s3Client.send(command);

    if (!data.Body) {
      return res.status(404).json({ msg: 'VPN profile not found.' });
    }

    // Set appropriate headers for file download
    res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="vpn-profile.ovpn"`);

    // Pipe the S3 response stream to the client
    // Convert ReadableStream to Node.js stream
    const readableStream = data.Body as unknown as stream.Readable;
    const pipeline = promisify(stream.pipeline);
    await pipeline(readableStream, res);
    
  } catch (error: any) {
    console.error('Error downloading OpenVPN profile from S3:', error);
    if (error.name === 'NoSuchKey') {
      res.status(404).json({ msg: 'VPN profile does not exist.' });
    } else {
      res.status(500).json({ msg: 'Failed to download OpenVPN profile.' });
    }
  }
};

export const terminateInstance = async (req: Request, res: Response) => {
  try {
    const { machineId } = req.params;
    const userId = res.locals.jwtData.id;

    if (!userId) {
      return res.status(401).json("User not registered / token malfunctioned");
    }
    const machine = await Machine.findById(machineId);
    if (!machine) { 
      res.status(400).json({ msg: 'Invalid machine ID selected' });
      return;
    }
    const instance = await Instance.findOne({ machineType: machine.name, user: userId });
    if (!instance) {
      res.status(404).json({ msg: 'Instance not found' });
      return;
    }

    const terminateParams = {
      InstanceIds: [instance.instanceId],
    };  
    const terminateCommand = new TerminateInstancesCommand(terminateParams);
    await ec2Client.send(terminateCommand);

    instance.status = 'terminated';
    await instance.save();

    res.json({ msg: 'Instance terminated successfully.' });
  } catch (error) {
    console.error('Error terminating instance:', error);
    res.status(500).send('Server error');
  }   
}; 
