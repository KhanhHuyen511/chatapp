import { useState } from 'react';

type UsePreviewReturn = {
  isPreview: boolean;
  handleTurnOnPreview: () => void;
  handleTurnOffPreview: () => void;
  resetPreview: () => void;
};

export const usePreview = (): UsePreviewReturn => {
  const [isPreview, setIsPreview] = useState(false);

  const handleTurnOnPreview = () => {
    setIsPreview(true);
  };

  const handleTurnOffPreview = () => {
    setIsPreview(false);
  };

  const resetPreview = () => {
    setIsPreview(false);
  };

  return {
    isPreview,
    handleTurnOnPreview,
    handleTurnOffPreview,
    resetPreview,
  };
};
