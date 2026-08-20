// Tribune Trader — Auth Gate
// Runs inline before page renders. Redirects to login.html if not authenticated.
(function() {
  if (sessionStorage.getItem('tt_auth') !== 'granted') {
    // Preserve destination so login can redirect back
    const dest = window.location.pathname + window.location.search;
    window.location.replace('/login.html?next=' + encodeURIComponent(dest));
  }
})();
