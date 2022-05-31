import axios from 'axios';
import { html2json, Node } from 'html2json';
import { HtmlStats, PageAnalysis, PathStats } from './types';

const lib = {
  getPageAnalysis,
  getHtmlFromUrl,
  getHtmlTreeFromString,
  getHtmlTreeStats,
};

export async function getPageAnalysis(url: string): Promise<PageAnalysis> {
  const html = await lib.getHtmlFromUrl(url);
  const htmlTree = await lib.getHtmlTreeFromString(html);
  const treeStats = lib.getHtmlTreeStats(htmlTree);
  let mostCommonTag = '';
  const uniqueTags: string[] = [];

  for (let key in treeStats.tagsOccurrences) {
    if (treeStats.tagsOccurrences[key] === 1) uniqueTags.push(key);
    if (
      !mostCommonTag ||
      treeStats.tagsOccurrences[key] > treeStats.tagsOccurrences[mostCommonTag]
    ) {
      mostCommonTag = key;
    }
  }

  const longestPathWithMostCommonTag =
    treeStats.longestPaths[mostCommonTag].path;
  let longestPath: string[] = [];
  for (let key in treeStats.longestPaths) {
    if (
      !mostCommonTag ||
      treeStats.longestPaths[key].path.length > longestPath.length
    ) {
      longestPath = treeStats.longestPaths[key].path;
    }
  }

  return {
    mostCommonTag,
    uniqueTags,
    longestPath,
    longestPathWithMostCommonTag,
  };
}

export async function getHtmlFromUrl(url: string): Promise<string> {
  const response = await axios.get(url);
  return response.data;
}

export async function getHtmlTreeFromString(html: string): Promise<Node> {
  // remove <!doctype html ... > to escape a bug of html parser
  const cutA = html.indexOf('<!');
  const cutB = html.indexOf('>');
  const cut = cutA != -1 ? cutB + 1 : 0;
  const htmlRes = html.substring(cut);
  return html2json(htmlRes);
}

function getHtmlTreeStats(
  treeNode: Node,
  currentPath: PathStats = { tagsOccurrences: {}, path: [] },
  stats: HtmlStats = { tagsOccurrences: {}, longestPaths: {} },
  nestingLevel: number = 0
): HtmlStats {
  const currentPathInner: PathStats = {
    ...currentPath,
    path: [...currentPath.path],
    tagsOccurrences: { ...currentPath.tagsOccurrences },
  };
  if (treeNode.tag) {
    currentPathInner.path.push(treeNode.tag);
    currentPathInner.tagsOccurrences[treeNode.tag] =
      currentPathInner.tagsOccurrences[treeNode.tag] != undefined
        ? currentPathInner.tagsOccurrences[treeNode.tag] + 1
        : 1;
    stats.tagsOccurrences[treeNode.tag] =
      stats.tagsOccurrences[treeNode.tag] != undefined
        ? stats.tagsOccurrences[treeNode.tag] + 1
        : 1;
    if (
      !currentPathInner.mostCommonTag ||
      currentPathInner.tagsOccurrences[treeNode.tag] >=
        currentPathInner.tagsOccurrences[currentPathInner.mostCommonTag]
    ) {
      currentPathInner.mostCommonTag = treeNode.tag;
    }
  }
  if (treeNode.child) {
    if (!Array.isArray(treeNode.child)) {
      treeNode.child = [treeNode.child];
    }
    if (treeNode.tag && treeNode.child.some((child) => child.tag)) {
    }

    treeNode.child.forEach((child) => {
      lib.getHtmlTreeStats(child, currentPathInner, stats, nestingLevel + 1);
    });
  } else if (
    currentPathInner.mostCommonTag &&
    nestingLevel > 0 &&
    (!stats.longestPaths[currentPathInner.mostCommonTag] ||
      currentPathInner.path.length >
        stats.longestPaths[currentPathInner.mostCommonTag].path.length)
  ) {
    stats.longestPaths[currentPathInner.mostCommonTag] = {
      path: [...currentPathInner.path],
      tagsOccurrences: { ...currentPathInner.tagsOccurrences },
    };
  }
  return stats;
}

export default lib;
