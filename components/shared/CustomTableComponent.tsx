"use client";
import React, {ReactNode} from 'react';
import {Box, Table} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";

type Props = {
  headerCells: ReactNode;
  bodyRows: ReactNode[];
};

export const CustomTableComponent: React.FC<Props> = (props) => {
  const { headerCells, bodyRows } = props;
  const { isSmall } = useMediaQuery();

  return (
      <Table size="lg" variant="outlined" sx={{ borderRadius: "lg" }}>
        <Box component="thead">
          <Box
              component="tr"
              sx={{
                fontWeight: 600,
                "& td": {
                  borderBottom: "2px solid var(--TableCell-borderColor)",
                  py: isSmall ? "10px" : "15px",
                },
              }}
          >
            {headerCells}
          </Box>
        </Box>
        <Box component="tbody">
          {bodyRows.map((row, index) =>
              <Box
                  component="tr"
                  key={index}
                  sx={{
                    "&:hover": {
                      "& *": {
                        backgroundColor: theme => theme.vars.palette.primary[500],
                        color: "white",
                        cursor: "pointer",
                      },
                    }
                  }}
              >
                {row}
              </Box>
          )}
        </Box>
      </Table>
  );
};

