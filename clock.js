/**
* @1900-2100区间内的公历、农历互转
* @charset UTF-8
* @Author  jiangjiazhi
* @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
* @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
*/
/**
* 农历1900-2100的润大小信息表
* @Array Of Property
* @return Hex
*/
var lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
	0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
	0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
	0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
	0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
	0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
	0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
	0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
	0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
	0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
	0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
	0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
	0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
	0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
	0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
	0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
	0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
	0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
	0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
	0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
	0x0d520] // 2100
var solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
/**
* 天干地支之天干速查表
* @Array Of Property trans['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
* @return Cn string
*/
// var Gan = ['\u7532', '\u4e59', '\u4e19', '\u4e01', '\u620a', '\u5df1', '\u5e9a', '\u8f9b', '\u58ec', '\u7678']
var Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
/**
* 天干地支之地支速查表
* @Array Of Property
* @trans['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
* @return Cn string
*/
// var Zhi = ['\u5b50', '\u4e11', '\u5bc5', '\u536f', '\u8fb0', '\u5df3', '\u5348', '\u672a', '\u7533', '\u9149', '\u620c', '\u4ea5']
var Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
/**
* 天干地支之地支速查表<=>生肖
* @Array Of Property
* @trans['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
* @return Cn string
*/
// var Animals = ['\u9f20', '\u725b', '\u864e', '\u5154', '\u9f99', '\u86c7', '\u9a6c', '\u7f8a', '\u7334', '\u9e21', '\u72d7', '\u732a']
var Animals = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬']
/**
* 24节气速查表
* @Array Of Property
* @trans['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至']
* @return Cn string
*/
// var solarTerm = ['\u5c0f\u5bd2', '\u5927\u5bd2', '\u7acb\u6625', '\u96e8\u6c34', '\u60ca\u86f0', '\u6625\u5206', '\u6e05\u660e', '\u8c37\u96e8', '\u7acb\u590f', '\u5c0f\u6ee1', '\u8292\u79cd', '\u590f\u81f3', '\u5c0f\u6691', '\u5927\u6691', '\u7acb\u79cb', '\u5904\u6691', '\u767d\u9732', '\u79cb\u5206', '\u5bd2\u9732', '\u971c\u964d', '\u7acb\u51ac', '\u5c0f\u96ea', '\u5927\u96ea', '\u51ac\u81f3']
var solarTerm = ['小寒', '大寒', '立春', '雨水','驚蟄', '春分', '清明', '穀雨', '立夏', '小滿', '芒種', '夏至', '小暑', '大暑', '立秋', '處暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至']
/**
* 1900-2100各年的24节气日期速查表
* @Array Of Property
* @return 0x string For splice
*/
var sTermInfo = ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
	'97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
	'97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
	'97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
	'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
	'97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
	'97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
	'9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
	'97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
	'97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
	'97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
	'9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
	'97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
	'97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
	'97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
	'9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
	'97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
	'97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
	'9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
	'7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
	'97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
	'97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
	'9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
	'7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
	'97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
	'97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
	'9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
	'7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
	'97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
	'9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
	'7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
	'7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
	'97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
	'9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
	'7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
	'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
	'97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
	'9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
	'7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
	'7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
	'977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
	'7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
	'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
	'7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
	'977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
	'7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
	'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
	'7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
	'977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
	'7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
	'7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
	'7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
	'7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
	'7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
	'7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
	'7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
	'7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
	'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
	'7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
	'7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
	'7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
	'7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
	'7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
	'665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
	'7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
	'7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
	'7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722']
/**
 * 数字转中文速查表
* @Array Of Property
* @trans ['日','一','二','三','四','五','六','七','八','九','十']
* @return Cn string
 */
var nStr1 = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341']
/**
* 日期转农历称呼速查表
* @Array Of Property
* @trans ['初','十','廿','卅']
* @return Cn string
*/
var nStr2 = ['\u521d', '\u5341', '\u5eff', '\u5345']
/**
* 月份转农历称呼速查表
* @Array Of Property
* @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
* @return Cn string
*/
// var nStr3 = ['\u6b63', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341', '\u51ac', '\u814a']
var nStr3 = ['正', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘']
/**
* 返回农历y年一整年的总天数
* @param lunar Year
 * @return Number
* @eg:var count = calendar.lYearDays(1987) ;//count=387
*/
function lYearDays(y) {
	var i
	var sum = 348
	for (i = 0x8000; i > 0x8; i >>= 1) { sum += (lunarInfo[y - 1900] & i) ? 1 : 0 }
	return (sum + leapDays(y))
}
/**
* 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
* @param lunar Year
* @return Number (0-12)
 * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
*/
function leapMonth(y) { // 闰字编码 \u95f0
	return (lunarInfo[y - 1900] & 0xf)
}
/**
* 返回农历y年闰月的天数 若该年没有闰月则返回0
* @param lunar Year
* @return Number (0、29、30)
* @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
*/
function leapDays(y) {
	if (leapMonth(y)) {
		return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
	}
	return (0)
}
/**
* 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
* @param lunar Year
* @return Number (-1、29、30)
 * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
*/
function monthDays(y, m) {
	if (m > 12 || m < 1) { return -1 }// 月份参数从1至12，参数错误返回-1
	return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29)
}
/**
* 返回公历(!)y年m月的天数
* @param solar Year
* @return Number (-1、28、29、30、31)
* @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
*/
function solarDays(y, m) {
	if (m > 12 || m < 1) { return -1 } // 若参数错误 返回-1
	var ms = m - 1
	if (ms === 1) { // 2月份的闰平规律测算后确认返回28或29
		return (((y % 4 === 0) && (y % 100 !== 0) || (y % 400 === 0)) ? 29 : 28)
	} else {
		return (solarMonth[ms])
	}
}
/**
* 农历年份转换为干支纪年
* @param  lYear 农历年的年份数
* @return Cn string
*/
function toGanZhiYear(lYear) {
	var ganKey = (lYear - 3) % 10
	var zhiKey = (lYear - 3) % 12
	if (ganKey === 0) ganKey = 10 // 如果余数为0则为最后一个天干
	if (zhiKey === 0) zhiKey = 12 // 如果余数为0则为最后一个地支
	return Gan[ganKey - 1] + Zhi[zhiKey - 1]
}
/**
* 公历月、日判断所属星座
* @param  cMonth [description]
* @param  cDay [description]
* @return Cn string
*/
function toAstro(cMonth, cDay) {
	var s = '\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf'
	var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22]
	return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + '\u5ea7' // 座
}
/**
* 传入offset偏移量返回干支
* @param offset 相对甲子的偏移量
* @return Cn string
*/
function toGanZhi(offset) {
	return Gan[offset % 10] + Zhi[offset % 12]
}
/**
* 传入公历(!)y年获得该年第n个节气的公历日期
* @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
* @return day Number
* @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
*/
function getTerm(y, n) {
	if (y < 1900 || y > 2100) { return -1 }
	if (n < 1 || n > 24) { return -1 }
	var _table = sTermInfo[y - 1900]
	var _info = [
		parseInt('0x' + _table.substr(0, 5)).toString(),
		parseInt('0x' + _table.substr(5, 5)).toString(),
		parseInt('0x' + _table.substr(10, 5)).toString(),
		parseInt('0x' + _table.substr(15, 5)).toString(),
		parseInt('0x' + _table.substr(20, 5)).toString(),
		parseInt('0x' + _table.substr(25, 5)).toString()
	]
	var _calday = [
		_info[0].substr(0, 1),
		_info[0].substr(1, 2),
		_info[0].substr(3, 1),
		_info[0].substr(4, 2),
		_info[1].substr(0, 1),
		_info[1].substr(1, 2),
		_info[1].substr(3, 1),
		_info[1].substr(4, 2),
		_info[2].substr(0, 1),
		_info[2].substr(1, 2),
		_info[2].substr(3, 1),
		_info[2].substr(4, 2),
		_info[3].substr(0, 1),
		_info[3].substr(1, 2),
		_info[3].substr(3, 1),
		_info[3].substr(4, 2),
		_info[4].substr(0, 1),
		_info[4].substr(1, 2),
		_info[4].substr(3, 1),
		_info[4].substr(4, 2),
		_info[5].substr(0, 1),
		_info[5].substr(1, 2),
		_info[5].substr(3, 1),
		_info[5].substr(4, 2)
	]
	return parseInt(_calday[n - 1])
}
/**
* 传入农历数字月份返回汉语通俗表示法
* @param lunar month
* @return Cn string
* @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
*/
function toChinaMonth(m) { // 月 => \u6708
	if (m > 12 || m < 1) { return -1 } // 若参数错误 返回-1
	var s = nStr3[m - 1]
	s += '\u6708' // 加上月字
	return s
}
/**
* 传入农历日期数字返回汉字表示法
* @param lunar day
* @return Cn string
* @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
*/
function toChinaDay(d) { // 日 => \u65e5
	var s
	switch (d) {
		case 10:
			s = '\u521d\u5341'
			break
		case 20:
			s = '\u4e8c\u5341'
			break
		case 30:
			s = '\u4e09\u5341'
			break
		default:
			s = nStr2[Math.floor(d / 10)]
			s += nStr1[d % 10]
	}
	return (s)
}
/**
* 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
* @param y year
* @return Cn string
* @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
*/
function getAnimal(y) {
	return Animals[(y - 4) % 12]
}
/**
* 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
* @param y  solar year
* @param m  solar month
* @param d  solar day
* @return JSON object
* @eg:console.log(calendar.solar2lunar(1987,11,01));
*/
function solar2lunar(y, m, d) { // 参数区间1900.1.31~2100.12.31
	// 年份限定、上限
	if (y < 1900 || y > 2100) {
		return -1 // undefined转换为数字变为NaN
	}
	// 公历传参最下限
	if (y === 1900 && m === 1 && d < 31) {
		return -1
	}
	// 未传参  获得当天
	var objDate = null
	if (!y) {
		objDate = new Date()
	} else {
		objDate = new Date(y, parseInt(m) - 1, d)
	}
	var i
	var leap = 0
	var temp = 0
	// 修正ymd参数
	y = objDate.getFullYear()
	m = objDate.getMonth() + 1
	d = objDate.getDate()
	var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000
	for (i = 1900; i < 2101 && offset > 0; i++) {
		temp = lYearDays(i)
		offset -= temp
	}
	if (offset < 0) {
		offset += temp; i--
	}
	// 是否今天
	var isTodayObj = new Date()
	var isToday = false
	if (isTodayObj.getFullYear() === y && isTodayObj.getMonth() + 1 === m && isTodayObj.getDate() === d) {
		isToday = true
	}
	// 星期几
	var nWeek = objDate.getDay()
	var cWeek = nStr1[nWeek]
	// 数字表示周几顺应天朝周一开始的惯例
	if (nWeek === 0) {
		nWeek = 7
	}
	// 农历年
	var year = i
	leap = leapMonth(i) // 闰哪个月
	var isLeap = false
	// 效验闰月
	for (i = 1; i < 13 && offset > 0; i++) {
		// 闰月
		if (leap > 0 && i === (leap + 1) && isLeap === false) {
			--i
			isLeap = true; temp = leapDays(year) // 计算农历闰月天数
		} else {
			temp = monthDays(year, i)// 计算农历普通月天数
		}
		// 解除闰月
		if (isLeap === true && i === (leap + 1)) { isLeap = false }
		offset -= temp
	}
	// 闰月导致数组下标重叠取反
	if (offset === 0 && leap > 0 && i === leap + 1) {
		if (isLeap) {
			isLeap = false
		} else {
			isLeap = true; --i
		}
	}
	if (offset < 0) {
		offset += temp; --i
	}
	// 农历月
	var month = i
	// 农历日
	var day = offset + 1
	// 天干地支处理
	var sm = m - 1
	var gzY = toGanZhiYear(year)
	// 当月的两个节气
	// bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
	var firstNode = getTerm(y, (m * 2 - 1)) // 返回当月「节」为几日开始
	var secondNode = getTerm(y, (m * 2)) // 返回当月「节」为几日开始
	// 依据12节气修正干支月
	var gzM = toGanZhi((y - 1900) * 12 + m + 11)
	if (d >= firstNode) {
		gzM = toGanZhi((y - 1900) * 12 + m + 12)
	}
	// 传入的日期的节气与否
	var isTerm = false
	var Term = null
	if (firstNode === d) {
		isTerm = true
		Term = solarTerm[m * 2 - 2]
	}
	else if (secondNode === d) {
		isTerm = true
		Term = solarTerm[m * 2 - 1]
	}
	else if (firstNode < d && secondNode > d) {
		Term = solarTerm[m * 2 - 2]
	}
	else if (firstNode > d) {
		Term = solarTerm[(m * 2 - 3 + 24) % 24]
	}
	else {
		Term = solarTerm[m * 2 - 1]
	}
	// 日柱 当月一日与 1900/1/1 相差天数
	var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10
	var gzD = toGanZhi(dayCyclical + d - 1)
	// 该日期所属的星座
	var astro = toAstro(m, d)
	// return { 'lYear': year, 'lMonth': month, 'lDay': day, 'Animal': getAnimal(year), 'IMonthCn': (isLeap ? '\u95f0' : '') + toChinaMonth(month), 'IDayCn': toChinaDay(day), 'cYear': y, 'cMonth': m, 'cDay': d, 'gzYear': gzY, 'gzMonth': gzM, 'gzDay': gzD, 'isToday': isToday, 'isLeap': isLeap, 'nWeek': nWeek, 'ncWeek': '\u661f\u671f' + cWeek, 'isTerm': isTerm, 'Term': Term, 'astro': astro }
	return { 'lYear': year, 'lMonth': month, 'lDay': day, 'Animal': getAnimal(year), 'IMonthCn': (isLeap ? '閏' : '') + toChinaMonth(month), 'IDayCn': toChinaDay(day), 'cYear': y, 'cMonth': m, 'cDay': d, 'gzYear': gzY, 'gzMonth': gzM, 'gzDay': gzD, 'isToday': isToday, 'isLeap': isLeap, 'nWeek': nWeek, 'ncWeek': '\u661f\u671f' + cWeek, 'isTerm': isTerm, 'Term': Term, 'astro': astro }
}
var calendarFormatter = {
	// 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
	solar2lunar: function (y, m, d) { // 参数区间1900.1.31~2100.12.31
		return solar2lunar(y, m, d)
	},
	/**
	* 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
	* @param y  lunar year
	* @param m  lunar month
	* @param d  lunar day
	* @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
	* @return JSON object
	* @eg:console.log(calendar.lunar2solar(1987,9,10));
	*/
	lunar2solar: function (y, m, d, isLeapMonth) { // 参数区间1900.1.31~2100.12.1
		isLeapMonth = !!isLeapMonth
		if (isLeapMonth && (leapMonth !== m)) { return -1 }// 传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
		if (y === 2100 && m === 12 && d > 1 || y === 1900 && m === 1 && d < 31) { return -1 } // 超出了最大极限值
		var day = monthDays(y, m)
		var _day = day
		// bugFix 2016-9-25
		// if month is leap, _day use leapDays method
		if (isLeapMonth) {
			_day = leapDays(y, m)
		}
		if (y < 1900 || y > 2100 || d > _day) { return -1 }// 参数合法性效验
		// 计算农历的时间差
		var offset = 0
		for (var i = 1900; i < y; i++) {
			offset += lYearDays(i)
		}
		var leap = 0
		var isAdd = false
		for (i = 1; i < m; i++) {
			leap = leapMonth(y)
			if (!isAdd) { // 处理闰月
				if (leap <= i && leap > 0) {
					offset += leapDays(y); isAdd = true
				}
			}
			offset += monthDays(y, i)
		}
		// 转换闰月农历 需补充该年闰月的前一个月的时差
		if (isLeapMonth) { offset += day }
		// 1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
		var stmap = Date.UTC(1900, 1, 30, 0, 0, 0)
		var calObj = new Date((offset + d - 31) * 86400000 + stmap)
		var cY = calObj.getUTCFullYear()
		var cM = calObj.getUTCMonth() + 1
		var cD = calObj.getUTCDate()
		return solar2lunar(cY, cM, cD)
	}
}

const ganzhi = '子丑寅卯辰巳午未申酉戌亥';
const xiaoshi = '初正';
// const jike = '一二三四五';
const jike = '初一二三';
function time_to_shichen(hour, minute) {
	// return ganzhi.charAt((hour + 1) % 24 / 2) + xiaoshi.charAt((hour + 1) % 2) + jike.charAt(minute / 14.4) + '刻';
	return ganzhi.charAt((hour + 1) % 24 / 2) + xiaoshi.charAt((hour + 1) % 2) + jike.charAt(minute / 15) + '刻';
}

function clockModule(options) {
	this._initial(options);
}
clockModule.prototype = {
	constructor: this,
	_initial: function (options) {
		var par = {
			Module: [],//需要显示时钟的模块，不限个数
			clocksize: [200, 200],//时钟大小,默认200，如果定义的单独时钟无长宽大小，默认为该值大小
			clockbgcolor: "#ffffff",//时钟背景颜色
			defaultcolor: {
				kdcolor: "#eee",
				zscolor: "#000",
				Minutehand: "#000",//分针颜色
				Hourhand: "#000",//时针颜色
				Secondhand: "#f00",//秒针颜色
				textcolor: "#000000",//文字颜色
				brimcolor: "#000000"//边框颜色
			},
			clockparameter: [{
				timezone: '',//时区
				cw: null,//宽度
				ch: null,//高度
				bgcolor: null,//时钟背景颜色
				cityName: '',//城市名称
				cityEnglish: '',//英文名称
				font: '',//字体大小设置
				kdcolor: null,
				zscolor: null,
				Minutehand: null,
				Hourhand: null,
				Secondhand: null,
				textcolor: null,
				brimcolor: null//边框颜色
			}],//每个时钟的参数配置
			expandmethod: function () { }//自定义扩展方法类
		};
		//封装extend合并方法
		this.extend = function (o, n, override) {
			for (var key in n) {
				if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
					o[key] = n[key];
				}
			}
			return o;
		};
		this.$ = function (className, topWindow) {
			var expression = /^\#|[\.]|\-\b$/;
			var v = expression.test(className);
			if (v == true) {
				if (className.indexOf("#") != -1) {
					topWindow != undefined ? className = topWindow.getElementById(className.slice(1)) : className = document.getElementById(className.slice(1));
				} else if (className.indexOf(".") != -1) {
					if (!document.getElementsByClassName) {
						topWindow != undefined ? className = this.getElementsByClassName(topWindow, className.slice(1))[0] : className = this.getElementsByClassName(document, className.slice(1))[0];
					} else {
						topWindow != undefined ? className = topWindow.getElementsByClassName(className.slice(1))[0] : className = document.getElementsByClassName(className.slice(1))[0];
					}
				}
			}
			return className;
		};
		//判断是否存在class属性方法
		this.hasClass = function (elements, cName) {
			return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
		};
		//添加class属性方法
		this.addClass = function (elements, cName) {
			if (!this.hasClass(elements, cName)) {
				elements.className += " " + cName;
			};
		};
		//删除class属性方法 elements当前结构  cName类名
		this.removeClass = function (elements, cName) {
			if (this.hasClass(elements, cName)) {
				elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换
			};
		};
		this.eve = function (eve) {
			var evt = eve || window.event; //指向触发事件的元素
			var obj = evt.target || evt.srcElement || eve.srcElement; //指向触发事件的元素
			return obj;
		},
			//根据class类名条件筛选结构
			this.getElementsByClassName = function (parent, className) {
				//获取所有父节点下的tag元素　
				var aEls = parent.getElementsByTagName("*");
				var arr = [];
				//循环所有tag元素　
				for (var i = 0; i < aEls.length; i++) {
					//将tag元素所包含的className集合（这里指一个元素可能包含多个class）拆分成数组,赋值给aClassName	　　　　
					var aClassName = aEls[i].className.split(' ');　　　　 //遍历每个tag元素所包含的每个className
					for (var j = 0; j < aClassName.length; j++) {　　　　　　 //如果符合所选class，添加到arr数组				　　　　　
						if (aClassName[j] == className) {
							arr.push(aEls[i]);　　　　　　　　 //如果className里面包含'box' 则跳出循环						　　　　　　　　
							break; //防止一个元素出现多次相同的class被添加多次						　　　　　　
						}
					};
				};
				return arr;
			}
		this.par = this.extend(par, options, true);
		this.show(this.par, this);
	},
	show: function (par, clock) {
		var doclist = par.Module;
		for (var i = 0; i < doclist.length; i++) {
			var pagination = clock.$(doclist[i]);
			var clockparameter = clock.par.clockparameter[i];
			if (clockparameter != undefined) {
				clock.clocksite(pagination, clock, clockparameter);
			}
		}
		clock.par.expandmethod(clock);
	},
	clocksite: function (doc, clock, clockparameter) {
		var kdcolor, zscolor, Minutehand, Hourhand, Secondhand, textcolor, brimcolor;
		var canvasbox = document.createElement("canvas");
		clock.addClass(canvasbox, "canvasbox");
		canvasbox.style.overflow = "hidden";
		canvasbox.style.borderRadius = "50%";
		doc.appendChild(canvasbox);
		var titletime = document.createElement("div");
		clock.addClass(titletime, "titletime");
		doc.appendChild(titletime);
		var titleName = document.createElement("div");
		clock.addClass(titleName, "cityName");
		titleName.innerHTML = clockparameter.cityName;
		doc.appendChild(titleName);
		var titleEnglish = document.createElement("div");
		clock.addClass(titleEnglish, "cityEnglish");
		titleEnglish.innerHTML = clockparameter.cityEnglish;
		doc.appendChild(titleEnglish);
		if (clockparameter.cw == null && clockparameter.ch == null) {
			var clocksize = clock.par.clocksize;
			for (var i = 0; i < clocksize.length; i++) {
				if (i == 0) {
					canvasbox.height = clocksize[i];
				} else if (i == 1) {
					canvasbox.width = clocksize[i];
				}
			}
		} else {
			canvasbox.height = clockparameter.ch;
			canvasbox.width = clockparameter.cw;
		}
		if (clockparameter.bgcolor == null) {
			canvasbox.style.backgroundColor = clock.par.clockbgcolor;
		} else {
			canvasbox.style.backgroundColor = clockparameter.bgcolor;
		}
		if (clockparameter.kdcolor == null) {
			kdcolor = clock.par.defaultcolor.kdcolor;
		} else {
			kdcolor = clockparameter.kdcolor;
		}
		if (clockparameter.zscolor == null) {
			zscolor = clock.par.defaultcolor.zscolor;
		} else {
			zscolor = clockparameter.zscolor;
		}
		if (clockparameter.Minutehand == null) {
			Minutehand = clock.par.defaultcolor.Minutehand;
		} else {
			Minutehand = clockparameter.Minutehand;
		}
		if (clockparameter.Hourhand == null) {
			Hourhand = clock.par.defaultcolor.Hourhand;
		} else {
			Hourhand = clockparameter.Hourhand;
		}
		if (clockparameter.Secondhand == null) {
			Secondhand = clock.par.defaultcolor.Secondhand;
		} else {
			Secondhand = clockparameter.Secondhand;
		}
		if (clockparameter.textcolor == null) {
			textcolor = clock.par.defaultcolor.textcolor;
		} else {
			textcolor = clockparameter.textcolor;
		}
		if (clockparameter.brimcolor == null) {
			brimcolor = clock.par.defaultcolor.brimcolor;
		} else {
			brimcolor = clockparameter.brimcolor;
		}
		var ctx = canvasbox.getContext("2d");
		var width = ctx.canvas.clientWidth;
		var height = ctx.canvas.clientHeight;
		var r = width / 2;
		var rem = width / 200;
		var drawAround = function () {
			ctx.save();
			ctx.beginPath();
			ctx.translate(r, r);
			ctx.lineWidth = 10 * rem;
			ctx.strokeStyle = brimcolor;
			ctx.arc(0, 0, r - 5, 0, 2 * Math.PI, false);
			ctx.stroke();
			var housNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
			ctx.font = clockparameter.font;
			ctx.textAlign = "center";
			ctx.textBaseline = 'middle';
			housNumbers.forEach(function (number, i) {
				var rad = 2 * Math.PI / 12 * i;
				var x = Math.cos(rad) * (r - 30);
				var y = Math.sin(rad) * (r - 30);
				ctx.fillStyle = textcolor;
				ctx.fillText(number, x, y);
			});
			for (var i = 0; i < 60; i++) {
				var rad = 2 * Math.PI / 60 * i;
				var x = Math.cos(rad) * (r - 18);
				var y = Math.sin(rad) * (r - 18);
				ctx.beginPath();
				if (i % 5 != 0) {
					ctx.fillStyle = kdcolor;
				} else {
					ctx.fillStyle = zscolor;
				}
				ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
				ctx.fill();
			}
		}
		var drawhHour = function (hour, minute) {
			ctx.save()
			ctx.beginPath();
			var rad = 2 * Math.PI / 12 * hour;
			var mrad = 2 * Math.PI / 12 / 60 * minute;
			ctx.rotate(rad + mrad);
			ctx.lineWidth = 6;
			ctx.lineCap = "round";
			ctx.strokeStyle = Hourhand;
			ctx.moveTo(0, 10);
			ctx.lineTo(0, -r / 2);
			ctx.stroke();
			ctx.restore();
		}
		var drawMinute = function (minute) {
			ctx.save()
			ctx.beginPath();
			var rad = 2 * Math.PI / 60 * minute;
			ctx.rotate(rad);
			ctx.lineWidth = 3;
			ctx.lineCap = "round";
			ctx.strokeStyle = Minutehand;
			ctx.moveTo(0, 10);
			ctx.lineTo(0, -r + 30);
			ctx.stroke();
			ctx.restore();
		}
		var drawSecond = function (second) {
			ctx.save()
			ctx.beginPath();
			var rad = 2 * Math.PI / 60 * second;
			ctx.rotate(rad);
			ctx.fillStyle = Secondhand;
			ctx.moveTo(-2, 20);
			ctx.lineTo(2, 20);
			ctx.lineTo(1, -r + 18);
			ctx.lineTo(-1, -r + 18);
			ctx.fill();
			ctx.restore();
		}
		var drawDot = function () {
			ctx.beginPath();
			ctx.fillStyle = "#fff";
			ctx.arc(0, 0, 3, 0, 2 * Math.PI, false);
			ctx.fill();
		}
		var datetime = function (hour, minute, clockdate, weekdate, lunardate, lunartime) {
			titletime.innerHTML = clockdate + "&nbsp;&nbsp;<span>" + hour + "</span>:<span>" + (minute.toString().length < 2 ? '0' + minute.toString() : minute.toString()) + "</span><br/>" + weekdate + "<br/>" + lunardate + '<br/>' + lunartime;
		}
		var draw = function () {
			ctx.clearRect(0, 0, width, height);
			var timezone = clockparameter.timezone; //目标时区时间
			var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
			var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
			var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
			var hour = targetDate.getHours();
			var minute = targetDate.getMinutes();
			var second = targetDate.getSeconds();
			var Year = targetDate.getFullYear();
			var ChinaYear = Year - 1911;
			var Month = targetDate.getMonth() + 1;
			var Dates = targetDate.getDate();
			var clockdate = "民國" + ChinaYear + "年" + Month + "月" + Dates + "日";
			var weekdate = "西元" + Year + "年&nbsp;&nbsp;星期" + nStr1[targetDate.getDay()] + "&nbsp;&nbsp;";
			var lunarDate = calendarFormatter.solar2lunar(Year, Month, Dates);
			weekdate += lunarDate.isTerm ? "今天" + lunarDate.Term : lunarDate.Term + "已過" ;
			var lunardate = lunarDate.gzYear + '(' + lunarDate.Animal + ')' + '年' + lunarDate.IMonthCn[0] + '(' + lunarDate.gzMonth + ')' + '月' + lunarDate.IDayCn + '(' + lunarDate.gzDay + ')日';
			var lunartime = time_to_shichen(hour, minute);
			drawAround();
			drawSecond(second);
			drawMinute(minute);
			drawhHour(hour, minute);
			datetime(hour, minute, clockdate, weekdate, lunardate, lunartime)
			drawDot();
			ctx.restore();
		}
		draw();
		setInterval(draw, 1000);
	}
}
