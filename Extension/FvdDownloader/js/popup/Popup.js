(function() {

	var Popup = function() {

		var self = this;

		const ALLOWED_EXT_IMAGES = [
			"flv",
			"mp3",
			"mp4",
			"pdf",
			"swf",
			"webm",
			"3gp"
		];

		const INTERVAL_TO_DISPLAY_WRITE_REVIEW = 3 * 24 * 3600 * 1000; // 3 days

		function threadsOfActiveTab(callback) {

			fvdSingleDownloader.Utils.getActiveTab(function(tab) {

				if (!tab) {
					callback(null);
				} else {
					callback(fvdSingleDownloader.Media.Storage.getDataForTab(tab.id));
				}

			});

		}

		function getExtImage(ext) {
			if (ALLOWED_EXT_IMAGES.indexOf(ext) == -1) {
				return;
			}

			ext = ext.toLowerCase();

			return "images/formats/" + ext + ".png";
		}

		function str_download_size(size) {

			if (size < 1073741824) return fvdSingleDownloader.Utils.bytesToMb(size) + "MB";
			else return fvdSingleDownloader.Utils.bytesToGb(size) + "GB";

		}

		function buildThreadItem(media) {

			function fbc(className) {
				return item.getElementsByClassName(className)[0];
			}

			var item = document.getElementById("download_item_template").cloneNode(true);

			item.removeAttribute("id");

			fbc("download_button").setAttribute("href", "#");

			fbc("download_url").textContent = media.displayName;
			fbc("download_url").setAttribute("href", media.url);

			if (media.downloadSize) {
				fbc("size").textContent = str_download_size(media.downloadSize);
			} else {
				fbc("size").setAttribute("loading", 1);
				fvdSingleDownloader.Utils.getSizeByUrl(media.url, function(size) {

					fbc("size").removeAttribute("loading");
					if (size) {
						fbc("size").textContent = str_download_size(size);
					}

				});
			}

			function onClick(event) {
				console.log('fvdSingleDownloader.Media.startDownload', media);

				fvdSingleDownloader.Media.startDownload(media);

				fbc("download_button").setAttribute("loading", 1);

				setTimeout(function() {
					fbc("download_button").removeAttribute("loading");
				}, 5000);

				event.stopPropagation();
			}

			item.addEventListener("mouseover", function() {

				fvdSingleDownloader.Utils.getActiveTab(function(tab) {
					fvdSingleDownloader.ContentScriptController.processMessage(tab.id, {
						action: "highlightMedia",
						media: media
					});
				});

			}, false);

			item.addEventListener("mouseout", function() {

				fvdSingleDownloader.Utils.getActiveTab(function(tab) {
					fvdSingleDownloader.ContentScriptController.processMessage(tab.id, {
						action: "unhighlightMedia"
					});
				});


			}, false);

			fbc("download_button").addEventListener("click", onClick, false)

			fbc("copyLink").addEventListener("click", function(event) {

				fvdSingleDownloader.Utils.copyToClipboard(media.url);

				event.stopPropagation();

			}, false);

			fbc("removeLink").addEventListener("click", function(event) {

				fvdSingleDownloader.Media.Storage.removeItem(media.id);

				item.parentNode.removeChild(item);

				event.stopPropagation();

			}, false);

			var topOfImageText = "";

			if (media.size) {
				topOfImageText = media.size;
			}

			if (!topOfImageText && media.quality) {
				topOfImageText = media.quality;
			}

			if (topOfImageText) {
				fbc("media_quality").textContent = topOfImageText;
			}

			var extImage = getExtImage(media.ext);

			if (extImage) {
				fbc("media_format").getElementsByTagName("img")[0].setAttribute("src", extImage);
			}

			return item;

		}

		this.init = function() {

			self.rebuildThreadsList();

			self.refreshTopHints();

			if (!chrome.webRequest) {
				var elem = document.getElementById("updateChromeNotice");
				if (elem) elem.removeAttribute("hidden");
				var elem = document.getElementById("multiple_download_block_title");
				if (elem) elem.setAttribute("hidden", true);
			}

			if (fvdSingleDownloader.noYoutube) {
				var elem = document.getElementById("help_link_converter");
				if (elem) elem.style.display = "none";
			} else {

			}

			if (!fvdSingleDownloader.noYoutube) {
				var elem = document.getElementById("help_link_convert_video");
				if (elem) elem.style.display = "none";
				//document.getElementById("help_link_player_video").style.display = "none";				
			}

			var now = new Date().getTime();

			if (now - fvdSingleDownloader.Prefs.get("install_time") < INTERVAL_TO_DISPLAY_WRITE_REVIEW) {
				var elem = document.getElementById("help_link_write_review");
				if (elem) elem.style.display = "none";
			}

			chrome.extension.onRequest.addListener(function(request) {

				if (request.subject == "mediaForTabUpdate") {


					fvdSingleDownloader.Utils.getActiveTab(function(tab) {

						if (tab.id == request.data) {

							self.rebuildThreadsList();

						}

					});

				}

			});


			var elem = document.getElementById("help_link_options");
			if (elem) elem.addEventListener("click", function() {
				self.display_setting();
			}, false);


			var elem = document.getElementById("returnToThreads");
			if (elem) elem.addEventListener("click", function() {
				displayDownloads();
			}, false);

			var elem = document.getElementById("help_link_donate");
			if (elem) elem.addEventListener("click", function() {
				displayDonate();
			}, false);

			var elem = document.getElementById("slowDownloadHint_close");
			if (elem) elem.addEventListener("click", function() {
				fvdSingleDownloader.Prefs.set("popup.display_slow_download_hint", false);
				self.refreshTopHints();
			}, false);

			var elem = document.getElementById("androidDownloadHint_close");
			if (elem) elem.addEventListener("click", function() {
				fvdSingleDownloader.Prefs.set("popup.display_download_android_getthemall", false);
				self.refreshTopHints();
			}, false);

			var elem = document.getElementById("help_link_clear");
			if (elem) elem.addEventListener("click", function() {
				self.clearList();
			}, false);

			fvdSingleDownloader.Utils.getActiveTab(function(tab) {

				if (fvdSingleDownloader.noYoutube) {
					if (fvdSingleDownloader.MainButton.isYoutubeUrl(tab.url)) {
						var elem = document.getElementById("noYoutubeMessage");
						if (elem) elem.removeAttribute("hidden");
					}
				} else {
					var elem = document.getElementById("noYoutubeMessage");
					if (elem) elem.setAttribute("hidden");
				}

			});

			fvdSingleDownloader.AD.rotateOnPage();

		}

		// ----------------------------------------------
		this.display_setting = function() {
				chrome.tabs.query({
					url: chrome.extension.getURL("/options.html")
				}, function(tabs) {

					if (tabs.length > 0) {
						foundTabId = tabs[0].id;
						chrome.tabs.update(foundTabId, {
							active: true
						});
					} else {
						chrome.tabs.create({
							active: true,
							url: chrome.extension.getURL("/options.html")
						}, function(tab) {});
					}
				});
			}
			// ----------------------------------------------
		this.clearList = function() {

			var container = document.getElementById("download_item_container");
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}

			fvdSingleDownloader.Utils.getActiveTab(function(tab) {

				if (tab) {
					fvdSingleDownloader.Media.Storage.removeTabData(tab.id);
				}

			});
		}



		this.refreshTopHints = function() {

			var elem = document.getElementById("slowDownloadHint");
			if (elem) elem.setAttribute("hidden", true);
			var elem = document.getElementById("androidDownloadHint");
			if (elem) elem.setAttribute("hidden", true);

			if (_b(fvdSingleDownloader.Prefs.get("popup.display_download_android_getthemall"))) {
				var elem = document.getElementById("androidDownloadHint");
				if (elem) elem.removeAttribute("hidden");
				return;
			}

			if (_b(fvdSingleDownloader.Prefs.get("popup.display_slow_download_hint"))) {
				var elem = document.getElementById("slowDownloadHint");
				if (elem) elem.removeAttribute("hidden");
				return;
			}


		}

		function checkExtByContentType(contentType) {
			var name = "fvd.enable_" + contentType;
			var x = fvdSingleDownloader.Prefs.get(name);
			if (x == 'false') return false;
			return true;
		}

		// ------------- перестроит?дерево
		this.rebuildThreadsList = function() {

			threadsOfActiveTab(function(threads) {
				if (threads) {
					var container = document.getElementById("download_item_container");
					while (container.firstChild) {
						container.removeChild(container.firstChild);
					}

					var currentGroup = null;

					var prev_item = null;

					threads.forEach(function(thread) {
						try {

							if (checkExtByContentType(thread.ext)) {

								if (currentGroup == null) currentGroup = thread.groupId;

								var item = buildThreadItem(thread);

								if (prev_item == null) container.appendChild(item);
								else container.insertBefore(item, prev_item);
								prev_item = item;

							}
						} catch (ex) {
							console.log(ex);
						}


					});

				}

			});
		}

	}

	this.Popup = new Popup();

}).apply(fvdSingleDownloader);