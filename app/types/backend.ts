export type PlayerRead = {
  id: number;
  game_id: number;
  name: string;
  is_host: boolean;
  continent: string;
};

export type GameRead = {
  id: number;
  name: string;
  stage: number;
  join_code: string;
  host_name: string;
  players?: PlayerRead[] | null;
  websocket_url?: string | null;
};

export type ApiSuccess<T> = {
  status: "success";
  data: T;
};
