export interface contentInterface {
  msg: string;
  time: string | number;
  origin: string;
  id: string;
}
export interface newTalkInterface {
  id: string;
  content: Array<contentInterface>;
  label: string;
}