import React from "react";
import { Link } from "react-router-dom";

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  className?: string;
  tag?: "a" | "button"; // Optional tag override
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  to,
  className,
}) => {
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
};