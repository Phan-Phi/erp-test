import { useCallback } from "react";
import { useToggle as useOriginalToggle } from "react-use";

const useToggle = () => {
  const [open, toggle] = useOriginalToggle(false);

  const onOpen = useCallback(() => {
    toggle(true);
  }, []);

  const onClose = useCallback(() => {
    toggle(false);
  }, []);

  return { open, onOpen, onClose, toggle };
};

export { useToggle };
