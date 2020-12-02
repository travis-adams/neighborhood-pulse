import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import React, { FunctionComponent, useState } from 'react';
import useStyles from '../css';
import Event from '../domain/Event';
import Filters from '../domain/Filters';
import { Card, CardContent, CardHeader, Divider, IconButton, TextField, Button, FormControlLabel, Switch,
  Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@material-ui/core';
import { AccessTime, RoomOutlined, LinkOutlined, Close, LocalOfferOutlined } from '@material-ui/icons';
import AddressField from './AddressField';
import Alert from '@material-ui/lab/Alert';
import EventService from "../service/EventService";
import TabOption from '../domain/TabOption';

interface Props {
  expandEvent: (event: Event) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  filters: Filters;
  categories: string[];
  token: string;
  username: string;
  setTab: (newTab: TabOption) => void;
}

const eventService = new EventService();
// set in the database
const MAX_DESC_LENGTH = 1500;

const CreateEventWindow: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  // fields
  const [title, setTitle] = useState<string>("");
  const [cat, setCat] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [address, setAddress] = useState<google.maps.places.AutocompletePrediction | null>(null); // full google.maps object of the selected address
  const [addressLatLng, setAddressLatLng] = useState<google.maps.LatLng | null>(null);            // lat & lng of the selected address
  const [addressString, setAddressString] = useState<string | null>(null);                        // street address of the selected address
  const [online, setOnline] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  // validation
  const [titleValid, setTitleValid] = useState<boolean>(true);
  const [dateValid, setDateValid] = useState<boolean>(true);
  const [addressValid, setAddressValid] = useState<boolean>(true);
  const [linkValid, setLinkValid] = useState<boolean>(true);
  const [descValid, setDescValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // unsaved changes
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState<boolean>(false);

  const closeToast = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsToastOpen(false);
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setTitleValid(true);
  }

  const handleCatChange = (event: React.ChangeEvent<HTMLInputElement>, input: string) => {
    setCat(input);
  }

  const handleDateChange = (date_: Date) => {
    setDate(date_);
    setDateValid(true);
  }

  const handleOnlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnline(event.target.checked)
    if (event.target.checked) {
      setAddressValid(true);
    }
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
    setLinkValid(true);
  }

  const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value);
    setDescValid(true);
  }

  // Validates fields and returns whether all are valid
  const validateFields = (): boolean => {
    let valid = true;
    if (title == null || title == "") {
      setTitleValid(false);
      valid = false;
    }
    if (date == null) {
      setDateValid(false);
      valid = false;
    }
    if (address == null && !online) {
      setAddressValid(false);
      valid = false;
    }
    // should also validate that it's a real link
    if (link == null || link == "") {
      setLinkValid(false);
      valid = false;
    }
    if (desc.length > MAX_DESC_LENGTH) {
      setDescValid(false);
      valid = false;
    }
    return valid;
  }

  // Returns whether any fields have been modified
  const fieldsDirty = (): boolean => {
    return ((title != null && title != "")
        || (cat != null && cat != "")
        || date != null
        || address != null
        || (link != null && link != "")
        || (desc != null && desc != ""));
  }

  const resetFields = () => {
    // fields
    setTitle("");
    setCat("");
    setDate(null);
    setAddress(null);
    setAddressString(null);
    setAddressLatLng(null);
    setOnline(false);
    setLink("");
    setDesc("");
    // validation
    setTitleValid(true);
    setDateValid(true);
    setAddressValid(true);
    setLinkValid(true);
    setDescValid(true);
    setErrorMessage("");
  }

  // "Discard" option of the unsaved changes dialog
  const handleDiscard = () => {
    resetFields();
    setUnsavedDialogOpen(false);
    props.setOpen(false);
  }

  // "Cancel" option of the unsaved changes dialog
  const handleCancel = () => {
    setUnsavedDialogOpen(false);
  }

  // Called when the user attempts to close the create window.
  // Will open an unsaved changes dialog if any fields are dirty
  const close = () => {
    if (fieldsDirty()) {
      setUnsavedDialogOpen(true);
    } else {
      props.setOpen(false);
      resetFields();
    }
  }

  const createEvent = async () => {
    try {
      // Cancel submission if any fields are invalid
      if (!validateFields()) {
        throw new Error("Some fields are missing or invalid.")
      }
      const event: Event = {
        name: title,
        desc: desc,
        date: date,
        location: online ? "Online" : address.structured_formatting.main_text,
        address: online ? "Online" : addressString,
        category: cat,
        link: link,
        position: online ? null : addressLatLng
      };
      const newEvent = await eventService.submitEvent(event, props.username, props.token);
      props.setTab(TabOption.MyCreatedEvents);
      props.expandEvent(newEvent);
      props.setOpen(false);
      resetFields();
      // Display confirmation toast
      setIsToastOpen(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div>
      <Dialog open={props.open} onClose={close} scroll="body" fullWidth maxWidth="md">
        <Card >
          <CardHeader
            className={classes.cardHeader}
            title="Create Event"
            action={
              <IconButton onClick={close}>
                <Close/>
              </IconButton>
            }
          />
          <CardContent>
            <TextField
              required
              error={!titleValid}
              helperText={titleValid ? null : "Title is required"}
              fullWidth
              variant="filled"
              label="Title"
              value={title}
              onChange={handleTitleChange}
            />
            <Divider className={classes.marginTop15}/>
            <div className={classes.eventFields}>
              <div className={classes.createCat}>
                <LocalOfferOutlined className={classes.marginRight10} />
                <Autocomplete
                  freeSolo
                  options={props.categories}
                  className={classes.createCatWidth}
                  onInputChange={handleCatChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" variant="filled" />
                  )}
                />
              </div>
              <div className={classes.createDateAndLink}>
                <AccessTime className={classes.marginRight10} />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    required
                    error={!dateValid}
                    helperText={dateValid ? null : "Date is required"}
                    format="yyyy-MM-dd"
                    label="Date"
                    inputVariant="filled"
                    value={date}
                    onChange={handleDateChange}
                    className={classes.marginRight10}
                  />
                  <TimePicker
                    required
                    error={!dateValid}
                    helperText={dateValid ? null : "Time is required"}
                    label="Time"
                    inputVariant="filled"
                    value={date}
                    onChange={handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className={classes.createAddressOnline}>
                <RoomOutlined className={classes.marginRight10}/>
                <AddressField
                  valid={addressValid}
                  setValid={setAddressValid}
                  online={online}
                  variant="filled"
                  label="Address"
                  value={address}
                  setValue={setAddress}
                  setAddressLatLng={setAddressLatLng}
                  setAddressString={setAddressString}
                />
                <FormControlLabel
                  checked={online}
                  onChange={handleOnlineChange}
                  control={<Switch color="primary" />}
                  label="Online"
                  labelPlacement="top"
                />
              </div>
              <div className={classes.createDateAndLink}>
                <LinkOutlined className={classes.marginRight10}/>
                <TextField
                  required
                  error={!linkValid}
                  helperText={linkValid ? null : "Link is required"}
                  fullWidth
                  variant="filled"
                  label="Link"
                  value={link}
                  onChange={handleLinkChange}
                />
              </div>
            </div>
            <Divider/>
            <TextField
              className={classes.marginTop15}
              error={!descValid}
              helperText={descValid ? null : "Description cannot exceed 1500 characters"}
              rows={5}
              multiline
              fullWidth
              variant="filled"
              label="Description"
              value={desc}
              onChange={handleDescChange}
            />
            <div className={classes.buttonsRight}>
              <Button
                color="primary"
                size="large"
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.submitButton}
                onClick={createEvent}
              >
                Create
              </Button>
            </div>
          </CardContent>
        </Card>
        {errorMessage && <Alert severity="error" variant="filled">{errorMessage}</Alert>}
      </Dialog>
      <Dialog
        open={unsavedDialogOpen}
        onClose={handleCancel}
      >
        <DialogTitle>{"Unsaved changes"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Do you want to discard them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDiscard} color="primary">
            Discard
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        className={classes.createToast}
        open={isToastOpen}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert onClose={closeToast} severity="success">
          Event created
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CreateEventWindow;
