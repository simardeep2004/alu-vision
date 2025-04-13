
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ChevronDown, Bell } from 'lucide-react';

import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b dark:border-gray-800 py-3 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/dashboard" className="flex items-center font-bold text-xl text-alu-primary">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-alu-primary">TheAluVision</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary transition-colors"}>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary transition-colors"}>
            Inventory
          </NavLink>
          <NavLink to="/quotations" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary transition-colors"}>
            Quotations
          </NavLink>
          {user?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary transition-colors"}>
              Admin
            </NavLink>
          )}
          <NavLink to="/crm" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary transition-colors"}>
            CRM
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "text-alu-primary font-medium" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary transition-colors"}>
            Settings
          </NavLink>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <ModeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 focus:outline-none">
                <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                  <AvatarImage src="https://github.com/shadcn.png" alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden xl:inline-block">{user?.name || 'User'}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full block">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="w-full block">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-lg z-50">
          <nav className="flex flex-col py-4 px-6 space-y-3">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? "text-alu-primary font-medium p-2" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary p-2 transition-colors"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/inventory" 
              className={({ isActive }) => isActive ? "text-alu-primary font-medium p-2" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary p-2 transition-colors"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inventory
            </NavLink>
            <NavLink 
              to="/quotations" 
              className={({ isActive }) => isActive ? "text-alu-primary font-medium p-2" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary p-2 transition-colors"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Quotations
            </NavLink>
            {user?.isAdmin && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => isActive ? "text-alu-primary font-medium p-2" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary p-2 transition-colors"}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </NavLink>
            )}
            <NavLink 
              to="/crm" 
              className={({ isActive }) => isActive ? "text-alu-primary font-medium p-2" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary p-2 transition-colors"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CRM
            </NavLink>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => isActive ? "text-alu-primary font-medium p-2" : "text-gray-600 dark:text-gray-300 hover:text-alu-primary dark:hover:text-alu-primary p-2 transition-colors"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </NavLink>
            <div className="border-t dark:border-gray-700 pt-2">
              <Button 
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
