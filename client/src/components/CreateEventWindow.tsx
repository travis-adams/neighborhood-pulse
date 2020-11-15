import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import React, { FunctionComponent, useState } from 'react';
import useStyles from '../css';
import Event from '../domain/Event';
import Filters from '../domain/Filters';
import { Card, CardContent, CardHeader, Divider, IconButton, TextField, Button, FormControlLabel,
  Switch, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@material-ui/core';
import { AccessTime, RoomOutlined, LinkOutlined, Close, LocalOfferOutlined } from '@material-ui/icons';
import AddressField from './AddressField';

interface Props {
  expandEvent: (event: Event) => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  filters: Filters;
  categories: string[];
  submitEvent: (event: Event) => void;
}

const CreateEventWindow: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  // fields
  const [title, setTitle] = useState<string>("");
  const [cat, setCat] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [address, setAddress] = useState<google.maps.places.AutocompletePrediction | null>(null);
  const [addressString, setAddressString] = useState<string | null>(null);
  const [addressLatLng, setAddressLatLng] = useState<google.maps.LatLng | null>(null);
  const [online, setOnline] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  // unsaved changes
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState<boolean>(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const handleCatChange = (event: React.ChangeEvent<HTMLInputElement>, input: string) => {
    setCat(input);
  }

  const handleDateChange = (date_: Date) => {
    setDate(date_);
  }

  const handleOnlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnline(event.target.checked)
  }

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  }

  const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value);
  }

  const isDirty = (): boolean => {
    return ((title != null && title != "")
        || (cat != null && cat != "")
        || date != null
        || address != null
        || (addressString != null && addressString != "")
        || addressLatLng != null
        || (link != null && link != "")
        || (desc != null && desc != ""));
  }

  const resetFields = () => {
    setTitle("");
    setCat("");
    setDate(null);
    setAddress(null);
    setAddressString(null);
    setAddressLatLng(null);
    setOnline(false);
    setLink("");
    setDesc("");
  }

  // "Discard" option of the unsaved changes dialog
  const handleDiscard = () => {
    resetFields();
    setUnsavedDialogOpen(false);
    props.setIsCreateOpen(false);
  }

  // "Cancel" option of the unsaved changes dialog
  const handleCancel = () => {
    setUnsavedDialogOpen(false);
  }

  const closeCreateWindow = () => {
    if (isDirty()) {
      setUnsavedDialogOpen(true);
    } else {
      setOnline(false); // the online switch isn't checked for dirty since it's just a switch. setting it false here in case it was switched to true
      props.setIsCreateOpen(false);
    }
  }

  const createEvent = () => {
    const event: Event = {
      name: title,
      desc: desc,
      date: date,
      location: online ? "Online" : address.structured_formatting.main_text,
      address: online ? "Online" : addressString,
      category: cat,
      link: link,
      position: {lat: online ? null : addressLatLng.lat(), lng: online ? null : addressLatLng.lng()} as google.maps.LatLngLiteral
    };
    props.submitEvent(event);
    resetFields();
    props.setIsCreateOpen(false);
  }

  return (
    <div>
      <Dialog open={props.isCreateOpen} onClose={closeCreateWindow} scroll="paper" fullWidth maxWidth="md">
        <Card style={{marginTop: -10}}>
          <CardHeader
            title="Create Event"
            action={
              <IconButton onClick={closeCreateWindow}>
                <Close/>
              </IconButton>
            }
          />
          <CardContent>
            <div style={{marginTop: -25}} />
            <TextField
              required
              fullWidth
              variant="filled"
              label="Title"
              value={title}
              onChange={handleTitleChange}
            />
            <div style={{paddingTop: 15}} />
            <Divider/>
            <div style={{display: 'flex', flexDirection: 'column', paddingTop: 15, paddingBottom: 15}}>
              <div style={{display: 'flex', alignItems: 'center', paddingBottom: 15}}>
                <LocalOfferOutlined style={{marginRight: 10}} />
                <Autocomplete
                  freeSolo
                  options={props.categories}
                  style={{width: 300}}
                  onInputChange={handleCatChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" variant="filled" />
                  )}
                />
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <AccessTime style={{marginRight: 10}} />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    required
                    format="yyyy-MM-dd"
                    label="Date"
                    inputVariant="filled"
                    value={date}
                    onChange={handleDateChange}
                    style={{marginRight: 10}}
                  />
                  <TimePicker
                    required
                    label="Time"
                    inputVariant="filled"
                    value={date}
                    onChange={handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div style={{display: 'flex', alignItems: 'center', paddingTop: 15, paddingBottom: 15}}>
                <RoomOutlined style={{marginRight: 10}}/>
                <AddressField
                  online={online}
                  variant="filled"
                  value={address}
                  setValue={setAddress}
                  setAddressString={setAddressString}
                  setAddressLatLng={setAddressLatLng}
                />
                <FormControlLabel
                  checked={online}
                  onChange={handleOnlineChange}
                  control={<Switch color="primary" />}
                  label="Online"
                  labelPlacement="top"
                />
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <LinkOutlined style={{marginRight: 10}}/>
                <TextField
                  required
                  fullWidth
                  variant="filled"
                  label="Link"
                  value={link}
                  onChange={handleLinkChange}
                />
              </div>
            </div>
            <Divider/>
            <div style={{paddingBottom: 15}} />
            <TextField
              rows={5}
              multiline
              fullWidth
              variant="filled"
              label="Description"
              value={desc}
              onChange={handleDescChange}
            />
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 15, marginBottom: -10}}>
              <Button
                color="primary"
                size="large"
                onClick={closeCreateWindow}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.createButton}
                onClick={createEvent}
              >
                Create
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <Button onClick={handleDiscard} color="primary" autoFocus>
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  );
}

export default CreateEventWindow;
