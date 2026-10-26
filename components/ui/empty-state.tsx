import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  description: string;
  imageSrc?: string;
}

const EmptyState = ({ title, description, imageSrc }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-20 text-center">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          width={96}
          height={96}
          unoptimized
          className="mb-5 size-24 opacity-80"
        />
      )}
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default EmptyState;
