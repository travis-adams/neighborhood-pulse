import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const buttonColor = '#444444';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapContainer: {
      flex: 1,
    },
    mapInfoWindow: {
      textAlign: 'center',
      padding: 10,
    },
    event: {
      display: 'flex',
      height: '15vh',
      alignItems: 'center',
    },
    eventDetails: {
      flex: 1,
      textAlign: 'center',
    },
    eventGrid: {
      backgroundColor: "#dddddd",
      overflow: "auto",
      flex: 1,
    },
    flexColumn: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    },
    mainBox: {
      flex: 1,
      display: "flex",
      flexFlow: "row nowrap",
      overflow: "hidden",
    },
    navBar: {
      flex: 0,
      backgroundColor: theme.palette.common.white,
      boxShadow: 'none',
    },
    logoDiv: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-start',
    },
    logoImg: {
      flex: 1,
      maxWidth: '25%',
      maxHeight: '25%',
    },
    gap: {
      flex: 1,
    },
    filterButton: {
      color: buttonColor,
      marginRight: '2%',
    },
    filterAndSearch: {
      flex: 2,
      display: 'flex',
      alignItems: 'center',
    },
    search: {
      flex: 1,
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white,
      marginRight: 0,
      marginLeft: 0,
      width: '100%',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: buttonColor,
    },
    inputRoot: {
      width: '100%',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      color: theme.palette.common.black,
    },
    userDiv: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    userButton: {
      color: buttonColor,
    },
  }),
);

export default useStyles;
