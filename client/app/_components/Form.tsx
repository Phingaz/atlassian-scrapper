"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useForm from "../_hooks/useForm";
import { useMain } from "../_context/Main";
import SectionWrapper from "./SectionWrapper";

const Form = () => {
  const {
    fetchData,
    handleAddKeyword,
    handleRemoveKeyword,
    handleKeywordToggle,
  } = useForm();

  const {
    formPost,
    keywords,
    selectedKeywords,
    newKeyword,
    page,
    setNewKeyword,
    setPage,
  } = useMain();

  const isLoading = formPost.loading;

  return (
    <SectionWrapper header="Select keywords to fetch" className="w-full">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {keywords.map((keyword) => (
              <motion.div
                key={keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`relative cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 text-sm font-[500] ${
                  selectedKeywords.includes(keyword)
                    ? "bg-gray-800 text-gray-50 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleKeywordToggle(keyword)}
              >
                {keyword}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveKeyword(keyword);
                  }}
                  className="absolute -top-2 -right-2 bg-white text-gray-700 rounded-full p-1 hover:text-white hover:bg-red-600 transition-all duration-300"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <form onSubmit={handleAddKeyword} className="flex gap-2">
          <Input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add new keyword"
            className="flex-grow"
          />
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="w-full">
            <label htmlFor="page" className="text-sm font-medium mb-2 block">
              Number of pages to fetch
            </label>
            <Input
              id="page"
              type="number"
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              placeholder="Enter page number"
              min={1}
              className="w-full"
            />
          </div>
          <Button onClick={fetchData} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Fetching..." : "Fetch Data"}
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Form;
