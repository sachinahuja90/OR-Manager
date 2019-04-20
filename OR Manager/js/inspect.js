debugger;
var mainObj = {},elementArray=[],module={};

var locatorArray=["id", "name", , "class", "classname", "href"];

chrome.storage.local.get('array', function(Object){
    console.log("printing");
    console.log(Object.array);
    for(var i=0;i<Object.array.length;i++){
        var element={};
        element["NameOfElement"]=Object.array[i]["NameOfElement"];
        element["ElementProperty"]=Object.array[i]["ElementProperty"];
        elementArray.push(element);
    }
});



function mOver(e){
    e.target.style.background= "#9BC4E2";
}
document.addEventListener("mouseover", mOver);

function mOut(e){
    e.target.style.background = ""
}
document.addEventListener("mouseout", mOut);

function toXml(o) {
 
    var toXml = function(v, name, ind) {
  
       var xml = "";
       if (v instanceof Array) {
          for (var i=0, n=v.length; i<n; i++)
             xml += toXml(v[i], name, ind);
       }
       else if (typeof(v) == "object") {
          var hasChild = false;
          xml += ind + "<" + name;
          for (var m in v) {
             if (m.charAt(0) == "@")
                xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
             else
                hasChild = true;
          }
          xml += hasChild ? ">\n" : "/>\n";
          if (hasChild) {
             for (var m in v) {
               if (m == "#text")
                   xml += v[m];
                else if (m == "#cdata")
                   xml += "<![CDATA[" + v[m] + "]]>";
                else if (m.charAt(0) != "@")
                   xml += toXml(v[m], m, ind+"\t");
             }
             xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">\n";
          }
       }
       else {
          xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">\n";
       }
       return xml;
    }, xml="";
    for (var m in o)
       xml += toXml(o[m], m, "");
   
   xml=xml.replace("\n\t<_xsi:type>Modules</_xsi:type>","");
   xml=xml.replace("\n\t<_xmlns:xsi>"+document.URL+"</_xmlns:xsi>", "");
   
   xml=xml.substring(0,8)+" xmlns:xsi="+"\""+ document.URL+"\""   +" xsi:type="+"\"Modules\""  + xml.substring(8);
   var xmlEncoding="<?xml version="+"\""+"1.0"+"\""+ " encoding="+"\""+"UTF-8"+"\""+"?>\n";
   xml=xmlEncoding+xml;
   
   return xml;
 
 }

function mClick(event){
    debugger;
    var name = "Please enter custom name"
    if (!!event.target.id) {
        name = event.target.id;
    }else if(!!event.target.name) {
        name = event.target.name;
    }
	    debugger;	
		var key = prompt("Please enter object name", name);
        
		if (key != null) {
            var dummyObj,
				elementPropArray = [],
				element={},
                nodeAttr = event.target.attributes,
                nodeLength = nodeAttr.length;
    
            for (i = 0; i < nodeLength; i++) {
                
                if(locatorArray.includes(nodeAttr[i].name)){

                    if(!((nodeAttr[i].nodeValue==="")||(nodeAttr[i].nodeValue===undefined))){
                        dummyObj = {};
                        if(nodeAttr[i].name==="href"){
                            dummyObj.Type="linktext"  ;
                        }else{
                            dummyObj.Type = nodeAttr[i].name;
                        }
                        
                        dummyObj.Value = nodeAttr[i].nodeValue;
                
				        elementPropArray.push(dummyObj);
                    }
                }
                
				
            }
            if (event === undefined) event = window.event;                     // IE hack
            var target = 'target' in event ? event.target : event.srcElement; // another IE hack
            var root = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
            var path = getPathTo(target);
            chrome.storage.local.set({'xpath': path});
            chrome.storage.local.set({'customName': key});
			elementPropArray.push({
				Type: "xpath",
				Value: path
			});
						
            element["NameOfElement"]=key;
            element["ElementProperty"]=elementPropArray;
			

            if(keyAlreadyExists(key)){
                if(orExist(element)){ 
                        alert("Same element with same set of properties already exist.")
                    //do nothing
                }else{
                    //update
                    //since key exists but value is different ask user if he want to update
                    var input= userInputToUpdatePropertiesOFAnExistingElement();
                    if(input==="OK"){
                        elementArray = elementArray.filter(function(obj){
                            return !(obj.NameOfElement===key);
                        });
                        elementArray.push(element);

                    }else if(input==="Cancel"){
                        
                        chrome.storage.local.set({ 'webElement': '' });
                        chrome.storage.local.set({ 'ObjectName': '' });
                        chrome.storage.local.set({ 'customName': '' });
                         $('#propertyValue').value('');
                         $('#objectname').val('');
                         $('#webelement').val('');
                        
                    }else{
                        //do nothing as user does not want to update the properties
                    }
                    
                }


            }else{
                if(propertiesAlreadyExists(elementPropArray)){
                    
                    var input=userInputToCreateElementWithPropertiesAlreadyExistingWithOtherElement();
                    if(input==="OK"){

                        elementArray.push(element);
                        
                    }else if(input==="Cancel"){
                        chrome.storage.local.set({ 'webElement': '' });
                        chrome.storage.local.set({ 'ObjectName': '' });
                        chrome.storage.local.set({ 'customName': '' });
                         $('#propertyValue').value('');
                         $('#objectname').val('');
                         $('#webelement').val('');
                        
                    }else{
                        //do nothing as user does not want to create new element with same properties
                    }
                }else{
                    //add element
                    elementArray.push(element);
                }
            }

            module["Element"]=elementArray;
            module["_xmlns:xsi"]=document.URL;
            
		    module["_xsi:type"]= "Modules";
            mainObj["Modules"] = module;

            var repository = JSON.stringify(mainObj, null, 4);
            
            chrome.storage.local.set({ 'repository': repository });
            var xmlRepository=toXml(mainObj);
            chrome.storage.local.set({ 'xmlRepository': xmlRepository });
            chrome.storage.local.set({ 'ObjectName': "     "+key });
            var webElementObj = JSON.stringify(element, null, 4);
            chrome.storage.local.set({ 'webElement': webElementObj });
            chrome.storage.local.set({ 'array': elementArray});
           
    
            event.preventDefault();
            event.stopPropagation();
        }
    }
document.addEventListener("click", mClick, true);


function orExist(element){
    return elementArray.some(function(e){

        return JSON.stringify(e)==JSON.stringify(element);
    });
}

function keyAlreadyExists(key){
    return elementArray.some(function(e){

        return e.NameOfElement===key;
    });

}

function propertiesAlreadyExists(elementPropArray){

    return elementArray.some(function(e){

        return JSON.stringify(e.ElementProperty)==JSON.stringify(elementPropArray);
    });


}

function userInputToUpdatePropertiesOFAnExistingElement() {
    var txt;
    if (confirm("Element with same name exists. Click 'OK' to update its properties else click 'Cancel'")) {
      txt = "OK";
    } else {
      txt = "Cancel";
    }
    return txt;
  }

  function userInputToCreateElementWithPropertiesAlreadyExistingWithOtherElement() {
    var txt;
    if (confirm("Same properties are already present with another element. Click 'OK' to create a new Element else click 'Cancel'")) {
      txt = "OK";
    } else {
      txt = "Cancel";
    }
    return txt;
  }
  


function encode(s) {
    var out = [];
    for (var i = 0; i < s.length; i++) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array(out);
}

function getPathTo(element) {
        
    var attrs = element.attributes;
    var xpath="";

    for(var i =0; i <  attrs.length ; i++) {
        //return "//" + element.tagName.toLowerCase() + "[text()='" + attrs[i].value + "']";
        
        if (attrs[i].name=='id')
            xpath=xpath + "@id='" + attrs[i].value + "' and ";
        else  if (attrs[i].name=='name')
            xpath=xpath + "@name='" + attrs[i].value + "' and ";      
    }

    if(xpath!==""){
        xpath=xpath.trim();
        xpath=xpath.substring(0,xpath.length-3).trim();
        return "//" + element.tagName.toLowerCase() + "["+ xpath +"]"
    }
    
    if (element===document.body)
        return element.tagName;

    return customXpath(element);
};

function downloadJson(){
var data=JSON.stringify(mainObj,null,4);
        var blob = new Blob( [ data ], {
            type: 'application/octet-stream'
        });
        
        url = URL.createObjectURL( blob );
        var link = document.createElement( 'a' );
        link.setAttribute( 'href', url );
        link.setAttribute( 'download', 'example.json' );
		var event = document.createEvent( 'MouseEvents' );
        event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent( event );

}

function customXpath(element) {
	var ix= 0,
		sibling,
		siblingLength,
		siblings;
	debugger;	
			
    if (element.id!=='')
         return "//" + element.tagName.toLowerCase() + "[@id='" + element.id + "']";
			
		
    if (element===document.body)	
        return "//" + element.tagName;
    
		siblings  = element.parentNode.childNodes;
		siblingLength = siblings.length;

	
    
    for (var i= 0; i<siblingLength; i++) {
        sibling= siblings[i];
        if (sibling===element)
            return customXpath(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
};

