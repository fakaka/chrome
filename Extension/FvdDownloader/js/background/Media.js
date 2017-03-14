if (window == chrome.extension.getBackgroundPage()) {

	(function(){
	
		var Media = function(){
		
			var self = this;
			
			var _onMediaForTabUpdateListeners = [];
			
			const DETECT_MODULES = ["Sniffer", "Youtube", "DailyMotion"];
			
			this.startDownload = function( media ){
				
				fvdSingleDownloader.Utils.Async.chain( [
					function( chainCallback ){
						if( fvdSingleDownloader.noYoutube == false )
						{
							fvdSingleDownloader.FvdSuite.downloadMedia( media, function( result ){
								if( !result )
								{
									chainCallback();
								}
							} );						
						}
						else
						{
							chainCallback();	
						}
						
					},
					function( chainCallback ){

						// изменение по доработке к сайту gogvo.com	
						if( media.url.toLowerCase().indexOf( "gvovideo.com" ) != -1)
						{
							chrome.tabs.create({
												url: media.url,
												active: false
												});		
							return;
						}	
					
						if( chrome.downloads )
						{							
							chrome.downloads.download({
								url: media.url,
								filename: media.downloadName,
								saveAs: true
							});
						}
						else
						{
							fvdSingleDownloader.Utils.getActiveTab(function( tab ){
								fvdSingleDownloader.ContentScriptController.processMessage( tab.id, {
									action: "startDownload",
									media: media
								} );
							});
						}						
						
					}
					
				] );
				
			}
			
			this.prepareDailyMotion = function( media ){

					var tabId = null;
					
					fvdSingleDownloader.Utils.Async.chain( [function( chainCallback ){
						
						var tabId = null;
						if (media)
						{
							if( media.length )	tabId = media[0].tabId;
										else	tabId = media.tabId;
						}
							
						chrome.tabs.get( tabId, function( tab ){	chainCallback();	} );
					},
					
					function(){
						
						if( media.length )
						{							
							media.forEach(function( item ){
								tabId = item.tabId;
								self.Storage.addItemForTab(item.tabId, item);							
							});
						}
						else
						{							
							tabId = media.tabId;
							self.Storage.addItemForTab(media.tabId, media);
						}
				
						chrome.extension.sendRequest( {
							subject: "mediaForTabUpdate",
							data: tabId
						} );
				
						_onMediaForTabUpdateListeners.forEach(function(listener){
							
							try
							{
								listener(tabId);							
							}
							catch( ex ){	}
							
						});
						
					}] );
				
				
			}
			
			this.checkExtByContentType = function( contentType ) {
				var name = "fvd.enable_" + contentType;
				var x = fvdSingleDownloader.Prefs.get( name );
				if( x == 'false' )  return false;
				return true;
			}
						
			this.init = function(){
				
				this.Storage.onMediaRemove.addListener(function( tabId ){

					console.log( "REMOVE ITEM " + tabId );
					
					_onMediaForTabUpdateListeners.forEach(function(listener){
						
						try{
							listener(tabId);							
						}
						catch( ex ){
							
						}
						
					});
				
				});
				
				function checkExtByContentType( contentType )
				{
					var name = "fvd.enable_" + contentType;
					var x = fvdSingleDownloader.Prefs.get( name );
					if( x == 'false' )  return false;
					return true;
				}
		
				
												
				function mediaDetectListener(media){
					
					var tabId = null;
					
					fvdSingleDownloader.Utils.Async.chain( [function( chainCallback ){
						
						if( fvdSingleDownloader.noYoutube ){
							var tabId = null;
							if (media)
							{
								if( media.length )	tabId = media[0].tabId;
											else	tabId = media.tabId;
							}
							
							chrome.tabs.get( tabId, function( tab ){
											
								if( tab.url.toLowerCase().indexOf( "http://youtube.com" ) != -1
									|| tab.url.toLowerCase().indexOf( "http://www.youtube.com" ) != -1 ){
							
								}
								else{
									chainCallback();
								}
								
							} );
							
						}
						else{
							chainCallback();
						}
						
					},
					
					function(){
						
						if( media.length ){							
							
							media.forEach(function( item ){
								tabId = item.tabId;
								self.Storage.addItemForTab(item.tabId, item);							
							});
						}
						else{							
							tabId = media.tabId;
							self.Storage.addItemForTab(media.tabId, media);
						}
				
						chrome.extension.sendRequest( {
							subject: "mediaForTabUpdate",
							data: tabId
						} );
				
						_onMediaForTabUpdateListeners.forEach(function(listener){
							
							try{
								listener(tabId);							
							}
							catch( ex ){
								
							}
							
						});
						
					}] );
					
					

					
				};
				
				DETECT_MODULES.forEach( function( module ){
					if( self[module] )
					{
						self[module].onMediaDetect.addListener(mediaDetectListener);						
					}
					
				} );
				
				chrome.tabs.onRemoved.addListener( function( tabId ){
					if( fvdSingleDownloader.Media.Storage.hasDataForTab( tabId ) ){
						fvdSingleDownloader.Media.Storage.removeTabData( tabId );
						
						_onMediaForTabUpdateListeners.forEach(function( listener ){
							listener( tabId );
						});
					}
				} );
				
				chrome.tabs.onUpdated.addListener( function( tabId, changeInfo ){
					
					if( changeInfo.url ){
						if( fvdSingleDownloader.Media.Storage.hasDataForTab( tabId ) ){
							fvdSingleDownloader.Media.Storage.removeTabData( tabId );
							
							_onMediaForTabUpdateListeners.forEach(function( listener ){
								listener( tabId );
							});
						}
					}
					
				} );
				
				chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
				
							if ('command' in request)
							{
								switch (request['command'])
								{
									case 'filter_media':
									{
										var media = request['media'];
										var nMedia = [];
										for( var k in media )
										{
											var m = media[k];	
											if (checkExtByContentType( m.ext ))
											{
												nMedia.push(m);
											}	
										}
										sendResponse(nMedia);
									}

								}
							}
						});
				
				
				
			}
			
			this.onMediaForTabUpdate = {
				addListener: function(callback){
					if (_onMediaForTabUpdateListeners.indexOf(callback) == -1) {
						_onMediaForTabUpdateListeners.push(callback);
					}
				}
			}
			
			
			
		}
		
		this.Media = new Media();
		
	}).apply(fvdSingleDownloader);
	
}
else{
	fvdSingleDownloader.Media = chrome.extension.getBackgroundPage().fvdSingleDownloader.Media;
}
