// 初始化
	popupPayPwd.prototype.init = function (options) {
		this.options = $.extend({}, DEFAULTS, options);
		this.init();
		this.$html = $(this.template);
		$('body').append(this.$html);
		this.num();
		this.add();
		this.del();
	};
	// 显示
	popupPayPwd.prototype.show = function () {
		var $PopupPayPwd = $('#PopupPayPwd');
		$PopupPayPwd.css('zIndex', this.options.zIndex).addClass('show');
		setTimeout(function () {
			$PopupPayPwd.addClass('show-visible');
		}, 300);
	};
	// 隐藏
	popupPayPwd.prototype.hide = function () {
		this.$html.remove();
	};
	// 渲染数字
	popupPayPwd.prototype.num = function () {
		var $box = this.$html.find('.number-box');
		var tpl = '<div class="ui-flex ui-border-b">';
		var arr = [];
		var len = 9;
		// 随机 1-9
		if (this.options.random) {
			while (arr.length < 9) {
				//取 1-9 之间的整数
				var num = Math.floor(9 * Math.random()) + 1;
				var flag = false;
				//遍历数组找到空位
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == num) {
						flag = true;
						break;
					}
				}
				if (!flag) {
					arr[arr.length] = num;
				}
			}
			len = arr.length;
		} else {
			// 默认 1-9
			arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		}
		// 渲染数字按钮
		for (var i = 0; i < len; i++) {
			if (i % 3 == 0) {
				tpl += '<a class="ui-flex-item ui-border-r" data-trigger="num" data-num="' + arr[i] + '">' + arr[i] + '</a>';
				tpl += '</div>';
			} else {
				tpl += '<a class="ui-flex-item ui-border-r" data-trigger="num" data-num="' + arr[i] + '">' + arr[i] + '</a>';
			}
		}
		tpl += '</div>';
		$box.prepend(tpl);
	};
	// 点击数字
	popupPayPwd.prototype.add = function () {
		var $this = this;
		var $password = this.$html.find('.password'); // 密码
		var $pwdVal = this.$html.find('.pwd-val'); // 密码显示文
		this.$html.find('[data-trigger="num"]').on('click', function () {
			var $self = $(this);
			var num = $self.data('num');
			var pwd = $password.val();
			// 超过 6 位不允许再录入
			if (pwd.length >= 6) {
				console.log('你已经输入完密码，请不要重复输入');
				return;
			} else {
				pwd += num; // 追加输入的数字
				// $pwdVal.eq(pwd.length - 1).text('*'); // 密文（实际应用中应全部显示 *）
				$pwdVal.eq(pwd.length - 1).text(num); // 明文（测试）
				$password.val(pwd); // 填入隐藏域
			}
			// 输入够6位数后立即执行需要做的事情，比如ajax提交
			if (pwd.length === 6) {
				// 你的回调代码
				$this.options.callback && $this.options.callback(pwd);
			}
		});
	};
	// 从右边开始删除密码
	popupPayPwd.prototype.del = function () {
		var $password = this.$html.find('.password'); // 密码
		var $pwdVal = this.$html.find('.pwd-val'); // 密码显示文
		this.$html.find('.number-delete').on('click', function () {
			var pwd = $password.val();
			// 密码为空的时候不在执行
			if (pwd !== '') {
				pwd = pwd.slice(0, -1); // 从最右边开始截取 1 位字符
				$password.val(pwd); // 赋值给密码框同步密码
				$pwdVal.eq(pwd.length).text(''); // 密码明文显示从右开始清空文本
			}
		});
	};
	// 输出模板字符串
	popupPayPwd.prototype._TEXT = function (wrap) {
		return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
	};
	// 模板
	popupPayPwd.prototype.template = function () {
		return this._TEXT(function () {
			/*
			<div id="PopupPayPwd" class="ui-dialog ui-dialog-actions popup-pay-pwd">
				<div class="ui-dialog-cnt">
					<div class="ui-dialog-hd">
						<a class="icon icon-close" data-role="close"></a>
						<div class="title">Payment Password</div>
					</div>
					<div class="ui-dialog-bd">
						<input type="password" class="password">
						<div class="pwd-box">
							<div class="pwd-val"></div>
							<div class="pwd-val"></div>
							<div class="pwd-val"></div>
							<div class="pwd-val"></div>
							<div class="pwd-val"></div>
							<div class="pwd-val"></div>
						</div>
						<div class="number-box ui-border-t">
							<div class="ui-flex ui-border-b">
								<a class="ui-flex-item ui-border-r bg-gray">&nbsp;</a>
								<a class="ui-flex-item ui-border-r" data-trigger="num" data-num="0">0</a>
								<a class="ui-flex-item ui-border-r number-delete"><i class="icon icon-delete"></i></a>
							</div>
						</div>
					</div>
				</div>
			</div>
			*/
		});
	};