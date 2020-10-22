import React, { FunctionComponent } from 'react';
import { Grid, Card, Button, Link } from '@material-ui/core';
import Event from "../domain/Event";
import useStyles from "../css";
import EventService from "../service/EventService";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import IconButton from '@material-ui/core/IconButton';

interface Props {
  events: Event[];
  setEvents: (event: Event[]) => void;
  signedIn: boolean;
  token: string;
  username: string;
  onlineOnly: boolean;
  savedOnly: boolean;
};

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

const eventService = new EventService();

const EventGrid: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  // If the event is saved, unsave it. If it's unsaved, save it
  const handleSaveButton = async (event: Event) => {
    var newEvents = [...props.events];
    if (event.saved) {
      await eventService.unsaveEvent(event.id, props.username, props.token);
      // If "Saved Events" is checked, hide the event once unsaved
      if (props.savedOnly) {
        newEvents = newEvents.filter(newEvent => newEvent.id != event.id);
      }
    } else {
      await eventService.saveEvent(event.id, props.username, props.token);
    }
    // If "Saved Events" filter not checked, locally update event as saved/unsaved
    // (provides instant update instead of needing to wait for a rerender)
    if (!props.savedOnly) {
      for (let newEvent of newEvents) {
        if (newEvent.id == event.id) {
          newEvent.saved = !event.saved;
          break;
        }
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
                    <IconButton 
                      onClick={() => handleSaveButton(event)}
                    >
                      {event.saved ? <IconButton aria-label = "unsave"> <BookmarkIcon /></IconButton> : <IconButton aria-label = "save"> <BookmarkBorderIcon /></IconButton>}
                    </IconButton>
                    
                  }
                </div>
              </Grid>
              <div className={classes.eventDetails}>
                <Link target="_blank" rel="noopener noreferrer" href={event.link}>
                  <h2>{event.name}</h2>
                </Link>
                <p>{event.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                {!props.onlineOnly &&
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
