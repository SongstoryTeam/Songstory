"use client";

import {useState} from "react";
import {Sidebar} from "./Sidebar";
import {TopBar} from "./TopBar";
import {StickyPlayer} from "@/components/player/StickyPlayer";
import styles from "./AppShell.module.css";

interface AppShellProps {
    locale: string;
    children: React.ReactNode;
}

export function AppShell({locale, children}: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className={styles.sidebarSpacer}/>
            <div className={styles.sidebarDesktop}>
                <Sidebar locale={locale} open onClose={() => {
                }}/>
            </div>
            <div className={styles.sidebarMobile}>
                <Sidebar locale={locale} open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
            </div>

            <div className={styles.content}>
                <TopBar locale={locale} onMenuClick={() => setSidebarOpen(true)}/>
                <main className={styles.main}>{children}</main>
            </div>

            <StickyPlayer/>
        </>
    );
}