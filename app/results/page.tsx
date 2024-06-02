import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {ResultComponent} from "@/components/ResultComponent";
import {protectRoute} from "@/utils/protectRoute";

const ResultsPage: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title={"Ergebnisse"}>
            <ResultComponent />
        </PageWrapperComponent>
    );
};

export default ResultsPage;

