findAllURL = function changeAllURL(text){
    var current = window.location.href;
    if(current.startsWith(text)){
      document.documentElement.innerHTML = '';
      document.documentElement.innerHTML = 'Domain is blocked';
      document.documentElement.scrollTop = 0;
    }
}

findAllURL("https://www.facebook.com/");
findAllURL("https://www.instagram.com/");
findAllURL("https://www.netflix.com/");
findAllURL("https://www.youtube.com/");
