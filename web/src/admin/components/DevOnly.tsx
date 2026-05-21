import { type ReactNode } from "react";
import { useUserInfo } from "./useUserInfo";

interface DevOnlyProps {
  children: ReactNode;
}

export default function DevOnly({ children }: DevOnlyProps) {
  const user = useUserInfo();

  if (!user.isDev) {
    return null;
  }

  return <>{children}</>;
}
