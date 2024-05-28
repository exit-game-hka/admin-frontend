import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import dynamic from "next/dynamic";

const SettingOptionsComponent = dynamic(
    () => import("../../components/SettingOptionsComponent"),
    { ssr: false }
);

const SettingsPage: React.FC = () => {
    return (
        <PageWrapperComponent title={"Einstellungen"}>
            <SettingOptionsComponent />
        </PageWrapperComponent>
    );
};

export default SettingsPage;
