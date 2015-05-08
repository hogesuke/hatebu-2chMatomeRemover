$(function(){

	$.when(isHatebuPage()).done(function(pageType) {
		if (pageType === 'hatebu') {
			observ(pageType);
		}
		doAction(pageType);
	});

	function isHatebuPage() {
		var dfd = $.Deferred();
//		chrome.extension.sendRequest({command: "isTargetPage", target: "^http:\/\/b\.hatena\.ne\.jp.*$"}, function(response) {
		chrome.extension.sendRequest({command: "isTargetPage"}, function(response) {
			dfd.resolve(response[0]);
		});
		return dfd.promise();
	}

	function observ(pageType) {
		var observer = new WebKitMutationObserver(function(mutations) {
			doAction(pageType);
		});
		var target = document.querySelector('.box1_1');
		if (!target) {
			target = document.querySelector('.entry-list-l');
		}
		if (!target) {
			target = document.querySelector('.box_section');
		}
		observer.observe(target, { attributes: true, childList: true, characterData: true });
		//observer.disconnect();
	}

	function doAction(pageType) {
		if (pageType === 'hatebu') {
			remove(".entry-unit .entry-link, .entrylist-unit .entry-link", ".entry-unit, .entrylist-unit");
		} else if (pageType === 'toppage') {
			remove(".js-bookmark-item .js-bookmark-target", ".js-bookmark-item");
		} else if (pageType === 'ranking') {
			remove(".entrylist-unit .entry-link", ".entrylist-unit");
		} else if (pageType === 'headline') {
			remove(".entry-unit .entry-link", ".entry-unit");
		} else if (pageType === 'toppage') {
			remove(".box .list li a:even", "li");
		} else {
			// nop
		}
	}

	function remove(anchorSelecter, removeSelector) {
		var $entries = $(anchorSelecter);
		if ($entries.size() <= 0) {
			return;
		}
		chrome.extension.sendRequest({command: "getUrl"}, function(response) {
			$entries.each(function() {
				var $entry = $(this);
				var url = $(this).attr("href");
				$($.parseJSON(response)).each(function() {
					if (url.match(new RegExp("^" + this + ".*"))) {
						$entry.closest(removeSelector).remove();
					}
				});
			});
		});
	}
});
