import { BOARD_SIZES } from '@/constants/app';

/** 棋盘尺寸的选项列表。 */
export const BOARD_SIZE_OPTIONS = BOARD_SIZES.map(size => ({
  label: `${size} × ${size}`,
  value: size,
}));

/** 默认棋盘尺寸。 */
export const DEFAULT_BOARD_SIZE = 9;
