import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewVeranstaltungFormComponent} from "@/components/forms/NewVeranstaltungFormComponent";
import {protectRoute} from "@/utils/protectRoute";

const NewVeranstaltungPage: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title={"Neues Fachgebiet"}>
            <NewVeranstaltungFormComponent />
        </PageWrapperComponent>
    );
};

export default NewVeranstaltungPage;
