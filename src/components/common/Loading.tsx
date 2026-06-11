import React from 'react';
import { Loader, Dimmer, SemanticSIZES } from 'semantic-ui-react';

interface LoadingProps {
  inverted?: boolean;
  active?: boolean;
  message?: string;
  onlySpinner?: boolean;
  size?: SemanticSIZES;
  containerProps?: Record<string, any>;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  active = true,
  inverted = true,
  message = '',
  onlySpinner = false,
  containerProps,
}) => {
  if (onlySpinner) {
    return (
      <div className="loading-spinner__container" {...containerProps}>
        <Loader active={active} size={size} content={message} />
      </div>
    );
  }

  return (
    <Dimmer active={active} inverted={inverted} {...containerProps}>
      <Loader size={size} content={message} />
    </Dimmer>
  );
};

export default Loading;
