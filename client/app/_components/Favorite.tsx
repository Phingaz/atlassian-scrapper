"use client";

import React from "react";
import { motion } from "framer-motion";
import DataCard from "./DataCard";
import SectionWrapper from "./SectionWrapper";
import { useMain } from "../_context/Main";

const FavoriteItems = () => {
  const { favorites } = useMain();

  return (
    <>
      {favorites.length > 0 && (
        <SectionWrapper header="Saved For Later">
          <div className="flex flex-col gap-6">
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
        </SectionWrapper>
      )}
    </>
  );
};

export default FavoriteItems;
