interface AnimatedBlobProps {
  className?: string;
}

export function AnimatedBlob({ className }: AnimatedBlobProps) {
  return (
    <div
      className={`absolute inset-0 -z-10 rounded-full blur-2xl filter transition-transform duration-[3000ms] ease-in-out ${className} `}
      style={{
        background:
          "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(59, 130, 246, 0.1) 70%)",
        width: "110%",
        height: "140%",
        left: "-5%",
        top: "-20%",
      }}
    />
  );
}
