import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewPlayerFormComponent} from "@/components/forms/NewPlayerFormComponent";

const NewPlayerPage: React.FC = () => {
    return (
        <PageWrapperComponent title={"Neuer Spieler"}>
            <NewPlayerFormComponent />
        </PageWrapperComponent>
    );
};

export default NewPlayerPage;
