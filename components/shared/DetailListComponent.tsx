import React, { ReactNode } from "react";
import {
    Box,
    List,
    ListDivider,
    ListItem,
    ListItemDecorator,
    Stack,
    Typography,
} from "@mui/joy";

type GroupItem = {
    icon: ReactNode;
    label: string;
    value: ReactNode;
};

// Generic T muss angegeben werden, um ein Objekt dieses Typen zu erstellen.
// Der generische Typ nimmt nur strings-Typen oder String-Union-Typen an
export type Group<T extends string> = {
    name: T;
    items: GroupItem[];
    detail?: ReactNode | undefined;
};

type PropsDetailsList<T extends string> = {
    groups: Group<T>[];
};

export const DetailsListComponent = <U extends string>(
    props: PropsDetailsList<U>,
) => {
    const { groups } = props;

    return (
        <Stack spacing={"var(--gap-3)"} sx={{ width: "100%" }}>
            {groups.map((group) => (
                <Box key={group.name} component="div">
                    <Typography
                        level="title-md"
                        sx={{ mb: 2, ml: 2 }}
                    >
                        {group.name}
                    </Typography>
                    <List
                        variant="soft"
                        sx={{
                            borderRadius: "md",
                            width: "100%",
                        }}
                    >
                        {group.items.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <ListItem
                                    endAction={<Box>{item.value}</Box>}
                                    sx={{ ml: 1, mr: 3 }}
                                >
                                    <ListItemDecorator>
                                        {item.icon}
                                    </ListItemDecorator>
                                    {item.label}
                                </ListItem>
                                {index !== group.items.length - 1 ? (
                                    <ListDivider />
                                ) : null}
                            </React.Fragment>
                        ))}
                    </List>
                    <Typography
                        level="body-sm"
                        sx={{ mt: 1, ml: 2 }}
                    >
                        {group.detail}
                    </Typography>
                </Box>
            ))}
        </Stack>
    );
};
