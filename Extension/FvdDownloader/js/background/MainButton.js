if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var MainButton = function(){
		
			var self = this;
			
			const YOUTUBE_URL_SIGNS = [
				"//youtube.com",
				"//www.youtube.com",
				"//soloset.net",
				"//www.soloset.net",
				"//solosing.com",
				"//www.solosing.com"
			];
			
			const DAILYMOTION_URL_SIGNS = [
				"//dailymotion.com",
				"//www.dailymotion.com",
				"//dmcdn.net"
			];
			
			function getActiveTab(callback){
				fvdSingleDownloader.Utils.getActiveTab(callback);
			}
			
			function setMainButtonStatus(can, tabId){
				//console.log(tabId, can);
				
				var img = chrome.extension.getURL('images/' + (can ? 'fvd.single.can_download.png' : 'fvd.single.cant_download.png'));
				chrome.browserAction.setIcon({
					path: img,
					tabId: tabId
				});
			}
			
			function checkExtByContentType( contentType )
			{
				var name = "fvd.enable_" + contentType;
				var x = fvdSingleDownloader.Prefs.get( name );
				if( x == 'false' )  return false;
				return true;
			}
			
			function refreshMainButtonStatus(){
			
				getActiveTab(function(tab){
				
					if (fvdSingleDownloader.noYoutube) {
					
						if (self.isYoutubeUrl(tab.url)) {
						
							chrome.browserAction.setTitle({
								title: _("noyoutube_message"),
								tabId: tab.id
							});
							
						}
						
					}
					
					if (!tab) 
					{
						setMainButtonStatus(false);
						return;
					}
					
					if (fvdSingleDownloader.Media.Storage.hasDataForTab(tab.id)) 
					{

						var items = fvdSingleDownloader.Media.Storage.getDataForTab( tab.id );
						
						var flag = false;
						
						items.forEach(function( item ){
									try
									{
										if (checkExtByContentType( item.ext ))
										{
											flag = true;
										}	
									}
									catch( ex ){	console.log( ex );		}

								});
						
						setMainButtonStatus(flag, tab.id);
						
					}
					else 
					{
					
						setMainButtonStatus(false, tab.id);
						
					}
					
				});
				
			}
			
			this.refreshMainButtonStatus = function(){
				refreshMainButtonStatus();
			}
			
			this.isYoutubeUrl = function(url){
				var url = url.toLowerCase();
				
				for( var i = 0; i != YOUTUBE_URL_SIGNS.length; i++ ){
					if( url.indexOf( YOUTUBE_URL_SIGNS[i] ) != -1 ){
						return true;
					}
				}
				
				return false;
			}
			
			this.isDailyMotionUrl = function(url){
				var url = url.toLowerCase();
				
				for( var i = 0; i != DAILYMOTION_URL_SIGNS.length; i++ )
				{
					if( url.indexOf( DAILYMOTION_URL_SIGNS[i] ) != -1 )				return true;
				}
				
				return false;
			}
			
			chrome.tabs.onUpdated.addListener(function(tabId, info){
			
				getActiveTab(function(tab){
				
					if (!info.status) {
						return;
					}
					
					if (tab.id == tabId) {
						refreshMainButtonStatus();
					}
					
				});
				
				
				
			});
			
			chrome.tabs.onActivated.addListener(function(info){
			
				refreshMainButtonStatus();
				
			});
			
			fvdSingleDownloader.Media.onMediaForTabUpdate.addListener(function(tabId){
			
				getActiveTab(function(tab){
				
					if (!tab) {
						return;
					}
					
					if (tabId == tab.id) {
						refreshMainButtonStatus();
					}
					
				});
				
			});
			
		}
		
		this.MainButton = new MainButton();
		
	}).apply(fvdSingleDownloader);
}
else{
	fvdSingleDownloader.MainButton = chrome.extension.getBackgroundPage().fvdSingleDownloader.MainButton;
}
