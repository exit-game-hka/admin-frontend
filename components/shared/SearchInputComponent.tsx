import React from "react";
import {Input} from "@mui/joy";
import {SxProps} from "@mui/system";
import {useMediaQuery} from "@/hooks/useMediaQuery";

type Props = {
    value: string;
    onChange: (event: any) => void;
    customStyles?:  SxProps | undefined;
}
const SearchInputComponent: React.FC<Props> = (props) => {
    const { value, onChange, customStyles } = props;
    const { isSmall } = useMediaQuery();

    return (
        <Input
            placeholder="Suchen"
            sx={{
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "md",
                minWidth: isSmall ? "unset" : "400px",
                ...customStyles,
            }}
            value={value}
            onChange={onChange}
        />
    );
};

export default SearchInputComponent;