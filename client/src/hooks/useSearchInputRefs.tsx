import { useRef } from "react";
import React from "react";

export const useSearchInputRefs = (count: number) => {
  const searchInputRefs = useRef(Array.from({ length: count }, () => React.createRef<HTMLInputElement>()));
  return searchInputRefs;
}