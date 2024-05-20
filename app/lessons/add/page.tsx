import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewVeranstaltungFormComponent} from "@/components/forms/NewVeranstaltungFormComponent";

const NewVeranstaltungPage: React.FC = () => {
    return (
        <PageWrapperComponent title={"Neue Veranstaltung"}>
            <NewVeranstaltungFormComponent />
        </PageWrapperComponent>
    );
};

export default NewVeranstaltungPage;
