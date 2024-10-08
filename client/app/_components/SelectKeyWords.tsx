import { X } from "lucide-react";
import React from "react";

const SelectKeyWords = ({
  keywords,
  selectedKeywords,
  handleKeywordToggle,
  handleRemoveKeyword,
}: {
  keywords: string[];
  selectedKeywords: string[];
  handleKeywordToggle: (keyword: string) => void;
  handleRemoveKeyword: (keyword: string) => void;
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-[500] mb-2">Select Keywords:</h2>
      <div className="flex flex-wrap gap-2">
        {keywords?.map((keyword) => (
          <div
            key={keyword}
            className={`relative cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 text-sm font-[500] ${
              selectedKeywords.includes(keyword)
                ? "bg-gray-800 text-gray-50 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleKeywordToggle(keyword)}
          >
            {keyword}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveKeyword(keyword);
              }}
              className="absolute -top-2 -right-2 bg-white text-gray-700 rounded-full p-1 hover:text-white hover:bg-red-600 transition-all duration-300"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectKeyWords;
