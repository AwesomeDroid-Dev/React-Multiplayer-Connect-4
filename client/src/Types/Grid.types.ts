export interface GameContextType {
  grid: XO[];
  setGrid: React.Dispatch<React.SetStateAction<XO[]>>;
  turn: 'X'|'O';
  setTurn: React.Dispatch<React.SetStateAction<('X'|'O')>>;
  latestChange: number;
  setLatestChange: React.Dispatch<React.SetStateAction<(number)>>;
  moves: any;
  setMoves: any;
  theme: 'original'|'new';
  setTheme: React.Dispatch<React.SetStateAction<'original'|'new'>>;
  event: string;
  setEvent: React.Dispatch<React.SetStateAction<string>>
}

export type XO = ('X'|'O'|'')