import React, { useState } from "react";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { TScrapedData } from "../page";

const Data = ({ scrapedData }: { scrapedData: TScrapedData }) => {
  const [openCards, setOpenCards] = useState<string[]>([]);

  const toggleCard = (keyword: string) => {
    setOpenCards((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <div>
      {Object.keys(scrapedData).length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Result:</h2>
          {Object.entries(scrapedData)?.map(([keyword, data]) => (
            <Card
              key={keyword}
              className="w-full cursor-pointer transition-shadow hover:shadow-md pb-4"
              onClick={() => toggleCard(keyword)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium capitalize">
                  {keyword} ({data.length})
                </CardTitle>
                {openCards.includes(keyword) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardHeader>
              <AnimatePresence>
                {openCards.includes(keyword) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      <ScrollArea className="h-[300px] w-full pr-4">
                        <ul className="flex flex-col gap-4">
                          {data.map((item, index) => (
                            <li key={index} className="flex flex-col">
                              <div className="flex gap-2 items-center">
                                <CalendarIcon
                                  size={14}
                                  className="text-gray-600 flex-shrink-0"
                                />
                                <span className="text-xs text-gray-600 whitespace-nowrap">
                                  {item.date} - {item.dateValue}
                                </span>
                              </div>
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline truncate"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Data;
