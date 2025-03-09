"use client";

import { Button } from "@/components/ui/button";
import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const light = () => {
    setTheme("light");
    setIsOpen(false);
  };
  const dark = () => {
    setTheme("dark");
    setIsOpen(false);
  };
  const system = () => {
    setTheme("system");
    setIsOpen(false);
  };

  return (
    <div className="relative block text-left h-full min-w-fit min-h-fit">
      <Button
        type="button"
        id="menu-button"
        aria-label="Theme Toggle"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
        className="bg-white py-1 px-2 hover:bg-gray-300 border-none text-black dark:bg-black dark:hover:bg-gray-800 dark:text-white"
      >
        {theme === "light" ? (
          <Sun size={20} />
        ) : theme === "dark" ? (
          <Moon size={20} />
        ) : (
          <MonitorCog size={20} />
        )}
      </Button>

      {isOpen && (
        <div
          role="menu"
          className="absolute -right-[70px] z-10 mt-2 w-[200px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in dark:bg-black dark:ring-white dark:ring-opacity-10 duration-300"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button
              className="block w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              role="menuitem"
              onClick={light}
            >
              <Sun size={16} className="inline mr-2" />
              Light Mode
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              role="menuitem"
              onClick={dark}
            >
              <Moon size={16} className="inline mr-2" />
              Dark Mode
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              role="menuitem"
              onClick={system}
            >
              <MonitorCog size={16} className="inline mr-2" />
              System Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
