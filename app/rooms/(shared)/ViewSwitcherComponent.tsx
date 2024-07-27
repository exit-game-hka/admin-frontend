"use client";
import React, {ReactNode, useState} from "react";
import {Box, Divider, IconButton, Sheet, Stack, ToggleButtonGroup} from "@mui/joy";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ClearAllOutlinedIcon from "@mui/icons-material/ClearAllOutlined";

export type ViewType = "GRID" | "TABLE";

type Props = {
    children?: ((view: ViewType) => ReactNode) | undefined;
}
const ViewSwitcherComponent: React.FC<Props> = (props) =>  {
    const { children } = props;
    const [view, setView] = useState<ViewType>("GRID");

    return (
        <Stack spacing={4}>
            <Box
                component="div"
                sx={{
                    px: 1,
                    alignSelf: "end",
                }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        display: "flex",
                        borderRadius: "md",
                        ap: 2,
                        p: 0.5,
                    }}
                >
                    <ToggleButtonGroup variant={"plain"} spacing={1}>
                        <IconButton
                            variant={view === "GRID" ? "solid" : "plain"}
                            color={view === "GRID" ? "primary" : "neutral"}
                            onClick={() => setView("GRID")}
                        >
                            <GridViewOutlinedIcon />
                        </IconButton>
                        <Divider orientation="vertical" sx={{ height: "60%", alignSelf: "center" }} />
                        <IconButton
                            variant={view === "TABLE" ? "solid" : "plain"}
                            color={view === "TABLE" ? "primary" : "neutral"}
                            onClick={() => setView("TABLE")}
                        >
                            <ClearAllOutlinedIcon />
                        </IconButton>
                    </ToggleButtonGroup>
                </Sheet>
            </Box>
            {children ? children(view) : null}
        </Stack>
    );
};

export default ViewSwitcherComponent;
