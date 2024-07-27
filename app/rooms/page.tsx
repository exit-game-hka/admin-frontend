import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {protectRoute} from "@/utils/protectRoute";
import RoomListComponent from "@/app/rooms/(shared)/RoomListComponent";

const RoomsPage: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title="Räume">
            <RoomListComponent />
        </PageWrapperComponent>
    );
};

export default RoomsPage;
