export type Wallet = {
  id: number;
  name: string;
  network: string;
  currency: string;
  address: string;
};

export type UserBalance = {
  asset: string;
  available: string;
  locked: string;
  margin?: string;
};

export type UserPlan = {
  current: string | null;
  next: string | null;
  remaining: string;
  netDeposits: string;
};

export type UserProfile = {
  id: number;
  email: string;
  username: string;
  phone: string;
  name: string | null;
  surname: string | null;
  isActive: boolean;
};

export type UserSettings = {
  id: number;
  userId: number;
  is2FAEnabled: boolean;
  newsAndOffers: boolean;
  accessToTransactionData: boolean;
  accessToGeolocation: boolean;
  preferences: string;
};

export type UserAddress = {
  id: number;
  userId: number;
  country: string | null;
  city: string | null;
  address: string | null;
  zip: string | null;
};

export type FundingType = "DEPOSIT" | "WITHDRAWAL";
export type FundingStatus = "PENDING" | "COMPLETED" | "CANCELED";
export type FundingCreatedBy = "USER" | "ADMIN" | "PLATFORM";

export type FundingRequest = {
  id: number;
  userId: number;
  type: FundingType;
  status: FundingStatus;
  asset: string;
  amount: string;
  destination: string;
  createdBy: FundingCreatedBy;
  message: string | null;
  createdAt: number;
  updatedAt: number;
};

export type FundingRequestInput = {
  amount: number;
  asset?: string;
};

export type WithdrawRequestInput = FundingRequestInput & {
  destination: string;
};

export type DepositRequestInput = FundingRequestInput & {
  walletId: number;
};

export type KycFile = {
  id: number;
  kind: "front" | "back" | "selfie";
  filename: string;
  contentType: string;
  size: number;
};

export type KycRequest = {
  id: number;
  userId: number;
  docType: string;
  country: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason: string | null;
  createdAt: number;
  updatedAt: number;
  files: KycFile[];
};

export type FileUploadState = {
  file: File;
  name: string;
  size: number;
  previewUrl: string | null;
};
