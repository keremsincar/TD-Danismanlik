import type { ComponentProps } from "react";

/** A regular anchor keeps navigation working if the client router is unavailable. */
export default function NativeLink({ children, ...props }: ComponentProps<"a">) {
  return <a {...props}>{children}</a>;
}
