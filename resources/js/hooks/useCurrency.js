// hooks/useCurrency.js
import { useCallback } from "react";

export default function useCurrency() {
  const formatCurrency = useCallback((value) => {
    if (value === null || value === undefined || value === "") {
      return "₱0.00";
    }
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  }, []);

  return { formatCurrency };
}
