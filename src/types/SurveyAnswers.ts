import { Information } from "./Information";

export type PageText = string[];
export type PageAction = (information: Information) => void;

class SurveyAnswers {
  private pages: Map<PageText, PageAction>;

  nextButtonQuery: string;

  constructor(nextButtonQuery: string) {
    this.nextButtonQuery = nextButtonQuery;
    this.pages = new Map<PageText, PageAction>();
  }

  addPage(pageText: PageText, pageAction: PageAction): void {
    if (this.pages.has(pageText)) throw new Error("Page already exist for: " + pageText);

    this.pages.set(pageText, pageAction);
  }

  getPageTextActionFromBody(body: string): [PageText, PageAction] | undefined {
    for (let [pageText, pageAction] of this.pages.entries()) {
      if (this.isPageMatch(pageText, body)) return [pageText, pageAction];
    }

    const document = new DOMParser().parseFromString(body, "text/html");;
    if (document.querySelectorAll(this.nextButtonQuery).length) return [[this.nextButtonQuery], () => {}];
    
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