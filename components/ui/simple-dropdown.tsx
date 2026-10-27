"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { cn } from "cn";

interface DropdownContextValue {
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue>({
  close: () => {},
});

/**
 * Minimal, dependency-free dropdown: state-driven panel with click-outside
 * and Escape handling. Used instead of portal/floating-ui menus whose popups
 * fail to mount in some runtime conditions.
 */
export function SimpleDropdown({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <DropdownContext.Provider value={{ close }}>
      <div ref={rootRef} className={cn("relative", className)}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          if (child.type === SimpleDropdownTrigger) {
            return React.cloneElement(child as React.ReactElement<{
              open: boolean;
              menuId: string;
              onToggle: () => void;
            }>, { open, menuId, onToggle: () => setOpen((v) => !v) });
          }
          if (child.type === SimpleDropdownContent) {
            return open
              ? React.cloneElement(child as React.ReactElement<{ menuId: string }>, {
                  menuId,
                })
              : null;
          }
          return child;
        })}
      </div>
    </DropdownContext.Provider>
  );
}

export function SimpleDropdownTrigger({
  children,
  className,
  ariaLabel,
  open: _open,
  menuId: _menuId,
  onToggle,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  open?: boolean;
  menuId?: string;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-haspopup="menu"
      aria-expanded={_open}
      aria-controls={_menuId}
      onClick={onToggle}
      className={className}
    >
      {children}
    </button>
  );
}

export function SimpleDropdownContent({
  children,
  className,
  align = "end",
  menuId,
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
  menuId?: string;
}) {
  return (
    <div
      id={menuId}
      role="menu"
      className={cn(
        "absolute top-full z-[60] mt-2 min-w-48 origin-top animate-scale-in rounded-xl bg-popover p-1.5 text-popover-foreground shadow-xl ring-1 ring-foreground/10",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

const baseItem =
  "flex w-full items-center rounded-lg px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-muted";

export function SimpleDropdownLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { close } = useContext(DropdownContext);
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={close}
      className={cn(baseItem, className)}
    >
      {children}
    </Link>
  );
}

export function SimpleDropdownAction({
  children,
  onSelect,
  className,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  className?: string;
}) {
  const { close } = useContext(DropdownContext);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        close();
        onSelect();
      }}
      className={cn(baseItem, className)}
    >
      {children}
    </button>
  );
}

export function SimpleDropdownSeparator() {
  return <div className="-mx-1.5 my-1 h-px bg-border" />;
}
