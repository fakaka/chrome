(function(){
	
	var ContentScriptController = function(){
		
		this.processMessage = function( tabId, message ){
			
			var file = "/js/contentScripts/contentScript.js";//chrome.extension.getURL("/js/contentScripts/contentScript.js");
			
			chrome.tabs.executeScript( tabId, {
				file: file
			}, function(){

				var port = chrome.tabs.connect( tabId );
				
				port.postMessage( message );
				
				port.onMessage.addListener(function( message ){
					
					switch( message.action ){
						case "getYTMEdia":
						
							fvdSingleDownloader.Media.Youtube.getContentFromYoutubePage( message.ytId, function( media ){
								
								port.postMessage( {
									action: "answer",
									media: media,
									requestId: message.requestId
								} );
								
							} );
							
							
						break;
						
						case "getDMMedia":
							fvdSingleDownloader.Media.prepareDailyMotion( message.media );
						break;
						
						case "download":
						
							fvdSingleDownloader.Media.startDownload( message.media );
						
						break;
						
						case "incrementAdCounter":
						
							fvdSingleDownloader.AD.incrementRotateCounter();
						
						break;
					}
					
				});
				
			});
		}
		
	}
	
	this.ContentScriptController = new ContentScriptController();
	
}).apply( fvdSingleDownloader );
