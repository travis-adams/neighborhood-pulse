import React, { FunctionComponent } from 'react';
import { Button, Menu } from '@material-ui/core';
import useStyles from '../css';

interface Props {
  anchorEl: HTMLElement;
  setAnchorEl: (element: HTMLElement) => void;
  close: () => void;
  signOut: () => void;
  openUserInfo: () => void
}

const UserMenu: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  return (
    <Menu
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.close}
      anchorReference="anchorPosition"
      // anchorPosition and transformOrigin handle the position of the filter menu dropdown
      anchorPosition={{
        top: (props.anchorEl?.getBoundingClientRect().bottom === undefined) ? 0 : props.anchorEl?.getBoundingClientRect().bottom,
        left: props.anchorEl?.getBoundingClientRect().right
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <div className={classes.userMenu}>
        <Button
          className={classes.manageAccountButton}
          variant="contained"
          color="primary"
          onClick={props.openUserInfo}
        >
          Manage Account
        </Button>
        <Button
          className={classes.signOutButton}
          variant="contained"
          color="primary"
          onClick={props.signOut}
        >
          Sign Out
        </Button>
      </div>
    </Menu>
  );
}

export default UserMenu;
