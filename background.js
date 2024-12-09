browser.browserAction.onClicked.addListener(async (tab) => {
  try {
    // Get the stored key and value
    const result = await browser.storage.sync.get(["hashKey", "hashValue"]);
    const { hashKey, hashValue } = result;
    
    if (!hashKey || !hashValue) {
      console.warn('Please configure the hash key and value in the extension options');
      return;
    }

    browser.tabs.executeScript({
      code: `
        (function() {
          function updateUrlWithoutReload() {
            if (!location.hash) {
              // No hash exists, add it
              const newUrl = location.href + '#' + '${hashKey}' + '=' + '${hashValue}';
              window.history.replaceState(null, '', newUrl);
            } else {
              // Hash exists, update or add our parameter
              const existingHash = location.hash.substring(1);
              const params = {};
              
              // Parse existing hash parameters
              existingHash.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key && key !== '${hashKey}') {
                  params[key] = value;
                }
              });
              
              // Add our parameter
              params['${hashKey}'] = '${hashValue}';
              
              // Reconstruct the URL
              const newHash = Object.entries(params)
                .map(([key, value]) => key + '=' + value)
                .join('&');
              const newUrl = location.pathname + location.search + '#' + newHash;
              
              window.history.replaceState(null, '', newUrl);
            }
          }

          updateUrlWithoutReload();
        })();
      `
    });
  } catch (error) {
    console.error('Error adding hash:', error);
  }
}); 
