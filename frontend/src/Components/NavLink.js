import * as React from "react";
import { NavLink as BaseNavLink } from "react-router-dom";

export const NavLink = React.forwardRef(
  ({ activeClassName, activeStyle, exact, ...props }, ref) => {
    return (
      <BaseNavLink
        ref={ref}
        {...props}
        exact = {exact}
        className={({ isActive }) =>
          [
            props.className,
            isActive ? activeClassName : null
          ]
            .filter(Boolean)
            .join(" ")
        }
        style={({ isActive }) => ({
          ...props.style,
          ...(isActive ? activeStyle : null)
        })}
      />
    );
  }
);
