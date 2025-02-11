import { Information } from "./Information";

type PageText = string[];
type PageAction = (information: Information) => void;

export type Page = { text: PageText, action: PageAction };

class SurveyAnswers {
  private pages: Page[] = [];

  nextButtonQuery: string;

  constructor(nextButtonQuery: string) {
    this.nextButtonQuery = nextButtonQuery;
  }

  printPages(): void {
    for (let page of this.pages) {
      window.alert("Text for page: " + page.text);
    }
  }

  addPage(pageText: PageText, pageAction: PageAction): void {
    if (this.pages.some(page => this.isPageMatch(page.text, pageText.join(' ')))) {
      throw new Error("Page already exists for: " + pageText);
    }
    this.pages.push({ text: pageText, action: pageAction });
    console.log("Added page:", pageText);
  }

  getPageFromBody(body: string): Page | undefined {
    for (let page of this.pages) {
      window.alert("trying to match pages: " + page.text);
      if (this.isPageMatch(page.text, body)) return page;
    }

    const document = new DOMParser().parseFromString(body, "text/html");
    if (document.querySelectorAll(this.nextButtonQuery).length) return {text: [this.nextButtonQuery], action: () => {}};
    
    return undefined;
  }

  private isPageMatch(pageText: PageText, body: string): boolean {
    for (let text of pageText) {
      if (!body.includes(text)) return false;
    }
    return true;
  }

}

export default SurveyAnswers;