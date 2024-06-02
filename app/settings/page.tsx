import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import dynamic from "next/dynamic";
import {protectRoute} from "@/utils/protectRoute";

const SettingOptionsComponent = dynamic(
    () => import("../../components/SettingOptionsComponent"),
    { ssr: false }
);

const SettingsPage: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title={"Einstellungen"}>
            <SettingOptionsComponent />
        </PageWrapperComponent>
    );
};

export default SettingsPage;
