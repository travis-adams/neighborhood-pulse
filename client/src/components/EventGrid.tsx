import React, { FunctionComponent } from "react";
import { Grid, Card, CardActionArea, CardContent, IconButton, Typography } from "@material-ui/core";
import Event from "../domain/Event";
import useStyles from "../css";
import EventService from "../service/EventService";
import UserSaved from "../../public/user-saved.svg";
import UserUnsaved from "../../public/user-unsaved.svg";
import GroupSaved from "../../public/group-saved.svg";
import GroupUnsaved from "../../public/group-unsaved.svg";
import TabOption from "../domain/TabOption";
import User from "../domain/User";
import "datejs";

interface Props {
  events: Event[];
  setEvents: (event: Event[]) => void;
  isSignedIn: boolean;
  token: string;
  user: User;
  onlineOnly: boolean;
  tab: TabOption;
  expandedEvent: Event;
  expandEvent: (event: Event) => void;
  closeEvent: () => void;
  isEventExpanded: boolean;
}

const eventService = new EventService();

const EventGrid: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  // If the event is saved, unsave it. If it's unsaved, save it
  const handleUserSaveButton = async (event: Event) => {
    let newEvents = [...props.events];
    if (event.userSaved) {
      await eventService.userUnsaveEvent(event.id, props.user.username, props.token);
      // If in the "My Saved Events" tab, hide the event once unsaved
      if (props.tab == TabOption.MySavedEvents) {
        // filter the event out of the displayed events
        newEvents = newEvents.filter(newEvent => newEvent.id != event.id);
      }
    } else {
      await eventService.userSaveEvent(event.id, props.user.username, props.token);
    }
    // If not in the "My Saved Events" tab, locally update event as saved/unsaved
    // (provides instant update instead of needing to wait for a rerender)
    if (props.tab != TabOption.MySavedEvents) {
      for (const newEvent of newEvents) {
        if (newEvent.id === event.id) {
          newEvent.userSaved = !event.userSaved;
          break;
        }
      }
    }
    props.setEvents(newEvents);
  }

  // If the event is saved, unsave it. If it's unsaved, save it
  const handleGroupSaveButton = async (event: Event) => {
    let newEvents = [...props.events];
    if (event.groupSaved) {
      await eventService.groupUnsaveEvent(event.id, props.user.groupId, props.token);
      // If in the "My Group's Saved Events" tab, hide the event once unsaved
      if (props.tab == TabOption.MyGroupSavedEvents) {
        // filter the event out of the displayed events
        newEvents = newEvents.filter(newEvent => newEvent.id != event.id);
      }
    } else {
      await eventService.groupSaveEvent(event.id, props.user.groupId, props.token);
    }
    // If not in the "My Group's Saved Events" tab, locally update event as saved/unsaved
    // (provides instant update instead of needing to wait for a rerender)
    if (props.tab != TabOption.MyGroupSavedEvents) {
      for (const newEvent of newEvents) {
        if (newEvent.id === event.id) {
          newEvent.groupSaved = !event.groupSaved;
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
      className={props.onlineOnly ? classes.eventGridOnline : classes.eventGrid}
    >
      {props.events.map((event, index) => {
         return (
          <Grid item key={index}>
            <Card className={classes.gridCard}>
              <CardContent className={classes.gridDateAndSave}>
                <div className={classes.flexColumn}>
                  <Typography variant="h6">
                    {event.date.toString("MMM")}
                  </Typography>
                  <Typography variant="h4">
                    {event.date.toString("dd")}
                  </Typography>
                </div>
                {props.isSignedIn &&
                  <div className={classes.flex}>
                    <IconButton
                      onClick={() => handleUserSaveButton(event)}
                      size="small"
                    >
                      {event.userSaved ? <UserSaved width="35" height="35" viewBox="0 0 400 492.6014319809069"/> : <UserUnsaved width="35" height="35" viewBox="0 0 400 492.6014319809069"/>}
                    </IconButton>
                    <IconButton
                      onClick={() => handleGroupSaveButton(event)}
                      size="small"
                    >
                      {event.groupSaved ? <GroupSaved width="35" height="35" viewBox="0 0 400 409.5238095238095"/> : <GroupUnsaved width="35" height="35" viewBox="0 0 400 409.5238095238095"/>}
                    </IconButton>
                  </div>
                }
              </CardContent>
              <CardActionArea onClick={() => ((event.id === props.expandedEvent?.id) && props.isEventExpanded) ? props.closeEvent() : props.expandEvent(event)}>
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {event.name}
                  </Typography>
                  <Typography variant="body2">
                    {event.date.toString("t")}
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
