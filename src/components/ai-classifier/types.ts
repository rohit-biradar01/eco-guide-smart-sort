export interface ClassificationResult {
  item: string;
  category: string;
  bin_color: string;
  instructions: string;
}

export interface ImageClassificationResult {
  segmentedImageUrl: string;
  category: string;
  confidence: number;
  details: string;
}

export const binColorStyles: Record<string, { bg: string; border: string; badge: string; iconName: string }> = {
  Blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-400 dark:border-blue-500",
    badge: "bg-blue-500 text-white",
    iconName: "recycle",
  },
  Black: {
    bg: "bg-gray-50 dark:bg-gray-900/30",
    border: "border-gray-500 dark:border-gray-400",
    badge: "bg-gray-700 text-white",
    iconName: "trash",
  },
  Green: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-400 dark:border-emerald-500",
    badge: "bg-emerald-500 text-white",
    iconName: "leaf",
  },
  Red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-400 dark:border-red-500",
    badge: "bg-red-500 text-white",
    iconName: "alert",
  },
  Orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-400 dark:border-orange-500",
    badge: "bg-orange-500 text-white",
    iconName: "cpu",
  },
};
