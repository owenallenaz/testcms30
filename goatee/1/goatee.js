(function(exports) {
	var fill = function(html, data, partials, globalData) {
		if (typeof partials == "undefined") {
			partials = {};
		}
		if (typeof globalData == "undefined") {
			globalData = {};
		}
		
		var context = getTemplateContext(html);
		var myPartials = {};
		for(var i in partials) {
			myPartials[i] = {
				context : getTemplateContext(partials[i]),
				html : partials[i]
			};
		}
		
		return processTags(html, context, [ data ], myPartials, {}, globalData);
	};
	
	var getTemplateContext = function(html) {
		var currentHTML = html;
		
		var context = {
			tags : [],
			start : 0,
			inner : html,
			innerStart : 0,
			innerEnd : html.length,
			end : html.length
		};
		var myContext = context;
		var previousContext = [];
		while(true) {
			var matches = currentHTML.match(/\{\{([##!:%\/\-\>]?)(.*?)\}\}/);
			
			if (matches == null) {
				break;
			}
			
			if (matches[1] != "/") {
				myContext.tags.push({ label : matches[2].toLowerCase(), type : matches[1], start : matches.index, end : matches[0].length + matches.index, innerStart : matches[0].length + matches.index, innerEnd : "", tags : [] });
				
				if (matches[1] != "" && matches[1] != "%" && matches[1] != ">") {
					previousContext.push(myContext);
					myContext = myContext.tags[myContext.tags.length - 1];
				}
			} else {
				myContext.end = matches[0].length + matches.index;
				myContext.innerEnd = matches.index;
				myContext.inner = html.substring(myContext.innerStart, myContext.innerEnd);
				myContext = previousContext[previousContext.length - 1];
				previousContext.splice(previousContext.length - 1, 1);
			}
			
			var temp = [];
			for(var i = 0; i < matches[0].length; i++) {
				temp.push("-");
			}
			currentHTML = currentHTML.replace(matches[0], temp.join(""));
		}
		
		return context;
	}
	
	var processTags = function(html, context, data, partials, extraData, globalData) {
		var returnArray = [];
		if (typeof extraData == "undefined") {
			extraData = {};
		}
		
		var position = context.innerStart;
		for(var i = 0; i < context.tags.length; i++) {
			returnArray.push(html.substring(position, context.tags[i].start));
			position = context.tags[i].end;
			
			if (context.tags[i].type == "-") {
				if (data.length > 1) {
					var newData = data.slice();
					newData.splice(data.length - 1, 1);
					returnArray.push(processTags(html, context.tags[i], newData, partials, {}, globalData));
				}
				continue;
			}

			if (context.tags[i].type == ">") {
				if (typeof partials[context.tags[i].label] != "undefined") {
					returnArray.push(processTags(partials[context.tags[i].label].html, partials[context.tags[i].label].context, data, partials, {}, globalData));
				}
				continue;
			}
			
			var myData = data[data.length - 1];
			var labelArr = context.tags[i].label.split(".");
			for(var j = 0; j < labelArr.length; j++) {
				if (labelArr[j].substr(0,1) == "*") {
					myData = globalData;
					labelArr[j] = labelArr[j].replace(/^\*/, "");
				}
				
				if (labelArr[j].substr(0,1) == "@") {
					myData = extraData[labelArr[j].replace(/^@/, "").toLowerCase()];
				} else if (myData instanceof Array) {
					myData = myData[parseInt(labelArr[j]) - 1];
				} else {
					var keyMap = getLcaseKeyMap(myData);
					myData = myData[keyMap[labelArr[j]]];
				}
				
				if (typeof myData == "undefined") {
					break;
				}
			}
			
			if (context.tags[i].type == "" || context.tags[i].type == "%") {
				if (typeof myData == "undefined" || myData == null) {
					// do nothing
				} else if (typeof myData == "string" || typeof myData == "number") {
					/*** standard tags ***/
					if (context.tags[i].type == "") {
						returnArray.push(myData)
					} else {
						returnArray.push(myData.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
					}
				} else if (typeof myData.template != "undefined" && typeof myData.data != "undefined") {
					/*** passing a template and data structure ***/
					
					/*** Is array loop over array ***/
					if (myData.data instanceof Array) {
						for(var j = 0; j < myData.data.length; j++) {
							returnArray.push(fill(myData.template, myData.data[j]));
						}
					} else {
						returnArray.push(fill(myData.template, myData.data));
					}
				}
			} else if (context.tags[i].type == "#") {
				if (typeof myData != "undefined") {
					if (myData instanceof Array) {
						var tempExtraData = {
							row : 1,
							first : false,
							last : false,
							even : false,
							odd : false
						};
						for(var j = 0; j < myData.length; j++) {
							tempExtraData.first = tempExtraData.row == 1 ? true : false;
							tempExtraData.last = tempExtraData.row == myData.length ? true : false;
							tempExtraData.odd = tempExtraData.row % 2 == 1 ? true : false;
							tempExtraData.even = !tempExtraData.odd;
							tempExtraData.data = myData[j];
							var newData = data.slice();
							newData.push(myData[j]);
							returnArray.push(processTags(html, context.tags[i], newData, partials, tempExtraData, globalData));
							tempExtraData.row++;
						}
					} else if (myData instanceof Object && !isEmpty(myData)) {
						var newData = data.slice();
						newData.push(myData);
						returnArray.push(processTags(html, context.tags[i], newData, partials, {}, globalData));
					}
				}
			} else if (context.tags[i].type == ":") {
				if (
					typeof myData != "undefined" && (
						(typeof myData == "string" && myData != "" && myData != "false")
						|| 
						(myData instanceof Array && myData.length > 0)
						||
						(myData instanceof Object && !isEmpty(myData))
						||
						(typeof myData == "boolean" && myData != false)
						||
						(typeof myData == "number")
					)
				) {
					returnArray.push(processTags(html, context.tags[i], data, partials, extraData, globalData));
				}
			} else if (context.tags[i].type == "!") {
				if (
					typeof myData == "undefined" 
					|| (
						(typeof myData == "string" && (myData == "" || myData == "false"))
						||
						(myData instanceof Array && myData.length == 0)
						||
						(myData instanceof Object && isEmpty(myData))
						||
						(typeof myData == "boolean" && myData == false)
					)
				) {
					returnArray.push(processTags(html, context.tags[i], data, partials, extraData, globalData));
				}
			}
		}
		
		if (position < context.end) {
			returnArray.push(html.substring(position, context.innerEnd));
		}
		
		return returnArray.join("");
	};
	
	/*** Cross browser way to test if an object has no keys ***/
	var isEmpty = function(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		
		return true;
	};

	// returns map of lcased keys in an object and their actual key so obj = { TeSt : "something", Blah : "else" } would return { "test" : "TeSt", "blah" : "Blah" }
	var getLcaseKeyMap = function(obj) {
		var map = {};
		
		for(var prop in obj) {
			map[prop.toLowerCase()] = prop;
		}
		
		return map;
	}
	
	var unpreserve = function(html) {
		return html.replace(/\{\{\$/g, "{{");
	};
	
	/*** only reveal public methods ***/
	exports.fill = fill;
	exports.unpreserve = unpreserve;
})(typeof exports === "undefined" ? this.sv.templates = {} : exports);