import Image from "next/image";

/**
 * YAHSHUA One Logo — uses the actual brand image
 */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo.jpg"
      alt="YAHSHUA One"
      width={size}
      height={size}
      style={{ borderRadius: size * 0.18, objectFit: "cover" }}
      priority
    />
  );
}

/** Rounded container version for nav/footer spots */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo.jpg"
      alt="YAHSHUA One"
      width={size}
      height={size}
      style={{
        borderRadius: size * 0.22,
        objectFit: "cover",
        flexShrink: 0,
        display: "block",
      }}
      priority
    />
  );
}
