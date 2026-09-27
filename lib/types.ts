export type Occasion =
  | "Birthday"
  | "Graduation"
  | "Congratulations"
  | "Thank You"
  | "Miss You"
  | "Love";

export type ExperienceType = "envelope" | "gift" | "balloon" | "wish" | "secret";

export interface Gift {
  id: string;
  recipientName: string;
  message: string;
  occasion: Occasion;
  experienceType: ExperienceType;
  passwordHash: string;
  passwordHint?: string;
  creatorName?: string;
  createdAt: string;
}

export interface GiftCreateInput {
  recipientName: string;
  message: string;
  occasion: Occasion;
  experienceType: ExperienceType;
  password: string;
  passwordHint?: string;
  creatorName?: string;
}
