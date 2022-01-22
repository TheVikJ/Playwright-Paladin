chrome.webRequest.onBeforeRequest.addListener(function(details) { 
    return {cancel: true}; 
},
{urls: ["https://www.netflix.com", "http://www.youtube.com/*"]},
["blocking"]);