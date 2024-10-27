import { CalendarIcon, Star } from "lucide-react";
import React from "react";
import { TScrapedData } from "../page";
import { useMain } from "../_context/Main";
import { motion } from "framer-motion";

const MotionStar = motion.create(Star);

const DataCard = ({ item }: { item: TScrapedData }) => {
  const { setFavorites, favorites } = useMain();

  const handleFavorite = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <li className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <CalendarIcon size={14} className="text-gray-600 flex-shrink-0" />
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {item.date} - {item.dateValue}
          </span>
        </span>
        <MotionStar
          size={17}
          onClick={handleFavorite}
          whileTap={{ scale: 0.7 }}
          fill={favorites.includes(item) ? "#FFD700" : "#ccc"}
          stroke={favorites.includes(item) ? "#FFD700" : "#ccc"}
          className="cursor-pointer outline-none border-none ring-0 focus:outline-none"
        />
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
  );
};

export default DataCard;
