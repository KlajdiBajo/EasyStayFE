import React from 'react'

const Title = ({ title, subtitle, align = "left" }) => (
  <div className={`mb-8 ${align === "left" ? "text-left" : "text-center"}`}>
    <h1 className="font-playfair text-4xl md:text-[40px] font-bold mb-2">{title}</h1>
    {subtitle && (
      <p className="text-gray-500 text-base md:text-lg mt-2">
        {subtitle}
      </p>
    )}
  </div>
);

export default Title;


