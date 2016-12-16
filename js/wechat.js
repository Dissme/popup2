if (true) {
		$.ajax({
				url: 'http://www.circuitpot.com:13000/config',
				type: 'post',
				data: {
						'url': window.location.href
				},
				success: function success(dt) {
						console.log('Ready');
						var config = {
								debug: false,
								appId: dt.appId,
								timestamp: dt.timestamp,
								nonceStr: dt.noncestr,
								signature: dt.signature,
								jsApiList: ['startSearchBeacons', 'stopSearchBeacons']
						};
						wx.config(config);
						wx.ready(function () {
							console.log('configed');
								wx.startSearchBeacons({
										complete: function complete(argv) {
												updateBeaconList(argv);
										}
								});
								wx.onSearchBeacons({
										complete: function complete(argv) {
												updateBeaconList(argv);
										}
								});
						});
				},
				error: function error(err) {
					// alert(JSON.stringify(err));
						console.log('Error', err);
				}
		});
}