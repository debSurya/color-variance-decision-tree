export interface IAnswerParams {
  qn: string;
  ans: string[];
  next: boolean;
}

export interface IQuestion {
  key: string;
  type: string;
  question: string;
  answers: { key: string; val: string }[];
  next: boolean;
}

export interface ISuggestion {
  suggestions: string[];
}

export interface IMetadata {
  index?: number;
  total?: number;
}
