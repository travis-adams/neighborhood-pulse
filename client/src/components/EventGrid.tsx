import React, { FunctionComponent } from 'react';
import { Grid, Card, Button } from '@material-ui/core';
import Event from "../domain/Event";
import useStyles from "../css";
import EventService from "../service/EventService";

interface Props {
  events: Event[];
  setEvents: (event: Event[]) => void;
  signedIn: boolean;
  token: string;
  username: string;
};

const eventService = new EventService();

const EventGrid: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const handleSaveButton = async (event: Event) => {
    // if the event is currently saved, unsave it. if it's unsaved, save it
    if (event.saved) {
      await eventService.unsaveEvent(event.id, props.username, props.token);
    } else {
      await eventService.saveEvent(event.id, props.username, props.token);
    }
    // set the frontend "saved" value manually. otherwise we'd have to wait until the page refreshes for the "save"/"unsave" button to update
    var newEvents = [...props.events];
    for (let newEvent of newEvents) {
      if (newEvent.id == event.id) {
        newEvent.saved = !event.saved;
        break;
      }
    }
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
                  {props.signedIn &&
                    <Button
                     onClick={() => handleSaveButton(event)}
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
