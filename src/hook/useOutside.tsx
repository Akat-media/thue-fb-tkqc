import { useRef, useEffect } from 'react';

export const useOnOutsideClick = (handleOutsideClick: any) => {
  const innerBorderRef = useRef<HTMLDivElement | null>(null);

  const onClick = (event: any) => {
    const target = event.target as HTMLElement;

    const clickedOutside =
      innerBorderRef.current && !innerBorderRef.current.contains(target);

    const clickedOnCalendar =
      target.closest('.rdrCalendarWrapper') ||
      target.closest('.react-datepicker') ||
      target.closest('.MuiPickersPopper-root') ||
      target.closest('.ant-picker-dropdown');

    if (clickedOutside && !clickedOnCalendar) {
      handleOutsideClick();
    }
  };

  useMountEffect(() => {
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
    };
  });

  return { innerBorderRef };
};

const useMountEffect = (fun: any) => useEffect(fun, []);
