browser.action.onClicked.addListener(async (tab) => {
  try {
    // Get the stored key and value
    const result = await browser.storage.sync.get(["hashKey", "hashValue"]);
    const { hashKey, hashValue } = result;
    
    if (!hashKey || !hashValue) {
      console.warn('Please configure the hash key and value in the extension options');
      return;
    }

    // Use the new scripting API instead of tabs.executeScript
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (key, value) => {
        function updateUrlWithoutReload() {
          if (!location.hash) {
            // No hash exists, add it
            const newUrl = location.href + '#' + key + '=' + value;
            window.history.replaceState(null, '', newUrl);
          } else {
            // Hash exists, update or add our parameter
            const existingHash = location.hash.substring(1);
            const params = {};
            
            // Parse existing hash parameters
            existingHash.split('&').forEach(pair => {
              const [k, v] = pair.split('=');
              if (k && k !== key) {
                params[k] = v;
              }
            });
            
            // Add our parameter
            params[key] = value;
            
            // Reconstruct the URL
            const newHash = Object.entries(params)
              .map(([k, v]) => k + '=' + v)
              .join('&');
            const newUrl = location.pathname + location.search + '#' + newHash;
            
            window.history.replaceState(null, '', newUrl);
          }
        }

        updateUrlWithoutReload();
      },
      args: [hashKey, hashValue]
    });
  } catch (error) {
    console.error('Error adding hash:', error);
  }
}); 
