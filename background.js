chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Function to inject SurveyAnswer context into webpage
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'INJECT_SURVEYANSWER_CONTEXT' && sender.tab) {
    const injectCode = Object.entries(message.context)
      .map(([key, value]) => `window.${key} = ${value};`)
      .join('\n');

    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: (code) => {
        const script = document.createElement('script');
        script.textContent = code;
        document.documentElement.appendChild(script);
        script.remove();
      },
      args: [injectCode]
    });
  }
});



// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'openSidePanel',
//     title: 'Open side panel',
//     contexts: ['all']
//   });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'openSidePanel') {
//     // This will open the panel in all the pages on the current window.
//     tab && chrome.sidePanel.open({ windowId: tab.windowId });
//   }
// });