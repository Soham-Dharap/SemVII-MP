import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  description: string;
  imageSrc?: string;
}

const EmptyState = ({ title, description, imageSrc }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {imageSrc && (
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-2xl rounded-full" />
          <Image
            src={imageSrc}
            alt={title}
            className="relative w-[160px] h-[120px] object-contain opacity-90"
            height={120}
            width={160}
          />
        </div>
      )}
      <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground max-w-[360px]">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
