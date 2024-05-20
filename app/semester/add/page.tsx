import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewSemesterFormComponent} from "@/components/forms/NewSemesterFormComponent";

const NewSemesterPage: React.FC = () => {
    return (
        <PageWrapperComponent title={"Neues Semester"}>
            <NewSemesterFormComponent />
        </PageWrapperComponent>
    );
};

export default NewSemesterPage;

