import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from 'lucide-react';

import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-4">
      <div className="container flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/dashboard" className="flex items-center font-bold text-xl text-alu-primary">
          TheAluVision
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
            Inventory
          </NavLink>
          <NavLink to="/quotations" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
            Quotations
          </NavLink>
          {user?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
              Admin
            </NavLink>
          )}
          <NavLink to="/settings" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
            Settings
          </NavLink>
        </nav>

        {/* User Avatar and Dropdown */}
        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/settings" className="w-full block">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center mt-4 space-y-3">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
              Dashboard
            </NavLink>
            <NavLink to="/inventory" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
              Inventory
            </NavLink>
            <NavLink to="/quotations" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
              Quotations
            </NavLink>
            {user?.isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
                Admin
              </NavLink>
            )}
            <NavLink to="/settings" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "hover:text-gray-500 dark:hover:text-gray-300"}>
              Settings
            </NavLink>
            <ModeToggle />
            <button onClick={() => logout()} className="hover:text-gray-500 dark:hover:text-gray-300">
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
