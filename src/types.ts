export type PageAnalysis = {
  uniqueTags: string[];
  mostCommonTag: string;
  longestPath: string[];
  longestPathWithMostCommonTag: string[];
};
export type HtmlStats = {
  tagsOccurrences: { [tag: string]: number }; // total
  longestPaths: { [tag: string]: PathStats };
};
export type PathStats = {
  tagsOccurrences: { [tag: string]: number }; // in the path only
  path: string[];
  mostCommonTag?: string;
};
