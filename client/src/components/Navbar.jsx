import { NavLink } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 shadow-sm border-b flex items-center justify-between bg-white dark:bg-zinc-900">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">DigiNotes</h1>

      <div className="flex items-center gap-4">
        <NavLink
          to="/timetable"
          className={({ isActive }) =>
            `text-sm font-medium px-3 py-2 rounded-md transition ${
              isActive
                ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white"
                : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`
          }
        >
          Timetable
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-sm font-medium px-3 py-2 rounded-md transition ${
              isActive
                ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white"
                : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`
          }
        >
          Home
        </NavLink>

        <ModeToggle />
      </div>
    </nav>
  );
}
