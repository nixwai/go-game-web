import type { GoBoardInstance } from '@go-board/design';

/** 棋盘组件暴露的落子与重置操作。 */
export interface GameBoardExpose {
  play: GoBoardInstance['play']
  reset: GoBoardInstance['reset']
}
