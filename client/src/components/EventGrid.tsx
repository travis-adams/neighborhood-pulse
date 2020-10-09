import React, { FunctionComponent } from 'react';
import { Grid, Card, Button, Link } from '@material-ui/core';
import Event from "../domain/Event";
import useStyles from "../css";
import EventService from "../service/EventService";

interface Props {
  events: Event[];
  setEvents: (event: Event[]) => void;
  signedIn: boolean;
  token: string;
  username: string;
  online: boolean;
};

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Novr", "Dec"];

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
                  <h2>{monthsShort[event.date.getMonth()]}</h2>
                  <h2>{('0' + event.date.getDate()).slice(-2)}</h2>
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
                <Link target="_blank" rel="noopener noreferrer" href={event.link}>
                  <h2>{event.name}</h2>
                </Link>
                <p>{event.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                {!props.online &&
                  <div>
                    <p>Address</p>
                    <p>City, State</p>
                  </div>
                }
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
