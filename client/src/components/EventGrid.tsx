import React, { FC } from 'react';
import { Paper, Grid, Card, CardContent, CardActionArea, Button, CardMedia } from '@material-ui/core';
import useStyles from "../css";

const EventGrid: FC = () => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      className={classes.eventGrid}
    >
      {
       // until event card is made, just putting 20 placeholders here
        Array.from({length: 20}, (v, i) => {return (
          <Grid
            container
            direction="row"
          >
            <Card key={i} className={classes.event}>
              <Grid>
                <div className={classes.eventDate}>
                    <h2>SEP</h2>
                    <h2>23</h2>
                </div>
                  <Button 
                    size="small"
                    color="secondary"
                  >
                    Save
                  </Button>
              </Grid>
              <div className={classes.eventDetails}>
                <h2>Event</h2>
                <p>day and time</p>
                <p>address</p>
                <p>Atlanta, GA</p>
              </div>
            </Card>
          </Grid>
          )}
        )
      }
    </Grid>
  )
};

export default EventGrid;
