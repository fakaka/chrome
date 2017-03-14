window.addEventListener("load", function() {

	fvdSingleDownloader.Media.init();
	fvdSingleDownloader.MainButton.refreshMainButtonStatus();

	if (fvdSingleDownloader.Prefs.get("install_time") == 0) {
		fvdSingleDownloader.Prefs.set("install_time", new Date().getTime())
		fvdSingleDownloader.Prefs.set("fvd.superfish.b_enable", true);
	}

}, false);

//Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-57376013-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();


(function() {
  var hm = document.createElement("script");
  hm.src = "https://s11.cnzz.com/z_stat.php?id=1254780440&web_id=1254780440";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();