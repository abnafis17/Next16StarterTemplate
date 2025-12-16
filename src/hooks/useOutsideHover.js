import { useEffect } from "react";

export const useOnOutsideHover = (ref, handler) => {
  useEffect(() => {
    const handleHover = (event) => {
      const el = ref?.current;
      if (!el || el.contains(event?.target || null)) {
        return;
      }

      handler(event); // Call the handler only if the hover is outside of the element passed.
    };

    const handleTouch = (event) => {
      if (!ref?.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event); // Call the handler only if the touch is outside of the element passed.
    };

    document.addEventListener("mouseover", handleHover);
    document.addEventListener("touchstart", handleTouch);

    return () => {
      document.removeEventListener("mouseover", handleHover);
      document.removeEventListener("touchstart", handleTouch);
    };
  }, [ref, handler]); // Reload only if ref or handler changes
};
