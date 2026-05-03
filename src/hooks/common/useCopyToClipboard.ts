import { useState } from "react";
import { copyToClipboard } from "@/utils";

export function useCopyToClipboard(resetTimeout: number = 5000) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy = async (text: string) => {
    const successful = await copyToClipboard(text);
    if (successful) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), resetTimeout);
    }
    return successful;
  };

  return { isCopied, copy };
}
