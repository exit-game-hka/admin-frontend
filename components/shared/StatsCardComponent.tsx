import * as React from 'react';
import {ReactNode} from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import {Box, IconButton} from "@mui/joy";
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

type Props = {
    label: ReactNode;
    value: ReactNode;
    tip?: ReactNode | undefined;
}
export const StatsCardComponent: React.FC<Props> = (props: Props) => {
    const { label, value, tip } = props;

    return (
        <Card>
            <CardContent orientation="horizontal">
                <Box component="div">
                    <Typography level="h3">{value}</Typography>
                    <Typography level="body-sm">{label}</Typography>
                </Box>
                {tip ?
                    <IconButton
                        aria-label="Über die Karte"
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        sx={{ position: "absolute", top: "10px", right: "10px" }}
                    >
                        <MoreHorizOutlinedIcon />
                    </IconButton> : null
                }
            </CardContent>
        </Card>
    );
}