// Add this at the top of the file to handle configuration
const DEFAULT_NGROK_SUBDOMAIN = 'your-subdomain'; // Replace with your default subdomain

browser.browserAction.onClicked.addListener(async (tab) => {
  try {
    // Get the stored key and value template
    const result = await browser.storage.sync.get(["hashKey", "hashValue"]);
    const hashKey = result.hashKey;
    const valueTemplate = result.hashValue;
    
    browser.tabs.executeScript({
      code: `
        (function() {
          const hashKey = '${hashKey}';
          const hashValue = '${valueTemplate}'.replace('${value}', '${result.subdomain || "default"}');
          
          function updateUrlWithoutReload() {
            if (!location.hash) {
              console.log('Adding hash parameter', hashKey, hashValue);
              const newUrl = location.href + '#' + hashKey + '=' + hashValue;
              window.history.replaceState(null, '', newUrl);
            } else {
              console.log('Replacing hash parameter', hashKey, hashValue);
              const existingHash = location.hash.substring(1);
              const params = {};
              
              existingHash.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key && key !== hashKey) {
                  params[key] = value;
                }
              });
              
              params[hashKey] = hashValue;
              
              const newHash = Object.entries(params)
                .map(([key, value]) => key + '=' + value)
                .join('&');

              const newUrl = location.pathname + location.search + '#' + newHash;
              window.history.replaceState(null, '', newUrl);
            }

            window.dispatchEvent(new CustomEvent('urlHashChanged', {
              detail: { [hashKey]: hashValue }
            }));
          }

          updateUrlWithoutReload();
        })();
      `
    });
  } catch (error) {
    console.error('Error adding hash:', error);
  }
}); 
