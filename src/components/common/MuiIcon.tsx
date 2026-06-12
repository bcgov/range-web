import React from 'react';
import AccessTime from '@mui/icons-material/AccessTime';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeft';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CameraAlt from '@mui/icons-material/CameraAlt';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import Check from '@mui/icons-material/Check';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Edit from '@mui/icons-material/Edit';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import ExploreOutlined from '@mui/icons-material/ExploreOutlined';
import HelpOutlined from '@mui/icons-material/HelpOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowLeft from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRight from '@mui/icons-material/KeyboardDoubleArrowRight';
import LocationOn from '@mui/icons-material/LocationOn';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import MoreVert from '@mui/icons-material/MoreVert';
import Person from '@mui/icons-material/Person';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import Print from '@mui/icons-material/Print';
import RemoveCircleOutlined from '@mui/icons-material/RemoveCircleOutlined';
import Save from '@mui/icons-material/Save';
import Star from '@mui/icons-material/Star';
import WarningAmber from '@mui/icons-material/WarningAmber';

const iconMap: Record<string, React.ElementType> = {
  'add circle': AddCircleOutlined,
  'angle down': KeyboardArrowDown,
  'angle double left': KeyboardDoubleArrowLeft,
  'angle double right': KeyboardDoubleArrowRight,
  'angle left': ChevronLeft,
  'angle right': ChevronRight,
  'arrow circle left': ArrowCircleLeft,
  'arrow left': ArrowBack,
  camera: CameraAlt,
  check: Check,
  'check circle': CheckCircleOutlined,
  'check square': CheckBoxOutlined,
  checkmark: Check,
  'clock outline': AccessTime,
  close: Close,
  compass: ExploreOutlined,
  edit: Edit,
  'ellipsis horizontal': MoreHoriz,
  'ellipsis vertical': MoreVert,
  'file pdf outline': PictureAsPdf,
  'long arrow alternate right': ArrowForward,
  'map marker alternate': LocationOn,
  'minus circle': RemoveCircleOutlined,
  pencil: Edit,
  'plus circle': AddCircleOutlined,
  print: Print,
  question: HelpOutlined,
  'question circle outline': HelpOutlined,
  remove: Close,
  'remove circle': CancelOutlined,
  save: Save,
  star: Star,
  times: Close,
  trash: DeleteOutlined,
  user: Person,
  'user circle': AccountCircle,
  'user outline': PersonOutlined,
  warning: WarningAmber,
  'warning circle': ErrorOutlined,
  'warning sign': WarningAmber,
};

interface MuiIconProps {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'big' | 'huge';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const sizeMap: Record<string, { fontSize: string }> = {
  small: { fontSize: '1rem' },
  medium: { fontSize: '1.25rem' },
  large: { fontSize: '1.5rem' },
  big: { fontSize: '2rem' },
  huge: { fontSize: '3rem' },
};

function MuiIcon({ name, size = 'medium', color, className, style, onClick }: MuiIconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return <span className={className} style={style} />;
  }

  const muiColor = color === 'black' ? undefined : (color as any);

  return (
    <IconComponent className={className} style={{ ...sizeMap[size], ...style }} color={muiColor} onClick={onClick} />
  );
}

export default MuiIcon;
