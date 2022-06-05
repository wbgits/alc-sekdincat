/*<![CDATA[*/
(()=>{
	const dev_definition_lastestPackage = parseInt(window.lastest_package); // paket terakhir
	const dev_definition_defaultPackage = parseInt(window.default_package); 
	const dev_definition_githubRepositoryName = window.github_repository_name;
	const dev_definition_githubVersion = window.github_version;
	const dev_activePackage = (()=>{
		// mendeinisikan aktif paket berdasarkan parameter url
		// url ?paket=num
		const url = window.location.href;
		const reg = /paket=(\d+).*$/;
		const match = reg.exec(url);
		if(match){
			const num = parseInt(match[1]);
			if(typeof num === "number"){
				if(num <= dev_definition_lastestPackage){
					return num;
				}
			}
		}
		return dev_definition_defaultPackage;
	})();
	const dev_definition_tandai_jawaban  = (()=>{
		const url = window.location.href;
		const reg = /tandaijawaban=ya/;
		const match = reg.test(url);
		if(match){
			return true;
		}
		return false;
	})(); // window.tandai_jawaban; 
	
	const dev_definition_urlSoalTWK = `https://cdn.jsdelivr.net/gh/wbgits/${dev_definition_githubRepositoryName}@${dev_definition_githubVersion}/p${dev_activePackage}-twk.js`;
	const dev_definition_urlSoalTIU = `https://cdn.jsdelivr.net/gh/wbgits/${dev_definition_githubRepositoryName}@${dev_definition_githubVersion}/p${dev_activePackage}-tiu.js`;
	const dev_definition_urlSoalTKP = `https://cdn.jsdelivr.net/gh/wbgits/${dev_definition_githubRepositoryName}@${dev_definition_githubVersion}/p${dev_activePackage}-tkp.js`;
	const dev_definition_urlMathJax = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
	
	const dev_definition_aktifkan = window.aktifkan;
	const dev_definition_submit_data =  window.submit_data;
	const dev_definition_waktuKeseluruhan = parseInt(window.waktu); // dalam menit
	const dev_definition_ambangBatasTWK = parseInt(window.ambang_batas_twk);
	const dev_definition_ambangBatasTIU = parseInt(window.ambang_batas_tiu);
	const dev_definition_ambangBatasTKP = parseInt(window.ambang_batas_tkp);	
	const dev_output_jumlahSoalTWK = parseInt(window.jumlah_soal_twk);
	const dev_output_jumlahSoalTIU = parseInt(window.jumlah_soal_tiu);
	const dev_output_jumlahSoalTKP = parseInt(window.jumlah_soal_tkp);	
	const dev_definition_pinSesi = "000" + dev_activePackage; // window.pin_sesi;		bersifat wajib karena akan disimpan ke firebase
	const dev_definition_nomorPeserta = window.members;					// bersifat wajib karena akan disimpan ke firebase
	const dev_output_acakSoal = false;
	
	if(dev_definition_aktifkan === "tidak"){
		document.getElementsByTagName("body")[0].className += " w-noaccess";
		return;
	}
	
	/* GENERAL
	BAGIAN INI ADALAH BAGIAN UMUM, SEMUA THEME MEMBUTUHKAN BAGIAN INI,
	TIDAK HANYA SEMUA THEME, SEMUA PEMBUATAN BERBAGAI ASSETS MUNGKIN MEMBUTUHKAN INI 
	DENGAN KATA LAIN, BAGIAN INI SUDAH MERUPAKAH FRAMEWORK MULTIGUNA */

	// {{GENERAL_DOM_VARIABLES}}
	// variable dom yang selalu digunakan pada semua project
	// berbagai variable ini dibutuhkan untuk {{SPECIAL_DOM_VARIABLES}}, {{GENERAL_VARIABLES}}, {{GENERAL_PROTOTYPES}}
	const d_doc = document;
	const d_html = d_doc.documentElement;
	const d_head = d_doc.getElementsByTagName("head")[0];
	const d_body = d_doc.getElementsByTagName("body")[0];
	const d_mainScrollable = d_doc.getElementById("w-blog"); // variable ini dibutuhkan untuk prototype {{p_eventAddTouch}}, yaitu elemen pertama yang scrollable.	
	const d_bodyMirror = d_doc.getElementById("w-blog1"); 

	// {{GENERAL_VARIABLES}}
	const g_win = window;	
	const g_screenWidth = g_win.innerWidth || d_html.clientWidth;
	const g_screenHeight = g_win.innerHeight || d_html.clientHeight;	
	const g_isOperamini = Object.prototype.toString.call(g_win.operamini) === "[object OperaMini]";
	const g_isUCBrowser = /UCBrowser/.test(navigator.userAgent);
	const g_isTouch = (()=>{
		const win = g_win;
		const nav = navigator;
		if('ontouchstart' in win || nav.maxTouchPoints > 0 || nav.msMaxTouchPoints > 0){
			return /(iphone|ipod|ipad|android|iemobile|blackberry|bada)/.test(nav.userAgent.toLowerCase());
		}
		return false;
	})();	

	// {{POLIFY}}
	(()=>{ // requestAnimationFrame
		// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
		// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
		// MIT license
		// Kode telah diubah ke ES6
		const win = g_win;
		let lastTime = 0;
		const vendors = ['ms', 'moz', 'webkit', 'o'];
		for(let x = 0; x< vendors.length && !win.requestAnimationFrame; ++x){
			win.requestAnimationFrame = win[vendors[x]+'RequestAnimationFrame'];
			win.cancelAnimationFrame = win[vendors[x]+'CancelAnimationFrame'] || win[vendors[x]+'CancelRequestAnimationFrame'];
		}
	 
		if(!win.requestAnimationFrame){
			win.requestAnimationFrame = (callback, element) => {
				const currTime = new Date().getTime();
				const timeToCall = Math.max(0, 16 - (currTime - lastTime));
				let id = win.setTimeout(() =>{
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		
	 
		if(!win.cancelAnimationFrame){
			win.cancelAnimationFrame = (id) => {
				clearTimeout(id);
			};
		}
	})();	


	// {{GENERAL_PROTOTYPES}}
	// semua prototypes ini hanya membutuhkan data {{GENERAL_DOM_VARIABLES}} atau {{GENERAL_VARIABLES}}
	const p_stringTrim = (s)=>{
		s = s.replace(/\n/g, " ");
		s = s.replace(/\s\s+/g, " ").trim();
		return s;
	};
	const p_stringFirstLetterToUpperCase = (s)=>{
		return s.charAt(0).toUpperCase() + s.slice(1)
	};
	const p_stringFirstLetterToLowerCase = (s)=>{
		return s.charAt(0).toLowerCase() + s.slice(1)
	};
	const p_stringToBoolean = (()=>{
		/*	Arguments:
				s			:	string. ketika value ini buka string (termasuk boolean), fungsi akan mereturn def
				def		:	default value (boolean)
				
			return
				boolean		
				null			:	ketika value tidak valid dan argument def dikosongkan atau === null
		*/
		const validValues = ["true", "false"];
		return (s, def = null)=>{
			if(validValues.indexOf(s) !== -1){
				return s === validValues[0] ? true : false;
			}
				
			return def;
		}
	})();
	const p_stringToNumber = (s, def=null)=>{ 
		/* argument:
			s : s bisa berupa string untrimmed dan harus berupa string
			
			returns:
				number || def
		*/
		
		const num = parseInt(s.replace(/\s/g, ""));
		if(typeof num === "number" && !isNaN(num)){
			return num;
		}
		
		return def;
	};
	const p_stringToArray = (()=>{
		/* arguments: s = berupa string yang dipisahkan dengan koma
			return = selalu array (mungkin kosong). Adapun Item array bersifat trimmed */
		const stringTrim = p_stringTrim;		
		return (s) => {
			const list = s.split(",");
			const content = [];
			for(let item of list){
				item = stringTrim(item);
				if(item){
					content.push(item);
				}
			}
			return content;
		};	
	})();
	const p_stringBlockToArray = ((()=>{
		/* argument: s = string yang diapit dengan blockKode (contoh : {{a}} {{b}})
			return : selalu array (mungkin kosong). Adapun item array bersifat trimmed */
		const stringTrim = p_stringTrim;
		return (s) => {
			const results = [];
			const arry = s.split("{{");
			for(let item of arry){
				if(item){
					item = stringTrim(item);
					if(item){
						const closerIndex = item.indexOf("}}");
						if(closerIndex !== -1){
							results.push(item.substring(0, closerIndex));
						}
					}
				}
			}
			
			return results;
		}
	})());
	const p_stringIsUrl = (s)=>{
		const reg = /^((https{0,1}?:\/\/.+)|(#))/;
		return reg.test(s);
	};
		
		
	const p_typeIsString = (data)=>{
		return typeof data === "string";
	};
	const p_typeIsNumber = (data)=>{
		return (typeof data === "number" && !isNaN(data));
	};
	const p_typeIsBoolean = (data)=>{
		return typeof data === "boolean";
	};
	const p_typeIsObject = (data)=>{
		return Object.prototype.toString.call(data) === "[object Object]";
	};
	const p_typeIsArray = (data)=>{
		return Object.prototype.toString.call(data) === "[object Array]";
	};
	const p_typeIsFunction = (data)=>{
		return typeof data === "function";
	};
	const p_typeIsDOM = (data)=>{
		return (data instanceof Element || data instanceof HTMLDocument);  
	};


	const p_elemGetById = (()=>{
		const doc = d_doc;
		return (id) => {
			return doc.getElementById(id);
		}
	})();	
	const p_elemGetByClass = (()=>{
		const doc = d_doc;
		return (parentElem, className, index, toArray) => {
			if(!parentElem){
				parentElem = doc;
			}
			
			const elems = parentElem.getElementsByClassName(className);
			const len = elems.length;
			
			if(len !== 0){
				if(typeof index === "number"){
					if(index < len){
						return elems[index];
					}
					else{
						return null;
					}
				}
				else{
					if(toArray){
						const arrayElems = [];
						for(let i=0;i<len;i++){
							arrayElems.push(elems[i]);
						}
						
						return arrayElems;
					}
					else{
						return elems;
					}
				}
			}
			else{
				return null;
			}
		}
	})();
	const p_elemGetByTag = (()=>{
		const doc = d_doc;
		return (parentElem, tagName, index, toArray)=>{
			if(!parentElem){
				parentElem = doc;
			}
			
			const elems = parentElem.getElementsByTagName(tagName.toUpperCase());
			const len = elems.length;
			if(len !== 0){
				if(typeof index === "number"){
					if(index < len){
						return elems[index];
					}
					else{
						return null;
					}
				}
				else{
					if(toArray){
						const arrayElems = [];
						for(let i=0;i<len;i++){
							arrayElems.push(elems[i]);
						}
						return arrayElems;
					}
					else{
						return elems;
					}
				}
			}
			else{
				return null;
			}
		}
	})();
	const p_elemGetChildrenByClass = (()=>{
		const getByClass = p_elemGetByClass;
		return (parentElem, classname, index)=>{
			if(typeof index === "number"){
				const byClass = getByClass(parentElem, classname, index);
				if(byClass){
					if(byClass.parentNode === parentElem){
						return byClass;
					}
				}
				
				return null;
			}
			else{
				const items = [];
				const byClass = getByClass(parentElem, classname, null, true);
				if(byClass){
					for(const item of byClass){
						if(item.parentNode === parentElem){
							items.push(item);
						}
					}
				}
				if(items.length === 0){
					return null;
				}
				else{
					return items;
				}					
			}
		}
	})();
	const p_elemGetChildrenByTag = (()=>{
		const getByTag = p_elemGetByTag;
		return (parentElem, tagname, index)=>{
			if(typeof index === "number"){
				const byTag = getByTag(parentElem, tagname, index);
				if(byTag){
					if(byTag.parentNode === parentElem){
						return byTag;
					}
				}
				
				return null;
			}
			else{
				const items = [];
				const byTag = getByTag(parentElem, tagname, null, true);
				if(byTag){
					for(const item of byTag){
						if(item.parentNode === parentElem){
							items.push(item);
						}
					}
				}
				
				if(items.length === 0){
					return null;
				}
				else{
					return items;
				}			
			}
		}
	})();
	const p_elemGetChildren = (parentElem, index)=>{
		const els = parentElem.children;
		const len = els.length;
		if(len === 0){
			return null;
		}
		else{
			if(typeof index === "number"){
				if(els[index]){
					return els[index];
				}
				else{
					return null;
				}
			}
			else{
				const items = [];
				for(let i=0;i<len;i++){
					items.push(els[i]);
				}
				
				return items;
			}
		}
	};
	const p_elemAppends = (parentElem, ...elems)=>{
		for(const e of elems){
			parentElem.appendChild(e);
		}
	};	


	const p_elemRemove = (...elems)=>{
		for(const e of elems){
			e.parentNode.removeChild(e);
		}
	};	
	const p_elemReplace = (oldElem, newElem)=>{
		oldElem.parentNode.replaceChild(newElem, oldElem);
	};	
	const p_elemAddClasses = (elem, ...classes)=>{
		for(const c of classes){
			elem.classList.add(c);
		}
	};
	const p_elemRemoveClasses = (elem, ...classes)=>{
		for(const c of classes){
			elem.classList.remove(c);
		}
	};
	const p_elemHasClass = (elem, className)=>{
		return elem.classList.contains(className);
	};
	const p_elemCreateTextNode = (()=>{
		const doc = d_doc;
		return (s)=>{
			return doc.createTextNode(s);
		}
	})();
	const p_elemCreateElem = (()=>{
		/*	arguments 
				o
					c				:	class, 
					i				:	id
					s				:	src
					n				:	innerHTML
					h				:	href
					cs				:	array argumentO || DOM || falsy
					f				:	f(elem), fungsi yang akan dijalankan ketida sub telah diproses 
				
				appendTo		:	DOM || falsy
										Ketika nilai adalah falsy, fungsi akan mereturn elem
										Sebaliknya, fungsi akan mereturn nothing (undefined) */
		const doc = d_doc;
		const typeIsArray = p_typeIsArray;
		const attrsData = {
			c : "className",
			i : "id",
			s : "src",
			n : "innerHTML",
			h : "href",
			tt : "title"
		};
		const create = (o, appendTo) =>{
			const tag = o.t;
			const elem = doc.createElement(tag || "div");
			const oProperties = Object.keys(o);
			for(const p of oProperties){
				// {{p}} merupakan semua property yang terdapat pada argumentO
				// pada argumentO, semua property yang terdapat pada {{attrsData}} harus bertype string atau falsy
				// proses akan diskip jika nilai adalah falsy
				const disO = o[p];
				if(disO){
					const disAttr = attrsData[p];
					// {{disAttr}} akan bernilai string atau undefined
					// ketika nilai adalah {{undefined}}, itu artinya property yang bersangkutan bukan property yang digunakan untuk menambahkan {{atribut atau inner}}
					// hal ini seperti property {{cs dan f}}. dua property ini tidak disertakan pada {{attrsData}}, oleh karena itu, disAttr dengan p === cs || f akan undefined.
					// pada keadaan disAttr undefined, fungsi akan diskip, proses untuk property yang bersangkutan akan diproses pada tahap selanjutnya.
					if(disAttr){
						elem[disAttr] = disO;
					}
				}
			}
			
			// proses khusus link,
			// untuk link, argument {{h}} mungkin tidak didefinisikan, 
			// pada kasus ini, href akan diset ke "#"
			if(tag === "a"){
				if(!o.h){
					elem.href = "#";
				}
			}
			
			// memproses sub
			const sub = o.cs;
			if(sub){
				if(typeIsArray(sub)){
					for(const s of sub){
						create(s, elem);
					}
				}
				else{
					elem.appendChild(sub);
				}
			}
			
			// memproses f
			if(o.f){
				o.f(elem);
			}
			
			if(appendTo){
				appendTo.appendChild(elem);
			}
			else{
				return elem;
			}
		};
		return (o, appendTo)=>{
			return create(o, appendTo);
		}
	})();	
	const p_elemCreateFragment = (()=>{
		var doc = d_doc;
		return ()=>{
			return doc.createDocumentFragment();
		};
	})(); 		
	const p_elemInsertFirstChild = (parentElem, newElem)=>{
		const fc = parentElem.firstElementChild; // dom || null
		if(fc){
			parentElem.insertBefore(newElem, fc);
		}
		else{
			parentElem.appendChild(newElem);
		}
	};
	const p_elemInsertBefore = (elem, paramElem)=>{
		paramElem.parentNode.insertBefore(elem, paramElem);
	};
	const p_elemGetAttrs = (()=>{
		/* return selalu object: {attrName : attrValue (trimmed)} 
			value bersifat trimmed */
		
		const stringTrim = p_stringTrim;
		return (elem)=>{
			const attributes = elem.attributes;
			const o = {};
			for(const a of attributes){
				o[a.name] = stringTrim(a.value);
			}
			return o;
		}
	})();		
	
	const p_elemGetOffsetToDocument = (()=>{
		let supported = true;
		try{
			d_bodyMirror.getBoundingClientRect();
		}
		catch(e){
			supported = false;
		}
		
		if(supported === false){
			return (elem)=>{
				return null;
			}
		}
		else{
			const scrollAble = d_mainScrollable;
			const bodyMirror = d_bodyMirror;
			return (el)=>{
				const elDatas = el.getBoundingClientRect();
				const scrollTop = scrollAble.scrollTop;
				const scrollLeft = scrollAble.scrollLeft;
				const bodyHeight = bodyMirror.offsetHeight;
				const bodyWidth = bodyMirror.offsetWidth;
				const topOfDocument = elDatas.top + scrollTop;
				const leftOfDocument = elDatas.left + scrollLeft;
			
				return {
					top: topOfDocument, 
					bottom: bodyHeight - (topOfDocument + el.offsetHeight),
					left: leftOfDocument,
					right : bodyWidth - (leftOfDocument + el.offsetWidth)
				}
			}
		}
	})();
	const p_elemGetBoundingClientRect = (()=>{
		let supported = true;
		try{
			d_bodyMirror.getBoundingClientRect();
		}
		catch(e){
			supported = false;
		}
		
		if(supported === false){
			return (elem)=>{
				return null;
			}
		}
		else{
			const screenHeight = g_screenHeight;
			const screenWidth = g_screenWidth;
			return (elem)=>{
				const rects = elem.getBoundingClientRect();					
				return {
					top : rects.top,
					bottom : screenHeight - (rects.top + rects.height),
					left : rects.left,
					right : screenWidth - (rects.left + rects.width)
				}
			};
		}
	})();		
	
	const p_elemGetPreviousSibling = (elem) => {
		/* return: node atau null */
		let node = elem.previousSibling;
		while (node !== null && node.nodeType !== 1){
			// node === null										: tidak tereksekusi
			// node !== null, nodeType === 1				: tidak tereksekusi
			// node !== null, nodeType !== 1				: tereksekusi
			node = node.previousSibling;
		}
		return node;
	};
	const p_elemGetNextSibling = (elem) => {
		/* return: node atau null */
		let node = elem.nextSibling;
		while (node !== null && node.nodeType !== 1){
			// node === null										: tidak tereksekusi
			// node !== null, nodeType === 1				: tidak tereksekusi
			// node !== null, nodeType !== 1				: tereksekusi
			node = node.nextSibling;
		}
		return node;
	};	
	const p_elemMoveUp = (()=>{
		const elemGetPreviousSibling = p_elemGetPreviousSibling;
		return (elem)=>{
			const previousSibling = elemGetPreviousSibling(elem);
			if(previousSibling){
				elem.parentNode.insertBefore(elem, previousSibling);
			}
		}
	})();
	const p_elemMoveDown = (()=>{
		const elemGetNextSibling = p_elemGetNextSibling;
		return (elem)=>{
			const nextSibling = elemGetNextSibling(elem);
			if(nextSibling){
				elem.parentNode.insertBefore(nextSibling, elem);
			}
		}
	})();
					
	const p_arrayMin = (arr)=>{
		return Math.min.apply(null, arr);
	};
	const p_arrayMax = (arr)=>{
		return Math.max.apply(null, arr);
	};
	const p_arrayMoveItem = (array, from, to)=>{
		/* arguments
				array	:	array
				form		:	index awal base 0, harus < array.length. Sebaliknya, proses akan diskip
				to			:	index akhir base 0, harus < array.length. Sebaliknya, proses akan diskip
			
			return nothing */
		const len = array.length;
		if(from < len && to < len){
			const cutAndGet = array.splice(from, 1);
			array.splice(to, 0, cutAndGet[0]);
		}
	};
	const p_arrayRemoveItem = (array, item)=>{
		const len = array.length;
		for(let i=0;i<len;i++){
			if(array[i] === item){
				array.splice(i, 1);
				return;
			}
		}
	};
	const p_arrayRemoveItemByIndex = (array, index)=>{
		// index harus < array.length. Sebaliknya, proses akan diskip.
		// return nothing. hanya menghapus item
		if(index < array.length){
			array.splice(index, 1);
		}
	};
	const p_arrayMoveItemToOtherArray = (arrayFrom, itemIndex, arrayTo)=>{
		// itemIndex harus < arrayFrom.length. Sebaliknya, proses akan diskip
		// return nothing, hanya memindahkan item
		// item akan dipindahkan pada arrayTo (indexTerakhir)
		if(itemIndex < arrayFrom.length){
			arrayTo.push(arrayFrom.splice(itemIndex, 1)[0]);
		}
	};
		
	const p_objLoop = (o, func)=>{
		const keys = Object.keys(o);
		const len = keys.length;
		for(let i=0;i<len;i++){
			const key = keys[i];
			if(func(o[key], i, key) === "break"){
				break;
			}
		}
	};	
	const p_objClone = (o)=>{
		/* return Object || false if cant stringify object */
		let newObj;
		try{
			newObj = JSON.parse(JSON.stringify(o));
		}
		catch(e){
			return false;
		}
		return newObj;
	};
	const p_objAssignAllProperties = (()=>{
		const objLoop = p_objLoop;
		const main = (data, obj)=>{
			objLoop(data, (item, index, key)=>{
				if(obj[key] === undefined){
					obj[key] = item;
				}
			});
			return obj;
		};
		return main;
	})();

	const p_eventAdd = (()=>{
		const win = g_win;
		if(win.addEventListener){
			return function(elem, eventName, runFunction){
				elem.addEventListener(eventName, runFunction)
			}
		}
		else if(win.attachEvent){
			return function(elem, eventName, runFunction){
				elem.attachEvent("on"+ eventName, runFunction)
			}
		}
	})();
	const p_eventRemove = (()=>{
		const win = g_win;
		if(win.removeEventListener){
			return (elem, eventName, functionName)=>{
				elem.removeEventListener(eventName, functionName)
			}
		}
		else if(win.detachEvent){
			return (elem, eventName, functionName)=>{
				elem.detachEvent("on"+ eventName, functionName)
			}
		}
	})();	
	const p_eventAddTouch = (()=>{
		/*	ALGORITMA				
			ARGUMENTS RUN FUNCS
				1.	start						:	event ini jarang digunakan, ini sama halnya dengan onclick, 
													kecuali jika ingin menambahkan onclick hanya untuk perangkat touch saja
				2.	move 					:	event ini akan selalu dipanggil, baik itu swipe cepat maupun lambat
				3. moveend				:	event akan dipanggil ketika swipe lambat selesai
				3. swipe					:	event hanya dipanggil ketika swipe cepat selesai
		*/
		const addEvent = p_eventAdd;
		const mainScrollable = d_mainScrollable;
		const isTouch = g_isTouch;
		return (elem, runFuncs)=>{
			if(!isTouch){
				return false;
			}
			
			let startTime;								// start time, untuk melacak berapa lama proses move berakhir
			let startX;										// titik awal touch
			let startScrollX;								// titik awal scroll window X
			let startScrollY;								// titik awal scroll window 
			let runEvent = false;						// akan dimanipulasi pada start, ini digunakan agar event biasa diblock dengan cara set propagation pada childs
			let inMoveSession = false;				// untuk mengidentifikasi akan itu merupakan move atau touch biasa (klik)
			
			const startFunc = runFuncs.start;
			const moveFunc = runFuncs.move;
			const moveendFunc = runFuncs.moveend;
			
			
			addEvent(elem, "touchstart", (e) => {
				runEvent = true;
				const touchesObj = e.changedTouches[0];
				startTime = new Date().getTime();
				startX = touchesObj.pageX;
				startY =  touchesObj.pageY;
				startScrollX = mainScrollable.scrollLeft;
				startScrollY = mainScrollable.scrollTop;
				
				if(startFunc){
					startFunc(startX, startY);
				}
			});
			
			addEvent(elem, "touchmove", (e)=>{
				if(runEvent){
					if(!inMoveSession){
						inMoveSession = true;
					}
					
					if(moveFunc){
						const touchesObj = e.changedTouches[0];
						const currentX = touchesObj.pageX;
						const currentY = touchesObj.pageY;
						const currentXChange = currentX - startX;
						const currentYChange = currentY - startY;
						moveFunc(currentXChange, currentYChange);
					}	
				}				
			});
			
			addEvent(elem, "touchend", (e)=>{
				if(inMoveSession){
					const touchesObj = e.changedTouches[0];
					endTime = new Date().getTime();
					endX = touchesObj.pageX;
					endY = touchesObj.pageY;
					endScrollX = mainScrollable.scrollLeft;
					endScrollY = mainScrollable.scrollTop;
					
					
					const endXChange = Math.abs(endX - startX);
					const endYChange = Math.abs(endY - startY);
					const isXChange = endXChange >= endYChange;
					const direction = isXChange ? (endX > startX ? "right" : "left") : (endY > startY ? "down" : "up");
					const usedChange = isXChange ? endXChange : endYChange;
					const isFastSwipe = (endTime - startTime) / 2 <  usedChange;
					
					if(isFastSwipe){
						const runSwipeFunc = runFuncs["swipe" + direction];
						if(runSwipeFunc){
							runSwipeFunc(usedChange);
						}
					}
					else{
						if(moveendFunc){
							moveendFunc(isXChange ? startX : startY, isXChange ? endX : endY);
						}
					}
					
					inMoveSession = false;
					runEvent = false;
				}
			});
		
			return true;
		}
	})();		

	const p_screen = (()=>{
		const win = g_win;
		return {
			min(mediaWidth){
				return win.matchMedia("(min-width:" + mediaWidth +"px)").matches;
			},
			max(mediaWidth){
				return win.matchMedia("(max-width:" + mediaWidth +"px)").matches;
			}
		}
	})();	
	const p_local = (()=>{
		const win = g_win;
		const isSupport = (()=>{
			// CREDIT: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
			try {
				const storage = win["localStorage"], x = '__storage_test__';
				storage.setItem(x, x);
				storage.removeItem(x);
				return true;
			}
			catch(e){
				return e instanceof DOMException && (
					// everything except Firefox
					e.code === 22 ||
					// Firefox
					e.code === 1014 ||
					// test name field too, because code might not be present
					// everything except Firefox
					e.name === 'QuotaExceededError' ||
					// Firefox
					e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
					// acknowledge QuotaExceededError only if there's something already stored
					storage.length !== 0;
			}
		})();
		
		return {
			set : (item, value)=>{
				if(isSupport){localStorage.setItem(item, value)} // item and value is string
			},
			get : (()=>{
				if(isSupport){
					return (item)=>{
						 return localStorage.getItem(item);
					}
				}
				else {
					return (item)=>{
						return null;
					}
				}
			})(),
			remove : (item)=>{
				if(isSupport){localStorage.removeItem(item)}
			},
			getKeys : (()=>{
				if(isSupport){
					return ()=>{
						const keys = [];
						const len = localStorage.length;
						for(let i=0;i<len;i++){
							keys.push(localStorage.key(i));
						}
						return keys;
					}
				}
				else{
					return ()=>{
						return [];
					}
				}
			})(),
			createKey : (name)=>{
				return "Wi_Local_" + name;
			}
		};
	})();
	const p_session = (function(){
		const win = g_win;
		const isSupport = (()=>{
			// CREDIT: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
			try {
				var storage = win["sessionStorage"], x = '__storage_test__';
				storage.setItem(x, x);
				storage.removeItem(x);
				return true;
			}
			catch(e) {
				return e instanceof DOMException && (
					// everything except Firefox
					e.code === 22 ||
					// Firefox
					e.code === 1014 ||
					// test name field too, because code might not be present
					// everything except Firefox
					e.name === 'QuotaExceededError' ||
					// Firefox
					e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
					// acknowledge QuotaExceededError only if there's something already stored
					storage.length !== 0;
			}
		})();
		
		return {
			set : (item, value)=>{
				if(isSupport){sessionStorage.setItem(item, value)} // item and value is string
			},
			get : (()=>{
				if(isSupport){
					return (item)=>{
						 return sessionStorage.getItem(item);
					}
				}
				else {
					return (item)=>{
						return null;
					}
				}
			})(),
			remove : (item)=>{
				if(isSupport){sessionStorage.removeItem(item)}
			}
		};	
	})();
	const p_animationFrameReg = (()=>{
		const win = g_win;
		const req = win.requestAnimationFrame;
		return (func) =>{
			return req(func);
		}
	})();
	const p_animationFrameCancel = (()=>{
		const win = g_win;
		const cancel = win.cancelAnimationFrame;
		return (func)=>{
			return cancel(func);
		}
	})();
	const p_addTimeout = (()=>{
		const _setTimeout = setTimeout;
		return (func, transition, callback)=>{
			return _setTimeout(()=>{
				func();
				if(callback){
					callback();
				}
			}, transition);
		}
	})();
														
	const p_getDataAttrTypeString = (() =>{
		const stringTrim = p_stringTrim;
		return (elem, name, doRemove = true, def = null) => {
			let value = elem.getAttribute("data-" + name);
			if(value){
				if(doRemove){
					elem.removeAttribute("data-" + name);
				}
				
				value = stringTrim(value);
				if(value){
					return value;
				}
			}
			
			return def;
		}
	})();
	const p_getDataAttrTypeNumber = (() =>{
		const stringTrim = p_stringTrim;
		return (elem, name, doRemove = true, def = null) => {
			let value = elem.getAttribute("data-" + name);
			if(value){
				if(doRemove){
					elem.removeAttribute("data-" + name);
				}
				
				value = stringTrim(value);
				if(value){
					let num = parseInt(value);
					if(typeof num === "number" && !isNaN(num)){
						return num;
					}
				}
			}
			
			return def;
		}
	})();
	const p_getDataAttrTypeBoolean = (() =>{
		const stringTrim = p_stringTrim;
		const validValue = ["true", "false"];
		return (elem, name, doRemove = true, def = null) => {
			let value = elem.getAttribute("data-" + name);
			if(value){
				if(doRemove){
					elem.removeAttribute("data-" + name);
				}
				value = stringTrim(value);
				if(validValue.indexOf(value) !== -1){
					return value === "true" ? true : false;
				}
			}
			
			return def;
		}
	})();

	const p_encodeHTML = (s)=>{
		//	s :	string html baik itu versi normal maupun versi encoded. untuk encoded, kode tidak akan terencoded lagi
		return s.replace(/&(?!(amp|gt|lt|quot|apos);)/g, (match)=>{
			return "&amp;";  /* Hanya akan mereplace & yang bukan merupakan versi ecoded entity */
		}).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
	};
	const p_decodeHTML = (s)=>{
		return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
	};		

	const p_getScrollbarSizes = (()=>{
		const createElem = p_elemCreateElem;
		const appends = p_elemAppends;
		const removeElem = p_elemRemove;
		
		return (parentElem)=>{
			const	wrap = createElem({});
						wrap.setAttribute("style", "width:100px;height:100px;visibility:hidden;overflow:scroll;margin:0;padding:0;border:0");
			const 	content = createElem({});
						content.setAttribute("style", "width:100%;height:100%");
			
			appends(wrap, content);
			appends(parentElem, wrap);
			
			const ver = wrap.offsetWidth - content.offsetWidth;
			const hor = wrap.offsetHeight - content.offsetHeight;
			
			removeElem(wrap);
			return [ver, hor];
		}
	})();	
	const p_getRandomNumber = (min, max) =>{
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	const p_getScriptParent = (()=>{
		const doc = d_doc;
		const getById = p_elemGetById;
		const removeElem = p_elemRemove;
		const nextNum = 1;
		
		const main = ()=>{
			var	newId = "w-randomelem-"+ nextNum;
					nextNum += 1;
					
			var hasAlreadyElem = getById(newId);
			if(hasAlreadyElem){
				return main();
			}
			else{
				doc.write("<span id='"+newId+"'></span>");
				
				var newCreatedDom = getById(newId);
				var newCreatedDomParent = newCreatedDom.parentNode;
				removeElem(newCreatedDom);
				return newCreatedDomParent;				
			}
		};
		
		return main;
	})();		
	const p_removeComment = (s)=>{
		return s.replace("<!--", "").replace("-->", "");			
	};
	const p_getRandomIndexs = (()=>{
		const getRandomNumber = p_getRandomNumber;
		const arrayRemoveItemByIndex = p_arrayRemoveItemByIndex;
		const main = (lenOfArray, lenOfResults)=>{
			/*	lenOfArray					:	jumlah item pada array
				lenOfResults					:	jumlah item (index) yang akan dibuat. value harus < dari lenOfArray*/
			const results = [];
			const availablesIndexs = [];
			for(let i=0;i<lenOfArray;i++){
				availablesIndexs.push(i);
			}
			
			for(let j=0;j<lenOfResults;j++){
				const rundomIndex = getRandomNumber(0, availablesIndexs.length - 1);
				results.push(availablesIndexs[rundomIndex]);
				arrayRemoveItemByIndex(availablesIndexs, rundomIndex);
			}
			
			return results;
			
		};
		return main;
	})();
	
	const p_resizeImg = (src, newSize)=>{
		const reg = /(.+?)(blogspot|googleusercontent)(.+?\/.+?\/.+?\/.+?\/.+?\/)(.+?)(\/.+?)/;
		const matches =  reg.exec(src);
		if(matches){
			let newSrc = src.replace(reg, (match, p1, p2, p3, p4, p5)=>{
				return p1 + p2 + p3 + newSize + p5;
			});
			return newSrc;
		}
		
		return src;
	};
	const p_createRandomId = (()=>{
		const getById = p_elemGetById;
		let latestUsedNum = 0;
		const prefix = "w-randomid";
		const main = ()=>{
			const newNum = latestUsedNum + 1;
			latestUsedNum += 1;
			const el = getById(prefix + newNum);
			if(el){
				return main();
			}
			else{
				return prefix + newNum;
			}
		};
		return main;
	})();
	const p_getItemsMaxHeight = (()=>{ 
		const arrayMax = p_arrayMax;
		const getByClass = p_elemGetByClass;
		const main = (parent, target)=>{
			const elItems = getByClass(parent, target);
			if(!elItems){
				return null;
			}
			else{
				const heights = [];
				for(const item of elItems){
					heights.push(item.clientHeight);
				}
				
				return arrayMax(heights);
			}
		};
		return main;
	})();			
	const p_jumpToElement = (()=>{
		const getOffsetToDocument = p_elemGetOffsetToDocument;
		const elemGetBoundingClientRect = p_elemGetBoundingClientRect;
		const screenHeight = g_screenHeight;
		const mainScrollable = d_mainScrollable;
		const addEvent = p_eventAdd;
		const removeEvent = p_eventRemove;
		const addClasses = p_elemAddClasses;
		const removeClasses = p_elemRemoveClasses;
		const _clearTimeout = clearTimeout;
		const _setTimeout = setTimeout;

			
		const prefix = "w-89";
		const ClassAnimationState1 = prefix + "p1";
		const ClassAnimationState2 = prefix + "p2";
		const ClassAnimationState3 = prefix + "p3";
		let ActiveElem;
		
		const main = (el, configs)=>{
			ActiveElem = el;
			
			const {animation} = configs;
			const elTopToDocument = getOffsetToDocument(el).top;
			const elRects = elemGetBoundingClientRect(el);
			const isOnViewArea = (elRects.top >= 0 && elRects.top < screenHeight) || (elRects.bottom >= 0 && elRects.bottom < screenHeight);
			let runAnimation = animation;
			if(runAnimation){
				if(isOnViewArea){
					runAnimation = false;
				}
			}
			
			const	scrollToOptions = {};
						scrollToOptions.left = 0;
						scrollToOptions.top = elTopToDocument -  80;
						scrollToOptions.behavior = "smooth";
						
			if(runAnimation){
				// hide with no transition
				addClasses(el, ClassAnimationState1); 
				
				// add scroll event
				onScroll.add();
			}		
			
			mainScrollable.scrollTo(scrollToOptions);
			
			/*	kode yang tereksekusi selanjutnya,
			*	runAnimation === true
				selanjutnya adalah mengeksekusi kode yang diassign pada onscroll
			*	runAnimation === false
				proses selesai disini, tidak terdapat kode selanjutnya */
		};
		const onScroll = (()=>{
			let activeEvent;							
			const fn = ()=>{
				remove();
				const el = ActiveElem;
				addClasses(el, ClassAnimationState2); // elemen masih tersembunyi, namun memiliki transisi
				_setTimeout(()=>{
					addClasses(el, ClassAnimationState3); // elemen mulai ditampilkan
					_setTimeout(()=>{
						removeClasses(el, ClassAnimationState1, ClassAnimationState2, ClassAnimationState3);
					}, 1100); // transisi animasi adalah 1s
				}, 20);
			};
			const waiter = ()=>{
				if(activeEvent){
					_clearTimeout(activeEvent);
				}
				activeEvent = _setTimeout(()=>{
					fn();
				}, 300);
			};
			const add = ()=>{
				addEvent(mainScrollable, "scroll", waiter);
			};
			const remove = ()=>{
				removeEvent(mainScrollable, "scroll", waiter);
			};
		
			return{add,remove}
		})();
		return main;
	})();	

					
	// {{SPECIAL_EVENTS}}
	/* {{ON_INIT}}
	proses ini akan dijalankan pertama kali setelah berbagai prototype terdefinsi.
	beberapa fungsi yang akan diletakkan disini adalah seperti meload fontawesome, check font loaded, dll.
	event ini tidak jauh berbeda dengan {{on_ready}}, hal ini dibuat hanya agar beberapa fungsi awal dapat didefinisikan terpisah */
	let SE_initDone = false;
	const SE_initFuncs = [];
	const SE_initReg = (func)=>{
		if(!SE_initDone){
			SE_initFuncs.push(func);
		}
		else{
			func();
		}
	};
	const SE_initExecute = ()=>{
		const funcs = SE_initFuncs;
		for(const func of funcs){
			func();
		}
		SE_initDone = true;
		SE_readyExecute();
	};

	/* {{ON_READY}} 
	Fungsi akan dijalankan tepat setelah proses init. */
	let SE_readyDone = false;
	const SE_readyFuncs = [];
	const SE_readyReg = (func)=>{
		if(!SE_readyDone){
			SE_readyFuncs.push(func);
		}
		else{
			func();
		}
	};
	const SE_readyExecute = ()=>{
		const funcs = SE_readyFuncs;
		for(const func of funcs){
			func();
		}
		
		SE_readyDone = true;
		if(SE_fontLoaded){
			setTimeout(()=>{
				SE_finishExecute();
			}, 300);
		}
	};

	/* {{ON_FONTSLOADED}}
		event ini hanya menuungu load untuk font regular */
	let SE_fontLoaded = false;
	let SE_fontDone = false;
	const SE_fontFuncs = [];
	const SE_fontReg = (func) => {
		if(!SE_fontDone){
			SE_fontFuncs.push(func);
		}
		else{
			func(SE_fontLoaded);
		}
	};
	const SE_fontExecute = (state)=>{
		const funcs = SE_fontFuncs;
		for(const func of funcs){
			func(state);
		}
		SE_fontDone = true;
		
		if(SE_readyDone){
			setTimeout(()=>{
				SE_finishExecute();
			}, 300);
			
			// tanpa set timeout,
			// ini cendrung akan tereksekusi dimana dom belum dirender sempurna,
			// terutama ketika browser menhace halaman
			// hal ini seperti misal add comment, onfinish akan tereksekusi sebelum browser menscrol ke elemen comment yang ditambahkan
			// ini akan menyebabkan JumpToElement ada proses init tidak sempurna (keadaan awal scrol tidak tereset ke 0)
			// karena window scrol di set ke 0 sebelum browser melakkan aksi default mensrol ke ancor
		}
	};		

	// {{ON_FINISH}}
	// Sejauh ini, fungsi akan dipanggil tepat setelah SE_fontExecute
	let SE_finishDone = false;
	const SE_finishFuncs = [];
	const SE_finishReg = (func) => {
		if(!SE_finishDone){
			SE_finishFuncs.push(func);
		}
		else{
			func();
		}
	};
	const SE_finishExecute = () => {
		const funcs = SE_finishFuncs;
		for(const func of funcs){
			func();
		}
		SE_finishDone = true;
	};

	// {[ON_WINDOW_LOADED}}
	let SE_loadedDone = false;
	const SE_loadedFuncs = [];
	const SE_loadedReg = (func) => {
		if(!SE_loadedDone){
			SE_loadedFuncs.push(func);
		}
		else{
			func();
		}
	};
	const SE_loadedExecute = () => {
		const funcs = SE_loadedFuncs;
		for(const func of funcs){
			func();
		}
		SE_loadedDone = true;
	};	
					


	/* SPESIAL 
		BAGIAN INI MUNGKIN AKAN BERBEDA UNTUK STIAP PROJECT.
		ENGAN KATA LAIN, BERBAGAI FUNGSI DISINI DIBUAT SESUAI KEBUTUHAN PROJECT
		ADAPUN BAGIAN INI TENTU MEMBUTUHKAN BAGIAN GENERAL */


	// {{SPECIAL_WIJS_VARIABLES}}
	const g_wijs = g_win.Wi;
	g_wijs.log = [];								// mungkin perlu dipush beberapa log yang memudahkan proses developer
	g_wijs.msgs = [];							// berbagai msg yang mungkin dapat menyebabkan masalah
	g_wijs.temp = {};							// holder untuk fungsi yang bersifat sementara
			 
			 
	const g_wijsBlog = g_wijs.blog;
	const g_wijsVars = g_wijs.vars;
	const g_wijsLog = g_wijs.log;
	const g_wijsMsgs = g_wijs.msgs;
	const g_wijsTemp = g_wijs.temp;


	// {{SPECIAL_VARIABLES}}
	const g_isSelfReferrer = (()=>{
		/*	TENTANG REFERRER DAN SESSION
			*	USER BERADA PADA BLOG
				1	USER MENGKLIK SALAH SATU LINK (SAME TAB)
					1.1	*	Protocol sebelumnya berbeda
								R 	:	empty
								S	:	false
							*	Protokol sebelumnya sama
								R	:	normal
								S	:	true
								
				2.	USER MENGKLIK SALAH SATU LINK (NEW TAB)
					2.1	*	Protocol sebelumnya berbeda
								R 	:	empty
								S	:	false
							*	Protokol sebelumnya sama
								R	:	normal
								S	:	false
					
							
				>	USER MEREFRESH DENGAN ENTER ADDRESS BAR	(return empty string)
						R		:	empty
						S		:	true
						
				>	USER MEREFRESH DENGAN TOMBOL REFRESH 
					Ini akan tergantung keadaan, 
						*	jika sebelumnya user sudah pernah merefresh dengan entr address bar
								R	:	empty
								S	:	true
								
						*	sebaliknya
								R :	referal sebelumnya
								S :	true
			
			berdasarkan data diatas, terdapat satu keadaan dimana referal sebenarnya berasal dari blog sendiri namun kedua data mereturn falsy hal ini terjadi pada state 1.1 dan state 2.1. 
			untuk protocol yang berbeda, ini tidak memiliki solusi hingga saat ini. oleh karena itu, pada koding xml, pastikan protocol semua link pada blog menggunakan protocol yang sedang aktif.
			adapun untuk kegiatan open new tab, pembacaan akan dilakukan dengan referrer.
			
			Tambahan:
			Sission juga tetap akan bernilai true untuk kegiatan submit comment.
		*/
		const doc = d_doc;
		const session = p_session;
		const local = p_local;
		const homepageUrl = g_wijsBlog.homepageUrl;
		const referrer = doc.referrer;
		const cookiePolicyLocalKey = local.createKey("Cookiepolicy");	// sesuaikan dengan local cookiePolicy. Ini dibutuhkan pada proses penghapusan local.
																									// adapun local ini tidak akan dihapus meskipun !isSelf.			
		const sessionKey = "WIJS_SESSION";
		const sessionData = session.get(sessionKey);
		const hasSession = sessionData === "true";
		
		let state = false;
		if(hasSession){
			state = true;
			// kondisi ini dapat true meski referal bukan url sendiri,
			// contoh kasus ini adalah ketika referal adalah dashbaord blogger (jika aksi dilakukan terus menerus)
			// jika kita open browser ulang, prilaku tetap normal (return falsy)
			// penyebab kondisi ini masih belum diketahui, kemungkinan besar kondisi ini disebabkan oleh chace browser
			// hal ini karena mungkin pada antarmuka HTML editor blogger, run juga dijalankan
			// kondisi ini tidak akan dibuat false, tetap manfaatkan prilaku chace browser
		}
		else{
			// kondisi ini dapat terjadi ketika user mengklik open new tab
			// oleh karena itu, cek referel,
			// adapun referal sendiri, untuk open new tab, selagi protokol adalah sama, referel akan mereturn url sebelumnya
			if(referrer.indexOf(homepageUrl) !== -1){
				state = true;
			}
			
			// untuk kegiatan submit komen, referal adalah blogger comment ("https://www.blogger.com/comment-iframe.do") namun session tetap truly
		}
		
		
		if(!state){
			session.set(sessionKey, "true");

			(()=>{ // hapus local
				const localKeys = local.getKeys();			
				for(const key of localKeys){
					if(key !== cookiePolicyLocalKey){
						local.remove(key);
					}
				}
			})();
		}
		
		return state;
	})();	
	const g_mainScrollbarSizes = (()=>{ // ver, hor
		const getScrollbarSizes = p_getScrollbarSizes;
		const body = d_body;
		return getScrollbarSizes(body);
	})();
	const g_bodyMirrorScrollbarSizes = (()=>{ // ver, hor
		const getScrollbarSizes = p_getScrollbarSizes;
		const bodyMirror = d_bodyMirror;
		return getScrollbarSizes(bodyMirror);
	})();

	// {{SPECIAL_PROTOTYPES}}
	const p_runEval = g_wijs.protos.runEval;
	const p_pushMsg = (()=>{
		const wijsMsgs = g_wijsMsgs;
		return (msg)=>{
			wijsMsgs.push(msg);
		}
	})();
	const p_pushLog = (()=>{
		const log = g_wijsLog;
		return (data)=>{
			log.push(data);
		}
	})();
	const p_insertJsBasedCss = (()=>{
		const head = d_head;
		const getById = p_elemGetById;
		const createElem = p_elemCreateElem;
		const createTextNode = p_elemCreateTextNode;
		const appends = p_elemAppends;
		const holder = createElem({t : "style", i : "w-CSSByJS"});
		appends(head, holder);
		
		return (selector, styleValue)=>{
			holder.appendChild(createTextNode(selector + "{" + styleValue + "}"));
		}
	})();
	const p_urlIsSelf = (()=>{
		const wijsBlog = g_wijsBlog;
		const {homepageUrl} = wijsBlog;
		let hostName = homepageUrl.substring(homepageUrl.indexOf("://") + 3, homepageUrl.length);
		const lastSlashIndex = hostName.indexOf("/");
		if(lastSlashIndex !== -1){
			hostName = hostName.substring(0, lastSlashIndex);
		}
		
		return (url)=>{
			url.indexOf(hostName) !== -1;
		}
	})();
	const p_urlDoBlankTarget = (()=>{
		const urlIsSelf = p_urlIsSelf;
		const wijsVars = g_wijsVars;
		const {openExternalLinkInNewTab} = wijsVars;
		if(openExternalLinkInNewTab){
			return (url)=>{
				// ketika url isSelf, return false, 
				// sebaliknya, return true. Jadi, fungsi dapat ditulis seperti berikut:
				return !urlIsSelf(url);
			}
		}
		else{
			return (url)=>{
				return false;
			}
		}
	})();
	const p_urlDoNofollow = (()=>{
		const urlIsSelf = p_urlIsSelf;
		const wijsVars = g_wijsVars;
		const {addNoFollowForExternalLink} = wijsVars;
		if(addNoFollowForExternalLink){
			return (url)=>{
				// ketika url isSelf, return false, 
				// sebaliknya, return true. Jadi, fungsi dapat ditulis seperti berikut:
				return !urlIsSelf(url);
			}
		}
		else{
			return (url)=>{
				return false;
			}
		}
	})();
	const p_createLabelUrl = (()=>{
		const wijsVars = g_wijsVars;
		const wijsBlog = g_wijsBlog;
		const {labelsUrlType} = wijsVars;
		const {homepageUrl} = wijsBlog;
		return (name)=>{
			let url = homepageUrl + "search";
			if(labelsUrlType === "parameter"){
				url += "?label=";
			}
			else{
				url += "/label/";
			}
			
			url += encodeURIComponent(name);
			
			return url;
		}
	})();					
	const p_dateISOToString = (()=>{
		const stringTrim = p_stringTrim;
		const wijsVars = g_wijsVars;
		const objLoop = p_objLoop;
		
		const defaultDateFormat = "MMMM, DD, YYYY";
		const monthNames = (()=>{
			const returned = [];
			const reg = /textMonth(\d+?)$/;
			objLoop(wijsVars, (item, index, key)=>{
				const match = reg.exec(key);
				if(match){
					returned[parseInt(match[1]) - 1 ] = item;
				}
			});
			
			return returned;
		})();
		
		return (ISO, format)=>{
			const year = ISO.substring(0,4);
			const month = ISO.substring(5,7);
			const day = ISO.substring(8,10);
			const dayNotNol = day[0] !== "0" ? day : day[1];
				
			const monthNum = parseInt(month); // 1 digit number based 1
			const dayNum = parseInt(day); // 1 digit number based 1
				
			let usedFormat;
			if(!format){
				usedFormat = defaultDateFormat;
			}
			else{
				usedFormat = stringTrim(format + "");
				if(!usedFormat){
					usedFormat = defaultDateFormat;
				}
			}
			
			let	time = usedFormat;
					time = time.replace("DD", day);
					time = time.replace("D", dayNotNol);
					time = time.replace("MMMM", monthNames[monthNum-1]);
					time = time.replace("MM", month);
					time = time.replace("YYYY", year);
					
			return time;
		};
	})();				
	const p_defineTextByJs = (()=>{
		// Fungsi ini akan mengupdate inner HTML elemen text dengan data
		/*	FORMAT HTML
			<element	class='w-textbyjs'
							data-text="text yang mengandung keys"
							data-keys="{{key1}} {{key2}}"
							data-values="{{value1}} {{value2}}"/> 
							
				class hanya digunakan untuk lebih mudah user mengidentifikasi
				
							
			PUSH MSG
				ETBJS_1.	length value and key tidak sesuai
								ketika msg terpush, inner html tetap terappend dengan data text tampa direplace
		*/
		const getDataAttrTypeString = p_getDataAttrTypeString;
		const stringToArray = p_stringToArray;
		const stringBlockToArray = p_stringBlockToArray;
		const removeClasses = p_elemRemoveClasses;
		const pushMsg = p_pushMsg;	
		return (elem)=>{
			const dataText = getDataAttrTypeString(elem, "text", true, "");
			const dataValues = getDataAttrTypeString(elem, "values", true, "");
			const dataKeys = getDataAttrTypeString(elem, "keys", true, "");
			const dataValuesArray = stringBlockToArray(dataValues);
			const dataKeysArray = stringToArray(dataKeys);
			const keysLength = dataKeysArray.length;
		
			let string = dataText;
			if(keysLength !== dataValuesArray.length){
				pushMsg("ETBJS_1");
			}
			else{
				for(let i=0;i<keysLength;i++){
					string = string.replace(new RegExp(dataKeysArray[i], "g"), "<span>" + dataValuesArray[i] + "</span>");
				}
			}
			
			elem.innerHTML = string;
			removeClasses(elem, "w-textbyjs");
		};
	})();				
	const p_loadJSON = (()=>{
		const appends = p_elemAppends;
		const createElem = p_elemCreateElem;
		const wijsBlog = g_wijsBlog;
		const {homepageUrl} = wijsBlog;
		
		const main = (o)=>{
			const {
				section,
				content,
				label,
				query,
				startIndex,
				maxResults,
				indexResults,
				callback
			} = o;
			
			const max = indexResults ? indexResults : maxResults;
			let src = homepageUrl + "feeds/posts/" + content;
			if(label){
				src+= "/-/" + encodeURI(label);
			}
			
			src += "?start-index="+ startIndex +"&max-results="+ max+"&alt=json-in-script&callback="+ callback;
			
			if(!label){
				if(query){
					src += "&q="+ encodeURI(query);
				}
			}
			
			const	script = createElem({t : "script"});
						script.async = true;
						script.src = src;
					
			appends(section, script);
		};
		return main;
	})();

	
	const p_configsCreate = (sources)=>{
		/*	TYPES
				1	: String
				2	: BOOLEAN
				3	: Number
				4	: FUNCTION */
				
		const returned = {};
		for(const item of sources){
			const name = item[0];
			const type = item[1];
			const value = item[2];
			const optionOrMinMax = item[3];
			const locked = item[4];
			const obj = {};
			if(optionOrMinMax){
				if(type === 3){
					obj.min = optionOrMinMax[0];
					obj.max = optionOrMinMax[1];
				}
				else{
					obj.option = optionOrMinMax;
				}
			}
			obj.value = value;
			obj.locked = locked === true ? true : false;	
			returned[name] = obj;
		}			
		return returned;
	};
	const p_configsValidate = (()=>{
		const typeIsString = p_typeIsString;
		const typeIsNumber = p_typeIsNumber;
		const typeIsBoolean = p_typeIsBoolean;
		const typeIsFunction = p_typeIsFunction;
		const objLoop = p_objLoop;
		const main = (configs, configsData)=>{
			objLoop(configs, (item, index, key)=>{
				const data = configsData[key];
				if(data !== undefined){
					const {type, option, min, max, value, locked} = data;
					if(locked){
						configs[key] = value;
					}
					else{
						let resetToDefault = false;
						if(	type === 1 && !typeIsString(item) ||
								type === 2 && !typeIsBoolean(item) ||
								type === 3 && !typeIsNumber(item) ||
								type === 4 && !typeIsFunction(item)
						){
							resetToDefault = true;
						}
						
						if(!resetToDefault){
							if(option){
								if(option.indexOf(item) === -1){
									resetToDefault = true;
								}
							}
							else{
								if(min){
									if(item < min){
										resetToDefault = true;
									}
								}
								
								if(max){
									if(item > max){
										resetToDefault = true;
									}
								}
							}
						}
						
						if(resetToDefault){
							configs[key] = value;
						}
					}
				}
			});
		};
		return main;
	})();
	const p_configsAssignAll = (()=>{
		/* CATATAN: FUNGSI HARUS DIPANGGIL SETELAH PROSES VALIDASI DILAKUKAN */
		const objLoop = p_objLoop;
		const main = (configsData, configs)=>{
			objLoop(configsData, (configData, index, key)=>{
				if(configs[key] === undefined){
					configs[key] = configData.value;
				}
			});
		};
		return main;
	})();	
	const p_configsGetOptionIndex = (configsData, property, value, base)=>{
		return configsData[property].option.indexOf(value) + base;
	};
	const p_configsCloneProperties = (()=>{
		const objClone = p_objClone;
		const objLoop = p_objLoop;
		const main = (holder, source, arrayGetProperties, arraySkipProperties, newNamePrefix)=>{
			/*	Arguments:
					holder							:	wajib. berupa object configs data 
					source							:	configsData yang akan di clone
					arrayGetProperties		:	daftar properties yang akan diambil, ketika ini terdefinisi, {{arraySkipProperties}} harus falsy
					arraySkipProperties		:	daftar properties yang tidak akan diambil, ketika ini terdefinisi {{arrayGetProperties}} harus falsy
					newNamePrefix				:	prefix untuk nama 
				Aksi
					Mengassign semua property yang diambil ke holder dengan atau tanpa prefix
					
				Return
					nothing, hanya mengassign new prperties
				
				Catatan
					fungsi bersifat DEV, berbagai kemungkinan error tidak diantisivasi
					*	setiap nama pada array harus tersedia pada source
			*/
			if(arrayGetProperties){
				for(const itemName of arrayGetProperties){
					const clonned = objClone(source[itemName]);
					const newName =  newNamePrefix  ? newNamePrefix + "_" + itemName : itemName;
					if(newNamePrefix){
						clonned.name = newName;
					}
					holder[newName] = clonned;
				}
			}
			else{
				objLoop(source, (config, index, key)=>{
					if(arraySkipProperties.indexOf(key) === -1){
						const clonned = objClone(config);
						const newName =  newNamePrefix  ? newNamePrefix +"_"+ key : key;
						if(newNamePrefix){
							clonned.name = newName;
						}
						holder[newName] = clonned;
					}
				});
			}
		};
		return main;
	})();
	const p_configsGetPrefixedProperties = (()=>{
		const objLoop = p_objLoop;
		const main = (holder, source, prefix)=>{
			const usedHolder = holder ? holder : {};
			objLoop(source, (item, index, key)=>{
				if(key.indexOf(prefix + "_") === 0){
					const noPrefix = key.substring(prefix.length + 1);
					usedHolder[noPrefix] = item;
				}
			});
			
			if(!holder){
				return usedHolder;
			}
		};
		return main;
	})();
	const p_configsStringToObj = (()=>{
		/*	RETURN
				NULL			:
				OBJECT 		:	(NOT EMPTY)
										CONFIG DENGAN PROPERTY YANG DITEMUKAN PADA STRING DAN VALID,
			
		
			ALGORITMA
			1.	AMBIL CONFIGS BY STRING, OBJECT DENGAN SEMUA PROPETY VALUE BERUPA STRING
			2.	CONVER STRING VALUE KE REAL VALUE
			3.	VALIDASI VALUE 
		*/
		
		const stringTrim = p_stringTrim;
		const stringToBoolean = p_stringToBoolean;
		const stringToNumber = p_stringToNumber;
		const objLoop = p_objLoop;
		const configsValidate = p_configsValidate;
		const main = (string, configsData)=>{
			// 1.	AMBIL CONFIGS BY STRING, OBJECT DENGAN SEMUA PROPETY VALUE BERUPA STRING
			const objString = {};
			const stringToArry = (stringTrim(string || "")).split(";");
			for(let item of stringToArry){
				item = stringTrim(item);
				if(item){
					const namesAndValue = item.split("=");
					if(namesAndValue.length === 2){
						const name = stringTrim(namesAndValue[0]);
						const value = stringTrim(namesAndValue[1]);
						objString[name] = value;
					}
				}
			}
			
			// sampai disini, semua property pada {{objString}} adalah berupa string
			// selanjutnya, definisikan value sebenarnya
			
			// 2.	CONVER STRING VALUE KE REAL VALUE
			const objRealValue = {};
			objLoop(objString, (item, index, key)=>{
				const data = configsData[key]; // object || undefined
				if(data){
					const {type, value, locked} = data;
					let usedValue;
					if(locked){
						usedValue = value;
					}
					else{
						if(type === 1){
							// do nothing
						}
						else if(type === 2){
							usedValue = stringToBoolean(item); // boolean || null
						}
						else if(type === 3){
							usedValue = stringToNumber(item); // boolean || null
						}
						
						// type 4 (function) tidak mendukung untuk configs by string
					}
					
					if(usedValue === null){
						usedValue = value;
					}
					
					objRealValue[key] = usedValue;
				}
			});
			
			// Sampai disini, {{objRealValue}} memiliki value real namun belum tervalidasi.
			// Property yang tersedia pada {{objRealValue}} merupakan property yang valid (tersedia pada data)
			
			// 3.	VALIDASI VALUE 
			configsValidate(objRealValue, configsData);
			
			if(Object.keys(objRealValue).length === 0){
				return null;
			}
			else{
				return objRealValue;
			}
		};
		return main;
	})();
	
	
	// ASSETS	
	const FT_ResizeObserverV1 = (()=>{
		/*	PEMBUATAN
			1.	Buat instance dengan:	
				const instance = new FT_ResizeObserverV1(el, {
					onStart 				: (ro_instance)=>{},
					onChange 			: (ro_instance)=>{},
					onStop 				: (ro_instance)=>{}
				}, {
					stopDelay : 300
				});
				
				Pembuatan instance boleh dilakukan kapanpun. 
					callback{{object}}
						onStart					:	tereksekusi pada event pertama
						onChange				:	tidak tereksekusi pada onStop
						onStop					:	tereksekusi pada event terakhir
						
						PANDUAN PENDEFINISIAN CALLBACK
							1.	Definisikan onStart jika terdapat fungsi yang hendak dipanggil 1x hanya diawal saja
							2.	Definisikan onChange jika terdapat fungsi yang hendak dipanggil secara continue
							3.	Definsikan onStop jika terdapat fungsi yang hendak dipanggil 1x diakhir		
						
					options
						stopDelay				:	nummber miliscond (300 def)
						
				Return INSTANCE 
					el
					options
					callback
					inSession								:	boolean
					scheduledOnStop					:	null || setTimeout
					clientWidth							:	selalu terupdate pada event resize. diassign ketika observe() dipanggil, ini dibutuhkan untuk mencegah terpanggilnya event pada keadaan awal.
																	secara logika, ini seharusnya tidak dibutuhkan, namun, jika tanpa algoritma compare dimensi ini, event callback akan terpanggil pada keadaan awal.
					clientHeight							:	-
					offsetWidth							:	-
					offsetHeight							:	-
					instance								:	hanya tersedia jika terdapat dukungan native ResizeObserver
					iframe									:	hanya tersedia jika tidak terdapat dukungan native ResizeObserver
					
						protos
							observe						:	mulai mengamati
							unobserve						:	stop mengamati
						
			2.	Panggil observe: 	instance.observe();
				Panggil fungsi ini ketka demensi telah siap (onload misalnya)			
		*/
	
		
		// CHECKING FALLBACK
		// g_win.ResizeObserver = null;  
		
		const win = g_win;
		const createElem = p_elemCreateElem; // used for fallback
		const appends = p_elemAppends;  // used for fallback
		const insertJsBasedCss = p_insertJsBasedCss;  // used for fallback
		
		
		const hasNativeObserver = typeof win.ResizeObserver === "function";
		let Obj;
		if(hasNativeObserver){
			Obj = (()=>{					
				const Main = function(el, callback, options){
					const	dis = this;
								dis.el = el;
								dis.options = options;
								dis.callback = callback;
								dis.inSession = false;
								dis.scheduledOnStop = null;
								dis.instance = new ResizeObserver((entries)=>{
									_runCallback(dis);
								});
				};
				Main.prototype.observe = function(){
					const dis = this;
					const {el} = dis;
					const {offsetHeight, clientHeight, offsetWidth, clientWidth} = el;
					dis.offsetHeight =  offsetHeight;
					dis.clientHeight = clientHeight;
					dis.offsetWidth = offsetWidth;
					dis.clientWidth = clientWidth;
					dis.instance.observe(el);
				};
				Main.prototype.unobserve = function(){
					this.instance.unobserve();
				};
				return Main;
			})();
		}
		else{
			Obj = (()=>{
				// DEFINE CSS IFRAME
				insertJsBasedCss(".w-ro-iframe", "position:absolute;top:0;left:0;width:100%;height:100%;right:0;bottom:0;box-sizing:border-box;margin:0;padding:0;visibility:hidden;opacity:0;z-index:-1");
				const Main = function(el, callback, options){
					const el_computedStyle = win.getComputedStyle(el, null);
					const el_position = el_computedStyle.getPropertyValue("position") || "static";
					if(el_position === "static"){
						el.style.position = "relative";
					}
					
					const iframe = createElem({t : "iframe", c : "w-ro-iframe"});
					appends(el, iframe);
					
					const	dis = this;
								dis.el = el;
								dis.options = options;
								dis.callback = callback;
								dis.inSession = false;
								dis.scheduledOnStop = null;
								dis.iframe = iframe;
				};
				Main.prototype.observe = function(){
					const dis = this;
					const {el, iframe} = dis;
					const {offsetHeight, clientHeight, offsetWidth, clientWidth} = el;
					dis.offsetHeight =  offsetHeight;
					dis.clientHeight = clientHeight;
					dis.offsetWidth = offsetWidth;
					dis.clientWidth = clientWidth;
					
					iframe.contentWindow.onresize = (e)=>{
						_runCallback(dis);
					};
				};
				Main.prototype.unobserve = function(){
					const dis = this;
					const {iframe} = dis;
					iframe.contentWindow.onresize = null;
				};
				return Main;
			})();
		}
		
		// fungsi run callback sama untuk kedua mode (native maupun fallback)
		const _runCallback = (dis)=>{
			const {el, callback, options} = dis;
			const {onStart, onChange, onStop} = callback || {};
			const {stopDelay} = options || {};
			
			const {offsetHeight, clientHeight, offsetWidth, clientWidth} = el;
			if(offsetHeight !== dis.offsetHeight || clientHeight !== dis.clientHeight || offsetWidth !== dis.offsetWidth || clientWidth !== dis.clientWidth){
				if(!dis.inSession){
					// ini adalah event pertama yang terekseusi dalam satu session
					// semua callback mungkin akan dipanggil pada sesi ini.
					dis.inSession = true;
					if(onStart){
						onStart(dis);
					}
					if(onChange){
						onChange(dis);
					}
					
					// Pada scope ini, {{scheduledOnStop}} pasti null
					if(onStop){
						dis.scheduledOnStop = setTimeout(()=>{
							onStop(dis);
							dis.scheduledOnStop = null;
							dis.inSession = false;
						}, stopDelay || 300);
					}
					else{
						// tidak memiliki onStop callback
						// disini, langsung reset
						dis.inSession = false;
					}
				}
				else{
					// pada kondisi ini, callback {{onStop}} pasti terdefinisi
					// karena jika tidak, inSession akan salalu false
					if(onChange){
						onChange(dis);
					}
					
					// onStop related
					if(dis.scheduledOnStop){
						clearTimeout(dis.scheduledOnStop);
					}
					dis.scheduledOnStop = setTimeout(()=>{
						onStop(dis);
						dis.scheduledOnStop = null;
						dis.inSession = false;
					}, stopDelay || 300);					
				}
				
				// update data dimensi
				dis.offsetHeight = offsetHeight;
				dis.clientHeight = clientHeight;
				dis.offsetWidth = offsetWidth;
				dis.clientWidth = clientWidth;				
			}
			else{
				// tidak terdapat perubahan dimensi dari sebelumnya
				// do nothing
			}
		};
		
		return Obj;
	})();	
	const FT_Skins = (()=>{
		const getRandomNumber = p_getRandomNumber;
		const arrayMoveItemToOtherArray = p_arrayMoveItemToOtherArray;
		const objLoop = p_objLoop;
		const wijsVars = g_wijsVars;
			
		const items = (()=>{
			const returned = [];
			const reg = /skin(Regular|Light|Dark)(.+?)$/;
			objLoop(wijsVars, (item, index, key)=>{
				const match = reg.exec(key);
				if(match){
					returned.push({
						type : match[1].toLowerCase(),
						name : match[2].toLowerCase(),
						color : item
					});
				}
			});
			return returned;
		})();
	
		
		const regularNames = (()=>{
			const returned = [];
			for(const i of items){
				if(i.type === "regular"){
					returned.push(i.name);
				}
			}
			
			return returned;
		})();
		const lightNames = (()=>{
			const returned = [];
			for(const i of items){
				if(i.type === "light"){
					returned.push(i.name);
				}
			}
			
			return returned;
		})();
		const darkNames = (()=>{
			const returned = [];
			for(const i of items){
				if(i.type === "dark"){
					returned.push(i.name);
				}
			}
			
			return returned;
		})();
		const getItems = (getRegular, getLight, getDark, excepts)=>{
			const returned = [];
			for(const i of items){
				const {type} = i;
				const doPush = (
											(type === "regular" && getRegular) || 
											(type === "light" && getLight) || 
											(type === "dark" && getDark)
										)
										&&
										(
											!excepts ||
											excepts.indexOf(i.name) === -1
										);
										
				if(doPush){
					returned.push(i.name);
				}
			}
			
			return returned;	
		};		
		const getRandom = (len, getRegular, getLight, getDark, excepts)=>{
			const results = [];
			let data = getItems(getRegular, getLight, getDark, excepts);
			let lastSkin;
			for(let i=0;i<len;i++){
				if(data.length === 0){
					data = getItems(getRegular, getLight, getDark, excepts);
				}
				
				const rundomNum = getRandomNumber(0, data.length - 1);
				if(lastSkin === data[rundomNum]){ // mencegah skin yang sama secara berurutan
					i -= 1;
					continue;
				}
				else{
					lastSkin = data[rundomNum];
					arrayMoveItemToOtherArray(data, rundomNum, results);
				}
			}
			return results;
		};
		const createClassString = (skinName)=>{
			return "w-s-"+ (regularNames.indexOf(skinName) !== -1 ? "r" : (lightNames.indexOf(skinName) !== -1 ? "l" : "d")) + ("-" + skinName);
		};
		
		return {
			items,												// OBJECT ITEM
			regularNames,									// ARRAY REGULAR NAME
			lightNames,										// ..
			darkNames,										// ..
			getItems,											// ()=>{}
			getRandom,										// ()=>{}
			createClassString								// ()=>{}
		};				
	})();
	const FT_Button = (()=>{
		/* TENTANG
			
			PEMBUATAN
				const buttonObj = ftButton.create({
					title 						: 	"title",
					tag 						: 	"a",
					url 						: 	"",
					skin 						: 	"main",
					icon						: 	"",
					iconPosition			: 	"left",
					boxType				:	"solid",
					rounded				:	false,
					fullWidth				:	false,
					align						:	"center",
					size						:	"normal"
				}, configsData);
		*/
		const configsCreate = p_configsCreate;
		const configsValidate = p_configsValidate;
		const configsAssignAll = p_configsAssignAll;
		const configsGetOptionIndex = p_configsGetOptionIndex;
		
		const createElem = p_elemCreateElem;
		const appends = p_elemAppends;
		const createTextNode = p_elemCreateTextNode;
		const ftSkins = FT_Skins;
		
		const ConfigsData = configsCreate([
			["title", 1, ""],
			["tag", 1, "button", ["a", "button"]],
			["url", 1, ""],
			["skin", 1, "main", ftSkins.getItems(true,true,true, null)],
			["icon", 1, ""],
			["iconPosition", 1, "left", ["left", "right"]],
			["boxType", 1, "solid", ["solid", "solid-border", "dashed-border"]],
			["rounded", 2, false],
			["fullWidth", 2, false],
			["align", 1, "center", ["left", "center", "right", "justify"]],
			["size", 1, "normal", ["small", "normal", "medium", "large"]]
		]);
		const Create = (configs, configsData)=>{
			// assignAll pada configs
			const usedConfigsData = configsData ? configsData : ConfigsData;
			configsValidate(configs, usedConfigsData);
			configsAssignAll(usedConfigsData, configs);
			
		
			const {title,tag,url,skin,icon,iconPosition,boxType,rounded,fullWidth,align,size, action} = configs;
			
			// define classes
			const classes = ["w-5a"];
			if(icon){
				classes.push("w--ip" + configsGetOptionIndex(usedConfigsData, "iconPosition", iconPosition, 1));
			}
			classes.push("w--b" + configsGetOptionIndex(usedConfigsData, "boxType", boxType, 1)); 
			classes.push(ftSkins.createClassString(skin));
			classes.push("w--r" + (rounded ? "1" : "0")); 
			classes.push("w--w" + (fullWidth ? "1" : "0")); 
			classes.push("w--a" + configsGetOptionIndex(usedConfigsData, "align", align, 1));
			classes.push("w--s" + configsGetOptionIndex(usedConfigsData, "size", size, 1));
									
			const elem = createElem({
				t : url ? "a" : action ? "button" : "span", 
				c : classes.join(" "),
				f : (elem)=>{
					if(icon){
						appends(elem, createElem({
							t : "i",
							c : icon
						}));
					}
					
					appends(elem, createElem({
						t : "span",
						cs : createTextNode(title)
					}));
					
					if(url){
						elem.setAttribute("href", url);
					}
				}
			});
			
			return elem;
		};
		return {
			configsData : ConfigsData,
			create : Create,
		};
	})();	
	const FT_OverlayScrollbarV1 = (()=>{
		/*	ALUR PROGRAM DAN PENDEFINISIAN INSTANCE
				1.	USER MEMBUAT INSTANCE FT_OverlayScrollbar(el, configs, configsData)
					const instance = new ftOverlayScrollbar.create(el, {
						thumbSize : 5,
						thumbColor : "black", 
						thumRunded : true, 
						autoHide : true,		
						yPosition : "right",
						yThumbMarginTop : 0,
						yThumbMarginBottom : 0,
						yThumbMarginRight : 0,
						yThumbMarginLeft : 0,
						xThumbMarginLeft : 0,
						xThumbMarginRight : 0, 
						xThumbMarginBottom : 0
					}, configsData);
					
			
					ARGUMENTS 
						*	el	(element with or without classes || null)
							-	element with classess. memungkin elemen lain sebagai child
								<div class='w-16a'>	el
									<div class='w-16a'>	elScrollable
										<div class='w-16c'>	elContent
										
							-	element without classess: harus dengan strukt tepat seperti berikut,
								<div>	el
									<div>	elScrollable
										<div>	elContent
								
							-	null
								elemen akan didefinisikan baru
								
							INFORMASI LAINNYA TERKAIT ELEMENT
								*	el
									-	posisi tidak boleh {{static}}
										Sejauh ini, tidak ada konfigurasi spesial pada el selain position
										Hal ini karena elemen sendiri hanya bertidak sebagai wrapper untuk thumb
										posisi sendiri di set ke class {{w-16a}}
									-	tidak boleh memiliki padding
										algoritma perhitungan untuk sekarang tidak mendukung padding
									-	event resize tidak ditambahkan pada {{el}}, jadi, pastikan perubahan dimensi hanya dipicu oleh perubahan {{elContent}}
										hal ini karena event hanya ditambahkan pada elContent
									-	akan otomatis mengikuti tinggi dan lebar {{elScrollable}}. Jadi, masalah dimensi {{el}} bisa dikatakan tidak mempengaruhi apapun.
										misal, ketika el tidak memiliki {{height}} dan {{maxHeight}}
										pada keadaan ini, tinggi elemen tentu akan sama dengan tinggi {{elScrollable}}
										script scrollbar akan tetap memproses elemen namun jelas elemen tidak akan memiliki scrollbar
									-	el boleh memiliki border, adapun offset thumb relative terhadap border (configs margin + lebar border)	
									-	Hingga sekarang, belum ada konfigurasi yang mengatur dimensi scrollbale
										dengan kata lain, dimensi hanya akan membaca pengaturan CSS
								*	elScrollable
									-	setidaknya memiliki css {{height}} atau {{maxHeight}} (hanya salah satu)
										dalam hal ini, {{maxHeight}} akan diutamakan. 
									-	tidak boleh memiliki padding. 
										terapkan padding pada content. lagipula, karena el disini adalah elemen dengan scrollbar, -
										menerapkan padding pada scrollable element memang tidak direkomendasikan
										kekurangannya adalah padding right akan terabaikan ketika memiliki over width.
									-	mendukung box-sizing {{cotent-box}} maupun {{border-box}}
									
									
					RETURN {{ItemInstance}}, dengan ketersediaan property:
						configs
						configsData
						el
						elScrollable
						elContent
						elThumbX
						elThumbY
						clickOrigin
						
							*	pada el, terdapat object {{WiOverlayScrollbar}} yang diassign
							
				2.	Init 
					*	aksi: mendefinisikan berbagai dimensi
					*	elemen harus telah terappend
					*	Fungsi ini harus dipanggil ketika dimensi elemen telah siap
						Dalam kasus umum, fungsi ini cocok dipanggil pada {{font loaded atau window loaded}}
						Fungsi hanya boleh dipanggil 1x
					
					*	Mendefinsisikan offset thumb
					*	Menambahkan beberapa class state pada elWrap
					*	Mendefinisikan berbagai data {{update}}
					*	AddMouse to thumb
					*	Assign {{ResizeObserver}}
					
				3. Update
					*	Mendefinisikan atau mengupdate berbagai data pada {{ItemInstance}}
							height										
							width										
							contentHeight							
							contentWidth							
							xTrack										
							xTrackPiece								
							xOver									
							xThumb											
							xThumbMarginPerScroll				
							xScrollPerThumbMargin				
							yTrack										
							yTrackPiece								
							yOver										
							yThumb									
							yThumbMarginPerScroll				
							yScrollPerThumbMargin				
							
					*	mengupdate style width and height thumb
					*	add or remove onscroll
					*	update ketersediaan thumb (berdasarkan over)
		
		
		
			ERROR:	(FT_OverlayScrollbarV1_ + num)
				1. Process {{Create}}: el tidak memiliki classes, tidak ditemukan el children (w2)
				2.	Process {{Create}}: el tidak memiliki classes, tidak ditemukan w2 children (w3)
				3.	Process {{Create}}: el memiliki classes, tidak ditemukan children dengan class w2 (w-16b)
				4.	Process {{Create}}: el memiliki classes, tidak ditemukan children dengan class w3 (w-16c)
				5.	Process {{Init}}: el belum terappend
				
				
		
		
			ITEM INSTANCE 
			Berikut adalah daftar semua property yang tersedia.
			Untuk kapan dan bagaimana property didefinisikan, lihat {{ALUR PROGRAM}}
				configs
				configsData
				el
				elScrollable
				elContent
				elThumbX
				elThumbY
				clickOrigin
				height										:	client el
				width										:	client el
				contentHeight							:	offset elContent		
				contentWidth								:	offset elContent
				xTrack										:	tinggi / lebar track keselruhan (thumb + piece)
				xTrackPiece								:	tinggi / lebar track yang tersisa / kosong (track - thumb)
				xOver										:	tinggi over content
				xThumb									:	tinggi / lebar thumb							
				xThumbMarginPerScroll				:	besar thumb margin per 1px scroll
				xScrollPerThumbMargin				:	besar scroll per 1px thumb margin
				yTrack										:	-
				yTrackPiece								:	-
				yOver										:	-
				yThumb									:	-
				yThumbMarginPerScroll				:	-
				yScrollPerThumbMargin				:	-
				scheduledAnimationFrame			:	NULL || requestAnimationFrame, hanya dieruntukkan untuk kebutuhan lokal
																	hanya tersedia ketika event {{onscroll}} telah ditambahkan.
				onScrollPaused							:	boolean.
																	hanya tersedia ketika event onscroll setiknya 1x di pause
																	
																	*	pada aplikasinya, event onscroll ditambahkan atau di {{pause}} (tidak dihapus)
																		proses pause sejauh ini hanya digunakan ketika elemen tidak memiliki over -
																		karena elemen sendiri tidak memiliki over, fungsi {{onscroll}} sendiri sebenarnya tidak akan -
																		tereksekusi walau tanpa dipause. ini hanya untuk amannya.
																	
																	*	fungsi {{pause}} sendiri dibuat untuk kepentingan mendatang yang mungkin membutuhkan pause event -
																		ketika elemen memiliki over. untuk sekarang. akses fungsi {{pause}} ini bersifat {{local}}				
		*/
		
		const win = g_win;
		const elemGetChildren = p_elemGetChildren;
		const elemGetChildrenByClass = p_elemGetChildrenByClass;
		const addClasses = p_elemAddClasses;
		const removeClasses = p_elemRemoveClasses;
		const appends = p_elemAppends;
		const removeElem = p_elemRemove;
		const createElem = p_elemCreateElem;
		const elemInsertBefore = p_elemInsertBefore;
		const hasClass = p_elemHasClass;
		const configsCreate = p_configsCreate;
		const configsValidate = p_configsValidate;
		const configsAssignAll = p_configsAssignAll;
		const animationFrameReg = p_animationFrameReg;
		const animationFrameCancel = p_animationFrameCancel;
		const eventAdd = p_eventAdd;
		const eventRemove = p_eventRemove;
		const isTouch = g_isTouch;
		const ftResizeObserverV1 = FT_ResizeObserverV1;
		const ftSkins = FT_Skins;
		
		const dev_minThumbHeight = 40;
		const Prefix = "w-16";
		let ActiveItem;
		const Items = [];
		const DConfigsData = configsCreate([
			["thumbSize", 3, 5, [0,null]],
			["thumbColor", 1, "black", ftSkins.getItems(true,true,true, null)], 
			["thumRunded", 2, true], 
			["autoHide", 2, true],		
			["yPosition", 1, "right", ["left", "right"]],
			["yThumbMarginTop", 3, 0, [0, null]],
			["yThumbMarginBottom", 3, 0, [0, null]],
			["yThumbMarginRight", 3, 0, [0, null]],
			["yThumbMarginLeft", 3, 0, [0, null]],
			["xThumbMarginLeft", 3, 0, [0, null]],
			["xThumbMarginRight", 3, 0, [0, null]],
			["xThumbMarginBottom", 3, 0, [0, null]]		
		]);
		const DisErrorReturn = (msg)=>{
			throw "FT_OverlayScrollbarV1_" + msg;
		};
		const Create = (()=>{
			const Main = function(el, configs, configsData){
				const 	usedConfigsData = configsData ? configsData : DConfigsData;
							configsValidate(configs, usedConfigsData);
							configsAssignAll(usedConfigsData, configs);
				
				let dom1;
				let dom2;
				let dom3;
				
				if(el){
					if(!hasClass(el, Prefix + "a")){
						dom1 = el;
						dom2 = elemGetChildren(dom1, 0);
						if(!dom2){
							DisErrorReturn(1);
						}
						
						dom3 = elemGetChildren(dom2, 0);
						if(!dom3){
							DisErrorReturn(2);
						}
						
						addClasses(dom1, Prefix + "a");
						addClasses(dom2, Prefix + "b");
						addClasses(dom3, Prefix + "c");
					}
					else{
						dom1 = el;
						dom2 = elemGetChildrenByClass(dom1, Prefix + "b", 0);
						if(!dom2){
							DisErrorReturn(3);
						}
						dom3 = elemGetChildrenByClass(dom2, Prefix + "c", 0);
						if(!dom3){
							DisErrorReturn(4);
						}	
					}			
				}
				else{
					createElem({
						c : Prefix + "a",
						cs : [
							{
								c : Prefix + "b",
								cs : [
									{
										c : Prefix + "c",
										f : (elem)=>{
											dom3 = elem;
										}
									}
								],
								f : (elem)=>{
									dom2 = elem;
								}
							}
						],
						f : (elem)=>{
							dom1 = elem;
						}
					});
				}
				
				const {
					thumbSize,
					thumRunded,
					thumbColor,
					autoHide,
					yPosition, 
					xPosition, 
					yThumbMarginLeft, 
					yThumbMarginTop, 
					yThumbMarginBottom, 
					yThumbMarginRight, 
					xThumbMarginLeft, 
					xThumbMarginRight, 
					xThumbMarginBottom
				} = configs;
				
				const elScrollable = dom2;
				const elContent = dom3;
				const elThumbY = createElem({c : Prefix + "ty w-dnone " + ftSkins.createClassString(thumbColor) + " w--r" + (thumRunded ? "1" : "0")});
				const elThumbX = createElem({c : Prefix + "tx w-dnone " + ftSkins.createClassString(thumbColor) + " w--r" + (thumRunded ? "1" : "0")});
				// informasi
				// class dnone harus ditambahkan pada thumb pada keadaan awal,
				// tanpa ini, ketika configs autoHide, thumb akan muncul sejenak pada load dom
				
				appends(dom1, elThumbX);
				appends(dom1, elThumbY);	
				
				const dis = this;
				dis.configs = configs;
				dis.configsData = usedConfigsData;
				dis.el = el;
				dis.elScrollable = elScrollable;
				dis.elContent = elContent;
				dis.elThumbX = elThumbX;
				dis.elThumbY = elThumbY;
				dis.clickOrigin = {};
				
				el.WiOverlayScrollbar = dis;
				Items.push(dis);
			};
			Main.prototype.init = function(){
				const dis = this;
				const {configs, el, elScrollable, elContent, elThumbX, elThumbY} = dis;
				if(!el.parentNode){
					DisErrorReturn(5);
				}
				
				const {
					thumbSize,
					autoHide,
					yPosition, 
					yThumbMarginLeft, 
					yThumbMarginTop, 
					yThumbMarginBottom, 
					yThumbMarginRight, 
					xThumbMarginLeft, 
					xThumbMarginRight, 
					xThumbMarginBottom, 
					xThumbMarginTop
				} = configs;
				
				// mendefinisikan margin thumb
				elThumbX.style.left = xThumbMarginLeft + "px";
				elThumbX.style.bottom = xThumbMarginBottom + "px";
				elThumbX.style.height = thumbSize + "px";
				elThumbY.style.top = yThumbMarginTop + "px";
				elThumbY.style[yPosition] = (yPosition === "right" ? yThumbMarginRight  : yThumbMarginLeft) + "px";	
				elThumbY.style.width = thumbSize + "px";
			
				// add classes
				if(autoHide){
					addClasses(el, "w--ah1");
				}				

				// runUpdate
				dis.update();
				
				// add mouse
				_OnMouse.add(dis);
				
				// onresize
				const resizeInstance = new ftResizeObserverV1(elContent, _OnResizeCallback, {stopDelay : 300});
				resizeInstance.observe();
			};
			Main.prototype.update = function(){
				const dis = this;
				const {el, elScrollable, elContent, elThumbX, elThumbY, configs, byAxis} = dis;
				const {
					thumbSize,
					yPosition, 
					yThumbMarginTop, 
					yThumbMarginBottom, 
					yThumbMarginRight, 
					yThumbMarginLeft, 
					xThumbMarginLeft, 
					xThumbMarginRight, 
					xThumbMarginBottom
				} = configs;
				
				const height = el.clientHeight;
				const width = el.clientWidth;
				const contentHeight = elContent.offsetHeight;
				const contentWidth = elContent.offsetWidth;
				
				dis.height = height;
				dis.width = width;
				dis.contentHeight = contentHeight;
				dis.contentWidth = contentWidth;
				
				for(let i=0;i<2;i++){
					const isX = i === 0;
					const track = isX ? width - xThumbMarginLeft - xThumbMarginRight : height - yThumbMarginTop - yThumbMarginBottom;
					const over = isX ? contentWidth - width : contentHeight - height;
					let thumb = isX ? (track / contentWidth) * track : (track / contentHeight) * track;
					if(thumb < dev_minThumbHeight){
						thumb = dev_minThumbHeight;
					}
					const trackPiece = track - thumb;
					const thumbMarginPerScroll = trackPiece / over;
					const scrollPerThumbMargin = over / trackPiece;
					
					const axisPrefix = isX ? "x" : "y";
					
					dis[axisPrefix + "Track"] = track;
					dis[axisPrefix + "Over"] = over;
					dis[axisPrefix + "Thumb"] = thumb;
					dis[axisPrefix + "TrackPiece"] = trackPiece;
					dis[axisPrefix + "ThumbMarginPerScroll"] = thumbMarginPerScroll;
					dis[axisPrefix + "ScrollPerThumbMargin"] = scrollPerThumbMargin;
					
					let newMargin = thumbMarginPerScroll * (isX ? elScrollable.scrollLeft : elScrollable.scrollTop);
					if(newMargin < 0){
						newMargin = 0;
					}
					
					if(newMargin > trackPiece){
						newMargin = trackPiece;
					}
					
					
					// apply height and margin pada elThumb
					const elThumb = isX ? elThumbX : elThumbY;						
					addClasses(elThumb, "w--hmt"); // has height, width, margin transition
					elThumb.style[isX ? "width" : "height"] = thumb + "px";
					elThumb.style[isX ? "marginLeft" : "marginTop"] = newMargin + "px";	
					setTimeout(()=>{
						removeClasses(elThumb, "w--hmt"); // has height, width, margin transition
					}, 320);
					
					
					// show or hide 
					(over > 0 ? removeClasses : addClasses)(elThumb, "w-dnone");
				}
				
				// add or remove scroll
				if(dis.yOver > 0 || dis.xOver > 0){
					_OnScroll.add(dis);
				}
				else{
					_OnScroll.pause(dis);
				}
			};				
		
			const _OnScroll = (()=>{
				const s_scheduledAnimationFrame = "scheduledAnimationFrame";
				const s_onScrollPaused = "onScrollPaused";
				
				const processY = (dis)=>{
					if(dis.yOver > 0){
						const {elScrollable, elThumbY, yThumbMarginPerScroll, yTrackPiece} = dis;
						const pos = elScrollable.scrollTop;
						let newMargin = (yThumbMarginPerScroll * pos);
						if(newMargin > yTrackPiece){
							newMargin = yTrackPiece;
						}
						if(newMargin < 0){
							newMargin = 0;
						}
						
						elThumbY.style.marginTop = newMargin + "px";
					}
				};
				const processX = (dis)=>{
					if(dis.xOver > 0){
						const {elScrollable, elThumbX, xThumbMarginPerScroll, xTrackPiece} = dis;
						const pos = elScrollable.scrollLeft;
						let newMargin = (xThumbMarginPerScroll * pos);
						if(newMargin > xTrackPiece){
							newMargin = xTrackPiece;
						}
						if(newMargin < 0){
							newMargin = 0;
						}
						
						elThumbX.style.marginTop = newMargin + "px";
					}
				};
				const add = (dis)=>{
					const main = (frameTime)=>{
						processY(dis);
						processX(dis);
						dis[s_scheduledAnimationFrame] = null;
					};
					const touchAutoHide = !isTouch || !dis.configs.autoHide ? null : (()=>{
						let inSession = false;
						let activeFn;
						const fn = ()=>{
							const {elThumbX, elThumbY} = dis;
							if(!inSession){
								inSession = true;
								addClasses(elThumbX, "w-show");
								addClasses(elThumbY, "w-show");
							}
							
							if(activeFn){
								clearTimeout(activeFn);
							}
							
							activeFn = setTimeout(()=>{
								removeClasses(elThumbX, "w-show");
								removeClasses(elThumbY, "w-show");
								activeFn = null;
								inSession = false;
							}, 500);
						};
						return fn;
					})();
					
					dis.elScrollable.onscroll = (e)=>{						
						if(!dis[s_onScrollPaused]){
							if(touchAutoHide){
								touchAutoHide();
							}
						
							if(dis[s_scheduledAnimationFrame]){
								return;
							}
							else{
								dis[s_scheduledAnimationFrame] = animationFrameReg(main);
							}
						}
					};
				};
				const pause = (dis)=>{
					if(dis[s_scheduledAnimationFrame]){
						animationFrameCancel(dis[s_scheduledAnimationFrame]);
					}
					dis[s_onScrollPaused] = false;
				};
				const resume = (dis)=>{
					if(dis[s_onScrollPaused]){
						dis[s_onScrollPaused] = false;
					}
				};
				return {add, pause, resume};
			})();
			const _OnMouse = (()=>{
				const add = (dis)=>{
					const {elThumbX, elThumbY} = dis;
					elThumbX.onmousedown = (e)=>{
						ActiveItem = dis;
						runMouseDownX(e);
					};
					elThumbY.onmousedown = (e)=>{
						ActiveItem = dis;
						runMouseDownY(e);
					};
				};
				const runMouseDownX = (e)=>{
					e.preventDefault();
					const dis = ActiveItem;
					const {el, elScrollable, configs, clickOrigin} = dis;
					const {autoHide} = configs;
					if(autoHide){
						addClasses(el, "w--pah"); // prevent hide 
					}
					
					clickOrigin.x = e.clientX;
					clickOrigin.posX = elScrollable.scrollLeft;
					
					eventAdd(win, "mousemove", runMouseMoveX);
					eventAdd(win, "mouseup", runMouseUp);
				};
				const runMouseDownY = (e)=>{
					e.preventDefault();
					const dis = ActiveItem;
					const {el, elScrollable, configs, clickOrigin} = dis;
					const {autoHide} = configs;
					if(autoHide){
						addClasses(el, "w--pah"); // prevent hide 
					}
					
					clickOrigin.y = e.clientY;
					clickOrigin.posY = elScrollable.scrollTop;
					eventAdd(win, "mousemove", runMouseMoveY);
					eventAdd(win, "mouseup", runMouseUp);
				};
				const runMouseMoveX = (e)=>{
					const dis = ActiveItem;
					const {clickOrigin, elThumbX, elScrollable} = dis;
					const {xThumbMarginPerScroll, xTrackPiece, xScrollPerThumbMargin} = dis;
					const lastCoordinate = clickOrigin.x;
					const lastScroll = clickOrigin.posX;
					
					const newCoordinate = e.clientX;
					const change = newCoordinate - lastCoordinate;	
					let newMargin = (lastScroll * xThumbMarginPerScroll) + change;
					if(newMargin < 0){
						newMargin = 0;
					}
					if(newMargin > xTrackPiece){
						newMargin = xTrackPiece;
					}
					
					const newScroll = xScrollPerThumbMargin * newMargin;
					elThumbX.style.marginLeft = newMargin + "px";
					elScrollable.scrollLeft = newScroll;
				};
				const runMouseMoveY = (e)=>{
					const dis = ActiveItem;
					const {clickOrigin, elThumbY, elScrollable} = dis;
					const {yThumbMarginPerScroll, yTrackPiece, yScrollPerThumbMargin} = dis;
					const lastCoordinate = clickOrigin.y;
					const lastScroll = clickOrigin.posY;
					
					const newCoordinate = e.clientY;
					const change = newCoordinate - lastCoordinate;	
					let newMargin = (lastScroll * yThumbMarginPerScroll) + change;
					if(newMargin < 0){
						newMargin = 0;
					}
					
					if(newMargin > yTrackPiece){
						newMargin = yTrackPiece;
					}
					
					const newScroll = yScrollPerThumbMargin * newMargin;
					elThumbY.style.marginTop = newMargin + "px";
					elScrollable.scrollTop = newScroll;
				};
				const runMouseUp = (e)=>{
					eventRemove(win, "mousemove", runMouseMoveX);
					eventRemove(win, "mousemove", runMouseMoveY);
					eventRemove(win, "mouseup", runMouseUp);
					
					const dis = ActiveItem;
					removeClasses(dis.el, "w--pah"); // remove prevent auto hide class
				};
			
				return {add};
			})();
			const _OnResizeCallback = {
				onStop : (resize_instance)=>{
					const resize_el = resize_instance.el;
					const scrollbar_el = resize_el.parentNode.parentNode;
					const scrollbar_instance = scrollbar_el.WiOverlayScrollbar;
					scrollbar_instance.update(); 
				}
			};				
		
			return Main;
		})();
		const AssignClasses = (el)=>{
			addClasses(el, Prefix + "a");
			addClasses(el.children[0], Prefix + "b");
			addClasses(el.children[0].children[0], Prefix + "c");
		};
		
		return {
			items : Items,
			configsData : DConfigsData,
			create : Create,
			assignClasses : AssignClasses
		};
	})();	
	
	const FT_TooltipsV1 = (()=>{
		/*  PEMBUATAN
				1.	BUAT INSTANCE:
					const tootips_instance = new ftTooltips.create(
						// el
						el : null,
							//	1.	1 level
							//		<elemen>text<elemen>
							//	2.	2 level dengan title saja
							//		<elemen>
							//			<title>text</title>
							//	3.	2 level dengan title dan sub
							//		<elemen>
							//			<title>text</title>
							//			<sub1>
							//				<sub2>
							//					<sub3>
							//						<sub4>
							//							<sub5>
							//								text or other hire
						
						// configs
						{
							position 							: 	"bottom",
							titleOffset 							: 	0,
							arrow								:	true,
							contentWidth						:	null,
							contentMaxWidth				:	null, 
							contentHeight					:	null, 
							contentMaxHeight				:	null, 
							offsetTop							:	0,
							offsetRight						:	0,
							offsetBottom						:	0,
							offsetLeft							:	0, 
						
							putLinkToContent				:	"touch-only",
							moreLinkUrl						:	"",
							moreLinkText						:	"",
							moreLinkStyle					:	"inline",
							moreLinkButon_boxType		:	"solid",
							moreLinkButon_skin			:	"main",
							moreLinkButon_rounded		:	false,
							moreLinkButon_align			:	"justify"
						}, 
						configsData, 
						elParent,
						// callbacks
						{
							onReady : (tooltips_instance)=>{
								// Fungsi akan dieksekusi ketika tooltips telah diproses, (dimensi, posisi, dll)
								// fungsi ini akan terpanggil ketika proses onmouseover selesai tereksekusi (tanpa error)
								// hal ini mungkin dibutuhkan untuk memproses konten tooltips
							}
						}
					);
					
					Sampai pada pembuatan instance ini, property pada instance adalah:
					*	Ketika terdapat error
							errorMsg
					
					*	TIdak terdapat error
							configs
							configsData
							elParent
							el
							elTitle
							elSub1
							elSub2
							elSub3
							elSub4
							elSub5
							elFooter
							hasFooter
							
				2.  INIT
					*	Menambahkan event onmouse over pada element
					*	Terdapat tambahan property {{hasInited}} saat fungsi init dipanggil.
					
					
		
	
					
			STRUKTUR DOM YANG TELAH JADI
				elemen
					_classes
						w--mrt[012]						: 	0 (none), 1 (inline), 2 (button)										morelink type										create
						w--mrp[1234]					:	1 (left), 2 (center), 3 (right), 4 (justify / fullwidth)			morelink type button position					create
						w--p[1234]						:	1 (top), 2 (right_, 3 (botom), 4 (left)								position												mouseover
				
				
					title
					sub1								: 	sebagai holder
						sub2							:	sebagai holder backgroud
							sub3						:	sebagai overlay scrollbar
								sub4..				:
									sub5..			:
										content...
							sub6						:	sebagai button holder
							
							
			CLASSES 
				a[content]
				b[title]
				c[sub1]
				d[sub2]
				e[sub3]
				f[sub4]
				g[sub5]
				h[elFooter]
				i[inline morelink wrap]
				j[inline more link separator]
				k[inline morelink link mirror]
				r[arrow]
				
							
		
			MSG 
			1.		Process {{Create}}: childs {{el}} > 2
			2		Process {{Create}}: childs {{sub1}} > 1
			3		Process {{Create}}: childs {{sub1}} = 0
			4		Process {{Create}}: childs {{sub2}} > 1
			5		Process {{Create}}: childs {{sub2}} = 0
			6		Process {{Create}}: childs {{sub3}} > 1
			7		Process {{Create}}: childs {{sub3}} = 0
			8		Process {{Create}}: childs {{sub4}} > 1
			9		Process {{Create}}: childs {{sub4}} = 0
			10	Process {{Create}}: idak terdapat attr content (saat ini dibutuhkan)
			11	Process {{Init_onHover}}: browser tidak mensupport {{getComputedStyle}}
			12	Process {{Init_onHover}}: availableWidth terlalu kecil
			13	Process {{Init_onHover}}: availableHeight terlalu kecil
			13	Process {{Init_onHover}}: browser tidak mensupport clientRect
		*/
		const win = g_win;
		const wijsVars = g_wijsVars;
		const textViewMore = wijsVars.textViewMore;
		const isTouch = g_isTouch;
		const bodyMirror = d_bodyMirror;
		
		const configsCreate = p_configsCreate;
		const configsValidate = p_configsValidate;
		const configsAssignAll = p_configsAssignAll;
		const configsStringToObj = p_configsStringToObj;
		const configsCloneProperties = p_configsCloneProperties;
		const configsGetPrefixedProperties = p_configsGetPrefixedProperties;
		const configsGetOptionIndex = p_configsGetOptionIndex;
		const pushMsg = p_pushMsg;
		const addClasses = p_elemAddClasses;
		const removeClasses = p_elemRemoveClasses;
		const createElem = p_elemCreateElem;
		const appends = p_elemAppends;
		const removeElem = p_elemRemove;
		const getDataAttrTypeString = p_getDataAttrTypeString;
		const createTextNode = p_elemCreateTextNode;
		const typeIsString = p_typeIsString;
		const elemGetOffsetToDocument = p_elemGetOffsetToDocument;
		const objLoop = p_objLoop;

		
		const ftResizeObserverV1 = FT_ResizeObserverV1;
		const ftButton = FT_Button;
		const ftOverlayScrollbarV1 = FT_OverlayScrollbarV1;
		
		// SE_fontDone
		
		
		
		const dev_buttonConfigsPrefix = "moreLinkButon";
		const dev_arrowHeight = 20;
		const dev_arrowSize = 13; // harus sama persis sesuai css
		const dev_footerHeight = 75; // real adalah 73.xx
		const dev_contentPadding = 15;
		
		const Id = "8";
		const Prefix = "w-" + Id;
		const DisPushMsg = (msg)=>{
			pushMsg("FT_TooltipsV1_" + msg);
		};
		const DConfigsData = (()=>{
			const newData = configsCreate([
				["position", 1, "bottom",  ["top", "right", "bottom", "left"]],
				["titleOffset", 3, 10],
				["arrow", 2, true],
				["contentWidth", 3, null],
				["contentMaxWidth", 3, null],
				["contentHeight", 3, null],
				["contentMaxHeight", 3, null],
				["offsetTop", 3, 0],
				["offsetRight", 3, 0],
				["offsetBottom", 3, 0],
				["offsetLeft", 3, 0],
				["putLinkToContent", 1, "none", ["none", "all", "touch-only"]],
				["moreLinkUrl", 1, ""],
				["moreLinkText", 1, ""],
				["moreLinkStyle", 1, "button", ["inline", "button"]]
			]);
			configsCloneProperties(newData, ftButton.configsData, [
				"boxType",
				"skin",
				"rounded",
				"align"					// align disini tidak digunakan untuk button, melainkan untuk posisi button
											// button akan dibuat full width jika align adalah justify
											// property ini nantinya akan direplace ke center jika sudah digunakan
			], null, dev_buttonConfigsPrefix);
			return newData;
		})(); 
		const Create = (()=>{
			const main = function(el, configs, configsData, elParent, callbacks){
				if(el.WiTooltips){
					return el.WiTooltips;
				}
				
				const dis = this;
				const usedConfigsData = configsData ? configsData : DConfigsData;
				configsValidate(configs, usedConfigsData);
				
				// GET CONFIGS FROM STRING
				const configsString = getDataAttrTypeString(el, "configs");
				if(configsString){
					const configsObjByAttr = configsStringToObj(configsString, usedConfigsData); // null || object not empty (telah tervalidasi)
					if(configsObjByAttr){
						objLoop(configsObjByAttr, (item, index, key)=>{
							configs[key] = item;
						});
					}
				}
				
				
				// BERBAGAI VARIABLES
				let elTitle;
				let elSub1;
				let elSub2;
				let elSub3;
				let elSub4;
				let elSub5;
				let hasMoreLinkTypeInline;
				let hasMoreLinkTypeButton;
				let elFooter;
				let moreLinkButtonPosition;
				let invalidMsg;
				
				// ASSIGN AND REDEFINE {{elTitle}}
				const childs = el.children;
				const len = childs.length;
				if(len > 2){
					invalidMsg = 1;
				}
				else{
					if(len === 0){
						elTitle = createElem({
							t : "span",
							n : el.innerHTML
						});
		
						el.innerHTML = "";
						appends(el, elTitle);
					}
					else{
						if(len === 1){
							elTitle = childs[0]; // langsung assign child0 ebagau {{elTitle}}
						}
						else{
							elTitle = childs[0]; // langsung assign child0 ebagau {{elTitle}}
							
							const sub1 = childs[1];
							const sub1Childs = sub1.children;
							const sub1ChildsLength = sub1Childs.length;
							if(sub1ChildsLength > 1){
								invalidMsg = 2;
							}
							else{
								if(sub1ChildsLength === 0){
									invalidMsg = 3;
								}
								else{								
									const sub2 = sub1Childs[0];
									const sub2Childs = sub2.children;
									const sub2ChildsLength = sub2Childs.length;
									if(sub2ChildsLength > 1){
										invalidMsg = 4;
									}
									else{
										if(sub2ChildsLength === 0){
											invalidMsg = 5;
										}
										else{
											const sub3 = sub2Childs[0];
											const sub3Childs = sub3.children;
											const sub3ChildsLength = sub3Childs.length;
											if(sub3ChildsLength > 1){
												invalidMsg = 6;
											}
											else{
												if(sub3ChildsLength === 0){
													invalidMsg = 7;
												}
												else{
													const sub4 = sub3Childs[0];
													const sub4Childs = sub4.children;
													const sub4ChildsLength = sub4Childs.length;
													if(sub4ChildsLength > 1){
														invalidMsg = 8;
													}
													else{
														if(sub4ChildsLength === 0){
															invalidMsg = 9;
														}
														else{
															elSub1 = sub1;
															elSub2 = sub2;
															elSub3 = sub3;
															elSub4 = sub4;
															elSub5 = sub4Childs[0];
														}
													}												
												}
											}												
										}
									}								
								}
							}
						}
					}
				}		
			
			
				
				/*	SAMPAI DISINI, 
					*	{{invalidMsg}} terdefinisi																invalid
					*	{{invalidMsg}} tidak terdefinisi														valid
						Pada kasus ini, elSub1 bisa terdefinisi ataupun tidak. */
						
				/*	*	sampai disini, masih masih ada kemungkinan error,
						yaitu ketika !elSub1 dan tidak ditemukan attr content 
					*	Sub akan dibuat dan diappend pada proses create
						hal ini agar sub dapat terindex google */
				
				// DEFINE SUB (JIKA BELUM TERSEDIA
				if(!invalidMsg){
					if(!elSub1){
						const contentStringAtAttr = getDataAttrTypeString(el, "content");
						if(!contentStringAtAttr){
							invalidMsg = 10;
						}
						else{
							elSub1 = createElem({
								t : "span",
								cs : [
									{
										t : "span",
										cs : [
											{
												t : "span",
												cs : [
													{
														t : "span",
														cs : [
															{
																t : "span",
																cs : createTextNode(contentStringAtAttr),
																f : (elem)=>{
																	elSub5 = elem;
																}
															}
														],
														f : (elem)=>{
															elSub4 = elem;
														}
													}
												],
												f : (elem)=>{
													elSub3 = elem;
												}
											}
										],
										f : (elem)=>{
											elSub2 = elem;
										}
									}
								]
							});
							
							appends(el, elSub1);
						}
					}
				}
				
				// DEFINE MORELINK
				if(!invalidMsg){
					const {
						putLinkToContent,
						moreLinkUrl,
						moreLinkStyle,
						moreLinkText
					} = configs;
					
					const hasNormalMoreLink = el.tagName !== "A" && moreLinkUrl;
					const hasMoreLinkFromA = el.tagName === "A" && (putLinkToContent === "all" || (putLinkToContent === "touch-only" && isTouch));
					const hasMoreLink = (hasNormalMoreLink ||  hasMoreLinkFromA);
					const createMoreLinkTypeButton = hasMoreLink && moreLinkStyle === "button";
					const createMoreLinkTypeText = hasMoreLink && moreLinkStyle !== "button";
				
					hasMoreLinkTypeInline = createMoreLinkTypeText;
					hasMoreLinkTypeButton = createMoreLinkTypeButton;
					
					if(createMoreLinkTypeButton){
						const buttonConfigs = configsGetPrefixedProperties(null, configs, dev_buttonConfigsPrefix);
						elFooter = createElem({t : "span", c : Prefix + "h"});
						moreLinkButtonPosition = buttonConfigs.align;
						
						buttonConfigs.title = moreLinkText || textViewMore;
						buttonConfigs.url = hasNormalMoreLink ? moreLinkUrl : "";
						buttonConfigs.fullWidth = moreLinkButtonPosition === "justify";
						buttonConfigs.align = "center";
									
						const buttonDom = ftButton.create(buttonConfigs, null);
						
						if(hasMoreLinkFromA){
							buttonDom.onclick = (e)=>{
								win.location = el.href;
							};
						}
						
						appends(elFooter, buttonDom);
						appends(elSub2, elFooter);
					}
					else{
						if(createMoreLinkTypeText){
							const elInlineMoreLink = createElem({
								t : "span",
								c : Prefix + "i",
								cs : [
									{
										t : "span",
										c : Prefix + "j",
										n : "-"
									},
									{
										t : hasMoreLinkFromA ? "span" : "a",
										c : Prefix + "k",
										h : hasMoreLinkFromA ? moreLinkUrl : false, 
										n : moreLinkText || textViewMore,
										f : (elem)=>{
											if(hasMoreLinkFromA){
												elem.onclick = (e)=>{
													win.location = el.href;
												};
											}
										}
									}
								]
							});
							appends(elSub5, elInlineMoreLink);
						}
					}
					
					if(hasMoreLinkFromA){
						el.onclick = (e)=>{
							e.preventDefault();
						};
					}
				}
				
					
				/* SAMPAI DISINI, SEMUA ELEMEN TELAH TERDFINISI, KECUALI ARROW */
						
				if(invalidMsg){
					// Ketika terdapat error, hanya property {{errorMsg}} yang terdapat pada {{instance}}
					dis.errorMsg = invalidMsg;
					DisPushMsg(invalidMsg);
				}
				else{
					addClasses(el, Prefix + "a");
					addClasses(elTitle, Prefix + "b");
					addClasses(elSub1, Prefix + "c");
					addClasses(elSub2, Prefix + "d");
					addClasses(elSub3, Prefix + "e");
					addClasses(elSub4, Prefix + "f");
					addClasses(elSub5, Prefix + "g");
					
					dis.configs = configs;
					dis.configsData = usedConfigsData;
					dis.elParent = elParent || bodyMirror;
					dis.el = el;
					dis.elTitle = elTitle;
					dis.elSub1 = elSub1;
					dis.elSub2 = elSub2;
					dis.elSub3 = elSub3;
					dis.elSub4 = elSub4;
					dis.elSub5 = elSub5;
					dis.elFooter = elFooter;
					dis.hasFooter = elFooter !== undefined;
					dis.callbacks = callbacks;
					
					// ADD CLASSES TO WRAP
					(()=>{
						addClasses(el, "w--mrt" + (!hasMoreLinkTypeButton && !hasMoreLinkTypeInline ? "0" : (hasMoreLinkTypeInline ? "1" : "2"))); // morelink type
						
						if(hasMoreLinkTypeButton){
							addClasses(el, ("w--mrp" + configsGetOptionIndex(usedConfigsData, dev_buttonConfigsPrefix + "_align", moreLinkButtonPosition, 1))); // more-link-position
						}
					})();					
				}
				el.WiTooltips = dis;
			};
			main.prototype.init = function(){				
				const dis = this;
				if(dis.hasInited){
					return;
				}
				else{
					dis.hasInited = true;
					if(!dis.errorMsg){
						const {el, callbacks} = dis;
						el.onmouseover = (e)=>{
							e.preventDefault();
							
							if(SE_fontDone){
								const runAndGetState = runOnMouseOver(dis);
								if(typeIsString(runAndGetState)){
									dis.errorMsg = runAndGetState;
									DisPushMsg(runAndGetState);
									
									// terjadi error pada proses
									// class s1 tidak akan ditambahkan agar elemen selalu tersembunyi
								}
								else{
									addClasses(el, "w--s1");
									
									if(callbacks){
										if(callbacks.onReady){
											callbacks.onReady(dis);
										}
									}
								}
								
								el.onmouseover = null;
							}
						};
					}					
				}
			};
			
			const runOnMouseOver = (dis)=>{
				const {
					configsData,
					configs,
					el,
					elParent,
					elSub1,
					elSub2,
					elSub3,
					elSub4,
					elSub5,
					hasFooter
				} = dis;
				
				const {
					position,
					contentWidth,
					contentMaxWidth,
					contentHeight,
					contentMaxHeight,
					contentMinWidth,
					contentMinHeight,
					offsetTop,
					offsetRight,
					offsetBottom,
					offsetLeft,
					arrow,
					titleOffset
				} = configs;
				
				
				// GET PADDING
				let paddingTop;
				let paddingBottom;
				let paddingRight;
				let paddingLeft;
				let elSub5ComputedStyles;
				try {
					elSub5ComputedStyles = window.getComputedStyle(elSub5, null);
				}
				catch(e) {
					elSub5ComputedStyles = null;
				}
				
				if(elSub5ComputedStyles === null){
					// error broser tidak mensupport {{getComputedStyle}}
					return "11";
				}
				else{
					paddingTop = parseInt(elSub5ComputedStyles.getPropertyValue("padding-top") || "0px");
					paddingRight = parseInt(elSub5ComputedStyles.getPropertyValue("padding-right") || "0px");
					paddingBottom = parseInt(elSub5ComputedStyles.getPropertyValue("padding-bottom") || "0px");
					paddingLeft = parseInt(elSub5ComputedStyles.getPropertyValue("padding-right") || "0px");
				}
				
				dis.paddingTop = paddingTop;
				dis.paddingBottom = paddingBottom;
				dis.paddingLeft = paddingLeft;
				dis.paddingRight = paddingRight;
				
				// GET PARENT WIDTH AND HEIGHT
				const availableWidth = elParent.clientWidth - offsetLeft - offsetRight;
				const availableHeight = elParent.clientHeight - offsetTop - offsetBottom;
				
				// ada kemungkinan availableWidth atau availableHeight adalah 0 atau < yang dibutuhkan
				// kondisi ini dapat terjadi karena pendefinisiaan {{elParent}} yang tidak valid
				// hal ini seperti {{elParent}} yang memiliki lebar terlalu kecil
				// ketika ini tidak terpenuhi, akan diassign dis.errorMsg
				// fungsi akan mereturn {{string msg}} untuk nantinya diproses pada fungsi parent
				const reqAvailableWidth = (dev_contentPadding * 2) + 13; // 13 adalah font size
				const reqAvailableHeight = dev_contentPadding + (!hasFooter ? dev_contentPadding : dev_footerHeight);
				if(availableWidth < reqAvailableWidth){
					return "12";
				}
				if(availableHeight < reqAvailableHeight){
					return "13";
				}
			
				
				dis.parentWidth = availableWidth;
				dis.parentHeight = availableHeight;
				
				
				// DEFINE USED MAX WIDTH AND MAX HEIGHT
				let usedWidth;
				let usedHeight;
				let usedMaxWidth;
				let usedMaxHeight;
				let usedMinWidth;
				let usedMinHeight;
				
				(()=>{ // DEFINE WIDTH AND HEIGHT
					// PADA PENDEFINISIAN INI, SPASE UNTUK ARROW DAN OFFSET TIDAK DIKALKULASIKAN
					// HAL INI KARENA VALUE TERSEBUT BELUM TENTU DIAPPLY
					if(contentWidth){
						const requiredSpace = contentWidth  + paddingRight + paddingLeft;
						if(requiredSpace <= availableWidth){
							usedWidth = requiredSpace;
						}
						else{
							usedWidth = availableWidth;
						}
					}
					else{
						if(contentMinWidth){
							const requiredSpace = contentMinWidth + paddingRight + paddingLeft;
							if(requiredSpace <= availableWidth){
								usedMinWidth = requiredSpace;
							}
							else{
								usedMinWidth = availableWidth;
							}		
						}
						
						if(contentMaxWidth){
							const requiredSpace = contentMaxWidth + paddingRight + paddingLeft;
							if(requiredSpace <= availableWidth){
								usedMaxWidth = requiredSpace;
							}
							else{
								usedMaxWidth = availableWidth;
							}						
						}
						else{
							usedMaxWidth = availableWidth;
						}
						
						if(usedMinWidth){
							if(usedMinWidth > usedMaxWidth){
								usedMinWidth  = usedMaxWidth;
							}
						}
					}
					
					
					if(contentHeight){
						let requiredSpace = paddingTop + contentHeight;
						if(!hasFooter){
							requiredSpace += paddingBottom;
						}
						else{
							requiredSpace += dev_footerHeight;
						}
						
						if(requiredSpace <= availableHeight){
							// ukuran mencukupi
							usedHeight = requiredSpace;
						}
						else{
							// ukuran tidak mencukupi
							usedHeight = availableHeight - (hasFooter ? dev_footerHeight : 0);
						}
					}
					else{
						if(contentMinHeight){
							const requiredSpace = paddingTop + contentMinHeight;
							if(!hasFooter){
								requiredSpace += paddingBottom;
							}
							else{
								requiredSpace += dev_footerHeight;
							}
							
							if(requiredSpace <= availableHeight){ // ukuran mencukupi
								usedMinHeight = requiredSpace;
							}
							else{ // ukuran tidak mencukupi
								usedMinHeight = availableHeight - (hasFooter ? dev_footerHeight : 0);
							}
						}
						
						if(contentMaxHeight){
							let requiredSpace = paddingTop + contentMaxHeight;
							if(!hasFooter){
								requiredSpace += paddingBottom;
							}
							else{
								requiredSpace += dev_footerHeight;
							}
							
							if(requiredSpace <= availableHeight){ // ukuran mencukupi
								usedMaxHeight = requiredSpace;
							}
							else { // ukuran tidak mencukupi
								usedMaxHeight = availableHeight - (hasFooter ? dev_footerHeight : 0);
							}
						}
						else{
							usedMaxHeight = availableHeight - (hasFooter ? dev_footerHeight : 0);
						}
						
						if(usedMinHeight){
							if(usedMinHeight > usedMaxHeight){
								usedMinHeight = usedMaxHeight;
							}
						}
					}
				})();
				(()=>{ // SET WIDTH YANG TELAH DIDAPATKAN KE EL SCROLLABLE W2 (SUB4), SESUAI DENGAN REQUIRED OV SCROLLBAR
					// width
					if(usedWidth){
						elSub4.style.width = usedWidth + "px";
					}
					else{
						if(usedMinWidth){
							elSub4.style.minWidth = usedMinWidth + "px";
						}
						elSub4.style.maxWidth = usedMaxWidth + "px";
					}
					
					// height
					if(usedHeight){
						elSub4.style.height = usedHeight + "px";
					}
					else{
						if(usedMinHeight){
							elSub4.style.minHeight = usedMinHeight + "px";
						}
						elSub4.style.maxHeight = usedMaxHeight + "px";
					}
				})();
				(()=>{ // CREATE OVERLAY SCROLLBAR
					// hingga sekarang, tidak terdapat configurasi apapun yang diberikan kepada user terkait overlay scrollbar
					// jadi, semua configurasi terkait overlay scrollbar bersifat predefined
					const os_instance = new ftOverlayScrollbarV1.create(elSub3, {
						yThumbMarginTop : 3,
						yThumbMarginRight : 3,
						yThumbMarginBottom : hasFooter ? 0 : 3,
						xThumbMarginLeft : 3,
						xThumbMarginRight : 3, 
						xThumbMarginBottom : hasFooter ? 0 : 3
						
						/* gunakan default:
							yPosition : "right",
							yThumbMarginLeft : 0,				tidak perlu karena posisi di lock ke right
							thumbSize : 5,							
							thumbColor : "black", 
							thumRunded : true, 
							autoHide : true,		
						*/
					}, null);
						
					// karena proses Init tooltips sendiri harus dipanggil ketika dimensi telah siap (fontLoaded),
					// init ov scrollbar bisa langsung dilakukan.
					os_instance.init();
				})();
				(()=>{ // APPENDS ARROW
					if(arrow){
						const el = createElem({t : "span", c : Prefix + "r"});
						
						// secara default koordinat arrow dibuat 0 pada css
						// ini berlaku untuk titleOffset == -1 atau 0
						// ketika terdapat titleOffset, posisi perlu diset (inline) sesuai vaue titleOffset
						if(titleOffset){
							const property = position === "left" ? "right" : position === "right" ? "left" : position === "top" ? "bottom" : "top";
							el.style[property] = titleOffset + "px";
						}
						
						// untuk posisi relative ke title, ini tidak bisa dilakuka disini,
						// proses akan dilakukan setelah posisi content diketahui,
						// hal ini karena arrow relative ke content
						
						appends(elSub1, el);
						dis.elArrow = el;
					}
				})();
				(()=>{ // ADD CLASSES
					const classes = [];
					classes.push("w--p" + (configsGetOptionIndex(configsData, "position", position, 1))); // posisi
					el.className += " "+ classes.join(" ");
				})();
				
				// UPDATE POSITION
				const runAndGetStateUpdatePosition = updatePosition(dis);
				if(typeIsString(runAndGetStateUpdatePosition)){
					return runAndGetStateUpdatePosition;
				}
				
				(()=>{ // add resize
					const instance = new ftResizeObserverV1(elSub2, {
						// onStart : (dis)=>{},
						// onChange : (dis)=>{},
						onStop : (ro_instance)=>{
							updatePosition(dis);
						}
					}, {
						stopDelay : 300
					});
					instance.observe();
				})();
			
			};	
			const updatePosition = (dis)=>{
				const {el, elParent, configs, elTitle,elSub1, elSub2, elArrow}= dis;
				const {position, offsetLeft, offsetRight, offsetBottom, offsetTop, titleOffset, arrow} = configs;
				
				// MENENTUKAN LEFT AND RIGHT CONTENT
				// SEBELUM ITU, CHECK DUKUNGAN CLIENT RECT
				const parentRects = elemGetOffsetToDocument(elParent);
				if(parentRects === null){
					return "14";
				}
				
				const parentLeft = parentRects.left;
				const parentRight = parentRects.right;
				const parentTop = parentRects.top;
				const parentBottom = parentRects.bottom;
				const titleWidth = elTitle.offsetWidth;
				const titleHeight = elTitle.offsetHeight;
				const titleHalfWidth = titleWidth / 2;
				const titleHalfHeight = titleHeight / 2;
				const contentWidth = elSub2.offsetWidth;
				const contentHeight = elSub2.offsetHeight;
				const contentHalfWidth = contentWidth / 2;
				const contentHalfHeight = contentHeight / 2;
				
				const titleRects = elemGetOffsetToDocument(elTitle);
				const titleLeft = titleRects.left;
				const titleRight = titleRects.right;
				const titleTop = titleRects.top;
				const titleBottom = titleRects.bottom;
				const titleLeftToParent = Math.abs(titleLeft - parentLeft) - offsetLeft;
				const titleRightToParent = Math.abs(titleRight - parentRight) - offsetRight;
				const titleTopToParent = Math.abs(titleTop - parentTop) - offsetTop;
				const titleBottomToParent = Math.abs(titleBottom - parentBottom) - offsetBottom;
				
				
				let displayArrow = false;
				let applyTitleOffset = false;
				const isTop = position === "top";
				const isBottom = position === "bottom";
				const isLeft = position === "left";
				const isRight = position === "right";
				
				(()=>{
					// MENGATUR POSISI SEUSAI CONFIGURASI POSISI
					const distance = isBottom ? titleBottomToParent : isTop ? titleTopToParent : isLeft ? titleLeftToParent : titleRightToParent;
					const contentSize = isBottom || isTop ? contentHeight : contentWidth;
					const titleSize = isBottom || isTop ? titleHeight : titleWidth;
					const property = isTop ? "bottom" : isBottom ? "top" : isLeft ? "right" : "left";
					const propertyForTitleOffset =  isTop ? "paddingBottom" : isBottom ? "paddingTop" : isLeft ? "paddingRight" : "paddingLeft";
					
					// value berikut digunakan untuk style koordinat sub1
					let value = 0;
					
					// sampai disini, value adalah 0, ini adalah posisi dimana titleOffset === -1
					// posisi akan dibuat seperti titleOffset == -1 jika ruang tidak mencukupi untuk offset dan arrow
					
					// selanjutnya, lihat apakah content dapat ditampilkan pada posisi sesuai configs atau tidak
					// minimal tanpa arrow dan titleOffset
					const fullSpace = titleSize + distance;
					if(contentSize > fullSpace){ 
						// ruang tidak mencukupi untuk menampilkan konten sesuai posisi,
						value = (contentSize - fullSpace) * -1;
					}
					else{
						// ruang mencukupi
						if(titleOffset !== -1){
							// fullspace menggunakan baru, hal ini karena ketika terdapat offset atau arrow, origin bukan lagi disis atas title (jika bottom),
							// melainkan disi bawah titile.
							const newFullSpace = distance;
							
							if(contentSize + titleOffset <= newFullSpace){
								applyTitleOffset = true;
								
								// cek ruang untuk arrow
								// dengan berada pada skope ini, arrow sendiri hanya akan ditampilkan jika ruang titleOffset terpenuhi
								if(arrow){
									if(contentSize + titleOffset + dev_arrowSize <= newFullSpace){
										displayArrow = true;
										
										// set posisi sub 1 yang sebelumnya adalah seperti tanpa titleOffset ke seperti titleOffset === 0
										// untuk selanjutnya, {{applyTitleOffset}} akan diterapkan dengan cara menambahkan padding pada sisi yang seharusnya
										value = (titleSize - 1);
									}
									// else,
									// do nothing, tetap 0
								}
							}
							// else,
							// do nothing, tetap 0
							// titleOffset tidak memungkinkan untuk diterapkan
						}
						// else,
						// do nothing,
						// tetap 0
					}
					
					if(applyTitleOffset){
						elSub1.style[propertyForTitleOffset] = (titleOffset + (displayArrow ? dev_arrowSize : 0)) + "px";
					}
					elSub1.style[property] = value + "px";
				})();
				
				// MENGATUR POSISI TERKAIT SELAIN POSISI
				// MISAL POSISI ADALAH BOTTOM DAN TOP, INI MENGATUR LEFT DAN RIGHT
				(()=>{
					const isVer = isBottom || isTop;
					const contentSize = isVer ? contentWidth : contentHeight;
					const contentHalf = contentSize / 2;
					const titleSize = isVer ? titleWidth : titleHeight;
					const titleHalf = titleSize / 2;
					const titleSide1ToParent = isVer ? titleLeftToParent : titleTopToParent; // jari sisi title (top / left) title ke parent (top / left)
					const titleSide2ToParent = isVer ? titleRightToParent : titleBottomToParent; // jari sisi title (bottom / right) title ke parent (bottom / right)
					const titleHalfSide1ToParent = titleSide1ToParent + titleHalf;
					const titleHalfSide2ToParent = titleSide2ToParent + titleHalf;
					
					const property = isVer ? "left" : "top";
					let value = titleHalf;
					if(titleHalfSide1ToParent >= contentHalf && titleHalfSide2ToParent >= contentHalf){ // posiible to center or middle
						value -= contentHalf;
					}
					else{
						if(titleHalfSide1ToParent < contentHalf){ // sisi 1 tidak cukup
							value -= titleHalfSide1ToParent;
						}
						else{ // sisi 2 tidak cukup
							value -= (contentHalf + (contentHalf - titleHalfSide2ToParent));
						}
					}
					elSub1.style[property] = value + "px";
					
					if(displayArrow){
						let usedValue = (value * -1) + titleHalf - (dev_arrowHeight / 2);
						if(usedValue < 0){
							usedValue = 0;
						}
						if(usedValue > contentSize - dev_arrowHeight){
							usedValue = contentSize - dev_arrowHeight;
						}
						elArrow.style[property] = usedValue + "px";
					}
				})();
					
				// UPDATE CLASSES
				// ARROW
				if(displayArrow){
					addClasses(el, "w--ar1");
				}
				else{
					removeClasses(el, "w--ar1");
				}
			};
			
			return main;
		})();
		return{
			id : Id,
			configsData : DConfigsData,
			create : Create
		}
	})();
	const FT_OverlaySideV1 = (()=>{
		/*	ALUR PROGRAM
				1.	PEMBUATAN INSTANCE new FT_OverlaySideV1.create(id, configs, configsData, el)
					const instance = new ftOverlaySideV1.create("id", {
						position						:	"left", "right",
						contentWidth					:	336,
						closerLocation				:	"header",
						headerTitle					:	"",
						headerTitleAlign			:	"left",
						headerBg						:	"white",
						scrollbar_thumbColor		:	"black",
						scrollbar_autoHide			:	true,
						onShowStart					:	(dis)=>{}
						onShowEnd					:
						onHideStart					:
						onHideEnd					:
					}, configsData, el);
				
				
					RETURN {{ItemInstance}}
						id
						showed
						ontransition
						configs
						configsData
						width
						contentWidth
						el1
						el2
						el3
						contents			
						
							SAMPAI DISINI, HAMPIR SEMUA PROSES TELAH DILAKUKAN
							ADAPUN PROSES YANG BELUM DILAKUKAN ADALAH APPLY {{FT_OverlayScrollbarV1}}
							{{FT_OverlayScrollbarV1}} sendiri mengahruskan elemen telah terappend, 
							jadi, ini akan dilakukan pada proses {{Init}}
							
				2.	Init:	
					*	Mengapply {{FT_OverlayScrollbarV1}}
					*	Proses harus dipanggil setelah elemen terappend
					*	Tambahan property pada this
						-	dis.elContent		:	elemen overlay scrollbar content
					*	appends dis.contents dan remove property
		
		
		
			ERROR:	(FT_OverlaySideV1_ + num)
				1. Process {{Create}}: el tidak memiliki classes, tidak ditemukan el children (w2)
				2.	Process {{Create}}: el tidak memiliki classes, tidak ditemukan w2 children (w3)
				3.	Process {{Create}}: el memiliki classes, tidak ditemukan children dengan class w2 (w-12b)
				4.	Process {{Create}}: el memiliki classes, tidak ditemukan children dengan class w3 (w-12c)
				5.	Process {{Init}}: el belum diappend
		
		
		
		
			RETURN 
				id
				items										:	Object by name {{itemInstance}} yang dibuat
				configsData
				create										:	(id, configs, configsData, el)
																	*	id	(string)
																		harus unik. digunakan sebagai property pada RETURN{{items}}
																		ini harus didefinisikan. ini tidak divalidasi. jadi pastikan terdefinisi dan valid
																	*	configs
																	*	configsData
																	
																	
																	*	el (element) || null
																		-	BERUPA ELEMENT TANPA CLASS.
																			ini umumnya digunakan pada pembuatan elemen baru
																			struktur element minimal 3 level
																			<div>
																				<div>
																					<div>
																					
																			atau 4 level
																			<div>
																				<div>
																					<div>
																						<div/>
																						<div/>
																						<div/>
																						
																			untuk yang 4 level, level ke-4 adalah contents
																			level ke 4 yang diambil sebagai contents hanya berupa elemen, bukan nodes
																			
																		-	BERUPA ELEMENT DENGAN CLASS.
																			ini digunakan untuk elemen yang sudah dibuat sebelumnya
																			adapun struktur bisa 3 atau 4 level seperti sebelumnya
																			<div class='w-12a'>
																				<div class='w-12b'>
																					<div class='w-12c'>
																						<div/>
																						<div/>
																			
																			fungsi dengan class ini diperuntukkan jika elemen yang telah tersedia memiliki children lainnya 
																			misal;
																			<div class='w-12a'>
																				<div class='others'/>
																				<div class='w-12b'>
																					<div class='w-12c'>
																			
																			disini, pastikan others tidak mempengarui dimensi elemen
																						
																		-	BERUPA NULL
																			-	elemen akan didefinisikan baru	
																		
																		
																		-	elemen harus telah terappend
																			script {{FT_OverlaySideV1}} tidak mengharuskan element terappend pada keadaan awal,
																			hal ini karena skript akan mendefinisikan dimensi tanpa mengambil dimensi elemen.
																			namun, fungsi ini menggunakan fungsi {{FT_OverlayScrollbarV1}},										
		*/
		const getByClass = p_elemGetByClass;
		const elemGetChildren = p_elemGetChildren;
		const elemGetChildrenByClass = p_elemGetChildrenByClass;
		const hasClass = p_elemHasClass;
		const createElem = p_elemCreateElem;
		const appends = p_elemAppends;
		const configsCreate = p_configsCreate;
		const configsValidate = p_configsValidate;
		const configsAssignAll = p_configsAssignAll;
		const configsCloneProperties = p_configsCloneProperties;
		const configsGetOptionIndex = p_configsGetOptionIndex;
		const configsGetPrefixedProperties = p_configsGetPrefixedProperties;
		
		const screenWidth = g_screenWidth;
		const screen = p_screen;
		const createTextNode = p_elemCreateTextNode;
		const insertFirstChild = p_elemInsertFirstChild;
		const addClasses = p_elemAddClasses;
		const removeClasses = p_elemRemoveClasses;
		const typeIsString = p_typeIsString;
		const objClone = p_objClone;

		
		const ftSkins = FT_Skins;
		const ftOverlayScrollbarV1 = FT_OverlayScrollbarV1;
		const ftOverlayScrollbarV1ConfigsData = ftOverlayScrollbarV1.configsData;
		
		const seFontReg = SE_fontReg;
		
		const Prefix_configsOverlayScrollbarV1 = "scrollbar";
		const dev_contentPaddingByQuery = screen.max(359) ? 10 : 20; 
		// pada aset kerangka, padding responsiver dibuat menjadi 10 ketika layar max 359
		// ketentuan ini mungkin diberlakukan untuk semua kerangka
		// disini, padding konten untuk layar besar dibuat 20 dan 10 untuk layar kecil 
		const dev_headerCloserFaWidth = 16; // lebar fa closer untuk header, sesuaikan jika perlu
		const dev_headerCloserDistanceToHeaderTitle = 20; // jarak closer header ke tititle yang diinginkan
		const dev_headerCloserEmptySpace = 30;	// lebar empty space ketika lokasi closer pada header
		const dev_outsideCloserEmptySpace = 40; // lebar empty space ketika lokasi closer pada outside
		
		
		const Id = "12";
		const Prefix = "w-" + Id;
		const Items = {};
		const DisErrorReturn = (msg)=>{
			throw "FT_OverlaySideV1_" + msg;
		};
		const DConfigsDataForOverlayScrollbar = (()=>{
			const obj = objClone(ftOverlayScrollbarV1ConfigsData);
			obj.yThumbMarginTop.value = 5;
			obj.yThumbMarginBottom.value = 5;
			return obj;
		})(); 			
		const DConfigsData = (()=>{
			const newData = configsCreate([
				["position", 1, "left", ["left", "right"]],
				["contentWidth", 3, 336],
				["closerLocation", 1, "header", ["header", "outside"]],
				["headerTitle", 1, ""],
				["headerTitleAlign", 1, "left", ["left", "right"]],
				["headerBg", 1, "white", ftSkins.getItems(true, true, true, null)],
				["onShowStart", 4, null],
				["onShowEnd", 4, null],
				["onHideStart", 4, null],
				["onHideEnd", 4, null]
			]);
			configsCloneProperties(newData, ftOverlayScrollbarV1.configsData, ["thumbColor", "autoHide"], null, Prefix_configsOverlayScrollbarV1);
			return newData;
		})();
		const Create = (()=>{
			const Main = function(id, configs, configsData, el){
				const usedConfigsData = configsData ? configsData : DConfigsData;
				configsValidate(configs, usedConfigsData);
				configsAssignAll(usedConfigsData, configs);
				
				const	dis = this;
							dis.id = id;
							dis.showed = false;
							dis.ontransition = false;
							dis.configs = configs;
							dis.configsData = usedConfigsData;
							
				const {position,closerLocation,contentWidth,headerTitle,headerTitleAlign,headerBg} = configs;	
				dis.width = (()=>{
					// mendefinsikan {{dis.width}} dan {[dis.contentWidth}}
					// {{dis.contentWidth}} mungkin tidak sama dengan {{dis.configs.contentWidth}}
					
					const paddingSpace = (dev_contentPaddingByQuery * 2);
					let usedContentWidth = contentWidth;
					let usedWidth = usedContentWidth + paddingSpace;
					const emptySpace = closerLocation === "header" ? dev_headerCloserEmptySpace : dev_outsideCloserEmptySpace;
					if(usedWidth > screenWidth - emptySpace){
						usedWidth = screenWidth - emptySpace;
						usedContentWidth = usedWidth - paddingSpace;
					}
					
					dis.contentWidth = usedContentWidth;
					return usedWidth;
				})();
							
				
				const isHeaderCloser = closerLocation === "header";
				const hasHeader = isHeaderCloser ||  headerTitle;	
				let dom1;
				let dom2;
				let dom3;
				let domContents;
				if(el){
					if(!hasClass(el, Prefix + "a")){
						dom1 = el;
						dom2 = elemGetChildren(dom1, 0);
						if(!dom2){
							DisErrorReturn(1);
						}
						
						dom3 = elemGetChildren(dom2, 0);
						if(!dom3){
							DisErrorReturn(2);
						}
						
						addClasses(dom1, Prefix + "a");
						addClasses(dom2, Prefix + "b");
						addClasses(dom3, Prefix + "c");
						
						domContents = elemGetChildren(dom3);
					}
					else{
						dom1 = el;
						dom2 = elemGetChildrenByClass(dom1, Prefix + "b", 0);
						if(!dom2){
							DisErrorReturn(3);
						}
						dom3 = elemGetChildrenByClass(dom2, Prefix + "c", 0);
						if(!dom3){
							DisErrorReturn(4);
						}	
						
						domContents = elemGetChildren(dom3);
					}					
				}
				else{
					createElem({
						c : Prefix + "a",
						cs : [
							{
								c : Prefix + "b",
								cs : [
									{
										c : Prefix + "c",
										f : (elem)=>{
											dom3 = elem;
										}
									}
								],
								f : (elem)=>{
									dom2 = elem;
								}
							}
						],
						f : (elem)=>{
							dom1 = elem;
						}
					});
				}
				
				dis.el1 = dom1;
				dis.el2 = dom2;
				dis.el3 = dom3;
				dis.contents = domContents;
				
				(()=>{ // W1
					const	classes = [];
								classes.push("w--p" + (position === "left" ? 1 : 2));
								classes.push("w--cl" + (isHeaderCloser ? 1 : 2));							// lokasi closer
								classes.push("w--h" + (hasHeader ? 1 : 0));									// ketersediaan header
								classes.push("w--ha" + configsGetOptionIndex(usedConfigsData, "headerTitleAlign", headerTitleAlign, 1));
								if(hasHeader){
									classes.push("w--hc" + (isHeaderCloser && headerTitle ? 2 : 1));		// jumlah konten pada header
								}
								classes.push("w--hb" + (headerBg === "white" ? 0 : 1));
					
					const oldClass = dom1.className;
					dom1.className = (oldClass ? oldClass + " " : "") + classes.join(" ");
					
					dom1.onmousedown = (e)=>{
						// ketika menggunakan onclick, untuk kasus user mengklik area inner > menyeret mouse ke emptyspace > melepas mouse, evet akan tereksekusi
						// hal ini mungkin disebabkan oleh target event berubah untuk setiap event (down, move, up, klik)
						// jadi, pada kondisi awal, sebenarnya target klik bukan empty space namun ketika user menyeret ke empty space, target pada klik telah berubah ke empty space
						_OnClickEmptySpace(dis, e);
					};
				})();
				(()=>{ // W2
					const width = dis.width;
					dom2.style.width = width + "px";
					dom2.style[position] = "-" + (width + 10) + "px";
				})();	
				(()=>{ // W3
					
				})();
				(()=>{ // APPEND CLOSER AND HEADER
					const width = dis.width;
					const elCloser = createElem({
						t : "button",
						c : "w-nostyle " + Prefix + "cl",
						cs : [
							{
								t : "i",
								c : !isHeaderCloser ? "fas fa-times" : ("fas fa-arrow-" + position)
							}
						],
						f : (elem)=>{
							elem.onclick = (e)=>{
								e.preventDefault();
								dis.hide();
							};
							
							if(!isHeaderCloser){
								elem.style[position] = (width + 15) + "px";
								// disini, jarak closer dibuat 15px ke sisi kontent
								// dengan fontSize 18px, lebar icon adalah += 13px;
								// adapun emptySpace telah diset sebesar 40px pada script sebelumnya
								// jadi, jarak closer ke sisi empty adalah minimal sebesar 40 - (15 + 14) = 40 - 29 = 11px
							}
						}
					});	
					const elHeader = !hasHeader ? null : createElem({
						c : Prefix + "h " + ftSkins.createClassString(headerBg),
						f : (elem)=>{		
							if(isHeaderCloser){
								appends(elem, elCloser);	
								let	usedPadding = dev_contentPaddingByQuery;
										usedPadding += dev_headerCloserFaWidth; 
										usedPadding += dev_headerCloserDistanceToHeaderTitle;											
										elem.style["padding" + (position === "left" ? "Left" : "Right")] = usedPadding + "px";
							}
							if(headerTitle){
								appends(elem, createElem({
									t : "span",
									c : Prefix + "ht",
									cs : createTextNode(headerTitle)
								}));
							}
						}
					});	
					if(isHeaderCloser){
						appends(elHeader, elCloser);
					}
					else{
						appends(dom1, elCloser);
					}
								
					if(elHeader){
						insertFirstChild(dom2, elHeader);
					}						
				})();	
				
				Items[id] = dis;
			};
			Main.prototype.init = function(){
				const dis = this;
				const {el1, el3, configs} = dis;
				
				// Untuk kepentingan overlay scrollbar
				// elemen harus telah diappends
				if(!el1.parentNode){
					DisErrorReturn(5);
				}
				
				
				(()=>{ // DEFINE OVERLAY SCROLLBAR
					const os_el = createElem({
						cs : [
							{
								cs : [
									{
										f : (elem)=>{
											dis.elContent = elem;
											
											// appends contents jika tersedia
											if(dis.contents){
												for(const c of dis.contents){
													appends(elem, c);
												}
												
												delete dis.contents;
											}
										}
									}
								]
							}
						]
					});
					ftOverlayScrollbarV1.assignClasses(os_el);
					appends(el3,  os_el);
					seFontReg((fontLoaded)=>{
						const scrollbarConfigs = configsGetPrefixedProperties(null, configs, Prefix_configsOverlayScrollbarV1);
						const instance = new ftOverlayScrollbarV1.create(os_el, scrollbarConfigs, DConfigsDataForOverlayScrollbar);
						instance.init();
					});
				})();
			};
			Main.prototype.setOpener = function(el){
				const dis = this;
				el.onclick = (e)=>{
					e.preventDefault();
					dis.show();
				};
			};
			Main.prototype.setContent = function(content){
				const dis = this;
				const {elContent} = dis;
				elContent.innerHTML = "";
				if(typeIsString(content)){
					elContent.innerHTML = content;
				}
				else{
					appends(elContent, content);
				}
			};
			Main.prototype.show = function(){
				const dis = this;
				if(!dis.ontransition){
					if(!dis.showed){
						dis.ontransition = true;
						addClasses(dis.el1, "w-show");
						const {onShowStart, onShowEnd} = dis.configs;
						if(onShowStart){
							onShowStart(dis);
						}
						setTimeout(()=>{
							if(onShowEnd){
								onShowEnd(dis);
							}
							dis.ontransition = false;
							dis.showed = true;
						}, 520);
					}
				}
			};
			Main.prototype.hide = function(){
				const dis = this;
				if(!dis.ontransition){
					if(dis.showed){
						dis.ontransition = true;
						removeClasses(dis.el1, "w-show");
						const {onHideStart, onHideEnd} = dis.configs;
						if(onHideStart){
							onHideStart(dis);
						}
						
						setTimeout(()=>{
							if(onHideEnd){
								onHideEnd(dis);
							}
							dis.ontransition = false;
							dis.showed = false;
						}, 520);
					}
				}
			};
			
			const _OnClickEmptySpace = (dis, e)=>{
				if(e.target === dis.el1){
					dis.hide();
				}
			};
			return Main;
		})();
		const AssignClasses = (el)=>{
			addClasses(el, Prefix + "a");
			addClasses(el.children[0], Prefix + "b");
			addClasses(el.children[0].children[0], Prefix + "c");
		};
		return {
			id : Id,
			items : Items,
			configsData : DConfigsData,
			create : Create,
			assignClasses : AssignClasses
		}
	})();	
	
	const FT_alertMsg = (()=>{ // MSG LIKE INPUT XML FIRST MESSAGE (ERROR MSG)
		/* PEMBUATAN
				const alertMsg_instance = new ftAlertMsg.create({
					id 							: null,										
					content 					: null,												
					contentWidth 			: -1,																			
					contentAlign 				: "center",								
					parent 						: null,												
					lazy 							: true,										
					onShowStart 				: null,										
					onShowEnd				: null, 										
					onHideStart 				: null, 										
					onHideEnd 				: null									
				});
		*/
		const addClasses = p_elemAddClasses;
		const removeClasses = p_elemRemoveClasses;
		const appends = p_elemAppends;
		const getByClass = p_elemGetByClass;
		const typeIsString = p_typeIsString;
		const removeElem = p_elemRemove;
		const configsCreate = p_configsCreate;
		const configsValidate = p_configsValidate;
		const configsAssignAll = p_configsAssignAll;
		
		const body = d_body;
		
		const Id = "91";
		const Prefix = "w-" + Id;
		const Items = {}; // item yang telah dibuat (memiliki id)
		const ConfigsData = configsCreate([
			["id", 1, ""],
			["content", 1, ""],
			["msgType", 1, "info", ["simple", "warning", "info"]],
			["contentWidth", 3, -1],
			["contentAlign", 1, "center", ["left", "center", "right", "justify"]],
			["parent", 1, null],
			["lazy", 2, true],
			["onShowStart", 4, null],
			["onShowEnd", 4, null],
			["onHideStart", 4, null],
			["onHideEnd", 4, null],
			["closeButton", 2, true]
		]);
		const Create = (()=>{
			const main = function(configs, configsData){
				const usedConfigsData = configsData ? configsData : ConfigsData;
				configsValidate(configs, usedConfigsData);
				configsAssignAll(usedConfigsData, configs);
				
				const dis = this;
				const {id, lazy, parent} = configs;
				const elParent = parent || body;
				dis.assetId = Id;
				dis.id = id;
				dis.ontransition = false;
				dis.showed = false;
				dis.configs = configs;
				dis.configsData = usedConfigsData;
				dis.elParent = elParent;
				dis.el = _DefineEl(dis);
				
				if(id){
					Items[id] = dis;
				}
				if(!lazy){
					appends(elParent, dis.el);
				}
			};
			main.prototype.open = function(callback){
				const dis = this;
				const {onShowStart, onShowEnd} = dis.configs;
				if(!dis.showed){
					if(!dis.ontransition){
						dis.ontransition = true;
						if(onShowStart){
							onShowStart(dis);
						}
						
						const dom = dis.el;
						appends(dis.elParent, dom);
						setTimeout(()=>{
							addClasses(dom, "w-show");
							setTimeout(()=>{
								dis.ontransition = false;
								dis.showed = true;
								if(onShowEnd){
									onShowEnd(dis);
								}
								if(callback){
									callback(dis);
								}
							}, 700);
						}, 20);
					}
				}
			};
			main.prototype.close = function(callback){
				const dis = this;
				const {onHideStart, onHideEnd} = dis.configs;
				if(dis.showed){
					if(!dis.ontransition){
						dis.ontransition = true;
						if(onHideStart){
							onHideStart(dis);
						}
						
						const dom = dis.el;
						removeClasses(dom, "w-show");
						setTimeout(()=>{
							dis.ontransition = false;
							dis.showed = false;
							if(onHideEnd){
								onHideEnd(dis);
							}
							
							if(callback){
								callback(dis);
							}
						}, 700);
					}
				}
			};
			main.prototype.assignOpener = function(elem, callback){
				const dis = this;
				elem.onclick = (e)=>{
					e.preventDefault();
					dis.open(callback);
				}
			};
			main.prototype.assignCloser = function(elem, callback){
				const dis = this;
				elem.onclick = (e)=>{
					e.preventDefault();
					dis.close(callback);
				}
			};	
			main.prototype.setContent = function(content){
				const dis = this;
				const elContentWrap = getByClass(dis.el, Prefix + "d", 0);
				elContentWrap.innerHTML = "";
				if(typeIsString(content)){
					elContentWrap.innerHTML = content;
				}
				else{
					appends(elContentWrap, content);
				}
			};		
			main.prototype.remove = function(){
				const dis = this;
				if(dis.el.parentNode){
					removeElem(dis.el);
				}
				if(dis.id){
					Items[dis.id] = null;
				}
			};			
			
			const _DefineEl = (()=>{
				const createElem = p_elemCreateElem;
				const typeIsString = p_typeIsString;
				const appends = p_elemAppends;
				const insertFirstChild = p_elemInsertFirstChild;
				const getByClass = p_elemGetByClass;
				const configsGetOptionIndex = p_configsGetOptionIndex;
				
				const prefix = Prefix;
				const main = (dis)=>{
					const {configs, configsData} = dis;
					const {
						id,
						content,
						msgType,
						contentWidth,
						contentAlign,
						parent,
						lazy,
						onShowStart,
						onShowEnd,
						onHideStart,
						onHideEnd,
						closeButton
					} = configs;
	
					
					const el = createElem({
						c : (()=>{
							const 	classes = [prefix + "a"];
										classes.push("w--ca" + (configsGetOptionIndex(configsData, "contentAlign", contentAlign, 1)));
										classes.push("w--mst" + (configsGetOptionIndex(configsData, "msgType", msgType, 1)));
										
							return classes.join(" ");
						})(),
						f : (elem)=>{								
							appends(elem, createElem({
								c : prefix + "b",
								cs : [
									{
										c : prefix + "c",
										f : (elem)=>{
											if(closeButton){
												const btn = createElem({
													t : "button",
													c : prefix + "cl",
													cs : [
														{
															t : "i",
															c : "fas fa-times"
														}
													]
												});
												appends(elem, btn);
												btn.onclick = (e)=>{
													e.preventDefault();
													dis.close();
												};
											}
											
											appends(elem, createElem({
												c : prefix + "d",
												f : (elem)=>{
													if(content){
														if(typeIsString(content)){
															elem.innerHTML = content;
														}
														else{
															appends(elem, content);
														}
													}
													if(contentWidth !== -1){
														elem.style.width = contentWidth;
													}
												}
											}));
										
											if(contentWidth > 0){
												elem.style.width = contentWidth + "px";
											}
										}
									}
								]
							}));
						}
					});
					
					if(id){
						el.id = prefix + "-"+ id;
					}
					
					return el;
				};
				return main;
			})();	
			
			return main;
		})();
		
		
		const obj = {
			id : Id,
			items : Items,
			configsData : ConfigsData,
			create : Create
		};	
		return obj;
	})();
	
	// {{ON_INIT_REG}}
	SE_initReg(()=>{ // {add_body_classes}}
		const isTouch = g_isTouch;
		const body = d_body;
		
		const	classes = [];
					classes.push((isTouch ? "w-touch" : "w-nontouch"));
		
		const	bodyClassBefore = body.className;
		const	bodyClassNext = (bodyClassBefore ? " " : "") + classes.join(" ");
					body.className += bodyClassNext;
	});
	SE_initReg(()=>{ // {{FontAwesomeLoader}} D:\WEB DEVELOPER\THEMES PROJECT\ASSETS\JS\FontAwesomeLoader.js
		const appends = p_elemAppends;
		const createElem = p_elemCreateElem;
		const head = d_head;
		const wijsVars = g_wijsVars;
		const {fontAwesomeUrl} = wijsVars;
		
		const link_tag = createElem({t:"link"});
		link_tag.rel = "stylesheet";
		link_tag.media = "only x";
		link_tag.href = fontAwesomeUrl;
		appends(head, link_tag);
		setTimeout(()=>{link_tag.media="all"});
	});
	SE_initReg(()=>{ // {{FontChecker}} D:\WEB DEVELOPER\THEMES PROJECT\ASSETS\JS\FontChecker.js
		// Fungsi ini akan memanggil {{SE_fontExecute}} setelah proses checker selesai
		
		// requireds
		const body = d_body;
		const createElem  = p_elemCreateElem;
		const appends = p_elemAppends;
		const removeElem = p_elemRemove;
		
		let timeout = 5000; 
		const intervalTime = 200;
		

		// BUAT ELEMENT CHECKER
		// Terdapat 2 buah element checker,
		// elem 1 adalah element tanpa style font, element ini akan memiliki font yang terapply pada body
		// elem 2 adalah element dengan style font, element ini memiliki font selalu sans-serif (sesuai fallback body)
		// algoritma:
		// cek lebar kedua checker, jika lebar kedua checker berbeda, ini artinya font telah terload
		
		const 	elInner = "mmmmmmmmmm"; // khususnya untuk font poppins, m memiliki perbedaan width dengan sans-sarif
		const	el1 = createElem({});
					el1.innerHTML = elInner;
					el1.style.top = "0px";
					el1.style.left = "0px";
					el1.style.visibility = "hidden";
					el1.style.position = "absolute";
					el1.style.display = "inline-block";
					
		const	el2 = createElem({});
					el2.innerHTML = elInner;
					el2.style.display = "inline-block";
					el2.style.position = "absolute";
					el2.style.top = "0px";
					el2.style.left = "0px";
					el2.style.visibility = "hidden";
					el2.style.fontFamily = "sans-serif";
					
		appends(body, el1);
		appends(body, el2);
		
		const check = () =>{
			if(el1.clientWidth !== el2.clientWidth){
				return true;
			}
			else{
				return false;
			}
		};
		
		let timeSpend = 0;
		const finish = (state)=>{
			clearInterval(runInterval);
			removeElem(el1);
			removeElem(el2);
			SE_fontLoaded = state;
			SE_fontExecute(state);
			
		};
		const runInterval = setInterval(()=>{
			timeSpend += intervalTime;
			const results = check();
			if(!results){
				if(timeSpend >= timeout){
					finish(results);
				}
				// else, run next interval, do nothings
			}
			else{
				finish(results);
			}
		}, intervalTime);
	});
	
	
	if(g_wijsBlog.isCAT){
		SE_readyReg(()=>{			
			const elMainContainer = p_elemGetById("w-main-w2");
			const elUserDetail = p_elemGetById("w-user-detail");
			const elHeaderInfo =p_elemGetById("w-header-info");
			const elInfoNoPeserta = p_elemGetById("w-info-no-peserta-value");
			const elInfoNamaPeserta = p_elemGetById("w-info-nama-peserta-value");
			const elInfoBatasWaktu = p_elemGetById("w-info-batas-waktu-value");
			const elInfoJumlahSoal = p_elemGetById("w-info-jumlah-soal-value");
			const elInfoTelahDijawab = p_elemGetById("w-info-telah-dijawab-value");
			const elInfoBelumDijawab = p_elemGetById("w-info-belum-dijawab-value");
			const elInfoSisaWaktuJam = p_elemGetById("w-info-sisa-waktu-jam");
			const elInfoSisaWaktuMenit = p_elemGetById("w-info-sisa-waktu-menit");
			const elInfoSisaWaktuDetik = p_elemGetById("w-info-sisa-waktu-detik");
			
			const ALL_DATA = {
				/*
				memberNumber				:	nomor peserta
				sessionPin							:	pinSesi
				questions 							:
					TWK
					TIU
					TKP
					ALL
					displayed
					answeredCount
					elPanel
				isCorectionMode				:		boolean, terassign ketika user menclick "koreksi lagi"
				finished
				timeInterval
				timeLeft							:	[jam, menit, detik]
				*/
			};
			
			const STEP1_loadAssets = (()=>{
				/* ALUR 
					1. loadRequiredAssets
					2. loadAsyncAssets
					3. NEXT OR ALERT ERROR
				*/
				const createElem = p_elemCreateElem;
				const appends = p_elemAppends;
				const head = d_head;

				const main = ()=>{
					loadRequiredAssets();
				};
				const loadRequiredAssets = (()=>{
					// PERTAMA-TAMA,
					// LOAD ASSETS YANG BERSIFAT REQUIREDMENT,
					// ASET TIDAK BOLEH DILOAD SECARA ASINC
					// URUTAN ASSET JUGA HARUS BERURUTAN					
					const data = [
						{
							name : "XLSX Core",
							url : "https://unpkg.com/xlsx/dist/xlsx.full.min.js"
						},
						{
							name : "File Saver",
							url : "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
						},
						{
							name : "TableExport",
							url : "https://unpkg.com/tableexport/dist/js/tableexport.min.js"
						}
					];
					const loadAsset = (aset)=>{
						const 	script = createElem({t : "script"});
									script.async = false;
									script.onload = ()=>{
										const asetIndex = data.indexOf(aset);
										if(asetIndex !== data.length - 1){
											loadAsset(data[asetIndex + 1]);
										}
										else{
											loadAsyncAssets();
										}
									};
									script.onerror = ()=>{
										showErrorMsg();
									};
									script.src = aset.url;
									
						appends(head, script);
					};
					const main = ()=>{
						loadAsset(data[0]);
					};
					return main;
				})();
				const loadAsyncAssets = (()=>{
					const assets = [
						{
							name : "Soal TWK",
							url : dev_definition_urlSoalTWK
						},
						{
							name : "Soal TIU",
							url : dev_definition_urlSoalTIU
						},
						{
							name : "Soal TKP",
							url : dev_definition_urlSoalTKP
						},
						{
							name : "MathJax",
							url : dev_definition_urlMathJax
						}
					];
					const loadedStates = [];
					for(const a of assets){
						loadedStates.push(null);
					}
					
					const main = ()=>{
						// definisikan maxjax config
						window.MathJax = {
							startup : {
								typeset : false
							},
							chtml : {
								scale: 1,                      			// global scaling factor for all expressions
								minScale: .5,                  		// smallest scaling factor to use
								matchFontHeight: true,         // true to match ex-height of surrounding font
								mtextInheritFont: true,       	// true to make mtext elements use surrounding font
								merrorInheritFont: true,      // true to make merror text use surrounding font
								mtextFont: 'Arial',                 	// font to use for mtext, if not inheriting (empty means use MathJax fonts)
								merrorFont: 'serif',           // font to use for merror, if not inheriting (empty means use MathJax fonts)
								mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
								skipAttributes: {},            // RFDa and other attributes NOT to copy to the output
								exFactor: .5,                  // default size of ex in em units
								displayAlign: 'center',        // default for indentalign when set to 'auto'
								displayIndent: '0'             // default for indentshift when set to 'auto'
							},
							options: {
								renderActions: {
									addMenu: []
								}
							}
						};		
						
						
						const len = assets.length;
						for(let i=0;i<len;i++){
							const	script = createElem({t : "script", i : "script-assets-" + (i + 1)});
										script.src = assets[i].url;
										script.async = true;
										script.onload = (e)=>{
											loadedStates[i] = true;
											runNextStep();
										};
										script.onerror = (e)=>{
											loadedStates[i] = false;
											runNextStep();
										};
									
							appends(head, script);
						}
					};
					
					const runNextStep = ()=>{
						if(loadedStates.indexOf(false) !== -1){
							showErrorMsg();
						}
						else{
							if(loadedStates.indexOf(null) !== -1){
								// do nothing
								// masih menunggu yang lainnya
							}
							else{
								STEP2_ambilSoal();
							}
						}
					};
					return main;
				})();
				const showErrorMsg = ()=>{
					alert("Terjadi kesalahan saat meload aset, refresh halaman untuk memuat ulang !");
				};
				return main;
			})();
			const STEP2_ambilSoal = (()=>{
				const getRandomIndexs = p_getRandomIndexs;
				const main = ()=>{
					const data = [
						{
							group : "TWK",
							items : window.DATA_QUESTION_TWK,
							quota : dev_output_jumlahSoalTWK
						},
						{
							group : "TIU",
							items : window.DATA_QUESTION_TIU,
							quota : dev_output_jumlahSoalTIU
						},
						{
							group : "TKP",
							items : window.DATA_QUESTION_TKP,
							quota : dev_output_jumlahSoalTKP
						}
					];
					
					const questions = {
						answeredCount : 0,
						unAnsweredCount : 0,
						panelGroups : [],
						ALL : []
					};
					const len = data.length;
					for(let i=0;i<len;i++){
						const d = data[i];
						const {group, items, quota} = d;
						const count = quota <= items.length ? quota : items.length;
						questions[group] = [];
						
						const holder = questions[group];
						if(!dev_output_acakSoal){
							for(let j=0;j<count;j++){
								holder.push(items[j]);
							}
						}
						else{
							const randomIndexs = getRandomIndexs(items.length, count);
							for(const index of randomIndexs){
								holder.push(items[index]);
							}
						}
						
						questions.unAnsweredCount += count;
						questions.ALL = questions.ALL.concat(holder);
					}
					
					ALL_DATA.questions = questions;
					STEP3_defineSoalDOM();
				};
				return main;
			})();
			const STEP3_defineSoalDOM = (()=>{
				const createElem = p_elemCreateElem;
				const appends = p_elemAppends;
				
				const prefix = "w-q-";
				const main = ()=>{
					const tandai_jawaban = dev_definition_tandai_jawaban;
					const questions = ALL_DATA.questions;
					const data = [questions.TWK, questions.TIU, questions.TKP];
					let numLeft = 0;
					for(const d of data){
						const len = d.length;
						for(let i=0;i<len;i++){
							const item = d[i];
							const num = numLeft + (i + 1);
							const elItem = createElem({
								c : prefix + "item",
								i : prefix + "item" + num,
								cs  : [
									{
										c : prefix + "group",
										n : item.group,
									},
									{
										c : prefix + "clue",
										n : item.clue || "",
									},
									{
										c : prefix + "num",
										cs : [
											{
												t : "span",
												n : "Soal No. "
											},
											{
												t : "span",
												i : prefix + "num-value",
												n : num,
											}
										]
									},
									{
										c : prefix + "content" + (item.content ? "" : " w-dnone"),
										n : item.content || ""
									},
									{
										t : "form",
										c : prefix + "options",
										f : (elem)=>{
											
											const alphabet = ["A", "B", "C", "D", "E"];
											const len = 5;
											item.elOptions = [];
											for(let j=0;j<len;j++){
												const id = num + "-" + (j + 1);
												const elItem = createElem({c : "w-item"});
												if(tandai_jawaban){
													if(item.scores[j] === 5){
														elItem.className += " w--benar";
													}
												}
												
												const elInput = createElem({
													t : "input",
													i : prefix + "option-" + id,
													c : prefix + "option"
												});
												elInput.name =  prefix + "option-" + num,
												elInput.value = j + 1;
												elInput.type = "radio"
												
												const elLabel = createElem({t : "label", n : "<span>" + alphabet[j] + ".</span><span>"+ item.option[j] +"</span>"});
												elLabel.setAttribute("for", prefix + "option-" + id);
												appends(elItem, elInput);
												appends(elItem, elLabel);
												appends(elem, elItem);
												
												item.elOptions.push(elInput);
											}
										}
									}
								]
							});	
							item.el = elItem;
							item.num = num;
						}
						
						numLeft += len;
					}
					
					STEP5_processUserDetail();
				};
				return main;
			})();
			const STEP5_processUserDetail = (()=>{
				const win = g_win;
				const getById = p_elemGetById;
				const getByClass = p_elemGetByClass;
				const removeElem = p_elemRemove;
				const addClasses = p_elemAddClasses;
				const removeClasses = p_elemRemoveClasses;
				const body = d_body;
				const bodyMirror = d_bodyMirror;
				const ftTooltips = FT_TooltipsV1;
				const ftButton = FT_Button;
				const ftOverlaySideV1 = FT_OverlaySideV1;
				const ftAlertMsg = FT_alertMsg;
				const appends = p_elemAppends;
				
				
				const main = ()=>{
					// kebutuhan css khusus
					addClasses(body, "ws-userdetailpage");
				
					
					// PROCESS MENU
					(()=>{
						const el = getById("w-header-menu-tooltips");
						const tooltips_instance = new ftTooltips.create(
							el,
							{
								position 							: 	"left",
								titleOffset 							: 	0,
								arrow								:	true,
								contentWidth						:	160,
								contentMaxWidth				:	null, 
								contentHeight					:	null, 
								contentMaxHeight				:	null, 
								offsetTop							:	0,
								offsetRight						:	0,
								offsetBottom						:	0,
								offsetLeft							:	0, 
							
								putLinkToContent				:	"touch-only",
								moreLinkUrl						:	"",
								moreLinkText						:	"",
								moreLinkStyle					:	"inline",
								moreLinkButon_boxType		:	"solid",
								moreLinkButon_skin			:	"main",
								moreLinkButon_rounded		:	false,
								moreLinkButon_align			:	"justify"
							}, 
							null, 
							null,
							// callbacks
							{
								onReady : (tooltips_instance)=>{
									// Fungsi akan dieksekusi ketika tooltips telah diproses, (dimensi, posisi, dll)
									// fungsi ini akan terpanggil ketika proses onmouseover selesai tereksekusi (tanpa error)
									// hal ini mungkin dibutuhkan untuk memproses konten tooltips
								}
							}
						);	

						tooltips_instance.init();				
						// console.log(tooltips_instance);
					})();
					
					// BUAT MODAL SUMBER SOAL
					(()=>{
						const elToggle = getById("w-toggle-questions-sources-info");
						const instance = new ftOverlaySideV1.create("questionSources", {
							position						:	"right",
							contentWidth					:	320,
							closerLocation				:	"outside",
							headerTitle					:	"",
							headerTitleAlign			:	"left",
							headerBg						:	"white",
							scrollbar_thumbColor		:	"black",
							scrollbar_autoHide			:	true,
							onShowStart					:	null,
							onShowEnd					:	null,
							onHideStart					:	null,
							onHideEnd					:	null
						}, null, null);
						
						appends(body, instance.el1);
						
						SE_finishReg((loaded)=>{
							instance.init();
							instance.setContent(""+
								"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada arcu condimentum nibh placerat, iaculis vehicula lacus ultricies. " +
								"Etiam ex nunc, tempor sit amet pharetra ac, dignissim eu velit. Etiam in nisi vel sem sollicitudin molestie. Cras pretium massa at nisl ornare gravida. "+
								"Sed augue erat, molestie sit amet lectus eget, ultricies sollicitudin magna. Cras vulputate pretium pulvinar. " +
								"Etiam eget euismod dui. Phasellus dictum gravida dui, sed gravida elit luctus non. Aenean aliquam nibh porttitor semper lacinia. " +
								"In metus dui, malesuada sit amet metus sed, laoreet bibendum enim. "+
								"<br/><br/>" +
								"Quisque consectetur finibus pretium. Aenean porttitor, tortor a aliquet placerat, turpis ante pharetra nunc, et accumsan felis neque ut enim. "+
								"Ut scelerisque sit amet nisl non consequat. Sed in arcu ac elit interdum ornare maximus in sapien." +
								"Morbi sit amet lorem a eros tristique consequat id et augue. Suspendisse ut libero imperdiet, aliquet ante ut, egestas lacus. "+
								"Integer vel luctus turpis. Maecenas in sodales mauris. Cras ultrices pellentesque ex, lobortis pellentesque libero ullamcorper sollicitudin. "
							);
							instance.setOpener(elToggle);
						});
						
					})();
					
					// TAMPILKAN
					removeClasses(body, "w-loading");					
					
					const elNIK = getById("w-input-nik");
					const elNoPeserta = getById("w-input-no-peserta");
					const elPin = getById("w-input-pin");
					const elPinSesi = getById("w-input-pin-sesi");
					const elButton = getById("w-start-button");
					
					// TAMBAHKAN ONINPUT UNTUK MENGHAPUS MSG JIKA TERSEDIA
					// HAL INI DIBUTUHKAN KETIKA USER MENGINPUT NILAI YANG TIDAK VALID DAN MEREVISINYA
					(()=>{
						const inputsWithValidating = [];
						if(dev_definition_nomorPeserta){
							inputsWithValidating.push({
								elInput : elNoPeserta,
								elMsg :  getByClass(elNoPeserta.parentNode, "w-msg", 0)
							});
						}
						if(dev_definition_pinSesi){
							inputsWithValidating.push({
								elInput : elPinSesi,
								elMsg :  getByClass(elPinSesi.parentNode, "w-msg", 0)
							});
						}
						if(inputsWithValidating.length !== 0){
							for(const i of inputsWithValidating){
								i.elInput.oninput = (e)=>{
									i.elMsg.innerHTML = "";
								};
							}
						}
					})();
					
					elButton.onclick = (e)=>{
						e.preventDefault();
					
						// LAKUKAN VALIDASI DISINI,
						// KETIKA TIDAK VALID, ALERT DAN RETURN
						// ...........................
						const validateMsg = (()=>{
							const dataValidating = [];
							if(dev_definition_nomorPeserta){
								const disData = {};
								disData.elInput = elNoPeserta;
								
								if(dev_definition_nomorPeserta.indexOf(elNoPeserta.value) === -1){
									disData.msg = "Nomor peserta tidak dikenali!";
								}
								dataValidating.push(disData);
							}
							if(dev_definition_pinSesi){
								const disData = {};
								disData.elInput = elPinSesi;
								if(dev_definition_pinSesi !== elPinSesi.value){
									disData.msg = "PIN sesi tidak benar!";
								}
								dataValidating.push(disData);
							}
							
							return dataValidating;
						})();
						let hasInvalidData = false;
						for(const d of validateMsg){			
							const elItem = d.elInput.parentNode;			// elInput pasti tersedia jika terdapat item	
							const elMsg = getByClass(elItem, "w-msg", 0);
							if(d.msg){
								elMsg.innerHTML = "<span>"+ d.msg +"</span>";
								hasInvalidData = true;
							}
							else{
								elMsg.innerHTML = "";
							}
						}
						if(hasInvalidData){
							// setidaknya terdapat 1 data yang bermasalah
							return;
						}
						else{
							// valid, assign data nomor peserta dan sesi (jika tersedia)
							if(dev_definition_nomorPeserta){
								ALL_DATA.memberNumber = elNoPeserta.value;
							}
							if(dev_definition_pinSesi){
								ALL_DATA.pinSesi = elPinSesi.value;
							}
						}
						
						// TAMBAHKAN EVENT UNLOAD WINDOW YANG MENCEGAH TAP DITUTUP
						ALL_DATA.beforeunload = (e)=>{
							e.preventDefault();
							e.returnValue = '';
						};
						win.addEventListener("beforeunload", ALL_DATA.beforeunload);

						
						// UPDATE HEADER INFO
						(()=>{
							const soal = ALL_DATA.questions;
							const jumlahSoal = soal.TIU.length + soal.TWK.length + soal.TKP.length;
							
							elInfoNoPeserta.innerHTML = elNoPeserta.value;
							elInfoNamaPeserta.innerHTML = "Nama anda";
							elInfoBatasWaktu.innerHTML =   Math.round(dev_definition_waktuKeseluruhan);     // sebelum (jumlahSoal * dev_definition_waktuUntuk1Soal) / 60; --> jumlah menit
							elInfoJumlahSoal.innerHTML = jumlahSoal;
							elInfoTelahDijawab.innerHTML = "0";
							elInfoBelumDijawab.innerHTML = jumlahSoal;
						})();
						
						// DEFINE SISA WAKTU
						(()=>{
							const soal = ALL_DATA.questions;
							const jumlahSoal = soal.TIU.length + soal.TWK.length + soal.TKP.length;
							const periode = Math.round(dev_definition_waktuKeseluruhan * 60); // sebelum  jumlahSoal * dev_definition_waktuUntuk1Soal; --> jumlah detik
							
							const start = Date.now();
							const end = start + (periode * 1000);
		
							const initialHourInfo = Math.floor(periode / 60 / 60);
							const initialMinuteInfo = Math.floor(periode / 60) - (initialHourInfo * 60);
							const initialSecondInfo = periode - (initialMinuteInfo * 60) - ((initialHourInfo * 60) * 60);
		
							elInfoSisaWaktuJam.innerHTML = initialHourInfo;
							elInfoSisaWaktuMenit.innerHTML = initialMinuteInfo >= 10 ? initialMinuteInfo : "0" + initialMinuteInfo;
							elInfoSisaWaktuDetik.innerHTML = initialSecondInfo >= 10 ? initialSecondInfo : "0" + initialSecondInfo; 
							
							ALL_DATA.timeLeft = [initialHourInfo,initialMinuteInfo,initialSecondInfo];
							
							const updateTimes = ()=>{
								const time = Date.now();
								if(time < end){
									const timeSpend = time - start;
									const timeSpendInSecond = Math.floor(timeSpend / 1000);
									const timeLeft = periode - timeSpendInSecond;
									
									const hourInfo = Math.floor(timeLeft / 60 / 60);
									const minuteInfo = Math.floor(timeLeft / 60) - (hourInfo * 60);
									const secondInfo = timeLeft - (minuteInfo * 60) - ((hourInfo * 60) * 60);
							
									if(hourInfo !== initialHourInfo){
										elInfoSisaWaktuJam.innerHTML = hourInfo;
									}
									
									if(minuteInfo !== initialMinuteInfo){
										elInfoSisaWaktuMenit.innerHTML = minuteInfo >= 10 ? minuteInfo : "0" + minuteInfo;
									}
							
									if(secondInfo !== initialSecondInfo){
										elInfoSisaWaktuDetik.innerHTML = secondInfo >= 10 ? secondInfo : "0" + secondInfo; 
									}
								
									ALL_DATA.timeLeft = [hourInfo, minuteInfo, secondInfo];
								}
								else{
									clearInterval(ALL_DATA.timeInterval);
									ALL_DATA.timeLeft = [0,0,0];
									if(!ALL_DATA.finished){
										FN_showResults();
									}
								}
							};
							
							ALL_DATA.timeInterval = setInterval(updateTimes, 1000);
						})();
						
						
						// DEFINE NUTTON FINHISH NOW TOOLTIPS
						(()=>{
							const elMoreInfo = getById("w-info-more");
							const tootips_instance = new ftTooltips.create(
								elMoreInfo,
								{
									position 							: 	"left",
									titleOffset 							: 	0,
									arrow								:	true,
									contentWidth						:	200,
									contentMaxWidth				:	null, 
									contentHeight					:	null, 
									contentMaxHeight				:	null, 
									offsetTop							:	0,
									offsetRight						:	0,
									offsetBottom						:	0,
									offsetLeft							:	0, 
								
									putLinkToContent				:	"touch-only",
									moreLinkUrl						:	"",
									moreLinkText						:	"",
									moreLinkStyle					:	"inline",
									moreLinkButon_boxType		:	"solid",
									moreLinkButon_skin			:	"main",
									moreLinkButon_rounded		:	false,
									moreLinkButon_align			:	"justify"
								}, 
								null, 
								null,
								// callbacks
								{
									onReady : (tooltips_instance)=>{
										// Fungsi akan dieksekusi ketika tooltips telah diproses, (dimensi, posisi, dll)
										// fungsi ini akan terpanggil ketika proses onmouseover selesai tereksekusi (tanpa error)
										// hal ini mungkin dibutuhkan untuk memproses konten tooltips
									}
								}
							);
							
							const elFinishButton = ftButton.create({
								title 						: 	"Selesai sekarang",
								url 						: 	"#",
								skin 						: 	"main",
								boxType				:	"solid",
								rounded				:	false,
								fullWidth				:	true,
								align						:	"center",
								size						:	"normal"
							}, null);
							elFinishButton.onclick = (e)=>{
								e.preventDefault();
								let msg;
								let buttonTitle;
								if(ALL_DATA.questions.answeredCount < ALL_DATA.questions.ALL.length){
									msg = "Anda masih memiliki pertanyan yang belum dijawab !";
									buttonTitle = "Batalkan";
								}
								else{
									msg = "Semua pertanyaan telah dijawab. Anda masih memiliki sisa waktu untuk melakukan koreksi !";
									buttonTitle = "Koreksi lagi";
								}
								
								
								FN_showFinishMsg(msg, buttonTitle);
							};
							
							appends(tootips_instance.elSub5, elFinishButton);
							
							tootips_instance.init();
						})();
						
						removeElem(elUserDetail);
						removeClasses(body, "ws-userdetailpage");
						addClasses(body, "ws-questionpage");
						addClasses(elHeaderInfo, "w-show");
						
						// tanpilkan blog log
						// removeClasses(getById("w-header-logo").getElementsByTagName("IMG")[0], "w-dnone");
						
						STEP5_appendSoal();
					};
				
				};
				return main;
			})();
			
			const STEP5_appendSoal = (()=>{
				const createElem = p_elemCreateElem;
				const appends = p_elemAppends;
				const ftButton = FT_Button;
				const addClasses = p_elemAddClasses;
				const removeClasses = p_elemRemoveClasses;
				const getById = p_elemGetById;
				const ftAlertMsg = FT_alertMsg;
				const main = ()=>{
					const questions = ALL_DATA.questions;
					const data = [questions.TWK, questions.TIU, questions.TKP];
					const elWrap = createElem({i : "w-questions"});
					let numLeft = 0;
					for(const d of data){
						for(const i of d){
							appends(elWrap, i.el);
						}
					}
					
					
					const alertMsg_instance = new ftAlertMsg.create({
						id 							: 	"actsMsg",										
						content 					: 	null,	
						msgType					:	"info",
						contentWidth 			: 	-1,																			
						contentAlign 				: 	"center",								
						parent 						: 	null,												
						lazy 							: 	true,										
						onShowStart 				: 	null,										
						onShowEnd				:	null, 										
						onHideStart 				: 	null, 										
						onHideEnd 				: 	null									
					});
					
					const elActs = createElem({
						i : "w-questions-acts",
						f : (elem)=>{
							const elSave  = ftButton.create({
								title 						: 	"Simpan dan lanjutkan",
								url 						: 	"#",
								skin 						: 	"main",
								boxType				:	"solid",
								rounded				:	false,
								fullWidth				:	false,
								align						:	"center",
								size						:	"normal"
							}, null);
							elSave.id = "w-questions-acts-save";
							const elSkip  = ftButton.create({
								title 						: 	"Lewati soal ini",
								url 						: 	"#",
								skin 						: 	"main",
								boxType				:	"solid-border",
								rounded				:	false,
								fullWidth				:	false,
								align						:	"center",
								size						:	"normal"
							}, null);
							elSkip.id = "w-questions-acts-skip";
							
							const getNextNum = ()=>{
								let num;
								const questions = ALL_DATA.questions.ALL;
								const displayed = ALL_DATA.questions.displayed;
								const currentIndex = questions.indexOf(displayed);
								const len = questions.length;
								for(let i=currentIndex+1;i<len;i++){
									const item = questions[i];
									if(item.selected === undefined){
										num = item.num;
										break;
									}
								}
								
								
								if(num === undefined){
									for(let i=0;i<currentIndex;i++){
										const item = questions[i];
										if(item.selected === undefined){
											num = item.num;
											break;
										}
									}
								}
								
								return num;				
							};
							
							
							elSave.onclick = (e)=>{
								e.preventDefault();
								
								// CHECK CHECKED OPTIONS
								const displayedQuestion = ALL_DATA.questions.displayed;
								const elOptions = displayedQuestion.elOptions;
								const lastCheckedOptionIndex = displayedQuestion.selected;
								
								let checkedOption;
								for(const e of elOptions){
									if(e.checked){
										checkedOption = e;
										break;
									}
								}
								
								if(!checkedOption){
									alertMsg_instance.setContent("Pilih salah satu opsi sebelum menyimpan !");
									alertMsg_instance.open();
								}
								else{
									const newCheckedOptionIndex =  elOptions.indexOf(checkedOption);
									if(newCheckedOptionIndex !== lastCheckedOptionIndex){
										displayedQuestion.selected = newCheckedOptionIndex;
									}
									
									if(lastCheckedOptionIndex === undefined){
										ALL_DATA.questions.answeredCount += 1;
										ALL_DATA.questions.unAnsweredCount -= 1;
										elInfoTelahDijawab.innerHTML = ALL_DATA.questions.answeredCount;
										elInfoBelumDijawab.innerHTML = ALL_DATA.questions.unAnsweredCount;
										addClasses(displayedQuestion.elPanel, "w-answered");
									}
									
									
									
									const nextNum = getNextNum();
									if(nextNum !== undefined){
										FN_showQuestion(nextNum);
									}
									else{
										// Ini artinya, semua telah dijawab
										if(!ALL_DATA.isCorectionMode){
											FN_showFinishMsg("Semua pertanyaan telah dijawab. Anda masih memiliki sisa waktu untuk melakukan koreksi !", "Koreksi lagi");
										}
										else{
											// TAMPILKAN NEXT
											const allQuestions = ALL_DATA.questions.ALL;
											const displayedNum = displayedQuestion.num;
											const nextDisplayedNum = displayedNum < allQuestions.length ? (displayedNum + 1) : 1;
											FN_showQuestion(nextDisplayedNum);
										}
									}
								}
							};						
							elSkip.onclick = (e)=>{
								e.preventDefault();
								
								// CHECK CHECKED OPTIONS
								const displayedQuestion = ALL_DATA.questions.displayed;
								const elOptions = displayedQuestion.elOptions;
								const selectedOption = displayedQuestion.selected;
								let checkedOption;
								for(const e of elOptions){
									if(e.checked){
										checkedOption = e;
										break;
									}
								}
								
								if(selectedOption === undefined){
									if(checkedOption){
										checkedOption.checked = false;
									}
								}
								else{
									// TERDAPAT OPSI YANG DIPILIH SEBELUMNYA
									// DISINI, ADA KEMUNGKINAN USER TELAH MELAKUKAN PERUBAHAN
									// HAL INI DAPAT DIIDENTIFIKASI DENGAN CARA MEMBANDINGKAN SELECTED INDEX DAN PROPERTI SELECTED
									const checkedIndex = elOptions.indexOf(checkedOption);
									if(checkedIndex !== selectedOption){
										// USER MELAKUKAN PERUBAHAN NAMUN MENGKLIK LEWATI, 
										// PERUBAHAN AKAN DIABAIKAN
										checkedOption.checked = false;
										elOptions[selectedOption].checked = true;
									}
								}
								
								
								const nextNum = getNextNum();
								if(nextNum !== undefined){
									FN_showQuestion(nextNum);
								}
								else{
									if(selectedOption === undefined){
										alertMsg_instance.setContent("Hanya soal ini yang belum dijawab !");
										alertMsg_instance.open();
									}
									else{
										// Kondisi ini tidak akan tersedia,
										// Kenapa ?
										// Pada scope ini, semua soal telah dijawab, ketika semua soal telah dijawab, pesan finish akan ditampilkan
										// oleh karena itu, mode disini pasti berupa mode koreksi,
										// pada mode koreksi sendiri tombol skip di disable
									}
								}		
							};
							
							appends(elem, elSave);
							appends(elem, elSkip);
						}
					});
					
					
					const elPanel = (()=>{
						const prefix = "w-q-panel-";
						const el = createElem({
							i : prefix + "w1",
							cs : [
								{
									i : prefix + "w2",
									cs : [
										{
											i : prefix + "caption",
											cs : [
												{
													t : "span",
													cs : [
														{
															t : "i",
														},
														{
															t : "span",
															n : "Belum dijawab"
														}
													]
												},
												{
													t : "span",
													cs : [
														{
															t : "i",
														},
														{
															t : "span",
															n : "Telah dijawab"
														}
													]
												}
											]
										},
										{
											i : prefix + "w3",
											f : (elem)=>{
												const questions = ALL_DATA.questions;
												const data = [questions.TWK, questions.TIU, questions.TKP];
												let lenBefore = 0;
												let addedGroup = 0;
												for(const d of data){
													const item0 = d[0];
													if(item0){
														const id = item0.groupAlias; 
														const len = d.length;
														const elGroup = createElem({
															i : prefix + id,
															c : addedGroup === 0 ? "w-active" : false,
															f : (elem)=>{
																for(let i=0;i<len;i++){
																	const item = d[i];
																	const el = createElem({
																		t : "span",
																		c : "w-item",
																		cs : [
																			{
																				t : "span",
																				n : lenBefore + (i + 1)
																			},
																			{
																				t : "span"
																			}
																		]
																	});
																	el.onclick = (e)=>{
																		e.preventDefault();
																		FN_showQuestion(item.num);
																	};
																	appends(elem, el);
																	item.elPanel = el;
																}
															}
														});
														
														appends(elem, elGroup);
														
														
														questions.panelGroups.push({
															el : elGroup,
															startNum : lenBefore + 1,
															endNum : lenBefore + len,
															isActive : addedGroup === 0
														});
														addedGroup += 1;
														lenBefore += len;
													}
												}
											}
										}
									],
									f : (elem)=>{
										appends(elem, createElem({
											i : prefix + "control",
											cs : [
												{
													t : "a",
													i : prefix + "control-prev",
													h : "#",
													cs : [
														{
															t : "i",
															c : "fas fa-arrow-left"
														}
													],
													f : (elem)=>{
														elem.onclick = (e)=>{
															e.preventDefault();
															const panelGroups = ALL_DATA.questions.panelGroups;
															let active;
															for(const p of panelGroups){
																if(p.isActive){
																	active = p;
																	break;
																}
															}
															
															let targetGroup;
															const activeIndex = panelGroups.indexOf(active);
															if(activeIndex !== 0){
																targetGroup = panelGroups[activeIndex - 1];
															}
															else{
																targetGroup = panelGroups[panelGroups.length - 1];
															}
															
															if(targetGroup !== active){
																removeClasses(active.el, "w-active");
																active.isActive = false;
																
																addClasses(targetGroup.el, "w-active");
																targetGroup.isActive = true;
															}
															
														};
													}
												},
												{
													t : "a",
													i : prefix + "control-next",
													h : "#",
													cs : [
														{
															t : "i",
															c : "fas fa-arrow-right"
														}
													],
													f : (elem)=>{
														elem.onclick = (e)=>{
															e.preventDefault();
															const panelGroups = ALL_DATA.questions.panelGroups;
															let active;
															for(const p of panelGroups){
																if(p.isActive){
																	active = p;
																	break;
																}
															}
															
															let targetGroup;
															const activeIndex = panelGroups.indexOf(active);
															if(activeIndex !== panelGroups.length - 1){
																targetGroup = panelGroups[activeIndex + 1];
															}
															else{
																targetGroup = panelGroups[0];
															}
															
															if(targetGroup !== active){
																removeClasses(active.el, "w-active");
																active.isActive = false;
																
																addClasses(targetGroup.el, "w-active");
																targetGroup.isActive = true;
															}
														};
													}
												}
											]
										}));
										
									}
								}
							]
						});
						return el;
					})();
					
					
					const elQuestionsContainer = createElem({
						i : "w-questions-container", 
						cs : elWrap
					});
					const elPanelContainer = createElem({
						i : "w-panel-container",
						cs : elPanel
					});
					

					appends(elWrap, elActs);
					appends(elMainContainer, elQuestionsContainer);	
					appends(elMainContainer, elPanelContainer);
					MathJax.typeset();
					FN_showQuestion(1);
				};
				return main;
			})();
			
			
			const FN_showQuestion = (()=>{
				const removeClasses = p_elemRemoveClasses;
				const addClasses = p_elemAddClasses;
				const main = (num)=>{
					const displayed = ALL_DATA.questions.displayed;
					const allQuestions = ALL_DATA.questions.ALL;
					const target = allQuestions[num - 1];
					if(target){
						if(target !== displayed){
							if(displayed){
								removeClasses(displayed.el, "w-show"); 
								removeClasses(displayed.elPanel, "w-active"); 
							}
							
							addClasses(target.el, "w-show");
							addClasses(target.elPanel, "w-active");
							ALL_DATA.questions.displayed = target;
							
							// open panel
							const panelGroups = ALL_DATA.questions.panelGroups;
							let activePanel;
							for(const p of panelGroups){
								if(p.isActive){
									activePanel = p;
									break;
								}
							}
							
							if(num < activePanel.startNum || num > activePanel.endNum){
								let targetPanel;
								for(const p of panelGroups){
									if(num >= p.startNum && num <= p.endNum){
										targetPanel = p;
										break;
									}
								}
								
								removeClasses(activePanel.el, "w-active");
								activePanel.isActive = false;
								
								addClasses(targetPanel.el, "w-active");
								targetPanel.isActive = true;
							}
						}
					}
				};
				return main;
			})();
			const FN_showResults = (()=>{
				const win = g_win;
				const createElem = p_elemCreateElem;
				const appends = p_elemAppends;
				const bodyMirror = d_bodyMirror;
				const objLoop = p_objLoop;
				const ftButton = FT_Button;
				const getById = p_elemGetById;
				const getByTag = p_elemGetByTag;
				const removeElem = p_elemRemove;
				const addClasses = p_elemAddClasses;
				
				const main = ()=>{
					clearInterval(ALL_DATA.timeInterval);
					
					const resultsData = (()=>{
						const allData = ALL_DATA;
						const questions = allData.questions;
						const dataByGroup = {};
						if(questions.TWK.length !== 0){
							dataByGroup.TWK = {
								items : questions.TWK,
								passingGrade : dev_definition_ambangBatasTWK
							};
						}
						
						if(questions.TIU.length !== 0){
							dataByGroup.TIU = {
								items : questions.TIU,
								passingGrade : dev_definition_ambangBatasTIU
							};
						}
						
						if(questions.TKP.length !== 0){
							dataByGroup.TKP = {
								items : questions.TKP,
								passingGrade : dev_definition_ambangBatasTKP
							};
						}
						
						
						
						
						objLoop(dataByGroup, (group, index, key)=>{
							const count = group.items.length;
							const maxPoin = count * 5;
							const passignGradePoin = group.passingGrade;
							const answered = (()=>{
								let num = 0;
								for(const i of group.items){
									if(i.selected !== undefined){
										num += 1;
									}
								}
								
								return num;
							})();
							const unAnswered = count - answered;
							const poin = (()=>{
								let value = 0;
								for(const i of group.items){
									if(i.selected !== undefined){
										value += i.scores[i.selected];
									}
								}
								
								return value;
							})();
							
							
							group.count = count;
							group.maxPoin = maxPoin;
							group.passignGradePoin = passignGradePoin;
							group.answered = answered;
							group.unAnswered = count - answered;
							group.poin = poin;
							group.state = poin > passignGradePoin;
						});
					
						
						return {
							TWK : dataByGroup.TWK,
							TIU : dataByGroup.TIU,
							TKP : dataByGroup.TKP
						}
					})();
					
					
					// SEND TO FIREBASE ==================
					if(dev_definition_submit_data === "ya"){
						(()=>{
							const db = firebase.database();
							const refPath = "test/" + ALL_DATA.pinSesi + "/" + ALL_DATA.memberNumber +"/";
							const savedData = ["answered", "unAnswered", "poin", "state"];
							const savedDataTranslated = ["terjawab", "tidak terjawab", "nilai", "status"];
							objLoop(resultsData, (group, index, key)=>{
								const refGroup = refPath + key + "/";
								objLoop(group, (g, index, key)=>{
									const keyIndex = savedData.indexOf(key);
									if(keyIndex !== -1){
										const usedKey = savedDataTranslated[keyIndex];
										const refProperty = refGroup + usedKey;
										let usedValue = g;
										// ubah state ke lulus atau tidak lulus
										if(key === "state"){
											if(g){
												usedValue = "lulus";
											}
											else{
												usedValue = "tidak lulus";
											}
										}
										
										const refTarget = db.ref(refProperty);
										// console.log(refProperty);
										// console.log(refTarget);
										refTarget.get().then((snapshot)=>{
											const val = snapshot.val();
											if(!val){
												refTarget.set(usedValue + "");
											}
											else{
												refTarget.set(val + ", " + usedValue + "");
											}
										});
									}
								});
								
								// date
								(()=>{
									const refTarget = db.ref(refPath + "/date/");
									refTarget.get().then((snapshot)=>{										
										const date = new Date();
										const year = date.getFullYear();
										const month = date.getMonth();
										const day = date.getDay();
										const hour = date.getHours();
										const minute = date.getMinutes();
										const usedValue = `${day}/${month}/${year} ${hour}:${minute}`;
										
										const val = snapshot.val();
										if(!val){
											refTarget.set(usedValue);
										}
										else{
											refTarget.set(val + ", " + usedValue);
										}
									});
								})();
							});		
						})();
					}
					// SEND TO FIREBASE ==================
					
					
					// REMOVE CLOSE TAB EVENT
					// TAMBAHKAN EVENT UNLOAD WINDOW YANG MENCEGAH TAP DITUTUP
					setTimeout(()=>{
						win.removeEventListener("beforeunload", ALL_DATA.beforeunload);
					}, 3000);

					
					const prefix = "w-r-";
					const elWrap = createElem({
						c : prefix + "w1",
						cs : [
							{
								c : prefix + "w2",
								cs : [
									{
										c : prefix + "w3",
										cs : [
											{
												c : prefix + "overall",
												f : (elem)=>{
													const lulus = (resultsData.TWK ?  resultsData.TWK.state : true) && (resultsData.TIU ? resultsData.TIU.state : true) && (resultsData.TKP ? resultsData.TKP.state : true);
													const elState = createElem({
														c : lulus ? "w--s1" : "w--s0",
														cs : [
															{
																c : "w-msg",
																n : lulus ? "<span>Lulus</span> <i>Passing Grade</i> !" : "<span>Belum Lulus</span> <i>Passing Grade</i> !"
															},
															{
																c : "w-score",
																cs : [
																	{
																		c : "w-label",
																		n : "NILAI"
																	},
																	{
																		c : "w-value",
																		n : (resultsData.TWK ? resultsData.TWK.poin : 0) + (resultsData.TIU ? resultsData.TIU.poin : 0)  + (resultsData.TKP ? resultsData.TKP.poin : 0) + ""
																	}
																]
															}
														]
													});
													appends(elem, elState);
												}
											},
											{
												c : prefix + "header",
												n : "Detail"
											}
										],
										f : (elem)=>{
											const data = [
												[
													"Kategori Tes", 
													"Jumlah Soal", 
													"Soal Terjawab", 
													"Soal Tidak Terjawab", 
													"Nilai Maksimal", 
													"Nilai <i>Passing Garde</i>", 
													"Nilai Yang Diperoleh", 
													"Status"
												]
											];
											
											if(resultsData.TWK){
												data.push([
													"Test Wawasan Kebangsaan", // Kategori Tes
													resultsData.TWK.count,  // Jumlah Soal
													resultsData.TWK.answered + "", // Soal Terjawab
													resultsData.TWK.unAnswered + "", // Soal Tidak Terjawab
													resultsData.TWK.maxPoin, // Nilai Maksimal
													resultsData.TWK.passignGradePoin, // Nilai Ambang Batas
													resultsData.TWK.poin + "", // Nilai Yang Diperoleh
													resultsData.TWK.state ? "<i class='fas fa-check'></i><span>Lulus</span>" : "<i class='fas fa-times'></i><span>Tidak lulus</span>" // Status
												]);
											}
											
											if(resultsData.TIU){
												data.push([
													"Test Intelegensi Umum", // Kategori Tes
													resultsData.TIU.count,  // Jumlah Soal
													resultsData.TIU.answered + "", // Soal Terjawab
													resultsData.TIU.unAnswered + "", // Soal Tidak Terjawab
													resultsData.TIU.maxPoin, // Nilai Maksimal
													resultsData.TIU.passignGradePoin, // Nilai Ambang Batas
													resultsData.TIU.poin + "", // Nilai Yang Diperoleh
													resultsData.TIU.state ? "<i class='fas fa-check'></i><span>Lulus</span>" : "<i class='fas fa-times'></i><span>Tidak lulus</span>" // Status
												]);											
											}
											
											if(resultsData.TKP){
												data.push([
													"Test Karakter Pribadi", // Kategori Tes
													resultsData.TKP.count,  // Jumlah Soal
													resultsData.TKP.answered + "", // Soal Terjawab
													resultsData.TKP.unAnswered + "", // Soal Tidak Terjawab
													resultsData.TKP.maxPoin, // Nilai Maksimal
													resultsData.TKP.passignGradePoin, // Nilai Ambang Batas
													resultsData.TKP.poin + "", // Nilai Yang Diperoleh
													resultsData.TKP.state ? "<i class='fas fa-check'></i><span>Lulus</span>" : "<i class='fas fa-times'></i><span>Tidak lulus</span>" // Status
												]);			
											}
											
											
											const elTable = createElem({
												t : "table",
												i : prefix + "table",
												cs : [
													{
														t : "tbody",
														f : (elem)=>{
															const len = data.length;
															for(let i=0;i<len;i++){
																const d = data[i];
																const isFirst = i===0;
																const elRow = createElem({
																	t : "tr"
																});
																
																const dataLength = d.length;
																for(let j=0;j<dataLength;j++){
																	const elCell = createElem({
																		t : isFirst ? "th" : "td",
																		n : d[j]
																	});
																	appends(elRow, elCell);
																}
																appends(elem, elRow);
															}
														}
													}
												]
											});
											
											appends(elem, createElem({
												c : prefix + "content",
												cs : elTable
											}));
											
											// ACTS
											appends(elem, createElem({
												i : prefix + "footer",
												c : prefix + "footer"
											}));
										}
									}
								]
							}
						]
					});
					
					bodyMirror.innerHTML = "";
					appends(bodyMirror, elWrap);
					
					
					// pembuatan table export harus dilakukan setelah elemen terappend
					(()=>{
						const table = getById(prefix + "table");
						const tableExportInstance = new TableExport(table, {
							headers: true,                     			 // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
							footers: true,                     			 // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
							formats: ["csv"],    						// (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt']),       (fakta: xlsx tidak didukung, file tidak bisa dibuka di exel)
							filename: (()=>{  // (id, String), filename for the downloaded file, (default: 'id')
								let name = "ALC-CAT-RESULTS";
								if(ALL_DATA.pinSesi){
									name += "-" + ALL_DATA.pinSesi;
								}
								if(ALL_DATA.memberNumber){
									name += "-" + ALL_DATA.memberNumber;
								}
								return name;
							})(),
							bootstrap: false,                   		// (Boolean), style buttons using bootstrap, (default: true)
							exportButtons: true,                		// (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
							position: "bottom",                 		// (top, bottom), position of the caption element relative to table, (default: 'bottom')
							ignoreRows: null,                   		// (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
							ignoreCols: null,                   		// (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
							trimWhitespace: true,               		// (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
							RTL: false,                         				// (Boolean), set direction of the worksheet to right-to-left (default: false)
							sheetname: (()=>{  // (id, String), sheet name for the exported spreadsheet, (default: 'id')
								let name = "ALC-CAT-RESULTS";
								if(ALL_DATA.pinSesi){
									name += "-" + ALL_DATA.pinSesi;
								}
								if(ALL_DATA.memberNumber){
									name += "-" + ALL_DATA.memberNumber;
								}
								return name;
							})()
						});
						
						// library tidak mendukung pembuatan tmbol download manual (masih kuran dimengerti)
						// disini, elemen button akan dipindahkan
						const 	generatedCaption = getByTag(table, "CAPTION", 0);
						const 	generatedButton = getByTag(generatedCaption, "BUTTON", 0);
									generatedButton.innerHTML = "<i class='fas fa-download'></i> Simpan Tabel";
									addClasses(generatedButton, "w-nostyle");
						const 	footer = getById(prefix + "footer");
						
						appends(footer, generatedButton);
						removeElem(generatedCaption);
					})();
					
					
					
					(()=>{
						
					})();
					
					// console.log(ALL_DATA);
				};
				return main;
			})();
			const FN_showFinishMsg = (()=>{
				const createElem = p_elemCreateElem;
				const appends = p_elemAppends;
				const addClasses = p_elemAddClasses;
				const ftButton = FT_Button;
				const ftAlertMsg = FT_alertMsg;
				const getById = p_elemGetById;
				
				let elMsg;
				let elButtonTitle;
				const msgInstance = new ftAlertMsg.create({
					id 							: 	"actsMsgFinish",										
					content 					: 	(()=>{
															const el = createElem({
																cs : [
																	{
																		n : "",
																		f : (elem)=>{
																			elMsg = elem;
																		}
																	}
																],
																f : (elem)=>{
																	const eventOnclickFinish1 = (e)=>{
																		e.preventDefault();
																		elLink.innerHTML = "Anda yakin?";
																		elLink.onclick = eventOnclickFinish2;
																	};
																	const eventOnclickFinish2 = (e)=>{
																		e.preventDefault();
																		ALL_DATA.finished = true;
																		msgInstance.close(()=>{
																			FN_showResults();
																		});
																	};
																	const elWrap = createElem({
																		t : "p",
																		c : "w-clear"
																	});
																	const elButton = ftButton.create({
																		title 						: 	"Koreksi lagi",
																		tag 						: 	"button",
																		url 						: 	"",
																		skin 						: 	"main",
																		icon						: 	"",
																		iconPosition			: 	"left",
																		boxType				:	"solid",
																		rounded				:	false,
																		fullWidth				:	false,
																		align						:	"center",
																		size						:	"small"
																	}, null);
																	const elLink = createElem({
																		t : "a",
																		n : "Selesai sekarang",
																		f : (elem)=>{
																			elem.onclick = eventOnclickFinish1;
																		}
																	});
																															
		
																			
																	
																	elButton.onclick = (e)=>{
																		e.preventDefault();
																		
																		// ada kemungkinan link selesai telah terklik
																		// kembalikan event ke semula 
																		elLink.onclick = eventOnclickFinish1;
																		
																		// maybe disable skip button 
																		const isCorectionMode = ALL_DATA.questions.ALL.length === ALL_DATA.questions.answeredCount;
																		ALL_DATA.isCorectionMode = isCorectionMode;
																		
																		if(isCorectionMode){
																			const actsSkip = getById("w-questions-acts-skip");
																			addClasses(actsSkip, "w-disabled");
																		}
																			
																		msgInstance.close(()=>{
																			// ada kemungkinan link selesai telah terklik
																			// kembalikan inner ke semula
																			elLink.innerHTML = "Selesai sekarang";
																		});
																	};
																	
																	
																	
																	elButton.style.float = "right";
																	elLink.style.float = "left";
																	
																	appends(elWrap, elLink);
																	appends(elWrap, elButton);
																	appends(elem, elWrap);
																	
																	elButtonTitle = elButton.children[0];
																}
															});
															
															return el;
														})(),	
					msgType					:	"simple",
					contentWidth 			: 	320,																			
					contentAlign 				: 	"left",								
					parent 						: 	null,												
					lazy 							: 	true,										
					onShowStart 				: 	null,										
					onShowEnd				:	null, 										
					onHideStart 				: 	null, 										
					onHideEnd 				: 	null,
					closeButton				:	false
				});
					
				const main = (msg, buttonTitle)=>{
					elMsg.innerHTML = msg;
					elButtonTitle.innerHTML = buttonTitle;
					msgInstance.open();
				};
				return main;
			})();
			
			STEP1_loadAssets();
		});
	}
	
	// ONFINISH
	SE_finishReg(()=>{
		if(!g_wijsBlog.isCAT){
			p_elemRemoveClasses(d_body, "w-loading");
		}
	});	
	
	
	// {{ON_INIT_CALL}}
	// pemanggilan ini juga secara otomatis akan mengakseskusi berbagai SE lainnya
	SE_initExecute();

	// {{ON_LOADED_CALL}}
	(()=>{
		const win = g_win;
		const addEvent = p_eventAdd;
		addEvent(win, "load", ()=>{
			setTimeout(()=>{
				SE_loadedExecute();
				// console.log(window.Wi);
			}, 500);
		});
	})();
	
})();


/*]]>*/
