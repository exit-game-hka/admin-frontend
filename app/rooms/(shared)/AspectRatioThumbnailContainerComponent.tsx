import React from "react";
import styled from "styled-components";
import AspectRatio from "@mui/joy/AspectRatio";
import Image, {ImageProps as NextImageProps} from "next/image";

type Props = NextImageProps;

const AspectRatioThumbnailContainerComponent: React.FC<Props> = (props) => {
    return (
        <AspectRatioThumbnailContainer objectFit="cover">
            <Thumbnail
                layout="fill"
                {...props}
            />
        </AspectRatioThumbnailContainer>
    );
};

const AspectRatioThumbnailContainer = styled(AspectRatio)`
    border-radius: var(--gap-1);
    box-shadow: 0 0 5px grey;

    &:hover {
        cursor: pointer;
        box-shadow: 0 0 10px var(--color-primary);
    };
`;
const Thumbnail = styled(Image)`
    border-radius: var(--gap-1);
`;

export default AspectRatioThumbnailContainerComponent;
