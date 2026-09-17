import { BOARD_SIZES } from '@/constants/app';

/** 棋盘尺寸的选项列表。 */
export const BOARD_SIZE_OPTIONS = BOARD_SIZES.map(size => ({
  label: `${size} × ${size}`,
  value: size,
}));

/** 默认棋盘尺寸。 */
export const DEFAULT_BOARD_SIZE = 9;

/** 棋局历史操作按钮的统一样式。 */
export const HISTORY_ACTION_CLASS = 'min-h-9 px-3.5 text-base font-[750] text-mc-sage-680 cursor-pointer bg-mc-sage-100 border-0 rounded-pill transition-all [&:not(:disabled):hover]:!text-mc-paper-0 [&:not(:disabled):hover]:!bg-mc-sage-600 [&:not(:disabled):hover]:translate-y-[-1px] disabled:!cursor-not-allowed disabled:!opacity-[0.42]';
