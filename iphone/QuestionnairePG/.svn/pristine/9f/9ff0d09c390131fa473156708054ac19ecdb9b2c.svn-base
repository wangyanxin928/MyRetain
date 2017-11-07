// ================================================================
// Author:
// CreateDate: 
// description: 根据设计样式封装的datatable

// ===============================================================
define(function(require, module, exports) {

	var Backbone = require('backbone');
	require('jquery');

	var tableTpl = require('text!plugins/DataTableView/datatable.xml');
	var pagingTpl = require('text!plugins/DataTableView/paging.xml');

	/** 格式化输入字符串* */
	// 用法: "hello{0}".format('world')；返回'hello world'
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/\{(\d+)\}/g, function(s, i) {
			return args[i];
		});
	}

	var BaseCollection = Backbone.Collection;//require("collections/BaseCollection");

	var TableView = Backbone.View.extend({
		template : _.template(tableTpl),
		initialize : function(options) {
			//缓存dataTable中各个页面中勾选的数据
			this.selectAllData= new Array();
			// 默认配置
			var defaults = {
				autoRender : true,
				// 数据来源方法
				data : {
					// 异步数据源
					sync : function(syncOptions, callback) {
						request.ajax($.extend(syncOptions, {
							data : {},
							success : function(data) {
								callback(data);
							}
						}));
					},
					// 数据列表的索引
					dataArrayIndex : 'rows',
					collection : BaseCollection,
					// 分页参数
					paging : {
						// 默认为分页
						enable : true,
						// 每页数据条数
						pageSize : 10,
						// 数据返回结果总条数的索引
						totalIndex : 'total',
						// 向后台传递的每页数据条数参数名
						pageSizeName : 'rows',
						// 向后台传递的当前页数参数名
						pageIndexName : 'page',
						"info" : "当前显示第 {0} 到第 {1} 条数据,总计  {2} 条数据",
						"emptyInfo" : "没有数据"
					}
				},
				//是否显示序号列
				displayIndex:false,
				/**
				 * var columns = [{ text : "角色描述", dataIndex : "role_desc",
				 * render : function(value,data) { } }];
				 */
				columns : [],
				// 默认多选模式
				"selModel" : {
					// single/multi,为空则不显示
					mode : "multi",
					// 是否显示行的checkbox
					checkbox : true,
				// singleSelect : true
					//定义选中的数据列表
					selectData:{
						keyword:"",
						selectDataValue:[]
					},
					keepCheckState:{//保持勾选状态才能获取全部的勾选数据
						keepCheck:false,
						keepStateKeyword:""
					}
				}
			};

			this.options = $.extend(true, defaults, options);

			if (this.options.autoRender) {
				this.render();
			}
		},
		events : {},
		render : function() {
			this.$el.html(this.template());

			// 初始化标题列
			this.renderHead();

			// 初始化表格数据
			// 显示分页栏
			if (this.options.data.paging.enable) {
				var pagingView = new PagingView({
					dataTable : this
				});
				this.$(".datelist_page").html(pagingView.$el);
				pagingView.goPage(1);
				this.pagingView = pagingView;
			} else {
				// 初始化表格数据
				this.renderData(this.options.afterRender);
			}
		},
		// 渲染表头
		renderHead : function() {
			// 是否显示全选
			var showCheckAll = true;
			if (this.options.selModel.mode != 'multi')
				showCheckAll = false;
//			var head = "<tr><th  style='width: 5px;'>" + (showCheckAll ? "<input type=checkbox class='dt_ckb_all'></input>" : "") + "</th>";
			//修改 byWendy 不是多选，则不显示checkbox列
			var head = "<tr>" + (showCheckAll ? "<th  style='width: 5px;'><input type=checkbox class='dt_ckb_all'></input></th>" : "");
			//修改 byWendy 是否显示序号列
			var displayIndex = this.options.displayIndex;
			head += (displayIndex ? "<th  style='text-align: center;'>序号</th>" : "");
			
			for (var i = 0; i < this.options.columns.length; i++) {
				head += "<th style='text-align: center;'>" + this.options.columns[i]['text'] + "</th>";
			}
			head += "</tr>";
			this.tableHeadArea = this.$el.find("table thead");
			this.tableHeadArea.html(head);

			// 缓存全选对象
			this.tableCheckboxAll = this.tableHeadArea.find("tr .dt_ckb_all")[0];
		},
		// 渲染数据表
		renderData : function(syncOptions, callback) {
			var me = this;
			var dataArea = this.$el.find("table tbody");
			this.tableDataArea = dataArea;
			
			//在清空数据之前，将当前页的数据存储到this的selectAllData中
			var selectDataCurrentPage=this.getSelectedModel();
			if(!!selectDataCurrentPage){
				for(var i=0;i<selectDataCurrentPage.length;i++){
					//循环selectAllData中的数据，如果没有当前数据，则push到selectAllData中
					var isExist=false;
					for(var j=0;j<me.selectAllData.length;j++){
						var keepStateKeyword=me.options.selModel.keepCheckState.keepStateKeyword;
						if(me.selectAllData[j].attributes[keepStateKeyword]===
							selectDataCurrentPage[i].attributes[keepStateKeyword]){
							isExist=true;
							break;
						}
					}	
					if(!isExist){
						me.selectAllData.push(selectDataCurrentPage[i]);
					}
				}
			}
			// 清空
			this.clearData();
			// 当前表的数据列表集合
			this.dataCollection = new this.options.data.collection();
			var Model = this.dataCollection.model;

			this.options.data.sync(syncOptions, function(result) {
				var data;
				if (result) {
					var rows = new Array();
					// 根据配置获取数据array
					data = result[me.options.data.dataArrayIndex];
					if (data) {
						for (var i = 0; i < data.length; i++) {
							var row = new Array();
							var d = data[i];
							// 添加对象
							var model = new Model(d);
							me.dataCollection.add(model);
							// 匹配显示列
							for (var k = 0; k < me.options.columns.length; k++) {
								var c = me.options.columns[k];
								var value = d[c['dataIndex']];
								// 有render方法,取render方法的值
								if (c.render) {
									row.push(c.render(value, d, data));
								}
								// 直接附加值
								else {
									row.push(value);
								}
							}
							rows.push(row);
						}
						
						//定义选中的数据数组，之后需要根据options传入；
						var needCheck=me.options.selModel.selectData.selectDataValue;//['1','232422','232424','232432','232434'];
						var keyword=me.options.selModel.selectData.keyword;//"XH";
						var keywordPosition=-1;
						//查找keyword所在位置  //前提是选择状态是多选，且显示行的checkbox
						if(me.options.selModel.mode == 'multi'&&me.options.selModel.checkbox){
							for (var k = 0; k < me.options.columns.length; k++) {
								var c = me.options.columns[k];
								if(c['dataIndex']==keyword){
									keywordPosition=k;
									break;
								}
							}
						}

						// 填充数据
						for (var i = 0; i < rows.length; i++) {

							//修改 byWendy 不是多选，则不显示checkbox列，否则根据checkbox配置显示
							var rowHtml="";
							if (me.options.selModel.mode != 'multi'){
								showCheckAll = false;
								rowHtml = "<tr " + (i % 2 == 0 ? "" : "class=bgbai") + ">";
							}
							else{
								// 是否显示checkbox
								var checkbox = me.options.selModel.checkbox ? true : false;
								
								// 勾选框及选中状态
								var checkboxDisplay="<input type=checkbox class='dt_ckb_row'></input>";
								//根据table的保持选中状态配置，确定数据的选中状态
								if(me.options.selModel.keepCheckState.keepCheck){
									for(var j=0;j<me.selectAllData.length;j++){
										var keepStateKeyword=me.options.selModel.keepCheckState.keepStateKeyword;
										if(me.selectAllData[j].attributes[keepStateKeyword]===me.dataCollection.at(i).attributes[keepStateKeyword]){
											checkboxDisplay="<input type=checkbox class='dt_ckb_row' checked='checked'></input>";
											break;
										}
									}
								}
								//根据初始化数据，确定数据的选中状态
								if(checkbox&&keywordPosition!=-1){
									for(var j=0;j<needCheck.length;j++){
										if(rows[i][keywordPosition]==needCheck[j]){
											checkboxDisplay="<input type=checkbox class='dt_ckb_row' checked='checked'></input>";
											break;
										}											
									}																	
								}
								rowHtml = "<tr " + (i % 2 == 0 ? "" : "class=bgbai") + ">" + "<td>" + checkboxDisplay
										+ "</td>";
							}	
							
							//修改 byWendy 是否显示序号列
							var displayIndex = me.options.displayIndex;
							rowHtml += (displayIndex ? ("<td >"+(i+1)+"</td>") : "");
							
							for (var j = 0; j < rows[i].length; j++) {
								rowHtml += "<td>" + rows[i][j] + "</td>";
							}

							// 创建行对象
							var tr = $(rowHtml + "</tr>");
							// 添加数据对象引用
							tr.attr("index", i);
							// 渲染至页面
							me.tableDataArea.append(tr);
						}
					}
				}
				// 回调渲染分页条
				if (me.options.data.paging.enable) {
					var p = {
						data : data,
						total : result && result[me.options.data.paging.totalIndex]
					};
					callback && callback(p);
				}
			});
		},
		// 初始化表格事件，需在表头和表数据渲染完成后调用
		initTableEvents : function() {
			var me = this;
			// 初始化全选与复选框效果
			this.tableCheckboxAll&& (this.tableCheckboxAll["checked"] = false);

			//初始化数据域的勾选状态，暂时注释
//			var rows = this.tableDataArea.find(".dt_ckb_row").each(function(index, e) {
//				e['checked'] = false;
//			});
			var rows = this.tableDataArea.find(".dt_ckb_row");

			// 全选框点击事件
			$(this.tableCheckboxAll).click(function(input) {
				var checked = input.currentTarget["checked"];
				me.tableDataArea.find(".dt_ckb_row").each(function(index, e) {
					e['checked'] = checked;
				});
			});

			// 行复选框点击事件
			this.tableDataArea.find(".dt_ckb_row").on('click', function(input) {
				var checked = input.currentTarget["checked"];
				// 判断是否应该操作全选
				var check = me.tableDataArea.find(".dt_ckb_row:checked").length >= rows.length;
				me.tableCheckboxAll["checked"] = check;

				// 触发行选中与取消选中事件
				if (checked) {
					me.trigger('select', [input], this);
				} else {
					me.trigger('deSelect', [input], this);
				}
			});
			
			this.options.initTableEventsCall && this.options.initTableEventsCall();
			
		},
		// 清空表数据
		clearData : function() {
			this.tableDataArea && this.tableDataArea.find("tr").remove();
		},
		reload : function(options) {
			this.pagingView.goPage(1);
		},
		getSelectedModel : function() {
			var me = this;
			// 多选模式返回array
			if (this.options.selModel.mode == "multi") {
				var array = new Array();
				this.tableDataArea.find(".dt_ckb_row:checked").each(function(index, e) {
					array.push(me.dataCollection.at(e.parentElement.parentElement.getAttribute('index')));
				});
				return array;
			}
		},
		getSelectAllModel:function(){
			var me=this;
			//将当前页中勾选的数据存储到this的selectAllData中
			var selectDataCurrentPage=this.getSelectedModel();
			for(var i=0;i<selectDataCurrentPage.length;i++){
				//循环selectAllData中的数据，如果没有当前数据，则push到selectAllData中
				var isExist=false;
				for(var j=0;j<me.selectAllData.length;j++){
					var keepStateKeyword=me.options.selModel.keepCheckState.keepStateKeyword;
					if(me.selectAllData[j].attributes[keepStateKeyword]===
						selectDataCurrentPage[i].attributes[keepStateKeyword]){
						isExist=true;
						break;
					}
				}	
				if(!isExist){
					me.selectAllData.push(selectDataCurrentPage[i]);
				}
			}
			return this.selectAllData;
		}
	});

	// 分页视图
	var PagingView = Backbone.View.extend({
		className:"row",
		template : _.template(pagingTpl),
		events : {
			// 事件定义
			"click .fy_first" : "goFirst",
			"click .fy_left" : "goPrevious",
			"click .fy_right" : "goNext",
			"click .fy_last" : "goLast",
			"click .bgyellow" : "jumpPage",
			
			//添加新的页签事件 by Wendy
			"click #datatable_previous":"goPrevious",
			"click #datatable_next":"goNext"
		},
		initialize : function(options) {
			this.pageIndex = 1;
			this.dataTable = options.dataTable;
			this.render();
		},
		render : function() {
			this.$el.html(this.template());
			return this;
		},
		goPage : function(index) {
			var me = this;
			this.pageIndex = index;

			var pagingOptions = this.dataTable.options.data.paging;

			var syncOptions = {
				data : {}
			};
			syncOptions.data[pagingOptions['pageSizeName']] = pagingOptions.pageSize;
			syncOptions.data[pagingOptions['pageIndexName']] = index;

			this.dataTable.renderData(syncOptions, function(r) {
				me.totalData = r.total;
				me.renderPaging(r.total, r.data && r.data.length, index);
				// 初始化表格事件
				me.dataTable.initTableEvents();
				// 表格渲染完成回调函数
				me.dataTable.options.afterRender && me.dataTable.options.afterRender();
			});
		},
		goFirst : function() {
			if (this.pageIndex == 1)
				return;
			this.pageIndex = 1;
			this.goPage(this.pageIndex);
		},
		goPrevious : function() {
			if (this.pageIndex == 1)
				return;
			if (this.pageIndex - 1 <= 1) {
				this.pageIndex = 1;
			} else {
				this.pageIndex = this.pageIndex - 1;
			}
			this.goPage(this.pageIndex);
		},
		goNext : function() {
			if (!this.pageTotal || this.pageTotal <= 1) {
				return;
			}
			if (this.pageIndex == this.pageTotal)
				return;
//			if (this.pageIndex + 1 >= this.pageTotal) {
			if (Number(this.pageIndex) + 1 >= this.pageTotal) {
				this.pageIndex = this.pageTotal;
			} else {
//				this.pageIndex = this.pageIndex + 1;
				this.pageIndex = Number(this.pageIndex) + 1;
			}
			this.goPage(this.pageIndex);
		},
		goLast : function() {
			if (!this.pageTotal || this.pageTotal <= 1) {
				return;
			}
			if (this.pageIndex == this.pageTotal)
				return;
			this.pageIndex = this.pageTotal;
			this.goPage(this.pageIndex);
		},
		// 渲染分页条的显示视图
		renderPaging : function(total, rows, index) {
			total = total ? total : 0;
			rows = rows ? rows : 0;
			var index = parseInt(index);

			// 隐藏更多页数的符号
			var moreSignal = "...";

			var me = this;
			var pagingOptions = this.dataTable.options.data.paging;
			// 每页条数
			var pageSize = pagingOptions.pageSize;
			// 总页数
			var pageTotal = Math.ceil(total / pagingOptions.pageSize);
			this.pageTotal = pageTotal;
			// 最多显示的页码个数
			var pageMax = 7;
			// 页码区域
//			var ul = this.$(".tablefy ul");
			var ulNew=this.$(".pagination");//By Wendy
			
			// 消息区域
//			var infoArea = this.$("#dt_page_data_description");
			var infoAreaNew=this.$(".dataTables_info");
			// 页码
//			var liArray = new Array();
			var liArrayNew=new Array();//By Wendy
			
			var info = rows > 0 ? pagingOptions.info : pagingOptions.emptyInfo;

			// 页码太多需要部分显示，有三种显示方式
			// 1,2,3,4,5...,10;1,...,4,5,6...,10;1,...,6,7,8,9,10
			if (pageTotal > pageMax) {
				//下面的逻辑待修改
				// 第一种
				if (index <= pageMax - 3) {
					for (var i = 1; i <= pageMax - 2; i++) {
//						liArray.push("<li " + (index == i ? "class='pdi_paging_pageNumber_selected'" : "") + ">" + i + "</li>");
						liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
					}
//					liArray.push("<li>" + moreSignal + "</li>");
//					liArray.push("<li>" + pageTotal + "</li>");
					liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");
					liArrayNew.push("<li class='paginate_button "+(index==pageTotal?"active":"")+"' ><a href='javascript:;'>" + pageTotal + "</a></li>");
				}
				// 第二种
				else if (index > pageMax - 3 && index <= pageTotal - 4) {
//					liArray.push("<li " + (index == 1 ? "class='pdi_paging_pageNumber_selected'" : "") + ">1</li>");
//					liArray.push("<li>" + moreSignal + "</li>");
					liArrayNew.push("<li  class='paginate_button "+(index==1?"active":"")+"'><a href='javascript:;'>1</a></li>");
					liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");
					for (var i = index - 1; i <= index + pageMax - 6; i++) {
//						liArray.push("<li " + (index == i ? "class='pdi_paging_pageNumber_selected'" : "") + ">" + i + "</li>");
						liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
					}
//					liArray.push("<li>" + moreSignal + "</li>");
//					liArray.push("<li>" + pageTotal + "</li>");
					liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");
					liArrayNew.push("<li class='paginate_button "+(index==pageTotal?"active":"")+"' ><a href='javascript:;'>" + pageTotal + "</a></li>");
				} else {
//					liArray.push("<li " + (index == 1 ? "class='pdi_paging_pageNumber_selected'" : "") + ">1</li>");
//					liArray.push("<li>" + moreSignal + "</li>");
					liArrayNew.push("<li  class='paginate_button "+(index==1?"active":"")+"'><a href='javascript:;'>1</a></li>");
					liArrayNew.push("<li  class='paginate_button '><a href='javascript:;'>" + moreSignal + "</a></li>");
					
					for (var i = pageTotal - pageMax + 3; i <= pageTotal; i++) {
//						liArray.push("<li " + (index == i ? "class='pdi_paging_pageNumber_selected'" : "") + ">" + i + "</li>");
						liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
					}
				}
				info = info.format((index - 1) * pageSize + 1, (index - 1) * pageSize + rows, total);
			} else if (pageTotal > 0) {
				for (var i = 1; i <= pageTotal; i++) {
//					liArray.push("<li " + (index == i ? "class='pdi_paging_pageNumber_selected'" : "") + ">" + i + "</li>");
					liArrayNew.push("<li class='paginate_button "+(index==i?"active":"")+"' ><a href='javascript:;'>" + i + "</a></li>");
				}
				info = info.format((index - 1) * pageSize + 1, (index - 1) * pageSize + rows, total);
			}
			// 没有数据
			else {
//				ul.html("");
				ulNew.html("");
				info = pagingOptions.emptyInfo;
			}

			// 渲染至页面
//			ul.html(liArray.join(""));
			
			//页码数组添加首位的“向前”，“向后”按钮  by Wendy
			liArrayNew.unshift("<li class='paginate_button previous "+(index==1?"disabled":"")+"' id='datatable_previous'><a href='javascript:;'><i class='fa fa-angle-left'></i></a></li>");
			liArrayNew.push("<li class='paginate_button next "+(index==pageTotal?"disabled":"")+"' id='datatable_next'><a href='javascript:;'><i class='fa fa-angle-right'></i></a></li>");
			ulNew.html(liArrayNew.join(""));
			// 数据描述
//			infoArea.html(info);
			infoAreaNew.html(info);
			// 绑定事件
//			ul.find("li").on('click', function(li) {
//				var value = $(li.currentTarget).text();
//				if (value && value != moreSignal) {
//					me.goPage(value);
//				}
//			});
			ulNew.find("li").on('click', function(li) {
				var value = $(li.currentTarget).text();
				if (value && value != moreSignal) {
					me.goPage(value);
				}
			});
		}
	});

	return TableView;

});
