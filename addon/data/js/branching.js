//récupération du worker.emit du main.js
self.port.on("mz_Branching", function(mz_prefs) {
  // récupération de l'url complete du script chargé
  // cette url dépend de l'url de la page en cours
// récupération de l'url courante
  mz_currentURL = mz_getCurrentUrl();
  console.log('Branching -> mz_currentURL = ' + mz_currentURL);
  
// récupération du répertoire des scripts spécifiques sur le serveur distant    
// on appelle mz en http si la page courante est en http, et en https si la page courante est en https
  var mz_currentScriptDir = mz_getUrlSection('protocol',mz_currentURL) + '//' + mz_prefs.prefs['mz_serveurMZ'] + '/' + mz_prefs.prefs['mz_internal_scripts_folder'] + '/' ;       
  console.log('Branching -> mz_currentScriptDir = ' + mz_currentScriptDir);
  
// récupération du script spécifique
  var mz_script = mz_getScriptForPage(mz_getUrlSection('pathname'), mz_prefs.prefs['mz_url_prefix']);  
  console.log('Branching -> mz_script  = ' + JSON.stringify(mz_script));        
  
  if(mz_script['name'] !== null) {           
    if(mz_script['type'] === 'external') {
        var mz_scriptURL=mz_currentScriptDir +  mz_script['name'];   
        console.log("Branching -> mz_scriptURL : " + mz_scriptURL); 
        mz_loadExternalScript(mz_scriptURL);
    }
    else if (mz_script['type'] === 'internal') { mz_loadInternalScript(mz_scriptURL);}
  }

});



                                                                                                                                                         
                      