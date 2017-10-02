var beginadd;
var map;
var mapCenter = localStorage.getItem("mapC") == undefined ? undefined : localStorage.getItem("mapC").split(','); //用户当前　lng,lat
var AllResult;
var marker;
var choeseCity = '';
var choeseDisCounty = '';
var isOneMap = true; //调用同一张地图
var poiaddress;
var poiend;
var placeSearch;
var infoWindow;
///mapapiToBindToolBar

//restapi - map Reverse lnt,lat to address 
function mapajaxtoda(lnt, lat, aes, na) {
	$.ajax({
		type: "post",
		url: "http://restapi.amap.com/v3/geocode/regeo?output=json",
		data: {
			location: lnt + "," + lat,
			key: "069ce86713bd3a78cfc126f48aefbcd3"
		},
		success: function(rs) {
			if(aes != undefined) {
				eval('' + aes + '(rs,na)');
			}
		},
		error: function() {}
	});
}
//两点距离数学计算。
function distance(a, b, c, d) {
	var lnglat = new AMap.LngLat(a, b); // a, b 为 用户定位获取得经
	var dis = lnglat.distance([c, d]); // c, d为商铺提供的经纬度   
	return dis; // 返回的是 两者的距离数。单位 M

}

// 地图导航-根据起终点经纬度规划驾车导航路线。
function driving(a,b,c,d) { // a:116.379028   b:39.865042、 c:116.427281  d:39.903719、
	//构造路线导航类
	var driving = new AMap.Driving({
		map: map,
		
	});
	// 根据起终点经纬度规划驾车导航路线
	driving.search(new AMap.LngLat(a, b), new AMap.LngLat(c, d));
}

/**
 * gclmap高德地图插件
 * 创建：2017-7-18
 * 作者: 深网cto-郭重良
 * 使用方法:
 * 1、引用高德必用接口文件，引用本文件
 * 2、gclmap.init();初始化地图,可传4参数配置地图，详情件具体$.init方法的备注
 * 3、gclmap.showMap("container");显示地图，container为需要显示的id，如果自定义了地图的额外样式需要展示，则把大div的id放里面去
 * 额外参数:
 * 1、beginadd 地图初始化或者移动结束后都会将高德地方返回的值给到beginadd，此参数为数组，里面包含省市区详细地址经纬度字符串等等
 * 2、mapCenter或者localStorage.getItem("mapC") 存放用户当前经纬度信息
 */
var gclmap = (function(document, undefined) {
	var $ = function(selector, context) {
		context = context || document;
		if(!selector)
			return wrap();
		if(typeof selector === 'object')
			if($.isArrayLike(selector)) {
				return wrap($.slice.call(selector), null);
			} else {
				return wrap([selector], null);
			}
		if(typeof selector === 'function')
			return $.ready(selector);
		if(typeof selector === 'string') {
			try {
				selector = selector.trim();
				if(idSelectorRE.test(selector)) {
					var found = document.getElementById(RegExp.$1);
					return wrap(found ? [found] : []);
				}
				return wrap($.qsa(selector, context), selector);
			} catch(e) {}
		}
		return wrap();
	};

	var wrap = function(dom, selector) {
		dom = dom || [];
		Object.setPrototypeOf(dom, $.fn);
		dom.selector = selector || '';
		return dom;
	};
	$.isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};

	/**
	 * gclmap初始化地图
	 * e:显示poi地址的元素
	 * d:显示poi地址详情的元素
	 * c:是否强制重新精准定位用户位置,即mapCenter失效
	 * d:map初始化定位后backfun
	 * f:map是否去掉高德广告
	 */
	$.init = function(e, b, c, d, f, g) {
		if(!c && g != undefined && g.length == 2) {
			var mc = [g[0], g[1]];
			map = new AMap.Map("container", {
				resizeEnable: true,
				zoom: 15,
				center: mc
			});
		} else if(!c && mapCenter != null) {
			var mc = [mapCenter[0], mapCenter[1]];
			map = new AMap.Map("container", {
				resizeEnable: true,
				zoom: 15,
				center: mc
			});
		} else {
			map = new AMap.Map("container", {
				resizeEnable: true,
				zoom: 15,

			});
		}
		map.plugin(["AMap.ToolBar"], function() {
			map.addControl(new AMap.ToolBar());
		});
		if(location.href.indexOf('&guide=1') !== -1) {
			map.setStatus({
				scrollWheel: false
			})
		}
		poiaddress = e;
		poiend = b;
		$.getmapcenterInfo(c);
		initBackFunName = d;
		if(f) {
			$.removeGG();
		}
		infoWindow = new AMap.InfoWindow({
			autoMove: true,
			offset: {
				x: 0,
				y: -30
			}
		});
		AMap.service(["AMap.PlaceSearch"], function() {
			placeSearch = new AMap.PlaceSearch({ //构造地点查询类
				pageSize: 1,
				type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
				pageIndex: 1,

			});
		});

	}
	var initBackFunName;
	$.getmapcenterInfo = function(c) {
		map.plugin('AMap.Geolocation', function() {
			if(c) {
				geolocation = new AMap.Geolocation({
					enableHighAccuracy: true, //是否使用高精度定位，默认:true
					showCircle: false,
				});
				map.addControl(geolocation);
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', $.mapComplete); //返回定位信息
				AMap.event.addListener(geolocation, 'error', $.mapError); //返回定位出错信息
			} else {
				geolocation = new AMap.Geolocation({
					enableHighAccuracy: true, //是否使用高精度定位，默认:true
					showCircle: false,
					panToLocation: false,
					zoomToAccuracy: false,
					showMarker: false,
				});
				var mvc = [map.getCenter().lng, map.getCenter().lat];
				if(marker != undefined)
					marker.setPosition(mvc);
				else {
					marker = new AMap.Marker({
						position: mvc
					});
					marker.setMap(map);
				}
				map.addControl(geolocation);
				abcmap('', mvc[0], mvc[1], "getmap");
			}

		});
	}
	$.mapComplete = function(rs) {
		if(rs.status == 1) {
			beginadd = [];
			choeseCity = rs.addressComponent.city;
			choeseDisCounty = rs.addressComponent.district;
			mapCenter = [];
			mapCenter.push(rs.position.lng);
			mapCenter.push(rs.position.lat);
			var movecenter = [mapCenter[0], mapCenter[1]];
			if(marker != undefined)
				marker.setPosition(movecenter);
			else {
				marker = new AMap.Marker({
					position: movecenter
				});
				marker.setMap(map);
			}
			localStorage.setItem("mapC", mapCenter);
			$.setauto(rs.addressComponent.citycode);
			beginadd = [];

			beginadd.push(rs.addressComponent.province); //省
			beginadd.push(rs.addressComponent.city); //市
			beginadd.push(rs.addressComponent.district); //区
			beginadd.push(rs.formattedAddress); //详细地址
			beginadd.push(rs.addressComponent.township + rs.addressComponent.street + rs.addressComponent.streetNumber); //地址名称
			beginadd.push(rs.position.lng + "," + rs.position.lat); //经纬度字符串

			if(poiaddress != undefined)
				poiaddress.innerHTML = rs.addressComponent.street + rs.addressComponent.streetNumber;
			if(poiend != undefined)
				poiend.innerHTML = "详情地址：" + rs.formattedAddress;
			if(initBackFunName != undefined)
				eval('' + initBackFunName + '(rs)');

		} else {
			alert("地图授权已过期，请检查key");
		}
	}

	$.setauto = function(citycode) {
		var autoOptions = {
			input: "tipinput",
			city: citycode, //城市，默认全国
		};
		var auto = new AMap.Autocomplete(autoOptions);
		AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
		function select(e) { //下拉列表选中事件
			mapmove = false;
			marker.setPosition(e.poi.location);
			map.setCenter(e.poi.location);
			placeSearch.searchNearBy('', e.poi.location, 600, function(status, result) {
				if(status === 'complete' && result.info === 'OK') {
					placeSearch_CallBack(result);
				}
			});
		}
	}

	$.mapError = function(rs) {
		$.mapcenterInfo();
	}
	$.mapcenterInfo = function() {
		if(map != undefined) {
			map.getCity(function(e) {
				mapCenter = [];
				mapCenter.push(map.getCenter().lng);
				mapCenter.push(map.getCenter().lat);
				localStorage.setItem("mapC", mapCenter);
				var mvc = [mapCenter[0], mapCenter[1]];
				if(marker != undefined)
					marker.setPosition(mvc);
				else {
					marker = new AMap.Marker({
						position: mvc
					});
					marker.setMap(map);
				}
				choeseCity = e.city;
				choeseDisCounty = e.district;
				$.setauto(e.citycode);
				beginadd = [];

				beginadd.push(e.province); //省
				beginadd.push(e.city); //市
				beginadd.push(e.district); //区
				beginadd.push(""); //详细地址
				beginadd.push(e.city + e.district); //地址名称
				beginadd.push(mapCenter[0] + "," + mapCenter[1]); //经纬度字符串
				if(poiaddress != undefined)
					poiaddress.innerHTML = e.district;
				if(poiend != undefined)
					poiend.innerHTML = "详情地址：" + e.city + e.district;
				if(initBackFunName != undefined)
					eval('' + initBackFunName + '(e)');
			});
		} else {
			alert("地图未init初始化");
		}
	}
	var btFirst = false;
	$.showMap = function(t) {
		document.getElementById(t).style.display = "block";
		if(!btFirst) {
			$.mapBindEvent();
		}
	}
	$.removeGG = function() {
		document.getElementsByClassName('amap-logo')[0].remove();
		document.getElementsByClassName('amap-geo')[0].remove()
		document.getElementsByClassName('amap-copyright')[0].remove();
		document.getElementsByClassName('amap-toolbar')[0].remove();
	}
	$.closeMap = function(t) {
		document.getElementById(t).style.display = "none";
		if(!btFirst)
			$.mapBindEvent();
	}
	$.mapBindEvent = function() {
		btFirst = true;
		map.on('mapmove', function(e) {
			var vlng = map.getCenter().getLng();
			var vlat = map.getCenter().getLat();
			var movecenter = [vlng, vlat];
			if(marker != undefined)
				marker.setPosition(movecenter);
			if(poiaddress != undefined)
				poiaddress.innerText = "poi正在获取中...";
			if(poiend != undefined)
				poiend.innerText = "详情地址：poi正在获取中...";

		});
		map.on('moveend', function(e) {
			var vlng = map.getCenter().getLng();
			var vlat = map.getCenter().getLat();
			var moveend = [vlng, vlat];

			placeSearch.searchNearBy('', moveend, 600, function(status, result) {
				if(status === 'complete' && result.info === 'OK') {
					placeSearch_CallBack(result);
				}
			});
		});
	}
	//回调函数
	function placeSearch_CallBack(data) {
		var poiArr = data.poiList.pois;
		var i = poiArr.length > 0 ? poiArr.length - 1 : 0;

		infoWindow.setContent(createContent(poiArr[0]));
		infoWindow.open(map, marker.getPosition());
	}

	function createContent(poi) { //信息窗体内容

		abcmap(poi.name, poi.location.lng, poi.location.lat, "getmap");
	}

	function abcmap(name, lng, lat, rsFun) {
		mapajaxtoda(lng, lat, rsFun, name);
	}

	return $;

})(document);

function getmap(rs, n) {
	beginadd = [];
	if(rs.status == 1) {
		gclmap.setauto(rs.regeocode.addressComponent.citycode);
		beginadd.push(rs.regeocode.addressComponent.province); //省
		beginadd.push(rs.regeocode.addressComponent.city); //市
		beginadd.push(rs.regeocode.addressComponent.district); //区
		beginadd.push(rs.regeocode.formatted_address); //详细地址
		beginadd.push(n); //地址名称
		beginadd.push(rs.regeocode.addressComponent.streetNumber.location); //经纬度字符串
		if(poiaddress != undefined)
			poiaddress.innerText = beginadd[4];
		if(poiend != undefined)
			poiend.innerText = "详情地址：" + beginadd[3];
	}
}