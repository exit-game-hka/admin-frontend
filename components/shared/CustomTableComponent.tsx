"use client";
import React, {ReactNode} from 'react';
import {Box, Table, TableProps} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";

type TableBodyRow = {
    content: ReactNode;
    onClick?: (() => void) | undefined;
};

type Props = TableProps & {
    headerCells: ReactNode;
    bodyRows: TableBodyRow[];
};

export const CustomTableComponent: React.FC<Props> = (props) => {
    const { headerCells, bodyRows, ...tableProps } = props;
    const { isSmall } = useMediaQuery();

    return (
        <Table
            size="lg"
            variant="outlined"
            sx={{ borderRadius: "lg" }}
            {...tableProps}
        >
            <Box
                component="thead"
                sx={{
                    "& tr": {
                        fontWeight: 600,
                    },
                    "& tr th": {
                        borderBottom: "2px solid var(--TableCell-borderColor)",
                        py: isSmall ? "10px" : "15px",
                    },
                    "& tr:first-child th:first-child": {
                        borderTopLeftRadius: "12px !important",
                    },
                    "& tr:first-child th:last-child": {
                        borderTopRightRadius: "12px !important",
                    },

                }}
            >
                {headerCells}
            </Box>
            <Box
                component="tbody"
                sx={{
                    "& tr:last-child td:first-child": {
                        borderBottomLeftRadius: "12px !important",
                    },
                    "& tr:last-child td:last-child": {
                        borderBottomRightRadius: "12px !important",
                    },
                }}
            >
                {bodyRows.map((row, index) =>
                    <Box
                        component="tr"
                        key={index}
                        onClick={row.onClick}
                        sx={{
                            "&:hover": {
                                "& *": {
                                    backgroundColor: theme => theme.vars.palette.primary[500],
                                    borderColor: theme => theme.vars.palette.primary[500],
                                    color: "white",
                                    cursor: "pointer",
                                },
                            },
                        }}
                    >
                        {row.content}
                    </Box>
                )}
            </Box>
        </Table>
    );
};

