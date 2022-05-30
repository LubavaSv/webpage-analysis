import { IPageAnalysis } from './IPageAnalysis';
import axios from 'axios';
import { html2json, Node } from 'html2json';
import { IHtmlStats } from './IHtmlStats';

async function getPageAnalysis(url: string): Promise<IPageAnalysis> {
  const htmlTree = await getHtmlTreeFromUrl(url);
  return {
    uniqueTags: [],
    mostCommonTag: '',
  };
}

export async function getHtmlTreeFromUrl(url: string): Promise<Node> {
  const response = await axios.get(url);
  const html = response.data.substring(15); // to remove <!doctype html> - bug of html parser
  return html2json(html);
}

export function getHtmlTreeStats(
  treeNode: Node,
  stats: IHtmlStats
): IHtmlStats {
  if (treeNode.node === 'element' && treeNode.tag) {
    stats[treeNode.tag] =
      stats[treeNode.tag] != undefined ? stats[treeNode.tag] + 1 : 1;
  }
  if (treeNode.child) {
    if (Array.isArray(treeNode.child)) {
      treeNode.child.forEach((child) => getHtmlTreeStats(child, stats));
    } else {
      getHtmlTreeStats(treeNode.child, stats);
    }
  }
  return stats;
}
