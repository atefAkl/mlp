import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGaugeHigh,
    faUsers,
    faUser,
    faSignOutAlt,
    faChevronRight,
    faChevronLeft,
    faGear,
    faUserShield,
    faKey,
    faChevronDown,
    faHome,
    faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../atoms/Button";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { getGeneralSettings } from "../../utils/themeHelper";

const DashboardLayout = () => {
    const { t, i18n } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState(["settings"]);
    const [appName, setAppName] = useState(() => getGeneralSettings().appName);
    const location = useLocation();
    const dispatch = useDispatch();
    const isRTL = i18n.language === "ar";

    useEffect(() => {
        const handleSettingsUpdate = (event) => {
            setAppName(event.detail?.appName || getGeneralSettings().appName);
        };

        window.addEventListener("app-settings-updated", handleSettingsUpdate);
        return () =>
            window.removeEventListener(
                "app-settings-updated",
                handleSettingsUpdate,
            );
    }, []);

    const toggleMenu = (menuId) => {
        setOpenMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((id) => id !== menuId)
                : [...prev, menuId],
        );
    };

    const menuGroups = [
        {
            id: "main",
            label: null,
            items: [
                {
                    id: "dashboard",
                    name: t("common.dashboard"),
                    icon: faGaugeHigh,
                    path: "/dashboard",
                },
                {
                    id: "users",
                    name: t("common.users"),
                    icon: faUsers,
                    path: "/dashboard/users",
                },
                {
                    id: "subscribers",
                    name: t('auto.subscribers'),
                    icon: faEnvelope,
                    path: "/dashboard/subscribers",
                },
            ],
        },
        {
            id: "settings",
            label: t('auto.settings'),
            icon: faGear,
            items: [
                {
                    id: "profile",
                    name: t("common.profile"),
                    icon: faUser,
                    path: "/dashboard/profile",
                },
                {
                    id: "roles",
                    name: t('auto.roles'),
                    icon: faUserShield,
                    path: "/dashboard/roles",
                },
                {
                    id: "permissions",
                    name: t('auto.permissions'),
                    icon: faKey,
                    path: "/dashboard/permissions",
                },
                {
                    id: "settings-page",
                    name: t('auto.general_settings'),
                    icon: faGear,
                    path: "/dashboard/settings",
                },
            ],
        },
    ];

    // Helper to get breadcrumb label
    const getBreadcrumb = () => {
        const path = location.pathname;
        if (path === "/dashboard") return null;
        const parts = path.split("/").filter((p) => p && p !== "dashboard");
        return parts.map((part) => {
            // Simple mapping or translation
            if (part === "users") return t('auto.users');
            if (part === "subscribers")
                return t('auto.subscribers');
            if (part === "roles") return t('auto.roles');
            if (part === "permissions")
                return t('auto.permissions');
            if (part === "profile") return t('auto.profile');
            if (part === "settings")
                return t('auto.general_settings');
            return part;
        });
    };

    const breadcrumbItems = getBreadcrumb();

    return (
        <div
            className="min-h-screen flex bg-slate-50 overflow-hidden"
            dir={t('auto.ltr')}
        >
            {/* Sidebar - Fixed Height and Sticky */}
            <aside
                className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-e border-slate-200 smooth-transition flex flex-col h-screen sticky top-0 z-50`}
            >
                <div className="h-16 flex-shrink-0 p-4 border-b border-slate-200 flex items-center justify-between">
                    {sidebarOpen && (
                        <span className="font-black text-2xl text-blue-600 tracking-tighter">
                            {appName}
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        icon={
                            sidebarOpen
                                ? isRTL
                                    ? faChevronRight
                                    : faChevronLeft
                                : isRTL
                                  ? faChevronLeft
                                  : faChevronRight
                        }
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-slate-50"
                    />
                </div>

                <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
                    {menuGroups.map((group) => (
                        <div key={group.id} className="space-y-1">
                            {group.label && sidebarOpen && (
                                <button
                                    onClick={() => toggleMenu(group.id)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <span>{group.label}</span>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`smooth-transition text-[8px] ${openMenus.includes(group.id) ? "" : "-rotate-90 rtl:rotate-90"}`}
                                    />
                                </button>
                            )}

                            {(group.id === "main" ||
                                openMenus.includes(group.id) ||
                                !sidebarOpen) && (
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive =
                                            location.pathname === item.path;
                                        return (
                                            <Link
                                                key={item.id}
                                                to={item.path}
                                                className={`flex items-center p-2.5 rounded-xl smooth-transition ${
                                                    isActive
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                                                }`}
                                            >
                                                <FontAwesomeIcon
                                                    icon={item.icon}
                                                    className={`${sidebarOpen ? (t('auto.mr_3')) : ""} w-5 text-sm`}
                                                />
                                                {sidebarOpen && (
                                                    <span className="text-xs font-bold">
                                                        {item.name}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                <div className="p-3 border-t border-slate-200 space-y-1">
                    <button
                        onClick={() => dispatch(logout())}
                        className="w-full flex items-center p-2.5 rounded-xl text-red-500 hover:bg-red-50 smooth-transition"
                    >
                        <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className={`${sidebarOpen ? (t('auto.mr_3')) : ""} w-5 text-sm`}
                        />
                        {sidebarOpen && (
                            <span className="text-xs font-bold">
                                {t("common.logout")}
                            </span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Container */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header - Fixed/Sticky with Glassmorphism */}
                <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold">
                            <Link
                                to="/dashboard"
                                className="text-slate-400 hover:text-blue-600 smooth-transition"
                            >
                                <FontAwesomeIcon
                                    icon={faHome}
                                    className="text-sm"
                                />
                            </Link>
                            {breadcrumbItems?.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <FontAwesomeIcon
                                        icon={
                                            isRTL
                                                ? faChevronLeft
                                                : faChevronRight
                                        }
                                        className="text-[8px] text-slate-300"
                                    />
                                    <span
                                        className={
                                            idx === breadcrumbItems.length - 1
                                                ? "text-blue-600 font-black"
                                                : "text-slate-400"
                                        }
                                    >
                                        {item}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() =>
                                i18n.changeLanguage(t('auto.ar'))
                            }
                            className="text-[10px] font-black text-slate-500 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 smooth-transition uppercase tracking-tighter"
                        >
                            {t('auto.key_yk00n')}
                        </button>
                        <div className="flex items-center gap-2 pl-4 border-s border-slate-200">
                            <div className="text-end hidden sm:block">
                                <div className="text-[11px] font-black text-slate-800 leading-none mb-0.5">
                                    Admin User
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Administrator
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white font-black text-sm border border-blue-400">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
