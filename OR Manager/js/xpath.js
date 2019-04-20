function reset() {
	$('#objectname').val('');
	$('#propertyValue').val('');
	$('#propertySelection').val('Xpath');
	$('#name').val('');
	$('#webelement').val('');
}

function cancel() {
//set element array==null
	var nullArray=[];
	chrome.storage.local.set({ 'array': nullArray});
//remove data from all the field
	$('#collapseOne').collapse("show");
	$('#objectname').val('');
	$('#propertyValue').val('');
	$('#propertySelection').val('Xpath');
	$('#name').val('');
	$('#webelement').val('');
	chrome.storage.local.set({ 'xpath': '' });
	chrome.storage.local.set({ 'webElement': '' });
	chrome.storage.local.set({ 'repository': '' });
	chrome.storage.local.set({ 'ObjectName': '' });
	chrome.storage.local.set({ 'customName': '' });
	chrome.storage.local.set({ 'xmlRepository': '' });
	
// disable inspect

chrome.tabs.executeScript(null, { file: 'js/stop.js' });
$('#inspect').removeClass('fa-disabled');
$('#highlight').removeClass('fa-disabled');
$('#reset').removeClass('fa-disabled');
	
$('#stop').addClass('fa-disabled');
$('#stop').removeClass('fa-2x');
$('#stop').css({"color":"black"})
count = 0;
chrome.storage.local.set({ 'count': count});

}

function downloadJson() {
	debugger;
	chrome.storage.local.get('repository', function (Object) {
		var data = JSON.stringify(Object.repository, null, 4);
		if(!(Object.repository===""||Object.repository===undefined||Object.repository===null)){
		var data1 = data.normalize('NFD');
		console.log('data : ', JSON.parse(data));
		var blob = new Blob([JSON.parse(data)], {
			type: 'application/octet-stream'
		});

		url = URL.createObjectURL(blob);
		var link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', 'Object_Repository.json');
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		link.dispatchEvent(event);
	}
	});
}

var count;

function downloadXML(){
    chrome.storage.local.get('xmlRepository', function (Object) {
		var data=Object.xmlRepository;
if(!(data===""||data===undefined)){
    var blob = new Blob( [ data ], {
            type: 'application/octet-stream'
        });
        
    url = URL.createObjectURL( blob );
    var link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', 'Object_Repository.xml' );
		var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	link.dispatchEvent( event );
			}
	});
}





$(function () {
	// chrome.storage.local.get('xpath', function (Object) {
	// 	$('#propertyValue').val(Object.xpath);
	// });
	chrome.storage.local.get('customName', function (Object) {
		$('#propertyValue').val(Object.customName);
	});
	chrome.storage.local.get('webElement', function (Object) {
		$('#webelement').val(Object.webElement);
	});
	chrome.storage.local.get('repository', function (Object) {
		$('#Repository').val(Object.repository);
	});
	chrome.storage.local.get('ObjectName', function (Object) {
		$('#objectname').val(Object.ObjectName);
	});

	chrome.storage.local.get('count', function (Object) {
		count=Object.count;
		if (count == 1) {
			$('#inspect').addClass('fa-disabled');
			// $('#highlight').addClass('fa-disabled');
			// $('#reset').addClass('fa-disabled');
			$('#stop').removeClass('fa-disabled');
			$('#stop').addClass('fa-2x');
			$('#stop').css({"color":"red"})
		}
		else {
			$('#inspect').removeClass('fa-disabled');
			$('#highlight').removeClass('fa-disabled');
			$('#reset').removeClass('fa-disabled');
			$('#stop').addClass('fa-disabled');
			$('#stop').removeClass('fa-2x');
			$('#stop').css({"color":"black"})
		}
	});

	
});





$(function () {
	$('#inspect').click(function () {
		$('#inspect').addClass("fa-disabled");
		// $('#highlight').addClass('fa-disabled');
		// 	$('#reset').addClass('fa-disabled');
			
		$('#stop').removeClass("fa-disabled");
		$('#stop').addClass('fa-2x');
		$('#stop').css({"color":"red"})
		count = 1;
		chrome.storage.local.set({ 'count': count});
		chrome.tabs.executeScript(null, { file: 'js/inspect.js' });
	});
});

var arrayE=[];
	chrome.storage.local.get('array', function (Object) {
		arrayE=Object.array;
	});

	function getXpath(name){
		var array1= arrayE.filter(function(e){
			return e.NameOfElement===name;
		});
		
		var array2= array1[0]["ElementProperty"];
		
		var array3= array2.filter(function(el){
			return el["Type"]==="xpath";
		});
		
		return array3[0]["Value"];
	}

$(function () {
	debugger;
	$('#highlight').click(function () {
		$('#highlight').css({"color":"red"})
		setTimeout(function(){$('#highlight').css({"color":""});},1000);
		var propertyValue = document.getElementById('propertyValue').value;
		propertyValue= getXpath(propertyValue);
	var propertySelection="Xpath"
		//var propertySelection = document.getElementById('propertySelection').value
		chrome.tabs.executeScript(null, {
			code: 'var propertyValue = "' + propertyValue + '";   var propertySelection = "' + propertySelection + '";'
		}, function () {
			chrome.tabs.executeScript(null, { file: 'js/highlight.js' });
		})
	});
});




$(function () {
	$('#reset').click(function () {
		chrome.storage.local.set({ 'xpath': '' });
		chrome.storage.local.set({ 'ObjectName': '' });
		reset();
	})
});

$(function () {
	$('#cancel').click(function () {
		cancel();
	})
});

$(function () {
	$('#downloadJSON').click(function () {
		downloadJson();
	})
});

$(function () {
	$('#downloadXML').click(function () {
		downloadXML();
	})
});

$(function () {
	$('#stop').click(function () {
		chrome.tabs.executeScript(null, { file: 'js/stop.js' });
		$('#inspect').removeClass('fa-disabled');
		$('#highlight').removeClass('fa-disabled');
		$('#reset').removeClass('fa-disabled');
			
		$('#stop').addClass('fa-disabled');
		$('#stop').removeClass('fa-2x');
		$('#stop').css({"color":"black"})
		count = 0;
		chrome.storage.local.set({ 'count': count});
	});
});

//adding logic for loading files here
function readSingleFile(e) {
	cancel();
	debugger;
	var file = e.target.files[0];

	if (!file) {
		return;
	}
	var fileName = e.target.value.split( '\\' ).pop();
	var reader = new FileReader();
	
	reader.onload = function(e) {
		debugger;
				var contents = e.target.result;
				
				
			 
				//Verifying if you are loading the correct OR for this page
				chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
					
								if(String(fileName).endsWith(".json")){

										var temp_contents= JSON.parse(contents);
										if(!(temp_contents.Modules["_xmlns:xsi"]===tabs[0].url)){
											alert("OR doesn't match with current web page");
										}else{
											elementArray=temp_contents.Modules.Element;
											$('#collapseOne').collapse("show");
											chrome.storage.local.set({ 'repository': contents });
											chrome.storage.local.set({ 'array': elementArray});
										}
										
								}else if(String(fileName).endsWith(".xml")){
										var x2js = new X2JS();
										var stringContent=String(contents);
                		contents=handleCharacterReferencesInXML(stringContent);
										var temp_contents = x2js.xml_str2json(contents); // Convert XML to JSON
										if(!(temp_contents.Modules["_xmlns:xsi"]===tabs[0].url)){
											alert("OR doesn't match with current web page");
										}else{
											if(temp_contents.Modules.Element.constructor===Array){
												elementArray= temp_contents.Modules.Element;
											}
											if(temp_contents.Modules.Element.constructor===Object){
												var array=[];
												array.push(temp_contents.Modules.Element);
												elementArray=array;
											}
										var jsonString=JSON.stringify(temp_contents, null, 4);

										
										$('#collapseOne').collapse("show");
										chrome.storage.local.set({ 'repository': jsonString });
										chrome.storage.local.set({ 'array': elementArray});
										}
								}else{
										alert("Please upload a JSON or XML file to process...");
								}
					}
				);
				e.preventDefault();
				e.stopPropagation();
				location.reload();
	};
	
	reader.readAsText(file);
}
 
document.getElementById('file').addEventListener('change', readSingleFile, false);

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

function handleCharacterReferencesInXML(stringContent){
	stringContent=stringContent.replaceAll("&","&amp;");

	return stringContent;
}





