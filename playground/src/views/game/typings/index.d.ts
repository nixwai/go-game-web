import type { GoBoardInstance } from '@go-board/design';

export interface GameBoardExpose {
  play: GoBoardInstance['play']
  reset: GoBoardInstance['reset']
}
