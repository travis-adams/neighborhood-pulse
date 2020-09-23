import React, { FC } from 'react';
import { Paper, Grid } from '@material-ui/core';
import useStyles from "../css";

const EventGrid: FC = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      spacing={1}
      wrap="nowrap"
      className={classes.eventGrid}
    >
      { // until event card is made, just putting 20 placeholders here
        Array.from({length: 20}, (v, i) => {return (
          <Grid item key={i}>
            <Paper className={classes.event}>
              <div className={classes.eventDetails}>
                <h3>Event</h3>
                <p>description</p>
              </div>
            </Paper>
          </Grid>
          )}
        )
      }
    </Grid>
  )
};

export default EventGrid;
