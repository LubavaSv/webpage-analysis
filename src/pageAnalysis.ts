import { IPageAnalysis } from './IPageAnalysis';
import axios from 'axios';
import { html2json, Node } from 'html2json';

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
