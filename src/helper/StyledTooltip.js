import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: theme.typography.pxToRem(14),
    whiteSpace: 'pre-line',
  },
}))(Tooltip);

export default StyledTooltip;
