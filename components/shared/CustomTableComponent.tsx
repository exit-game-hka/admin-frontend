"use client";
import React, {ReactNode} from "react";
import {
    Box,
    Card,
    FormControl,
    FormLabel,
    IconButton,
    Option,
    Select,
    Stack,
    Table,
    TableProps,
    Typography
} from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {PaginationConfig} from "@/contexts/ApplicationContext";

type TableBodyRow = {
    content: ReactNode;
    onClick?: (() => void) | undefined;
};

type Props = TableProps & {
    headerCells: ReactNode;
    bodyRows: TableBodyRow[];
    footer?: ReactNode;
    paginationConfig?: PaginationConfig | undefined;
};

export const CustomTableComponent: React.FC<Props> = (props) => {
    const { headerCells, bodyRows, footer, paginationConfig, ...tableProps } = props;
    const { isSmall } = useMediaQuery();

    return (
        <Stack component="div" spacing="var(--gap-3)">
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
                {footer ? <Box component="tfoot">{footer}</Box> : null}
            </Table>
            {paginationConfig ? <PaginationComponent {...paginationConfig} /> : null}
        </Stack>
    );
};

const PaginationComponent: React.FC<PaginationConfig> = (props) => {
    const { isSmall } = useMediaQuery();
    const {
        pageNumber,
        pageSize,
        totalPages,
        totalElements,
        isFirst,
        isLast,
        onChangePage,
        onChangeRowsPerPage
    } = props;

    const pageSizeOptions = [5, 10, 20, 30, 40, 50, 100];

    const handleChangeRowsPerPage = (_: any, newValue: number | null) => {
        if (!newValue) return;
        onChangeRowsPerPage(newValue);
        onChangePage(0);
    };

    return (
        <Card
            component="div"
            size="sm"
            variant="outlined"
            sx={{ borderRadius: "lg" }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    justifyContent: "flex-end",
                    "@media screen and (max-width: 900px)": {
                        gap: 1,
                    },
                }}
            >
                <FormControl orientation="horizontal">
                    <FormLabel>Datensätze pro Seite:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} value={pageSize}>
                        {pageSizeOptions
                            //.filter((option) => option <= totalElements)
                            .map((option) => <Option key={option} value={option}>{option}</Option>)
                        }
                    </Select>
                </FormControl>
                <Stack component="div">
                    <Typography textAlign="center" sx={{ minWidth: 60 }}>
                        {pageNumber + 1}/{totalPages} Seiten
                    </Typography>
                    <Typography textAlign="center" level="body-xs" sx={{ display: isSmall ? "none" : "block" }}>
                        {totalElements} Datensätze insgesamt
                    </Typography>
                </Stack>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                        size="sm"
                        color="neutral"
                        variant="outlined"
                        disabled={isFirst}
                        onClick={() => onChangePage(pageNumber - 1)}
                        sx={{ backgroundColor: "background.surface" }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        size="sm"
                        color="neutral"
                        variant="outlined"
                        disabled={isLast}
                        onClick={() => onChangePage(pageNumber + 1)}
                        sx={{ bgcolor: "background.surface" }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Box>
            </Box>
        </Card>
    )
};
