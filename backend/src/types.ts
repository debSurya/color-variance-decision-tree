export type Answer = {
  key: number;
  val: string;
};

export type Question = {
  type: string;
  question: string;
  answers: Answer[];
};

export interface QueryArgs {
  qn: string;
  ans: string[];
}
