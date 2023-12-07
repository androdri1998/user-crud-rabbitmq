import { format } from "date-fns";

export const formatDatetime = (date: Date): string => {
  return format(date, "yyyy-MM-dd HH:mm:ss");
};
