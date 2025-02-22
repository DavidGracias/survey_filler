import { ThemeProvider } from "@emotion/react";
import {
  CssBaseline,
  Container,
  createTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Information, People } from "./types/Information";
import SurveyPicker from "./components/SurveyPicker";
import StarIcon from "@mui/icons-material/Star";
import { Block, ExpandLess, ExpandMore } from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#323e42",
    },
  },
});

const defaultUrl = "";
const defaultTabId = 0;
export const defaultBody = "<html></html>";

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
      .then((results) => {
        setBody(results[0].result!);
        if (DEBUG_MODE && body != results[0].result!) alert(`Body Changed!`);
      });
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

  // app specific code
  const [user, setUser] = useState<People>(People.David);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ minWidth: "300px", padding: "0 10px 10px 10px" }}>
        <Container sx={{ margin: "10px 0px" }}>
          <ListItemButton
            onClick={() => setOpenUserDropdown(!openUserDropdown)}
          >
            <ListItemText primary={People[user]} />
            {openUserDropdown ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openUserDropdown} timeout="auto" unmountOnExit>
            <List>
              {Object.values(People)
                .filter((value): value is People => typeof value !== "string")
                .map((person: People) => (
                  <ListItem key={person} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setUser(person);
                        setOpenUserDropdown(false);
                      }}
                    >
                      <ListItemIcon>
                        {person === user && <StarIcon />}
                      </ListItemIcon>
                      <ListItemText primary={People[person]} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Collapse>
        </Container>
        <Divider />
        <SurveyPicker
          url={url}
          body={body}
          tabId={tabId}
          information={useMemo(() => new Information(user), [user])}
        />
      </Container>
    </ThemeProvider>
  );
}

// other exports
export const DEBUG_MODE: boolean = true;
