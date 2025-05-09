/**
 * Interface representing a machine associated with a contest.
 */
export interface Machine {
  _id: string;
  name: string;
}

export interface Contest {
  _id: string;
  name: string;
}

/**
 * Interface representing the details of a contest.
 */
export interface ContestDetail {
  _id: string;
  name: string;
  description: string;
  contestExp: number;
  machines: Machine[];
  startTime: string;
  endTime: string;
  isActive: boolean;
}

/**
 * Interface representing the status of a contest.
 */
export interface ContestStatus {
  isActive: boolean;
  isStarted: boolean;
  isEnded: boolean;
}

/**
 * Interface representing the contest banner.
 */
export interface ContestBannerItem {
  _id: string;
  name: string;
  contestExp: number;
  startTime: string;
  endTime: string;
}
