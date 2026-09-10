import { BOARD_SIZES } from '@/constants/app';

export const BOARD_SIZE_OPTIONS = BOARD_SIZES.map(size => ({
  label: `${size} × ${size}`,
  value: size,
}));

export const DEFAULT_BOARD_SIZE = 9;
