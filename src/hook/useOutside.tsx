import { useRef, useEffect } from "react";

export const useOnOutsideClick = (handleOutsideClick: any) => {
  const innerBorderRef = useRef<HTMLDivElement | null>(null);

  const onClick = (event: any) => {
    if (
      innerBorderRef.current &&
      !innerBorderRef.current.contains(event.target)
    ) {
      handleOutsideClick();
    }
  };
  useMountEffect(() => {
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  });

  return { innerBorderRef };
};

const useMountEffect = (fun: any) => useEffect(fun, []);
