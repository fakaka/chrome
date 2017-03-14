(function(){
	
			
	const FVD_DOWNLOADER_HIGHTLIGHBOX_ID = "fvdDownloaderHighlightBox";
	const FVD_DOWNLOADER_HIGHTLIGHBOX_STYLE = "position: absolute; border: 5px solid red;";
	const FVD_DOWNLOADER_HIGHTLIGHBOX_OFFSET = 4;
	const BUTTON_TITLE = "Download";
	const BUTTON_TOOLTIP = "Download";
	
	if(window.__fvdSingleDownloaderContentScriptInserted){
		return;
	}
	
		
	window.__fvdSingleDownloaderContentScriptInserted = true;

	function downloadMediaItem( media ){
	
		var a = document.createElement("a");
		
		a.setAttribute( "download", media.downloadName );
		a.setAttribute( "href", media.url );			
		//a.setAttribute( "target", "_blank" );	
		document.body.appendChild( a );

		var theEvent = document.createEvent("MouseEvent");
		
		theEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(theEvent);
				
		document.body.removeChild( a );
	}
	
	
	chrome.extension.onConnect.addListener(function( port ){				
		
		var pendingRequestLastId = 0;
		var pendingRequests = {};
		
		function addRequest( message, callback ){
			var requestId = pendingRequestLastId;
			pendingRequestLastId++;
			
			message.requestId = requestId;
			
			pendingRequests[ requestId ] = callback;
						
			port.postMessage( message );
		}
		
		function downloadMediaItemRequest( media ){
			
			port.postMessage( {
				action: "download",
				media: media
			} );
			
		}
		
		function getOffset( obj ) {
			var curleft = curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				}
				while(obj = obj.offsetParent);
			}
			
			
			
			return {
				"left": curleft,
				"top": curtop
			};
		}
		
		function highlightObject( object ){
			
			if( object.hasAttribute( "width" ) && object.hasAttribute("height") ){
				
				var box = document.getElementById( FVD_DOWNLOADER_HIGHTLIGHBOX_ID );
				if( !box ){
					box = document.createElement( "div" );
					box.setAttribute( "id", FVD_DOWNLOADER_HIGHTLIGHBOX_ID );
					box.setAttribute( "style", FVD_DOWNLOADER_HIGHTLIGHBOX_STYLE );
					box.style.display = "none";
					document.body.appendChild( box );
				}
				
				var offset = getOffset( object );
				
				box.style.left = offset.left - FVD_DOWNLOADER_HIGHTLIGHBOX_OFFSET + "px";
				box.style.top = offset.top - FVD_DOWNLOADER_HIGHTLIGHBOX_OFFSET + "px";				
				
				var height = parseInt( object.getAttribute( "height" ) );
				var width = parseInt( object.getAttribute( "width" ) );
				
				box.style.width = width + "px";
				box.style.height = height + "px";				
				
				box.style.display = "block";
				
				var startWindow = document.body.scrollTop;
				var endWindow = document.body.scrollTop + window.innerHeight;
				
				if( offset.top >= startWindow && offset.top <= endWindow &&
					(offset.top + height) >= startWindow && (offset.top + height) <= endWindow ){
					
				}	
				else{					
					document.body.scrollTop = offset.top;
				}
				
			}
			
		}
	
		function unhighlight(){
			var box = document.getElementById( FVD_DOWNLOADER_HIGHTLIGHBOX_ID );
			if( box ){
				box.style.display = "none";
			}	
		}
	
		port.onMessage.addListener( function( message ){
									
			switch( message.action ){
								
				case "answer":
				
					var requestId = message.requestId;
					if( pendingRequests[ requestId ] )
					{
						pendingRequests[ requestId ]( message );
						delete pendingRequests[ requestId ];
					}
					else
					{
						console.log( "Undefined answer", message );
					}					
				
				break;
				
				case "startDownload":
					
					var media = message.media;
					
					console.log( 'startDownload', media.url );
					
					downloadMediaItem( media );

				break;

				
				case "insertDMButton":

					const BUTTON_ID_DM = "fvdSingleDownloader_dm_button";
					
					var clickTimer = null;
					var clickMenu = false;
					
					var mainMedia = message.media;
					port.postMessage( { 	action: "getDMMedia",	media: mainMedia }	 );
					
					function createButtonElementDM( buttonId ){
	
						var buttonImg = '<span style="margin-right:5px;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoZJREFUeNpsk0trE1EUx899zEyatk6xImotaLUgFXGnIijddS/FhVsxwb1fQFz5GfwIElwX68JFN6JQi0VbU/rQJmmbTmIm874Pz0zoZHwcuDB35v5/95z/OUMuPnsNJyGVOn9j6vTynctnphKp5Ml7Til0o9haWmu86IfJS0ZzCXApVb4JhaJzF+zJx/dnbT9K8vclg8HusQfv1xujThyDydgQAEDyDcVnL5LiR9cHP84TAMug0HRDkBoUIaQoAc4owdR1tkm/RZhRL5TgJwUAKvuRApWdIdlBgmVRRhCQFkQ0CKUyciQUOIGAqAAwOIVeJDOATvV4KTfYSQkAaRapWsrMB+iEAmJRAAgExAKU1kDxZm7wogdI1SkEUyIKTZa6F0gEiCEAs+wjVEodpmlnGhhYgR7Q51gXwRYmJZNPlEcsuxskkBS6w6iCSFGwx0oLwg1QQjgjdFxI+ZZj3J6+NL1gWhYorEFZBmx4KX/YqoHBDKZmZubPCjVP0ZN26zA8ODhc4b4fPNpvtl7N3rz+wBotQ5IkxS79ESZlMMIZNLZ2Oq3WURVLf8PRUafXdp7Uv3xV1+7dWixP2iAT8Y84bR/lHPbXN529b/WKkqpGEZYNJePc+dVqVzdWPtZEHIE1bgErGcBGBouXTTDHTGhubjnbn9aqGsXpHGRa++7DwRRSEgRdd7l35Fw5NWnPGei2iiLQ2A2CM/Jzve5sfVitKCFrFEvJhglXDhhAaBD0vXfu4fHVssnmCM699DxobG47O5+/V7VCMf4HBEgO4H/XyhhzXMet1Fc39PS5iUXXjzv7zU5Fq2HaxeD/c5sy6nh+/HR3ry1ipZawqTWSTav+5+xvAQYADRQ40Hwcd4cAAAAASUVORK5CYII=" align="left"></span>';
						var buttonContent = buttonImg + BUTTON_TOOLTIP + '<span class="icn_wrap"><span class="icn icon_select"></span></span>';
						
						var button = document.createElement("button");
				
						button.setAttribute("class", "tool_addto icn_right button action:toggleOrUpdate action:arg0:#moveto_container");
						button.setAttribute("data-tooltip",  BUTTON_TOOLTIP);					
						button.setAttribute("title",  BUTTON_TOOLTIP);					
						button.setAttribute("type", "button");
						button.setAttribute("id", BUTTON_ID_DM);
						
						button.innerHTML = buttonContent;
						
						button.addEventListener( "click", function( event ){
						
							var elem = document.getElementById('download_container');
							
							var x = elem.getAttribute("style");
					        if( x.indexOf( "none" ) != -1 )
							{
								elem.setAttribute("style", "display: block; z-index: 30; position:relative;");
	
								chrome.extension.sendRequest({command:"filter_media", media:  mainMedia}, 	function( media ){
								
																buildMediaListDM( media, elem );						
																
															});
															
								document.addEventListener("click",  click_document, true);
								
							}
							else 
							{
								elem.setAttribute("style", "display: none; z-index: 30; position:relative;");
								document.removeEventListener("click", click_document, true);
							}	
							
							}, false );
						
						
						return button;
						
					}
					function click_document( media, parent ){
						var elem = document.getElementById('download_container');
						if (elem.style.display == 'none') return;
						if ( clickMenu )
						{
							clickMenu = false;
							return;
						}	

						clickMenu = false;
						clickTimer = setTimeout(function() {   
											elem.style.display = 'none';
										},  100 );
					}
					
					function buildMediaListDM( media, parent ){

					
						var menus = document.getElementById('download_menu'); 
												
						var menu = null;
						if( menus )
						{
							while( menus.firstChild )
							{
								menus.removeChild( menus.firstChild );
							}
							menu = menus;
						}
						else
						{
							menu = document.createElement( "div" );
							menu.setAttribute( "class", "dmco_html dmpi_video_list_moveto dmco_select chrome_options foreground2 light_border background" );
							menu.setAttribute( "style", "position: absolute; top: -1px; left: 0; border: 1px solid #ddd; -webkit-box-shadow: rgba(0,0,0,0.3) 0 0 1px; -moz-box-shadow: rgba(0,0,0,0.3) 0 0 1px; margin-right: 0; padding: 8px 0 4px;" );
							menu.setAttribute("id", "download_menu");
							parent.appendChild(menu);
							
						}
						
						for( var k in media )
						{
							var m = media[k];						
							if ( !m.check ) continue;	
																		
							var span = document.createElement("a");
							span.setAttribute( "class", "dmco_simplelink dmpi_video_tools_addbookmark foreground foreground tool_moveto_bookmark dmco_link action:replace" );
							span.setAttribute("id", "download_menu");
							span.textContent = m.quality + ' ['+m.size+']';
							
							(function( medToDownload, span ){
								span.addEventListener("click", function(){
									downloadMediaItemRequest( medToDownload );
								}, true);
							})( m, span );
							
							menu.appendChild( span );					
						}
						
						if( message.ad ){
							
							var ad = message.ad;
							
							var span = document.createElement("a");
							span.setAttribute( "class", "dmco_simplelink dmpi_video_tools_addbookmark foreground foreground tool_moveto_bookmark dmco_link action:replace" );
							span.setAttribute( "id", "dm_video_converter_button" );
							span.addEventListener("click", function(){
								window.open( ad.url );
								
								port.postMessage( {
									action: "incrementAdCounter"
								} );
							}, true);
							span.innerHTML = "<img style='margin-left:-6px;margin-right: 1px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx5JREFUeNpsU0toVFcY/u553XPvPJLJazLV2IfJBEJCi5YsSlNsA7rRFmkXXXRVVwV3FlK66aZQ0C7soptQaDcVjCApljQLo3VRihSNFh/BTNI8sDM6yUycZCZz3/5XqZTogZ97Dvf83/f9/3d+I4oi7FxuiN65qt/r+f5LKR5i3ReNfKvYaNfsKv2u/v+usQOg7a+yNzZZqH9yvbid61dbxtFsA7edFJacJA7l0xdGe/QXdO/OcwAe0PHr/KMfbiyWPugyGshqAz2JCC0mh6kkZtc5Ts0CI32ZytejnR8qht+fARBE7tbiv5PLq8vDOTOEEgLgAkwocKUg6ZzWHIW1AMdnmhh5Pbv27bsdI4JhjhGIqFYq47X7C8Mxq6EsRFKDmxakaUJJCSkFXAgM9iTw3aEW/HK71nF2vv59SAIZKThQKhZHGbFIU8OkJG1ZsG0blhWfSQGBCCFhCo7yIx/upovJwtZ7W370tnAcZ0/TcSz5hElCkeQ40nbMzrBNzSGpMKWB89dr+HKKTGhLodwIUKz73cJ13WYQBOCcgzEGSysktMS1lW1MzdZw7J12BFTn+B81/Dxbh2qzkWlRIHZUnJAJSvLjRFAzTUWNi0KcnCpj/Oo2tpwQf656eOAwrAcc6e4UTFtAkTM8lkXmCZIbCmL3fQ+1jSq+utjEuUUTmVwKOUtgyYsgkxydVA4n70xyw0oItGqGtGR2DFDTWoflBxV2+rKHCytpZPemoZIKBjdgMoPsZBC0lwRiWQyMvrmU9HM2f2LjlWx3drpS3cA/m00kd7VDJch/uiSJUVscCZsjmRRIpQS0LeEzjsN7rJ/aNLsUAzitrZnPBgcHlz/atYxuLCGybLKPPw0qQyc1hQVDawReEx/vxsL7L+tvds7C/sLcnYkzk7+9Nh32o/Hqm9DUVElPSG6WIPw6dnMXR/oyE0eHBz6H0qsvGqaO9YelsYszMyemS4ax2PUGsmt3sb9xz+vL5xf2DQ2cfGVv748u+apoPl4E8N86XL6/kj13c2Wj8Pe12qcH33LyA0PzfhgUOX+aGL/QeD0WYABEziK94bE8yAAAAABJRU5ErkJggg==' align='left'>"+ad.title;	
							menu.appendChild( span );		
						}											
						menu.addEventListener( "click", function( event ){
								clickMenu = true;
								window.clearTimeout(clickTimer);
							});
						

					}	
					
					
					if( !document.getElementById( BUTTON_ID_DM ) )
					{
						var button = createButtonElementDM( BUTTON_ID_DM );
						
						var elemFlag = document.getElementById('sd_video_tools');
						
						if( elemFlag )
						{
							var li = document.createElement("li");
							li.appendChild( button );	
							elemFlag.appendChild( li );					
							
							var div = document.createElement("div");
							div.setAttribute("style", "display: none; z-index: 30; position:relative;");
							div.setAttribute("id", "download_container");
							li.appendChild( div );	
							
						}
					}
					
					
				break;
				
				case "insertYTBUtton":
							
					const BUTTON_ID = "fvdSingleDownloader_yt_button";
//					const BUTTON_TITLE = "Download";
//					const BUTTON_TOOLTIP = "Download";
										
					var mainMedia = message.media;
					
					function createButtonElement( buttonId ){
				
						var buttonContent = '<span class="yt-uix-button-content yt-uix-button-icon-wrapper">' + "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoZJREFUeNpsk0trE1EUx899zEyatk6xImotaLUgFXGnIijddS/FhVsxwb1fQFz5GfwIElwX68JFN6JQi0VbU/rQJmmbTmIm874Pz0zoZHwcuDB35v5/95z/OUMuPnsNJyGVOn9j6vTynctnphKp5Ml7Til0o9haWmu86IfJS0ZzCXApVb4JhaJzF+zJx/dnbT9K8vclg8HusQfv1xujThyDydgQAEDyDcVnL5LiR9cHP84TAMug0HRDkBoUIaQoAc4owdR1tkm/RZhRL5TgJwUAKvuRApWdIdlBgmVRRhCQFkQ0CKUyciQUOIGAqAAwOIVeJDOATvV4KTfYSQkAaRapWsrMB+iEAmJRAAgExAKU1kDxZm7wogdI1SkEUyIKTZa6F0gEiCEAs+wjVEodpmlnGhhYgR7Q51gXwRYmJZNPlEcsuxskkBS6w6iCSFGwx0oLwg1QQjgjdFxI+ZZj3J6+NL1gWhYorEFZBmx4KX/YqoHBDKZmZubPCjVP0ZN26zA8ODhc4b4fPNpvtl7N3rz+wBotQ5IkxS79ESZlMMIZNLZ2Oq3WURVLf8PRUafXdp7Uv3xV1+7dWixP2iAT8Y84bR/lHPbXN529b/WKkqpGEZYNJePc+dVqVzdWPtZEHIE1bgErGcBGBouXTTDHTGhubjnbn9aqGsXpHGRa++7DwRRSEgRdd7l35Fw5NWnPGei2iiLQ2A2CM/Jzve5sfVitKCFrFEvJhglXDhhAaBD0vXfu4fHVssnmCM699DxobG47O5+/V7VCMf4HBEgO4H/XyhhzXMet1Fc39PS5iUXXjzv7zU5Fq2HaxeD/c5sy6nh+/HR3ry1ipZawqTWSTav+5+xvAQYADRQ40Hwcd4cAAAAASUVORK5CYII=' align='left'></span><span  style='padding-left:5px;line-height:23px '>"+ BUTTON_TITLE + '</span> &nbsp; <img class="yt-uix-button-arrow" src="" alt="" /><ul style="display:none" class="yt-uix-button-menu"></ul>';
						
						var button = document.createElement("button");
				
						button.setAttribute("data-button-listener", "");
						button.setAttribute("data-tooltip-timer", "271");
						button.setAttribute("class", "yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip");
						button.setAttribute("data-tooltip",  BUTTON_TOOLTIP);					
						button.setAttribute("type", "button");
						button.setAttribute("id", BUTTON_ID);
						
						button.innerHTML = buttonContent;
						
						return button;
						
					}
					
					function buildMediaList( media, button ){
						
						var menus = button.getElementsByTagName( "ul" );
												
						var menu = null;
						if( menus.length != 0 ){
							while( menus[0].firstChild ){
								menus[0].removeChild( menus[0].firstChild );
							}
							menu = menus[0];
						}
						else{
							menu = document.createElement( "ul" );
							menu.setAttribute( "class", "yt-uix-button-menu" );
							button.appendChild(menu);
						}
																
						for( var k in media ){
							var m = media[k];	
							if ( !m.check ) continue;	
																		
							var li = document.createElement("li");
							li.setAttribute( "data", "media" );
							var span = document.createElement( "span" );
							span.setAttribute( "class", "yt-uix-button-menu-item" );
							span.textContent = m.quality + " " + m.ext;
							
							(function( medToDownload, span ){
								span.addEventListener("click", function(){
									downloadMediaItemRequest( medToDownload );
								}, true);
							})( m, span );
							
							li.appendChild( span );	
																			
							menu.appendChild( li );					
						}
						
						if( message.ad ){
							
							var ad = message.ad;
							
							var li = document.createElement("li");
							var span = document.createElement( "span" );
							span.setAttribute( "class", "yt-uix-button-menu-item" );
							span.setAttribute( "id", "yt_video_converter_button" );
							span.addEventListener("click", function(){
								window.open( ad.url );
								
								port.postMessage( {
									action: "incrementAdCounter"
								} );
							}, true);
							span.innerHTML = "<img style='margin-left:-6px;margin-right: 1px;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx5JREFUeNpsU0toVFcY/u553XPvPJLJazLV2IfJBEJCi5YsSlNsA7rRFmkXXXRVVwV3FlK66aZQ0C7soptQaDcVjCApljQLo3VRihSNFh/BTNI8sDM6yUycZCZz3/5XqZTogZ97Dvf83/f9/3d+I4oi7FxuiN65qt/r+f5LKR5i3ReNfKvYaNfsKv2u/v+usQOg7a+yNzZZqH9yvbid61dbxtFsA7edFJacJA7l0xdGe/QXdO/OcwAe0PHr/KMfbiyWPugyGshqAz2JCC0mh6kkZtc5Ts0CI32ZytejnR8qht+fARBE7tbiv5PLq8vDOTOEEgLgAkwocKUg6ZzWHIW1AMdnmhh5Pbv27bsdI4JhjhGIqFYq47X7C8Mxq6EsRFKDmxakaUJJCSkFXAgM9iTw3aEW/HK71nF2vv59SAIZKThQKhZHGbFIU8OkJG1ZsG0blhWfSQGBCCFhCo7yIx/upovJwtZ7W370tnAcZ0/TcSz5hElCkeQ40nbMzrBNzSGpMKWB89dr+HKKTGhLodwIUKz73cJ13WYQBOCcgzEGSysktMS1lW1MzdZw7J12BFTn+B81/Dxbh2qzkWlRIHZUnJAJSvLjRFAzTUWNi0KcnCpj/Oo2tpwQf656eOAwrAcc6e4UTFtAkTM8lkXmCZIbCmL3fQ+1jSq+utjEuUUTmVwKOUtgyYsgkxydVA4n70xyw0oItGqGtGR2DFDTWoflBxV2+rKHCytpZPemoZIKBjdgMoPsZBC0lwRiWQyMvrmU9HM2f2LjlWx3drpS3cA/m00kd7VDJch/uiSJUVscCZsjmRRIpQS0LeEzjsN7rJ/aNLsUAzitrZnPBgcHlz/atYxuLCGybLKPPw0qQyc1hQVDawReEx/vxsL7L+tvds7C/sLcnYkzk7+9Nh32o/Hqm9DUVElPSG6WIPw6dnMXR/oyE0eHBz6H0qsvGqaO9YelsYszMyemS4ax2PUGsmt3sb9xz+vL5xf2DQ2cfGVv748u+apoPl4E8N86XL6/kj13c2Wj8Pe12qcH33LyA0PzfhgUOX+aGL/QeD0WYABEziK94bE8yAAAAABJRU5ErkJggg==' align='left'>"+ad.title;	
							li.appendChild( span );	
							
							menu.appendChild( li );		
						}											
					}
					function openMediaList( button ){
					
						var elems = document.querySelectorAll( "[data=media]" );

						if (elems)
						{
							for( var i in elems )
							{
								var e = elems[i];
								if (e.parentNode)	e.parentNode.removeChild( e );
							}
						}

						chrome.extension.sendRequest({command:"filter_media", media:  mainMedia}, 	function( media ){
								
												var conv = document.getElementById( "yt_video_converter_button" );
												if (conv) 
												{
												
													for( var k in media )
													{
														var m = media[k];
														var li = document.createElement("li");
														li.setAttribute( "data", "media" );
														var span = document.createElement( "span" );
														span.setAttribute( "class", "yt-uix-button-menu-item" );
														span.textContent = m.quality + " " + m.ext;
							
														(function( medToDownload, span ){
																		span.addEventListener("click", function(){
																						downloadMediaItemRequest( medToDownload );
																					}, true);
																	})( m, span );
							
														li.appendChild( span );	
																
														conv.parentNode.insertBefore(li, conv);
													}				
												}	
											});
					}


					
					if( !document.getElementById( BUTTON_ID ) ){
						var button = createButtonElement( BUTTON_ID );
						var elemFlag = document.getElementById('watch-flag');
						
						var inserted = false;
							
						if( elemFlag ){
							elemFlag.parentNode.insertBefore(button, elemFlag);
							inserted = true;
						}
						else{
							var actionsDiv = document.getElementById('watch-actions-right');
							
							if( !actionsDiv ){
								actionsDiv = document.getElementById('watch7-sentiment-actions');					
							}
							
							if( actionsDiv ){
								inserted = true;
					            actionsDiv.appendChild(button);				
							}
						}
						
						if( inserted ){
							buildMediaList( mainMedia, button );						
						}	
						
						button.addEventListener("click", function(event){
									openMediaList( button );
								}, false);
						
						
					}
					
					if( document.location.href.indexOf( "youtube.com/user/" ) != -1 ){
						function ytChannelSetupVideosDownloadButton(){
							
							// this is channel page
							var videos = document.querySelectorAll( ".single-playlist .blogger-video" );
							
							for( var i = 0; i != videos.length; i++ ){
								var video = videos[i];
								
								if( video.hasAttribute( "fvdSingleDownloaderDownloadButtonInjected" ) ){
									continue;
								}
								video.setAttribute( "fvdSingleDownloaderDownloadButtonInjected", 1 );
								
								var videoLink = video.getElementsByTagName( "a" )[0].href;	
								
								var match = videoLink.match( /\?v=([^&]+)/i );
								
								if( !match ){
									continue;
								}
								
								var videoId = match[1];
								
								(function(video, videoId){
									
									addRequest({
										action: "getYTMEdia",
										ytId: videoId
									}, function( response ){
										
										var media = response.media;
										
										var buttonId = BUTTON_ID + "-" + videoId;
										
										var button = createButtonElement( buttonId );
										
										button.addEventListener( "click", function( event ){
										//	event.stopPropagation();
											event.preventDefault();
										}, false );
										
										video.getElementsByClassName("video-item-content")[0].appendChild( button );
										buildMediaList( media, button );
										
									});
									
					
								})(video, videoId);
											
							}	
							
						}
						
						ytChannelSetupVideosDownloadButton();
						
						setInterval( function(){
							
							ytChannelSetupVideosDownloadButton();
							
						}, 1000 );

					}
					
											
							
				break;
				
				case "highlightMedia":
					var media = message.media;
				
					if( media.source == "Youtube" ){
						
						var foundObject = null;
						
						var objects = document.getElementsByTagName( "object" );
						for( var i = 0; i != objects.length; i++ ){
							var object = objects[i];
							if( object.innerHTML.indexOf( media.groupId ) != -1 ){
								foundObject = object;
								break;
							}
						}
						
						if( foundObject ){							
							highlightObject( foundObject );							
							return;							
						}
						
						var foundFrame = null;
						
						var frames = document.getElementsByTagName( "iframe" );
						for( var i = 0; i != frames.length; i++ ){
							var frame = frames[i];
							if( frame.getAttribute("src").indexOf( media.groupId ) != -1 ){
								foundFrame = frame;
								break;
							}
						}
						
						if( foundFrame ){
							highlightObject( foundFrame );							
							return;			
						}					
						
					}
				
				break;
				
				case "unhighlightMedia":
				
					unhighlight();
				
				break;
			}
			
		} );

		
	});
	
})();

