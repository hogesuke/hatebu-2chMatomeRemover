$(function(){

	$.when(isHatebuPage()).done(function(hatebuPageFlg) {
		if (hatebuPageFlg) {
			observ(hatebuPageFlg);
		}
		doAction(hatebuPageFlg);
	});

	function isHatebuPage() {
		var dfd = $.Deferred();
		chrome.extension.sendRequest({command: "isTargetPage", target: "^http:\/\/b\.hatena\.ne\.jp.*$"}, function(response) {
			if ($.parseJSON(response)) {
				dfd.resolve(true);
				return;
			}
			dfd.resolve(false);
		});
		return dfd.promise();
	}

	function observ(hatebuPageFlg) {
		var observer = new WebKitMutationObserver(function(mutations) {
			doAction(hatebuPageFlg);
		});
		var target = document.querySelector('.box1_1');
		observer.observe(target, { attributes: true, childList: true, characterData: true });
		//observer.disconnect();
	}

	function doAction(hatebuPageFlg) {
		if (hatebuPageFlg) {
			remove(".entry-unit .entry-link", ".entry-unit");
		} else {
			// はてなトップページ
			remove(".box .list li a:even", "li");
		}
	}

	function remove(anchorSelecter, removeSelector) {
		var $entrys = $(anchorSelecter);
		if ($entrys.size() <= 0) {
			return;
		}
		chrome.extension.sendRequest({command: "getUrl"}, function(response) {
			$entrys.each(function() {
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
