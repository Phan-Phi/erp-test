import { usePopupState } from "material-ui-popup-state/hooks";

const usePopover = ({ popupId }) => {
  const popupState = usePopupState({ variant: "popover", popupId });

  return popupState;
};

export default usePopover;
