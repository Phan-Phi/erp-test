import { useUpdateEffect } from "react-use";
import React, { createContext, useCallback, useMemo, useRef, useState } from "react";

import { DeleteConfirmation, type DialogContentProps } from "components";

interface ConfirmationProps {
  children: React.ReactNode;
}

type ConfirmationContextProps = {
  onOpen: () => void;
  onClose: () => void;
  onConfirm: (
    cb: (...args: unknown[]) => Promise<void>,
    content: DialogContentProps
  ) => void;
};

export const ConfirmationContext = createContext<ConfirmationContextProps>({
  onOpen: () => {},
  onClose: () => {},
  onConfirm: () => {},
});

const initContent = {
  message: "",
  buttonLeft: "Hủy bỏ",
  buttonRight: "Xác nhận",
  variant: "warning",
} as const;

const Confirmation = ({ children }: ConfirmationProps) => {
  const [open, setOpen] = useState(false);
  const callback = useRef<() => Promise<void>>();

  const [content, setContent] = useState<DialogContentProps>(initContent);

  const onCloseHandler = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpenHandler = useCallback(() => {
    setOpen(true);
  }, []);

  const onConfirmHandler = useCallback(
    (
      cb: () => Promise<void>,
      {
        message,
        buttonLeft = "Hủy bỏ",
        buttonRight = "Xác nhận",
        variant = "warning",
      }: DialogContentProps
    ) => {
      callback.current = cb;
      onOpenHandler();

      setContent({ message, buttonLeft, buttonRight, variant });
    },
    []
  );

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    if (!open) {
      callback.current = undefined;

      timer = setTimeout(() => {
        setContent(initContent);
      }, 300);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [open]);

  const contextValue = useMemo(() => {
    return {
      onClose: onCloseHandler,
      onOpen: onOpenHandler,
      onConfirm: onConfirmHandler,
    };
  }, []);

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      <DeleteConfirmation
        {...{
          open,
          content,
          onClose: onCloseHandler,
          onConfirm: callback.current,
        }}
      />
    </ConfirmationContext.Provider>
  );
};

export default Confirmation;
