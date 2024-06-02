import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewSemesterFormComponent} from "@/components/forms/NewSemesterFormComponent";
import {protectRoute} from "@/utils/protectRoute";

const NewSemesterPage: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title={"Neues Semester"}>
            <NewSemesterFormComponent />
        </PageWrapperComponent>
    );
};

export default NewSemesterPage;

