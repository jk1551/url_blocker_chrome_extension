document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const addButton = document.getElementById('addButton');
    const urlList = document.getElementById('urlList');

    function loadUrls() {
        chrome.storage.sync.get(['blockedUrls'], (result) => {
            const blockedUrls = result.blockedUrls || [];
            urlList.innerHTML = '';
            blockedUrls.forEach((url, index) => {
                const li = document.createElement('li');
                li.textContent = url;
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = () => removeUrl(index);
                li.appendChild(removeButton);
                urlList.appendChild(li);
            });
        });
    }

    function addUrl() {
        const url = urlInput.value.trim();
        if (url) {
            chrome.storage.sync.get(['blockedUrls'], (result) => {
                const blockedUrls = result.blockedUrls || [];
                blockedUrls.push(url);
                chrome.storage.sync.set({ blockedUrls }, () => {
                    urlInput.value = '';
                    loadUrls();
                });
            });
        }
    }

    function removeUrl(index) {
        chrome.storage.sync.get(['blockedUrls'], (result) => {
            const blockedUrls = result.blockedUrls || [];
            blockedUrls.splice(index, 1);
            chrome.storage.sync.set({ blockedUrls }, loadUrls);
        });
    }

    addButton.addEventListener('click', addUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addUrl();
        }
    });

    loadUrls();
});