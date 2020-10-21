hideHTMLDoc();
window.history.replaceState( null, null, window.location.href );
var docVisibilityPromise =  new Promise(function(r,c){
    setTimeout(r,2000);
}).then(() => showHTMLDoc());
var mainButtons = null;
var loggedInUser = null;
var auth = null;

/**
 * Called when the window is fully loaded
 */
window.addEventListener('load', (event) =>
{
    initButtons();
    let params = getURLParams();
    logParamaters(params);
    
    auth = retrieveAuthcode(params);
     loggedInUser = getLoggedInUser(auth);
    let req = server.createServerRequest("GET", "/osf project/kiosk program/src/main page/res/index.html", true);
    console.log(req.getHttpRequest());
    server.applyCredentialsToRequest(req.getHttpRequest(), loggedInUser[0], loggedInUser[1]);
    server.sendServerRequest(req);
    
    pluginAppsOnLoad = pluginAppsLoadedCallback;
    loadApps();
    require(['crypto-js'], function (CryptoJS) {
    console.log("window fully loaded");
    console.log(CryptoJS);
    defaultCipherSettings = {
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.AnsiX923
    }
   
    /*
    let secureData = new SecureData(CryptoJS, 'jmbotka', "adom");
    console.log('decrypted data: ' + secureData.getData().toString()
                + '\nHashed data: ' + secureData.getHashDigest());
                */
        return CryptoJS;
    });
});

function getURLParams(){
    let element = document.getElementById('param-url');
    let url = element !== null ? element.href : null;
    if (element !== null){
        element.remove();
    }
    return hasParameters(url) === true ? parseParameters(url) : null;
}

/**
 * Retrieves login information
 * @param {} params 
 */
function retrieveAuthcode(params = null){
    
    if (params !== null){
        let authcode = params.find((element) => element['key'] === 'authcode');
        if (authcode !== undefined){
            authcode = authcode['value'];
            return authcode;
        }
    }

    return null;
}

/**
 * 
 * @param {*} authcode 
 */
function getLoggedInUser(authcode){
    let email = window.localStorage.getItem('loggedinuser-email'.concat(authcode));
    let hashedPwd = window.localStorage.getItem('loggedinuser-pwd'.concat(authcode));
    if (email !== null && hashedPwd !== null){
        console.log('retrieved logged in user');
        return [email,hashedPwd];
    }
    return null;
}

/**
 * Test callback for http request completed state change
 */
  function callback(){
    if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
       }
  }

  /**
   * Checks if client is logged into account.
   */
  function checkIfLoggedIn(){
      // do a post with current logg in
  }

  /**
   * Callback
   * @param {*} apps Apps object
   */
  function pluginAppsLoadedCallback(apps) {
    console.log('Apps loaded and ready: ' + apps);
  }

  /**
   * Callback
   * @param {*} appInfo AppInfo object
   */
  function pluginAppInfoLoaded(appInfo = null){
      console.log(appInfo.getApp().toString());
    let appNum = appInfo.getApp().getAppNumber();
    if (isSet(appNum)){
        console.log(mainPageButtons);
        let index = parseInt(appNum - 1);
        let button = mainPageButtons[index];
        button.setAttribute('name', 'app-'.concat(appNum));
        button.src = appInfo.getAppPictureUrl();
        button.onclick = function(event){
            console.log(event);
            let element = event.srcElement;
            let name = element.name;
            let cName = parseInt(name.substring(name.indexOf("-") + 1));
            let buttonAppInfo = null;
            if (cName <= apps.size){
                let app = apps.getApp(cName - 1);
                let filePath = app.mainFile;
                console.log(filePath);
                if (filePath !== null){
                    /*
                    let req = server.createServerRequest("POST", "/osf project/kiosk server/php scripts/open-app-request.php", true,function(){
                            //
                        }
                    );
                    let data = new FormData();
                    data.append('furlpath', filePath);
                    req.getHttpRequest().send(data);
                    console.log("posted to : " + "/osf project/kiosk server/php scripts/open-app-request" );
                    */
                   document.getElementById('form-input').value = [filePath, loggedInUser[0], loggedInUser[1]];
                   document.getElementById('app-request-form').submit();
                    
                }
                else{
                    
                }
            }

            return this;
        };
        console.log(button);
    }

    if (isSet(apps)){
        if (apps.isAllAppsLoaded()){
            showHTMLDoc();
        }
    }
           
      
  }

  function isSet(element){
      return element !== undefined && element !== null;
  }


  function hideHTMLDoc(){
    document.getElementsByTagName("html")[0].style.visibility = "hidden";
  }
  function showHTMLDoc(){
    document.getElementsByTagName("html")[0].style.visibility = "visible";
  }

