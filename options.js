function saveOptions(e) {
  e.preventDefault();
  const status = document.getElementById('status');
  const hashKey = document.querySelector("#hashKey").value;
  const hashValue = document.querySelector("#hashValue").value;

  browser.storage.sync.set({
    hashKey,
    hashValue
  }).then(() => {
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  }).catch((error) => {
    console.error('Error saving options:', error);
    status.textContent = 'Error saving settings!';
    status.style.color = 'red';
    status.style.display = 'block';
  });
}

function restoreOptions() {
  browser.storage.sync.get(["hashKey", "hashValue"]).then((result) => {
    document.querySelector("#hashKey").value = result.hashKey;
    document.querySelector("#hashValue").value = result.hashValue;
  }).catch((error) => {
    console.error('Error loading options:', error);
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
