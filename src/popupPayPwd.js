/*!
 * User: http://orzhtml.github.io/
 * Date: 16-12-02 上午11:55
 * Detail: 支付密码弹窗
 */

"use strict";
(function ($, window) {
	// 默认配置
	var DEFAULTS = {
		random: false, // 是否随机摆放1-9数字
		zIndex: 1000, // 弹窗的层级，可根据不同页面配置
		ciphertext: true, // 是否显示明文，默认密文*
		callback: '' // 回调，输入满6位数字，触发回调
	};

	var popupPayPwd = function () {};
	popupPayPwd.prototype.init = function (options) {
		this.options = $.extend({}, DEFAULTS, options);
		this.$html = $(this.template);
		$('body').append(this.$html);
		// 绑定默认关闭按钮
		this.$html.find('[data-role="close"]').on('click', $.proxy(function () {
			this.close();
		}, this));
		// 显示弹窗
		this.$html.css('zIndex', this.options.zIndex).addClass('show');
		setTimeout($.proxy(function () {
			this.$html.addClass('show-visible');
		}, this), 0);
		// 其他事件
		this.num();
		this.add();
		this.del();
	};
	// 隐藏
	popupPayPwd.prototype.close = function () {
		this.$html.removeClass("show-visible");
		setTimeout($.proxy(function () {
			this.$html.remove();
		}, this), 300);
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
			if (i % 3 == 0 && i != 0) {
				tpl += '</div><div class="ui-flex ui-border-b">';
				tpl += '<a class="ui-flex-item ui-border-r" data-trigger="num" data-num="' + arr[i] + '">' + arr[i] + '</a>';
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
				return;
			} else {
				pwd += num; // 追加输入的数字
				if ($this.options.ciphertext) {
					$pwdVal.eq(pwd.length - 1).text('*'); // 密文
				} else {
					$pwdVal.eq(pwd.length - 1).text(num); // 明文
				}
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
	// 模板
	popupPayPwd.prototype.template = _TEXT(function () {
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
	// 输出模板字符串
	function _TEXT(wrap) {
		return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
	};
	$.PopupPayPwd = popupPayPwd;
})(jQuery, window);