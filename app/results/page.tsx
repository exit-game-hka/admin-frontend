import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {ResultComponent} from "@/components/ResultComponent";

const ResultsPage: React.FC = () => {
    return (
        <PageWrapperComponent title={"Ergebnisse"}>
            <ResultComponent />
        </PageWrapperComponent>
    );
};

export default ResultsPage;

