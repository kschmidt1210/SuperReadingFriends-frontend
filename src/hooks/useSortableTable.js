import { useState, useEffect } from "react";

const useSortableTable = (initialData) => {
    console.log("📢 useSortableTable Received:", initialData);

    const [data, setData] = useState(initialData);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // 🔹 Ensure state updates when `initialData` changes
    useEffect(() => {
        setData(initialData);
        console.log("✅ Data Updated in useSortableTable:", initialData);
    }, [initialData]); // Runs whenever initialData changes

    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setData(sortedData);
        setSortConfig({ key, direction });
    };

    return { data, sortData, sortConfig };
};

export default useSortableTable;