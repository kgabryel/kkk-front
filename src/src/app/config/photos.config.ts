export const PhotosConfig = {
  medium: 'medium',
  original: 'original',
  small: 'small',
} as const;

export type PhotosConfig = (typeof PhotosConfig)[keyof typeof PhotosConfig];
