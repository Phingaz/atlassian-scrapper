import React from "react";

import { toast } from "sonner";
import { API_URL } from "@/lib/utils";
import { useMain } from "../_context/Main";
import useSocket from "./useSocket";

const useForm = () => {
  const {
    formPost,
    keywords,
    setKeywords,
    newKeyword,
    setNewKeyword,
    selectedKeywords,
    setSelectedKeywords,
    page,
    setError,
    minutes,
  } = useMain();

  const socket = useSocket();

  const handleAddKeyword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newKeyword) {
      toast.error("Please enter a keyword");
      return;
    }

    if (keywords.includes(newKeyword)) {
      toast.error("Keyword already exists");
      return;
    }

    toast.info(`Added ${newKeyword}`);
    setKeywords([...keywords, newKeyword]);
    setNewKeyword("");
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
    setSelectedKeywords(selectedKeywords.filter((k) => k !== keywordToRemove));
    toast.info(`Removed ${keywordToRemove} from the list`);
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const isSelected = prev.includes(keyword);
      return isSelected
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword];
    });

    const isSelected = selectedKeywords.includes(keyword);
    toast.info(
      `${isSelected ? "Removed" : "Added"} ${keyword} ${
        isSelected ? "from" : "to"
      } selected keywords`
    );
  };

  const fetchData = async () => {
    if (selectedKeywords.length === 0) {
      toast.error("Please select at least one keyword");
      return;
    }

    toast.info(
      `Fetching data for ${selectedKeywords.join(
        ", "
      )}.\nScraping ${page} total pages for each keyword`
    );

    try {
      await formPost.post(`${API_URL}/scrape`, {
        page,
        keywords: selectedKeywords,
      });

      if (minutes[0] !== 0) {
        socket.sendMessage(minutes[0].toString());
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return {
    handleAddKeyword,
    handleRemoveKeyword,
    handleKeywordToggle,
    fetchData,
  };
};

export default useForm;
