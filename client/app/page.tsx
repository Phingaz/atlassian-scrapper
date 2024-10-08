"use client";

import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { API_URL } from "@/lib/utils";
import usePost from "./_hooks/usePost";
import useLocalStorage from "./_hooks/useLocalstorage";
import CardLoader from "./_components/Loader";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import KeyWords from "./_components/KeyWords";
import Data from "./_components/Data";

const SelectKeyWords = dynamic(() => import("./_components/SelectKeyWords"), {
  ssr: false,
});

export type TScrapedData = Record<
  string,
  { title: string; link: string; date: string; dateValue: string }[]
>;

const Page = () => {
  const { post, data, loading } = usePost<TScrapedData>();

  const [keywords, setKeywords] = useLocalStorage<string[]>("default", ["jql"]);
  const [page, setPage] = useLocalStorage<number>("page", 1);
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useLocalStorage<string[]>(
    "selectedKeyword",
    []
  );
  const [error, setError] = useState<string | null>(null);

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      toast.info(`Added ${newKeyword}`);
      setKeywords([...keywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(
      keywords.filter((keyword) => {
        toast.info(`Removed ${keywordToRemove} from keywords list`);
        return keyword !== keywordToRemove;
      })
    );
    setSelectedKeywords(
      selectedKeywords.filter((keyword) => {
        toast.info(`Removed ${keywordToRemove} from selected keywords list`);
        return keyword !== keywordToRemove;
      })
    );
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const isSelected = prev.includes(keyword);

      if (isSelected) {
        toast.info(`Removed ${keyword} from selected keywords`);
        return prev.filter((k) => k !== keyword);
      }

      toast.info(`Added ${keyword} to selected keywords`);
      return [...prev, keyword];
    });
  };

  const fetchData = async () => {
    toast.info(
      `Fetching data for ${selectedKeywords.join(
        ", "
      )}.\nScraping ${page} total pages for each keyword`
    );

    if (selectedKeywords.length === 0) {
      toast.error("Please select at least one keyword");
      return;
    }

    try {
      await post(`${API_URL}/scrape`, { keywords: selectedKeywords, page });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="my-8">
        <h1 className="text-4xl font-semibold ">Atlassian Community Scraper</h1>
        <p className="text-sm mt-3 max-w-xl">
          This is a simple web scraper that scrapes the Atlassian Community for
          the given keywords. It fetches the title, link, and date of the posts.
        </p>
      </div>

      <KeyWords
        page={page}
        setPage={setPage}
        fetchData={fetchData}
        isLoading={loading}
        newKeyword={newKeyword}
        setNewKeyword={setNewKeyword}
        handleAddKeyword={handleAddKeyword}
      />

      <SelectKeyWords
        keywords={keywords}
        selectedKeywords={selectedKeywords}
        handleKeywordToggle={handleKeywordToggle}
        handleRemoveKeyword={handleRemoveKeyword}
      />

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
        <Data scrapedData={data ?? {}} />
      )}
    </div>
  );
};

export default Page;
