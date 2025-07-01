import React, { useState, useEffect } from "react";
import Topbar from "../Components/Layouts/TopBar";
import SideBar from "../Components/Layouts/SideBar";
import toast, { Toaster } from "react-hot-toast";
import { Head, usePage } from "@inertiajs/react";

export default function RootLayout({ title, children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const darkMode =
            localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        setIsDark(darkMode);
        document.documentElement.classList.toggle("dark", darkMode);
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", !isDark ? "dark" : "light");
    };

    const { flash } = usePage().props;
    useEffect(() => {
        const { type, message } = flash;

        if (type == "success") toast.success(message);
        if (type == "error") toast.error(message);
    }, [flash]);

    return (
        <>
            <div
                className="fixed inset-0 bg-[#F5FAFA] dark:bg-slate-900"
                aria-hidden="true"
            />
            <div className="relative flex flex-col min-h-screen">
                <Toaster position="bottom-right" />
                <Head>
                    <title>{title ?? ""}</title>
                </Head>

                <Topbar
                    toggleSidebar={() => setSidebarOpen(true)}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />

                <div className="flex flex-1 pt-16">
                    <SideBar
                        isOpen={isSidebarOpen}
                        setIsOpen={setSidebarOpen}
                    />
                    <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 lg:pl-[calc(theme(spacing.8)+256px)] transition-all duration-300 overflow-hidden">
                        <div className="mx-auto w-full max-w-[1920px] space-y-6 flex-1 flex flex-col">
                            {children}
                        </div>
                    </main>
                </div>

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-[#00A7A1]/10 backdrop-blur-sm z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </div>
        </>
    );
}
