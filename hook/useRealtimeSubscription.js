import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useRealtimeSubscription = (onDataChange) => {
  useEffect(() => {
    const dataTable = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "data_table" },
        (payload) => {
          console.log("Data table changed:", payload);
          onDataChange(payload); // Panggil fungsi callback
        }
      )
      .subscribe();

    // Bersihkan langganan saat komponen di-unmount
    return () => {
      supabase.removeChannel(dataTable);
    };
  }, [onDataChange]);
};
