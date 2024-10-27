import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { TScrapedResult } from "../page";
import DataCard from "./DataCard";
import SectionWrapper from "./SectionWrapper";
import useLocalStorage from "../_hooks/useLocalstorage";

const Data = ({ scrapedData }: { scrapedData: TScrapedResult }) => {
  const [openCards, setOpenCards] = useLocalStorage<string[]>("openCards", []);

  const toggleCard = (keyword: string) => {
    setOpenCards((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <SectionWrapper header="Result:">
      {Object.keys(scrapedData).length > 0 && (
        <>
          {Object.entries(scrapedData)?.map(([keyword, data]) => (
            <Card
              key={keyword}
              className="w-full cursor-pointer transition-shadow hover:shadow-md pb-4 mb-4 last:mb-0"
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
                        <ul className="flex flex-col gap-6">
                          {data.map((item, index) => (
                            <DataCard key={index} item={item} />
                          ))}
                        </ul>
                      </ScrollArea>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </>
      )}
    </SectionWrapper>
  );
};

export default Data;
