import { CSSProperties } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';

// react-google-maps requires CSSProperties
export const mapStyle = {
  container: {
    width: '51vw',
    height: '100vh'
  } as CSSProperties,
  eventInfoWindow: {
    textAlign: 'center',
    padding: 10
  } as CSSProperties
};

const useStyles = makeStyles(() =>
  createStyles({
    event: {
      display: 'flex',
      height: '15vh',
      alignItems: 'center',
    },
    eventDetails: {
      flex: 1,
      textAlign: 'center',
    },
  }),
);

export default useStyles;