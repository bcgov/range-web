import puppeteer from 'puppeteer';

const setupBrowser = async () => {
  const browser = await puppeteer.launch({
    headlesss: process.env.CI,
    devtools: !process.env.CI,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  return { browser, page };
};

export default setupBrowser;
