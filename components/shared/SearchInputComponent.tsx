import React from "react";
import {Input} from "@mui/joy";
import {SxProps} from "@mui/system";

type Props = {
    value: string;
    onChange: (event: any) => void;
    customStyles?:  SxProps | undefined;
}
const SearchInputComponent: React.FC<Props> = (props) => {
    const { value, onChange, customStyles } = props;

    return (
        <Input
            placeholder="Suchen"
            sx={{
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "md",
                minWidth: "400px",
                ...customStyles,
            }}
            value={value}
            onChange={onChange}
        />
    );
};

export default SearchInputComponent;