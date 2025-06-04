import type { Day } from "~/types/day"

type DayDict = {
  [key in Day]: string;
};

export const DayDict: DayDict = {
  "MON": "1",
  "TUE": "2",
  "WED": "3",
  "THU": "4",
  "FRI": "5",
  "SAT": "6",
  "SUN": "7",
}