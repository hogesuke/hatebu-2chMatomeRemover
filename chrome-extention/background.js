$(function() {
	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (request.command == "getUrl") {
				$.ajax({
					url: "http://www.hogesuke.com/2chMatomeRemover/remover.php",
					cache: false,
					success: function(urlJson){
						sendResponse(urlJson);
					},
					error: function(xhr, status, err){
						sendResponse([]);
					}
				});
			} else if (request.command == "isTargetPage") {
				chrome.windows.getCurrent(function (currentWindow) {
					chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
						if (activeTabs[0].url.match(new RegExp("^http:\/\/b\.hatena\.ne\.jp.*$"))) {
							sendResponse(['hatebu']);
						} else if (activeTabs[0].url.match(new RegExp("^http:\/\/www\.hatena\.ne\.jp\/?$"))) {
							sendResponse(['toppage']);
						} else if (activeTabs[0].url.match(new RegExp("^http:\/\/b\.hatena\.ne\.jp\/ranking.*$"))) {
							sendResponse(['ranking']);
						} else if (activeTabs[0].url.match(new RegExp("^http:\/\/b\.hatena\.ne\.jp\/headline.*$"))) {
							sendResponse(['headline']);
						} else {
							sendResponse(['unknown']);
						}
					});
				});
			} else {
				sendResponse([]); // snub them.
			}
		}
	);
});
