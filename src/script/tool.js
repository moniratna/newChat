window.$ = (tag, all) => {
  if (!tag){
    console.warn('Please check if the passed css selector is correct')
    return null
  }
  if (!document.querySelector) {
    console.warn('The browser does not support querySelector')
    return null
  }
  if (all){
    return document.querySelectorAll(tag)
  }else{
    return document.querySelector(tag)
  }
}
$.ajax = function(json){
    if (!json) return;
    let type = json.type.toUpperCase();
    let url = json.url;
    let data = json.data;
    let success = json.success;
    let error = json.error;


    // IE6, IE5 Browser compatible execution code
    let xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    /*
     * open: Specify the request type, URL, and whether to process the request asynchronously.
     * method：The type of request; GET 或 POST
     * rl：The location of the file on the server
     * async：true（Asynchronous) (default) or false (synchronous)
    */
    if (type === "GET") {
      if (data) {
        let res = Object.keys(data).map((key) => `${key}=${data[key]}`).join('&');
        url += ('?' + res);
      }
      xmlHttp.open(type, url, true);
      xmlHttp.send();
    }
    /*
     * send: Send the request to the server.
     * string: only used for POST requests
    */
    if (type === 'POST') {
        xmlHttp.open(type, url, true);
        xmlHttp.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
        xmlHttp.send(data);
    }

    /*
     * onreadystatechange: 当readyState This function will be called when the property changes。
     * readyState: The status of XMLHttpRequest is stored. Changes from 0 to 4。
     * 0: The request is not initialized
     * 1: Server connection has been established
     * 2: Request received
     * 3: Request processing
     * 4: The request has been completed and the response is ready
     * status：
     * 200: "OK"
     * 404: Page not found
    */
    xmlHttp.onload = function(){
       // 304 The client has executed a GET, but the file has not changed
        // 206 When the resource download is not completed, it is generally used for the download of media resources
        if (xmlHttp.status === 200 || xmlHttp.status === 304 || xmlHttp.status === 206) {
         // responseText gets the response data in string form.
            // responseXML gets the response data in XML form.
            const res = JSON.parse(xmlHttp.responseText)
            if (xmlHttp.responseText && res && res.code === 0) {
                success && success(res.data);
            } else {
                alert('Network request failure, please try again！')
            }
        } else {
            error && error(xmlHttp.responseText)
        }
    }

}
// window.tool = {
//   ajax(type, url, data, fun){
//     const ajax = new XMLHttpRequest()
//     ajax.open(type, url, true)
//     ajax.send(data)
//     ajax.onreadystatechange = function () {
//       if (ajax.readyState == 4 && ajax.status == 200) {
//         const res = JSON.parse(ajax.responseText)
//         if (ajax.responseText && res && res.code === 0) {
//           fun(res.data)
//         } else {
//           alert('Network request failure, please try again!')
//         }
//       }
//     }
//   }
// }
