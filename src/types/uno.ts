export type CardColor = "red" | "yellow" | "green" | "blue" | "wild";
export type CardValue =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "skip"
  | "reverse"
  | "drawTwo"
  | "wild"
  | "wildDrawFour";

export interface Card {
  color: CardColor;
  value: CardValue;
}
