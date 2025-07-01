import { Link, usePage } from "@inertiajs/react";
import {
    ChevronDown,
    KeyRound,
    LogOut,
    MessagesSquare,
    User,
} from "lucide-react";
import { useState } from "react";
import CheckRoles from "../../utils/CheckRoles";

export default function ProfileDropdown() {
    const { loggeduser } = usePage().props;
    const [isProfileOpen, setProfileOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-[#E6F5F5] dark:hover:bg-slate-700/50"
            >
                <div className="flex items-center justify-center rounded-full size-8 bg-primary/10">
                    <User className="size-5 text-primary" />
                </div>
                <div className="hidden text-left md:block">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {loggeduser.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {loggeduser.position}
                    </div>
                </div>
                <ChevronDown className="size-4 text-slate-400" />
            </button>

            {isProfileOpen && (
                <div className="absolute right-0 w-64 mt-1 bg-white border shadow-lg dark:bg-slate-800 rounded-xl border-blue-100/50 dark:border-slate-700/50">
                    <div className="p-3 border-b border-blue-100/50 dark:border-slate-700/50">
                        <div className="text-sm font-medium text-slate-700 dark:text-white">
                            {loggeduser.name}
                        </div>
                        <div className="text-sm truncate text-slate-500 dark:text-slate-400">
                            {loggeduser.email}
                        </div>
                    </div>
                    <div className="grid gap-1 p-2">
                        <Link
                            href="/profile"
                            className="flex items-center w-full gap-2 px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                        >
                            <User className="size-4" />
                            Ubah Profile
                        </Link>
                        <Link
                            href="/password"
                            className="flex items-center w-full gap-2 px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                        >
                            <KeyRound className="size-4" />
                            Ubah Password
                        </Link>
                        <CheckRoles
                            notRoles={["fasyankes"]}
                            children={
                                <Link
                                    href="/telegram/connect"
                                    className="flex items-center w-full gap-2 px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                                >
                                    <MessagesSquare className="size-4" />
                                    Hubungkan Telegram
                                </Link>
                            }
                        />
                        <Link
                            href="/auth/logout"
                            className="flex items-center w-full gap-2 px-3 py-2 text-sm text-white bg-red-600 rounded-lg"
                        >
                            <LogOut className="size-4" />
                            Keluar
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
