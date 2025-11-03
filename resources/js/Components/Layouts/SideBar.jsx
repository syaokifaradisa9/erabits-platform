import { Briefcase, Home, ShoppingBag, Users } from "lucide-react";
import SidebarLink from "./SideBarLink";
import CheckRoles from "../../utils/CheckRoles";

export default function Sidebar({ isOpen, setIsOpen }) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-slate-900/60 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 transform transition-transform duration-300 ease-in-out border-r border-gray-300/90 dark:border-slate-700/50 lg:translate-x-0 lg:z-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center flex-shrink-0 h-16 border-b border-gray-300/90 dark:border-slate-700/50">
                        {/* <Logo className="flex h-14 lg:mx-auto md:hidden" /> */}
                    </div>
                    <div className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            <div className="px-3 mt-5">
                                <div className="py-2">
                                    <h3 className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                                        Halaman Utama
                                    </h3>
                                </div>
                                <SidebarLink
                                    name="Dashboard"
                                    href="/dashboard"
                                    icon={Home}
                                />
                            </div>
                            <div className="px-3 mt-2">
                                <div className="py-2">
                                    <h3 className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                                        Layanan
                                    </h3>
                                </div>
                                <SidebarLink
                                    name="Item"
                                    href="/items"
                                    icon={Briefcase}
                                    roles={[
                                        "Superadmin",
                                        "Admin",
                                        "Manager",
                                        "Officer",
                                        "Finance",
                                    ]}
                                />
                                <SidebarLink
                                    name="Permintaan"
                                    href="/orders"
                                    icon={ShoppingBag}
                                />
                                <SidebarLink
                                    name="Aset Saya"
                                    href="/my-assets"
                                    icon={Briefcase}
                                    roles={["Client"]}
                                />
                                <SidebarLink
                                    name="Dashboard Perbaikan"
                                    href="/repair-dashboard"
                                    icon={Briefcase}
                                    roles={["Superadmin", "Admin", "Manager", "Officer"]}
                                />
                            </div>
                            <div className="px-3 mt-2">
                                <div className="py-2">
                                    <h3 className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400">
                                        Manajemen
                                    </h3>
                                </div>
                                <SidebarLink
                                    name="Pengguna"
                                    href="/users"
                                    icon={Users}
                                    roles={["Superadmin", "Admin", "Manager"]}
                                />
                                <SidebarLink
                                    name="Klien"
                                    href="/clients"
                                    icon={Users}
                                    roles={["Superadmin", "Admin", "Manager"]}
                                />
                                <SidebarLink
                                    name="Inventaris Klien"
                                    href="/client-inventories"
                                    icon={Briefcase}
                                />
                            </div>
                        </div>
                        <div className="flex-shrink-0 p-3">
                            <div className="px-3 py-2.5 rounded-lg bg-[#E6F5F5] dark:bg-slate-700/30">
                                <div className="mt-1.5 flex flex-col items-center">
                                    <div className="flex text-xs text-slate-500 dark:text-slate-400">
                                        Developed with
                                        <svg
                                            className="size-3.5 mx-1 text-red-500 animate-pulse"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        PT Erabits Indonesia
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
