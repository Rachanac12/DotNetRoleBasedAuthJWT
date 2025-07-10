export interface UserDetail {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
    phoneNumber: string;
    twoFactorEnabled: boolean;
    phoneNumberConfirmed: boolean;
    accessFailedCount: number;
  }