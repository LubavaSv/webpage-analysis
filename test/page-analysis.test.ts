import analyser from '../src/page-analysis';
import * as fs from 'fs';

describe('analyser', () => {
  it('should work with simple html', async () => {
    const html1 = fs.readFileSync('./test/sample1.html', 'utf8');
    const correctAnalysis = {
      mostCommonTag: 'block',
      uniqueTags: ['html', 'head', 'meta', 'title', 'body', 'p', 'span', 'a'],
      longestPath: ['html', 'body', 'div', 'div', 'div', 'a'],
      longestPathWithMostCommonTag: ['html', 'body', 'block', 'block', 'block'],
    };
    jest.spyOn(analyser, 'getHtmlFromUrl').mockResolvedValue(html1);
    const analysis = await analyser.getPageAnalysis('');
    expect(analysis).toEqual(correctAnalysis);
  });

  it('should work with complex html', async () => {
    const html2 = fs.readFileSync('./test/sample2.html', 'utf8');
    const correctAnalysis = {
      mostCommonTag: 'div',
      uniqueTags: ['head', 'title', 'link', 'body', 'h1', 'h3'],
      longestPath: [
        'body',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'ul',
        'li',
        'a',
        'span',
      ],
      longestPathWithMostCommonTag: [
        'body',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'ul',
        'li',
        'a',
        'span',
      ],
    };
    jest.spyOn(analyser, 'getHtmlFromUrl').mockResolvedValue(html2);
    const analysis = await analyser.getPageAnalysis('');
    expect(analysis).toEqual(correctAnalysis);
  });

  it('should work with complex html', async () => {
    const html3 = fs.readFileSync('./test/sample3.html', 'utf8');
    const correctAnalysis = {
      mostCommonTag: 'div',
      uniqueTags: ['html', 'head', 'title', 'link', 'body', 'h1', 'h3'],
      longestPath: [
        'html',
        'body',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'ul',
        'li',
        'a',
        'span',
      ],
      longestPathWithMostCommonTag: [
        'html',
        'body',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'div',
        'ul',
        'li',
        'a',
        'span',
      ],
    };
    jest.spyOn(analyser, 'getHtmlFromUrl').mockResolvedValue(html3);
    const analysis = await analyser.getPageAnalysis('');
    expect(analysis).toEqual(correctAnalysis);
  });
});
