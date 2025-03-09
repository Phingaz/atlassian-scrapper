"use client";
import React from "react";
import usePost from "../_hooks/usePost";
import { TScrapedData, TScrapedResult } from "../page";
import useLocalStorage from "../_hooks/useLocalstorage";
import { FeatureFlagType } from "@/lib/utils";

export type TMainCtx = {
  features: FeatureFlagType;
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  minutes: number[];
  setMinutes: React.Dispatch<React.SetStateAction<number[]>>;
  newKeyword: string;
  setNewKeyword: React.Dispatch<React.SetStateAction<string>>;
  selectedKeywords: string[];
  setSelectedKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  formPost: ReturnType<typeof usePost>;
  favorites: TScrapedData[];
  setFavorites: React.Dispatch<React.SetStateAction<TScrapedData[]>>;
};

const Main = React.createContext<TMainCtx | undefined>(undefined);

export function MainCtxProvider({
  features,
  children,
}: React.PropsWithChildren<{
  features: FeatureFlagType;
  children: React.ReactNode;
}>) {
  const formPost = usePost<TScrapedResult>();

  const [favorites, setFavorites] = useLocalStorage<TScrapedData[]>(
    "favorites",
    []
  );
  const [keywords, setKeywords] = useLocalStorage<string[]>("default", ["jql"]);
  const [page, setPage] = useLocalStorage<number>("page", 1);
  const [newKeyword, setNewKeyword] = React.useState("");
  const [minutes, setMinutes] = React.useState([5]);
  const [selectedKeywords, setSelectedKeywords] = useLocalStorage<string[]>(
    "selectedKeyword",
    []
  );
  const [error, setError] = React.useState<string | null>(null);

  const contextValue = {
    features,
    keywords,
    setKeywords,
    page,
    setPage,
    minutes,
    setMinutes,
    newKeyword,
    setNewKeyword,
    selectedKeywords,
    setSelectedKeywords,
    error,
    setError,
    formPost,
    favorites,
    setFavorites,
  };

  return <Main.Provider value={contextValue}>{children}</Main.Provider>;
}

export const useMain = () => {
  const context = React.useContext(Main);
  if (!context) {
    throw new Error("useMain must be used within a MainCtxProvider");
  }
  return context;
};

export default Main;
