import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon, Menu } from 'semantic-ui-react';
import { Manager, Reference, Popper } from 'react-popper';

const RowMenu = ({ onCopy, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div ref={ref} data-testid="schedule-row-menu">
            <Icon name="ellipsis vertical" onClick={() => setIsOpen(!isOpen)} />
          </div>
        )}
      </Reference>
      {isOpen &&
        ReactDOM.createPortal(
          <Popper
            placement="left"
            positionFixed
            modifiers={{
              hide: { enabled: false },
            }}
          >
            {({ ref, style, placement, arrowProps }) => (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  onClick={() => setIsOpen(false)}
                />
                <div ref={ref} style={style} data-placement={placement}>
                  <Menu
                    vertical
                    onBlur={() => setIsOpen(false)}
                    pointing
                    compact
                  >
                    <Menu.Item
                      onClick={() => {
                        setIsOpen(false);
                        setTimeout(() => {
                          onCopy();
                        }, 0);
                      }}
                    >
                      Duplicate
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        setIsOpen(false);
                        setTimeout(() => {
                          onDelete();
                        }, 0);
                      }}
                    >
                      Delete
                    </Menu.Item>
                  </Menu>
                  <div {...arrowProps} />
                </div>
              </>
            )}
          </Popper>,
          document.body,
        )}
    </Manager>
  );
};

export default RowMenu;
