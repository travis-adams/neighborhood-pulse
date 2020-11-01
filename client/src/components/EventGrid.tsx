import React, { FunctionComponent } from 'react';
import { Grid, Card, CardActionArea, CardContent, IconButton, Typography } from '@material-ui/core';
import Event from "../domain/Event";
import useStyles from "../css";
import EventService from "../service/EventService";
import { Bookmark, BookmarkBorder } from '@material-ui/icons';

interface Props {
  events: Event[];
  setEvents: (event: Event[]) => void;
  signedIn: boolean;
  token: string;
  username: string;
  onlineOnly: boolean;
  savedOnly: boolean;
  expandedEvent: Event;
  expandEvent: (event: Event) => void;
  closeEvent: () => void;
  isEventExpanded: boolean;
}

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const eventService = new EventService();

const EventGrid: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  // If the event is saved, unsave it. If it's unsaved, save it
  const handleSaveButton = async (event: Event) => {
    let newEvents = [...props.events];
    if (event.saved) {
      await eventService.unsaveEvent(event.id, props.username, props.token);
      // If "Saved Events" is checked, hide the event once unsaved
      if (props.savedOnly) {
        // filter the event out of the displayed events
        newEvents = newEvents.filter(newEvent => newEvent.id != event.id);
      }
    } else {
      await eventService.saveEvent(event.id, props.username, props.token);
    }
    // If "Saved Events" filter not checked, locally update event as saved/unsaved
    // (provides instant update instead of needing to wait for a rerender)
    if (!props.savedOnly) {
      for (const newEvent of newEvents) {
        if (newEvent.id === event.id) {
          newEvent.saved = !event.saved;
          break;
        }
      }
    }
    props.setEvents(newEvents);
  }

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
              <CardContent style={{textAlign: 'center', backgroundColor: '#eeeeff'}}>
                <Typography variant="h6">
                  {monthsShort[event.date.getMonth()]}
                </Typography>
                <Typography variant="h4">
                  {('0' + event.date.getDate()).slice(-2)}
                </Typography>
                {props.signedIn &&
                  <IconButton
                    onClick={() => handleSaveButton(event)}
                    size="small"
                    color="primary"
                    style={{marginLeft: -7, marginRight: -7}}
                  >
                    {event.saved ? <Bookmark style={{fontSize: 35}} /> : <BookmarkBorder style={{fontSize: 35}} />}
                  </IconButton>
                }
              </CardContent>
              <CardActionArea onClick={() => ((event.id === props.expandedEvent?.id) && props.isEventExpanded) ? props.closeEvent() : props.expandEvent(event)}>
                <CardContent style={{textOverflow: "ellipsis"}}>
                  <Typography variant="h6" noWrap>
                    {event.name}
                  </Typography>
                  <Typography variant="body2">
                    {event.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </Typography>
                  {!props.onlineOnly &&
                    <div>
                      <Typography variant="body2">
                        {event.location}
                      </Typography>
                      <Typography variant="body2">
                        {event.address}
                      </Typography>
                    </div>
                  }
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          )}
        )
      }
    </Grid>
  )
}

export default EventGrid;
