import { Information } from "./Information";

type PageText = string[];
export type PageAction = (information: Information) => void;

export type Page = { text: PageText, action: PageAction };

class SurveyAnswers {
  private pages: Page[] = [];
  private pagePromises: Promise<void>[] = [];

  nextButtonQuery: string;

  constructor(nextButtonQuery: string) {
    this.nextButtonQuery = nextButtonQuery;
  }

  printPages(): void {
    let alertMessage = "";
    for (let page of this.pages) {
      alertMessage += page.text.join("\n") + "\n\n---\n";
    }
    window.alert("Survey Pages:" + alertMessage);
  }

  addPage(pageText: PageText, pageAction: PageAction): void {
    const pagePromise = new Promise<void>((resolve, reject) => {
      if (this.pages.some(page => this.isPageMatch(page.text, pageText.join(' ')))) {
        reject(new Error("Page already exists for: " + pageText));
      } else {
        this.pages.push({ text: pageText, action: pageAction });
        resolve();
      }
    });

    this.pagePromises.push(pagePromise);
  }

  getPageFromBody(body: string): Page | undefined {
    for (let page of this.pages) {
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

  async waitForAllPages(): Promise<void> {
    await Promise.all(this.pagePromises);
  }
}

export default SurveyAnswers;