import React, { useEffect, useRef, ReactNode } from 'react';
import { ELEMENT_ID } from '../../constants/variables';

interface StickyHeaderProps {
  children?: ReactNode;
}

const StickyHeader = ({ children }: StickyHeaderProps) => {
  const stickyOffsetTopRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById(ELEMENT_ID.RUP_STICKY_HEADER);
      if (!header) return;
      if (stickyOffsetTopRef.current === null) {
        stickyOffsetTopRef.current = header.offsetTop;
      }
      if (window.pageYOffset > stickyOffsetTopRef.current) {
        header.classList.add('rup__sticky--fixed');
      } else {
        header.classList.remove('rup__sticky--fixed');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id={ELEMENT_ID.RUP_STICKY_HEADER} className="rup__sticky">
      {children}
    </div>
  );
};

export default StickyHeader;
