import { Tooltip } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    fontSize: theme.typography.pxToRem(14),
    whiteSpace: 'pre-line' as const,
  },
}))(Tooltip);

export default StyledTooltip;
