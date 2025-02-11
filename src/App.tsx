import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Container, createTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Information, People } from "./types/Information";
import SurveyPicker from "./components/SurveyPicker";

// Change if Bela:
const INFORMATION = new Information(People.David);
export const DEBUG_MODE: boolean = true;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#323e42",
    },
  },
});

const defaultBody = "<html></html>";
const defaultUrl = "";
const defaultTabId = 0;

export default function App() {
  const [body, setBody] = useState<string>(defaultBody);
  const [url, setUrl] = useState<string>(defaultUrl);
  const [tabId, setTabId] = useState<number>(defaultTabId);

  const updateTabInformation = (tab: chrome.tabs.Tab) => {
    // Unable to get tab information
    if (!tab || !tab.id || !tab.url || tab.url?.startsWith("chrome://")) {
      setBody(defaultBody);
      setUrl(defaultUrl);
      setTabId(defaultTabId);
      return;
    }
    // Shouldn't get tab information (ex. programatic tab open)
    if (["", "about:blank"].includes(tab.url)) return;

    chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        func: () => document.querySelector("body")!.outerHTML,
      })
      .then((results) => setBody(results[0].result!));
    setUrl(tab.url!);
    setTabId(tab.id!);
  };

  const queryActiveTabCallback = (callback: (tab: chrome.tabs.Tab) => void) =>
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true },
      ([firstTabResult]) => callback(firstTabResult)
    );

  chrome.tabs.onCreated.addListener(updateTabInformation);
  chrome.tabs.onActivated.addListener((activeInfo) =>
    queryActiveTabCallback(updateTabInformation)
  );
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
    updateTabInformation(tab)
  );

  // Refresh body every second
  const [count, setCount] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(!count);
      queryActiveTabCallback(updateTabInformation);
    }, 1e3);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ minWidth: "300px", padding: "10px" }}>
        { (body != defaultBody) && <SurveyPicker
          url={url}
          body={body}
          tabId={tabId}
          information={INFORMATION}
        />}
      </Container>
    </ThemeProvider>
  );
}
