import { makeStyles } from '@material-ui/styles';
import { pink } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root: {
        margin: 0,
        padding: 0,
    },
    content: {
        marginTop: theme.spacing(2)
    },
    pinkAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: pink[500],
    }, paper: {
        position: 'absolute',
        width: 800,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 4),
        outline: 'none',
    },
}));

export default useStyles;
