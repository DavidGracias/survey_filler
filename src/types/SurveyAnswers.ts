import { Information } from "./Information";

type PageText = string[];
export type PageAction = (information: Information) => void;

export type Page = { text: PageText; action: PageAction };

class SurveyAnswers {
  private pages: Page[] = [];
  private pagePromises: Promise<void>[] = [];

  nextButtonAction: () => void;

  constructor(param: string | (() => void)) {
    if (typeof param === "string") {
      this.nextButtonAction = () => {
        const nextButton = document.querySelector(param) as HTMLButtonElement;
        nextButton.click()
      };
    } else {
      this.nextButtonAction = param;
    }
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
      if (
        this.pages.some(
          (page) => page.text.sort().join() === pageText.sort().join()
        )
      ) {
        reject(new Error("Page already exists for: " + pageText));
      } else {
        this.pages.push({ text: pageText, action: pageAction });
        resolve();
      }
    });

    this.pagePromises.push(pagePromise);
  }

  getPageFromBody(body: string): Page {
    const document = new DOMParser().parseFromString(body, "text/html");
    document.body
      .querySelectorAll("script")
      .forEach((script) => script.remove());
    const cleanedBody = document.body.outerHTML;

    for (let page of this.pages) {
      if (this.isPageMatch(page.text, cleanedBody)) return page;
    }

    return {
      text: ["No page found; attempting to continue..."],
      action: () => {},
    };
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
