export const executeScript = <T extends any[]>(tabId: number, args: T, func: (...args: T) => any) =>
  chrome.scripting.executeScript({
    target: {
      tabId: tabId,
      allFrames: true,
    },
    world: "MAIN",
    func: func,
    args: args,
  });

