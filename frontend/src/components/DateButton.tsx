import React, { useState } from "react";

interface DateButtonProps {
  years: number;
  onApply: (date: string, years: number) => void;
}

const DateButton: React.FC<DateButtonProps> = ({ years, onApply }) => {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(today.getFullYear() - years);

  const formattedToday = today.toISOString().split("T")[0];
  const formattedPastDate = pastDate.toISOString().split("T")[0];

  const [tempDate] = useState<string>(formattedPastDate);

  const handleApply = () => {
    onApply(tempDate, years);
  };

  return (
    <div>
      <button
        onClick={handleApply}
        style={{
            background: "none",
            color: "white",
            cursor: "pointer",
        }}
      >
        {years} Year{years > 1 ? "s" : ""}
      </button>
    </div>
  );
};

export default DateButton;
