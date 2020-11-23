import React, { FunctionComponent } from 'react';
import { Divider, Paper, Tabs, Tab } from "@material-ui/core";
import TabOption from '../domain/TabOption';
import useStyles from '../css';

interface Props {
  isSignedIn: boolean;
  tab: TabOption;
  setTab: (newTab: TabOption) => void;
}

const TabBar: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const handleTabChange = (event: React.SyntheticEvent, newTab: TabOption) => {
      props.setTab(newTab)
  }

  return (props.isSignedIn &&
    <div>
      <Divider />
      <Paper square elevation={0}>
      <Tabs
        value={props.tab}
        onChange={handleTabChange}
        classes={{
          indicator: classes.noTabIndicator
        }}
        centered
      >
        <Tab
          label="Nearby Events"
          value={TabOption.NearbyEvents}
          classes={{
            root: classes.tabRoot,
            selected: classes.selectedTab
          }}
        />
        <Tab
          label="My Saved Events"
          value={TabOption.MySavedEvents}
          classes={{
            root: classes.tabRoot,
            selected: classes.selectedTab
          }}
        />
        <Tab
          label="My Group's Saved Events"
          value={TabOption.MyGroupSavedEvents}
          classes={{
            root: classes.tabRoot,
            selected: classes.selectedTab
          }}
        />
        <Tab
          label="My Created Events"
          value={TabOption.MyCreatedEvents}
          classes={{
            root: classes.tabRoot,
            selected: classes.selectedTab
          }}
        />
      </Tabs>
      </Paper>
    </div>
  );
}

export default TabBar;
