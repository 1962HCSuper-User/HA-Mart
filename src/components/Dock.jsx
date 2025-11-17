import React from "react";
import { motion } from "framer-motion";
import "./Dock.css";

const Dock = ({ items, panelHeight = 68, baseItemSize = 50, magnification = 70 }) => {
  return (
    <div className="dock-outer">
      <div
        className="dock-panel"
        style={{ height: `${panelHeight}px` }}
      >
        {items.map((item, i) => (
          <motion.button
            key={i}
            className="dock-item"
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={item.onClick}
            style={{
              width: `${baseItemSize}px`,
              height: `${baseItemSize}px`,
            }}
          >
            <div className="dock-icon">{item.icon}</div>
            <span className="dock-label">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Dock;
