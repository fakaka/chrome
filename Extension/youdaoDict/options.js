var options = {
	"ctrl_only": ["checked", false],
	"playwhenhovering": ["checked", false],
	"playwhenclicking": ["checked", false]
};

var retphrase = "";
var basetrans = "";
var webtrans = "";
var noBaseTrans = false;
var noWebTrans = false;
var _word;
function parseXML(xmlnode) {
	var translate = "<strong>查询:</strong><br/>";
	var root = xmlnode.getElementsByTagName("yodaodict")[0];

	if ("" + root.getElementsByTagName("return-phrase")[0].childNodes[0] != "undefined")
		retphrase = root.getElementsByTagName("return-phrase")[0].childNodes[0].nodeValue;

	var strpho = "";

	if ("" + root.getElementsByTagName("phonetic-symbol")[0] != "undefined") {
		if ("" + root.getElementsByTagName("phonetic-symbol")[0].childNodes[0] != "undefined")
			var pho = root.getElementsByTagName("phonetic-symbol")[0].childNodes[0].nodeValue;

		if (pho != null) {
			strpho = "&nbsp;[" + pho + "]";
		}
	}

	if ("" + root.getElementsByTagName("translation")[0] == "undefined") {
		noBaseTrans = true;
	}
	if ("" + root.getElementsByTagName("web-translation")[0] == "undefined") {
		noWebTrans = true;
	}

	if (noBaseTrans == false) {
		translate += retphrase + "<br/><br/><strong>基本释义:</strong><br/>";

		if ("" + root.getElementsByTagName("translation")[0].childNodes[0] != "undefined")
			var translations = root.getElementsByTagName("translation");
		else {
			basetrans += '未找到基本释义';
		}

		for (var i = 0; i < translations.length; i++) {
			var line = translations[i].getElementsByTagName("content")[0].childNodes[0].nodeValue + "<br/>";
			if (line.length > 50) {
				var reg = /[;；]/;
				var childs = line.split(reg);
				line = '';
				for (var i = 0; i < childs.length; i++)
					line += childs[i] + "<br/>";
			}
			basetrans += line;
		}
	}
	if (noWebTrans == false) {
		if ("" + root.getElementsByTagName("web-translation")[0].childNodes[0] != "undefined")
			var webtranslations = root.getElementsByTagName("web-translation");
		else {
			webtrans += '未找到网络释义';
		}

		for (var i = 0; i < webtranslations.length; i++) {
			webtrans += webtranslations[i].getElementsByTagName("key")[0].childNodes[0].nodeValue + ":  ";
			webtrans += webtranslations[i].getElementsByTagName("trans")[0].getElementsByTagName("value")[0].childNodes[0].nodeValue + "<br/>";
		}
	}
	renderResult();
}

function query(word) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function (data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				parseXML(xhr.responseXML);
			}
		}
	}
	_word = word;
	var url = 'http://dict.youdao.com/fsearch?client=deskdict&keyfrom=chrome.extension&q=' + encodeURIComponent(word) + '&pos=-1&doctype=xml&xmlVersion=3.2&dogVersion=1.0&vendor=unknown&appVer=3.1.17.4208&le=eng'
	xhr.open('GET', url, true);
	xhr.send();
}
function renderResult() {
	var res = document.getElementById('result');
	res.innerHTML = '';
	if (noBaseTrans == false) {
		res.innerHTML = "<strong>基本翻译:</strong><br/>" + basetrans;
	}
	if (noWebTrans == false) {
		webtrans = "<strong>网络释义:</strong><br/>" + webtrans;
		res.innerHTML += webtrans;
	}
	if (noBaseTrans == false || noWebTrans == false) {
		res.innerHTML += "<a href ='http://dict.youdao.com/search?q=" + encodeURIComponent(_word) + "&ue=utf8&keyfrom=chrome.extension' target=_blank>点击 查看详细释义</a>";
	}
	if (noBaseTrans && noWebTrans) {
		res.innerHTML = "未找到英汉翻译!";
		res.innerHTML += "<br><a href ='http://www.youdao.com/search?q=" + encodeURIComponent(_word) + "&ue=utf8&keyfrom=chrome.extension' target=_blank>尝试用有道搜索</a>";
	}
	retphrase = '';
	webtrans = '';
	basetrans = '';
	_word = '';
	noBaseTrans = false;
	noWebTrans = false;
	document.getElementsByName('word')[0].focus();
}
function save_options() {
	for (key in options) {
		if (options[key][0] == "checked") {
			options[key][1] = document.getElementById(key).checked;
		}
	}
	localStorage["ColorOptions"] = JSON.stringify(options);
}

function restore_options() {
	var localOptions = JSON.parse(localStorage["ColorOptions"]);

	for (key in localOptions) {
		optionValue = localOptions[key];
		if (!optionValue)
			return;
		var element = document.getElementById(key);
		if (element) {
			element.value = localOptions[key][1];
			switch (localOptions[key][0]) {
				case "checked":
					if (localOptions[key][1])
						element.checked = true;
					else
						element.checked = false;
					break;
			}
		}
	}

}

document.body.onload = function () {
	restore_options();
	document.getElementById('word').focus();
};

document.getElementById("ctrl_only").onclick = function () { save_options(); };

document.getElementById("playwhenhovering").onclick = function () { save_options(); };
document.getElementById("playwhenclicking").onclick = function () { save_options(); };

document.getElementById("word").onkeydown = function () {
	if (event.keyCode == 13)
		query(document.getElementsByName("word")[0].value);
};
document.getElementById("querybutton").onclick = function () {
	query(document.getElementsByName("word")[0].value);
};
