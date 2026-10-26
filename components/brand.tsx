import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/icon.svg"
      alt="Codepilot logo"
      width={size}
      height={size}
      className={cn("rounded-[22%]", className)}
      priority
    />
  );
}

export default function Brand({
  href = "/dashboard",
  className,
  showWordmark = true,
}: {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5", className)}
      aria-label="Codepilot home"
    >
      <BrandMark size={30} />
      {showWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-zinc-900">
          Codepilot
        </span>
      )}
    </Link>
  );
}
