			var webElement;	
			debugger;

			if(propertyValue!=""){
				switch(propertySelection) {
					case "Xpath":
						webElement=getElementByXpath(propertyValue);
						break;  
						
					case "CSS":
						webElement=document.querySelector(propertyValue);
						break;

					case "ID":
						webElement= document.getElementById(propertyValue);
						break;

					case "Name":
						webElement=document.getElementsByName(propertyValue);
						break;

					case "Class":
						webElement=document.getElementsByClassName(propertyValue);
						break;
				}
				setTimeout(function(){webElement.style.background="#9BC4E2";},1);
				setTimeout(function(){webElement.style.background="";},1000);
			}

			function getElementByXpath(xpath) {
				debugger;
				return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			}		  
