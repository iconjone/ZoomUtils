try {
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-162832688-1']);
  _gaq.push(['_trackPageview']);
} catch (r) {
  console.log(r, 'Page View Failed');
}
// test
(async function() {
  try {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  } catch (e) {
    console.log(e, 'Google Analytics Failed');
  }
})();
