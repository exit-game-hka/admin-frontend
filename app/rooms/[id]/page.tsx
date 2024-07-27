import React from "react";
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {protectRoute} from "@/utils/protectRoute";
import RoomDetailedInfoComponent from "@/app/rooms/(shared)/RoomDetailedInfoComponent";

const RoomDetailsPage: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title={"Info zum Raum"}>
            <RoomDetailedInfoComponent />
        </PageWrapperComponent>
    );
};

export default RoomDetailsPage;
