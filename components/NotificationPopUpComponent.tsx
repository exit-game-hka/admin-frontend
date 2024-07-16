import React, {useState} from "react";
import Snackbar from '@mui/joy/Snackbar';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import {Notification} from "@/api/notification";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {IconButton} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";

type Props = {
    isOpen: boolean,
    onClose: () => void,
    notification: Notification,
};
const NotificationPopUpComponent: React.FC<Props> = (props) => {
    const { notification, isOpen, onClose } = props;
    const [open, setOpen] = useState<boolean>(isOpen);
    const { isSmall } = useMediaQuery();

    const handleClose = () => {
        setOpen(false);
        onClose();
    }

    return (
        <React.Fragment>
            <Snackbar
                autoHideDuration={20000}
                variant="outlined"
                //color="primary"
                size="md"
                //invertedColors
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={(theme) => ({
                    background: `linear-gradient(45deg, ${theme.palette.primary[600]} 30%, ${theme.palette.primary[500]} 90%})`,
                    maxWidth: isSmall ? "100dvw" : 550,
                    borderRadius: "lg",
                    px: 1,
                    py: 1,
                })}
            >
                <div>
                    <Stack direction="row">
                        <Typography
                            level="title-sm"
                            fontWeight="bold"
                            sx={{
                                flexGrow: 1,
                                ml: 1,
                                mt: 1,
                            }}
                        >
                            {notification.title}
                        </Typography>
                        <IconButton variant="soft" size="sm" onClick={handleClose} sx={{ borderRadius: "50%" }}>
                            <CloseOutlinedIcon />
                        </IconButton>
                    </Stack>
                    <Typography
                        level="body-sm"
                        sx={{
                            mb: 1,
                            ml: 1,
                        }}
                    >
                        {notification.content}
                    </Typography>
                </div>
            </Snackbar>
        </React.Fragment>
    );
};

export default NotificationPopUpComponent;
