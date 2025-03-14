"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Trash2Icon } from "lucide-react";
import CardLoader from "./_components/Loader";
import dynamic from "next/dynamic";
import { useMain } from "./_context/Main";
import { clearLocalStorage } from "./_hooks/useLocalstorage";
import { CONSTANTS } from "@/lib/utils";
import ThemeToggle from "./_components/ThemeToggle";

const Form = dynamic(() => import("./_components/Form"), { ssr: false });
const Data = dynamic(() => import("./_components/Data"), { ssr: false });
const FavoriteItems = dynamic(() => import("./_components/Favorite"), {
  ssr: false,
});

export type TScrapedData = {
  title: string;
  link: string;
  date: string;
  dateValue: string;
};

export type TScrapedResult = Record<string, TScrapedData[]>;

const Page = () => {
  const { error, formPost, selectedKeywords } = useMain();
  const { data, loading } = formPost;

  return (
    <main className="flex flex-col gap-6 container">
      <div className="my-8 flex justify-between items-start">
        <span>
          <h1 className="text-4xl font-semibold ">
            Atlassian Community Scraper
          </h1>
          <p className="text-sm mt-3 max-w-xl">
            This is a simple web scraper that scrapes the Atlassian Community
            for the given keywords. It fetches the title, link, and date of the
            posts.
          </p>
        </span>
        <span className="flex gap-3 items-center">
          <ThemeToggle />
          {!CONSTANTS.ISPROD && (
            <Trash2Icon
              className="text-red-600 cursor-pointer size-5 hover:scale-105 transition"
              onClick={() => {
                clearLocalStorage(CONSTANTS.LOCAL_STORAGE_KEY);
                clearLocalStorage(CONSTANTS.DATA);
              }}
            />
          )}
        </span>
      </div>
      <div className="flex gap-6 h-[350px] w-full">
        <Form />
        <FavoriteItems />
      </div>
      <div>
        {selectedKeywords?.length > 0 && loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: selectedKeywords.length }).map((_, i) => (
              <CardLoader key={i} />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Data scrapedData={(data as TScrapedResult) ?? {}} />
        )}
      </div>
    </main>
  );
};

export default Page;
