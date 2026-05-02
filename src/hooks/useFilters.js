import { useState } from "react";

export const useFilters = () => {
  const [filters, setFilters] = useState({
    status: ""

  });

  const [sortBy, setSortBy] = useState("");

  return { filters, sortBy, setFilters, setSortBy };
};

