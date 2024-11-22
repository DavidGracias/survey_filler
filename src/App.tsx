import { ThemeProvider } from '@emotion/react';
import { CssBaseline, Container, createTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import GenericSurvey from './components/GenericSurvey';
import Example from './components/Example';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#323e42"
    },
  },
});

const defaultBody = "<html></html>";
const defaultUrl = "";
const defaultTabId = 0;

// App will load the first component whose url-fragments are part of the url
const Sites: { urlfragments: string[]; Component: React.ComponentType<ComponentProps> }[] = [
  {
    urlfragments: ["surveymonkey"],
    Component: GenericSurvey,
  },
  {
    urlfragments: [],
    Component: Example,
  },
];
const targetUrls = Sites.flatMap(site => site.urlfragments);

export default function App() {
  const [body, setBody] = useState<string>(defaultBody);
  const [url, setUrl] = useState<string>(defaultUrl);
  const [tabId, setTabId] = useState<number>(defaultTabId);

  const updateTabInformation = (tab: chrome.tabs.Tab) => {
    // Unable to get tab information
    if (!tab || !tab.id || !tab.url || tab.url.startsWith("chrome://")) {
      setBody(defaultBody);
      setUrl(defaultUrl);
      setTabId(defaultTabId);
      return;
    }
    // Shouldn't get tab information (ex. programatic tab open)
    if (["", "about:blank"].includes(tab.url)) return;

    if (!targetUrls.includes(tab.url)) return setUrl(tab.url!);

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => document.querySelector("body")!.outerHTML,
    }).then((results) => setBody(results[0].result!));
  };
  const queryActiveTabCallback = (callback: (tab: chrome.tabs.Tab) => void) =>
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([firstTabResult]) => callback(firstTabResult));

  chrome.tabs.onCreated.addListener(updateTabInformation);
  chrome.tabs.onActivated.addListener((activeInfo) => queryActiveTabCallback(updateTabInformation));
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => updateTabInformation(tab));

  // Refresh body every second
  const [count, setCount] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(!count);
      queryActiveTabCallback(updateTabInformation);
    }, 1e3);
    return () => clearTimeout(timer);
  }, [count]);

  const [Component, setComponent] = useState<React.ComponentType<ComponentProps>>(Example);
  useEffect(() => {
    if (url === defaultUrl) return;
    for (let i = 0; i < Sites.length; ++i) {
      const site = Sites[i];
      for (let j = 0; j < site.urlfragments.length; ++j) {
        if (url.includes(site.urlfragments[j]))
          return setComponent(site.Component);
      }
    }
  }, [url]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ minWidth: "300px", padding: "10px" }}>
        {/* Pass props to the dynamically rendered component */}
        <Component url={url} body={body} tabId={tabId} />
      </Container>
    </ThemeProvider>
  );
}
