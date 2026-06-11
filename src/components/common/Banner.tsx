import React from 'react';
import classnames from 'classnames';

interface BannerProps {
  header: string;
  content: string;
  style?: React.CSSProperties;
  noDefaultHeight?: boolean;
  contentLine2?: string;
  isReplacementPlan?: boolean;
}

function Banner({
  header,
  content,
  style = {},
  noDefaultHeight = false,
  contentLine2,
  isReplacementPlan,
}: BannerProps) {
  return (
    <div className="banner" style={style}>
      <div
        className={classnames('banner__container', {
          'banner__container--no-default-height': noDefaultHeight,
          banner__container__highlighted: isReplacementPlan,
        })}
      >
        <div>
          <h1 className="banner__header">
            {header}
            {isReplacementPlan ? ' (Replacement Plan)' : ''}
          </h1>
          <div className="banner__content">{content}</div>
          {contentLine2 && (
            <>
              <br />
              <br />
              <div className="banner__content2">{contentLine2}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
