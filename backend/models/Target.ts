import { TargetType, VerificationStatus } from "../types/scanner";

export interface ITarget {
  id: string;
  name: string;
  url: string;
  type: TargetType;
  verificationToken: string;
  verificationStatus: VerificationStatus;
  verificationStatusDetails?: string;
  verifiedAt?: string;
  lastScanAt?: string;
  currentRiskScore?: number;
}

export class Target implements ITarget {
  id: string;
  name: string;
  url: string;
  type: TargetType;
  verificationToken: string;
  verificationStatus: VerificationStatus;
  verificationStatusDetails?: string;
  verifiedAt?: string;
  lastScanAt?: string;
  currentRiskScore?: number;

  constructor(data: ITarget) {
    this.id = data.id;
    this.name = data.name;
    this.url = data.url;
    this.type = data.type;
    this.verificationToken = data.verificationToken;
    this.verificationStatus = data.verificationStatus;
    this.verificationStatusDetails = data.verificationStatusDetails;
    this.verifiedAt = data.verifiedAt;
    this.lastScanAt = data.lastScanAt;
    this.currentRiskScore = data.currentRiskScore;
  }
}
