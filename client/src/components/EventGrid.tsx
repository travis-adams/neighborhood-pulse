import React, { FunctionComponent } from 'react';
import { Grid, Card, Button } from '@material-ui/core';
import Event from "../domain/Event";
import useStyles from "../css";

interface Props {
  events: Event[];
  signedIn: boolean;
  token: string;
  username: string;
  setEvents: (event: Event[]) => void;
};

const EventGrid: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

const handleSaveButton = (event: Event) => {
  event.saved = !(event.saved);
  var newEvents = [...props.events];

  props.setEvents(newEvents);
};

  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      className={classes.eventGrid}
    >
      {props.events.map((event, index) => {
         return (
          <Grid
            container
            direction="row"
            key={index}
          >
            <Card className={classes.event}>
              <Grid>
                <div className={classes.eventDate}>
                    <h2>SEP</h2>
                    <h2>23</h2>
                
                  {props.signedIn  &&
                  <Button 
                  onClick = {() => handleSaveButton(event)}
                    size="small"
                    color="secondary"
                  >
                    {event.saved ? "Unsave" : "Save"}
                  </Button>
      }   
              </div>
              </Grid>
              <div className={classes.eventDetails}>
                <h2>{event.name}</h2>
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
