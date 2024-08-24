chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedUrls: [] });
  });
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.blockedUrls) {
      updateBlockRules(changes.blockedUrls.newValue);
    }
  });
  
  function updateBlockRules(blockedUrls) {
    // Remove all existing rules
    chrome.declarativeNetRequest.getDynamicRules(rules => {
      const ruleIds = rules.map(rule => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      }, () => {
        // Add new rules
        const newRules = blockedUrls.map((url, index) => ({
          id: index + 1,
          priority: 1,
          action: { type: 'block' },
          condition: { urlFilter: url, resourceTypes: ['main_frame'] }
        }));
  
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: newRules
        });
      });
    });
  }