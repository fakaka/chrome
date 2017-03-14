(function(){
	
	var DailyMotion = function(){		
	
		const TITLE_MAX_LENGTH  = 96;
	
		var mediaDetectCallbacks = [];

		function checkDailyMotionPage( data, callback ){
			
			var url = data.url;

			if( url.toLowerCase().indexOf( "dailymotion.com/video/" ) != -1 )
			{
			
				getContentFromDailyMotionPage( url, callback );   			
				
			}
			else if( url.toLowerCase().indexOf( "dailymotion.com/playlist/" ) != -1 )
			{
			
			}
			else
			{	
			 	callback( null ); 
			}
		}
		
		function getContentFromDailyMotionPage( url, callback ){
			
			// send request to DailyMotion
			var ajax = new XMLHttpRequest();
			ajax.open('GET', url, true);
			ajax.setRequestHeader('Cache-Control', 'no-cache');
			
			ajax.onload = function(){
				var content = this.responseText;

				parseDailyMotionEmbed( content, function( media )  {
					callback( media );
				} );
			}
			
			ajax.onerror = function(){
				callback( null );
			}
			
			ajax.send( null );
		
		}
		
		// ----------------------------------------------------------
		function get_JSON_param( name, val ){			
		
			var x = '"' + name + '"\s*:\s*"([^\"]+?)"';
			var rxe = new RegExp( x, 'i');
			var m  = rxe.exec(val);
			if (m)	return m[1];
			return null;
		}
		
		// ----------------------------------------------------------
		function parseDailyMotionEmbed( content, callback ){			
		
			// название
			var videoTitle='';
            var headTitle = content.match(/<span[^>]+title="([^\"]+?)"/i);
            if (headTitle != null)
			{
				videoTitle = headTitle[1].replace(/&#039;/g, '\'');;
			}	
		
		    var paramFlashvars = content.match(/var\s*flashvars = (.*?);/i);
            if (paramFlashvars == null) return;
			var paramElements = decodeURIComponent( paramFlashvars[1] );

			var m  = get_JSON_param( 'videoTitle', paramElements );
			if ( videoTitle == null ) videoTitle = m;

			var tags={
					"hd1080": {		label: "HD1080",	size: "1080",			  },
					"hd720":  {		label: "HD720",		size: "720",	  		  },
					"hq":     {		label: "HQ",		size: "480",			  },
					"sd":     {	    label: "SD",		size: "480",			  },
					"ld":     {		label: "LD",		size: "480",			  },
					}

            var mediaFound = false;
                
            var parsedMediaList = [];
					
			for(var n in tags) 
			{
				var m  = get_JSON_param( n+"URL", paramElements );
				
				if (m)
				{
	                var url = m.replace(new RegExp("\/", "g"), "");

					var label=tags[n].label;
					var size =tags[n].size; 
					var extension="flv";
					var mExt=/\.([0-9a-zA-Z]+)(?:$|\?)/.exec(url);
					if(mExt)	extension=mExt[1];

/*					
					console.log(url);
					console.log(label);
					console.log(size);
					console.log(extension);
					console.log(videoTitle);*/
					
                    var media = {
                        displayName: videoTitle + "." + extension,
                        url: url,
                        quality: label,
                        ext: extension,
                        downloadName: videoTitle + "." + extension,
						size: size,
						orderField:  0
                    };
                    
                    parsedMediaList.push(media);
                    
                    mediaFound = true;
				}	
			}	
			
			callback( parsedMediaList );
		
		}
		
		function storeMedia( media, data ){
			
			media.forEach(function( item ){
				item.tabId = data.tabId;
				item.priority = 1;
				item.source = "DailyMotion";
				item.check = fvdSingleDownloader.Media.checkExtByContentType(item.ext);
			});
			
			mediaDetectCallbacks.forEach( function( callback ){
				callback( media );
			} );
			
			// событие
			fvdSingleDownloader.AD.getRotationItem( function( item ){

				fvdSingleDownloader.ContentScriptController.processMessage( data.tabId, {
					action: "insertDMButton",
					media: media,
					ad: item
				} );				
				
			} );

		}
		
		this.onMediaDetect = {
			addListener: function( callback ){
				if( mediaDetectCallbacks.indexOf( callback ) == -1 )
				{
					mediaDetectCallbacks.push( callback );
				}
			}
		}
		
		this.isEqualItems = function( item1, item2 )		{
			if( item1.type == item2.type && item1.displayName == item2.displayName  && item1.url == item2.url )
			{
				return true;
			}
			return false;
		}
		
		
        chrome.webRequest.onResponseStarted.addListener(function(data){
		
			if ( data.url.match( /http:\/\/(www\.)?dailymotion(\.co)?\.([^\.\/]+)\//i ) )		
			{
			
				fvdSingleDownloader.Utils.Async.chain([
					
					function( chainCallback ){
						
						checkDailyMotionPage( data, function( mediaToSave )  {
							if( mediaToSave )
							{
								storeMedia( mediaToSave, data );
							}
							else
							{
								chainCallback();	
							}						
						} );
						
					},
				
					function(){
					
					}				
				
				]);   // fvdSingleDownloader.Utils.Async.chain
			
			}

		
        }, {
            urls: ["<all_urls>"],
			types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "other"]
        }, ["responseHeaders"]);
			
				
	}
	
	this.DailyMotion = new DailyMotion();
	
}).apply( fvdSingleDownloader.Media );
