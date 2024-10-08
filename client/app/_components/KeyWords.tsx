import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import React from "react";

const KeyWords = ({
  page,
  setPage,
  isLoading,
  newKeyword,
  setNewKeyword,
  handleAddKeyword,
  fetchData,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  newKeyword: string;
  handleAddKeyword: () => void;
  setNewKeyword: React.Dispatch<React.SetStateAction<string>>;
  fetchData: () => Promise<void>;
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-[500] mb-2">Add Keywords:</h2>
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Enter a keyword"
          className="flex-grow"
        />
        <Button type="button" onClick={handleAddKeyword}>
          <Plus className="mr-2 h-4 w-4" /> Add Keyword
        </Button>
      </form>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-2 items-center"
      >
        <Input
          type="number"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          placeholder="Enter page number"
          className="w-32"
          min={1}
        />
        <Button type="button" onClick={fetchData} disabled={isLoading}>
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Fetching..." : "Fetch Data"}
        </Button>
      </form>
    </div>
  );
};

export default KeyWords;
