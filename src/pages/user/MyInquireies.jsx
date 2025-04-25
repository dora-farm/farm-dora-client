import React, { useState } from "react";
import DateFilter from "./components/DateFilter";

function MyInquireies() {
    const [dateRange, setDateRange] = useState({
        startDate: "2025-01-01",
        endDate: "2025-12-31"
    });
    
    const [selectedRange, setSelectedRange] = useState('all');

    const handleRangeUpdate = (newRange, newSelected) => {
        setDateRange(newRange);
        setSelectedRange(newSelected);
    }




    return (
        <div className="w-full m-7">
            <h1 className="text-2xl font-bold text-center border-b-2 pb-5">내 문의 내역</h1>
            <DateFilter 
                dateRange={dateRange}
                selectedRange={selectedRange}
                onRangeUpdate={handleRangeUpdate}
            />
        </div>
    )
}

export default MyInquireies;