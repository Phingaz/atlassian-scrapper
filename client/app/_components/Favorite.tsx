"use client";

import React from "react";
import { motion } from "framer-motion";
import DataCard from "./DataCard";
import SectionWrapper from "./SectionWrapper";
import { useMain } from "../_context/Main";
import { AlertCircle } from "lucide-react";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";

const FavoriteItems = () => {
  const { favorites } = useMain();

  return (
    <SectionWrapper header="Saved For Later" className="w-full">
      {favorites.length === 0 ? (
        <div className="flex items-center gap-2 h-full">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
          <div>
            <AlertTitle>You have no saved items</AlertTitle>
            <AlertDescription>
              Save items by clicking the star icon on the cards
            </AlertDescription>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {favorites.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DataCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default FavoriteItems;
