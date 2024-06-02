import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewPlayerFormComponent} from "@/components/forms/NewPlayerFormComponent";
import {protectRoute} from "@/utils/protectRoute";

const NewPlayerPage: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title={"Neuer Spieler"}>
            <NewPlayerFormComponent />
        </PageWrapperComponent>
    );
};

export default NewPlayerPage;
