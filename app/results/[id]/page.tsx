import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {ResultDetailComponent} from "@/components/ResultDetailComponent";
import {protectRoute} from "@/utils/protectRoute";

type PageProps = {
    params: { id: string },
    searchParams: Record<string, string>,
}
const ResultDetailsPage: React.FC<PageProps> = async (props) => {
    await protectRoute();

    const { params: { id } } = props;
    return (
        <PageWrapperComponent title={"Ergebnisdetails"}>
            <ResultDetailComponent playerId={id} />
        </PageWrapperComponent>
    );
};

export default ResultDetailsPage;
