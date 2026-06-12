import React, { useState, useRef } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiIcon from './MuiIcon';

interface InfoTipProps {
  header?: string;
  content?: React.ReactNode;
  size?: string;
}

const style = {
  backgroundColor: '#002C71',
  color: 'white',
  maxWidth: 320,
  p: 2,
};

function InfoTip({ header, content, size = 'small' }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      <span
        ref={anchorRef}
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
      >
        <MuiIcon name="question circle outline" color="grey" size={size as any} />
      </span>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{ paper: { sx: style } }}
      >
        {header && <Typography sx={{ fontWeight: 'bold', mb: 0.5, color: 'white' }}>{header}</Typography>}
        {content && <Box sx={{ color: 'white' }}>{content}</Box>}
      </Popover>
    </>
  );
}

export default InfoTip;
