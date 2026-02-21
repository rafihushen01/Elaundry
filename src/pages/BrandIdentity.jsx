import React from "react";
import { motion } from "framer-motion";
import elaundrylogo from "../../public/Elaundry.png";

const BrandIdentity = ({
  title = "E-Laundry",
  subtitle = "Smart Laundry Experience",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  logoClassName = "",
  onClick,
}) => {
  return (
    <motion.div
      className={`flex items-center gap-3 ${onClick ? "cursor-pointer" : ""} ${className}`}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <motion.img
        src={elaundrylogo}
        alt="E-Laundry logo"
        className={`h-11 w-11 rounded-xl object-cover shadow-md ring-1 ring-emerald-200 ${logoClassName}`}
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      />
      <div className="leading-tight">
        <p className={`text-lg sm:text-xl font-bold tracking-tight text-emerald-800 ${titleClassName}`}>{title}</p>
        {subtitle ? <p className={`text-xs sm:text-sm text-emerald-600 ${subtitleClassName}`}>{subtitle}</p> : null}
      </div>
    </motion.div>
  );
};

export default BrandIdentity;
