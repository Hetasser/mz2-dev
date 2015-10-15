// api contenant les fonctions
// 1) communes à plusieurs pages MZ
// 2) utilisables par les scripts externes

// fonction de test : modifie le cadre de connexion sur la page de login
function modifyFieldByTagName(tagName, param){
        document.getElementsByTagName(tagName)[0].innerHTML += " " + param;
}

  // chargement d'un script interne
function mz_loadInternalScript(mz_scriptURL){
     self.importScripts(mz_scriptURL);
}  
  
// chargement d'un script externe
function mz_loadExternalScript(mz_scriptURL){   
    console.log("mzapi -> mz_loadExternalScript = " + mz_scriptURL);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", mz_scriptURL);
    xmlhttp.onreadystatechange = function()
    {
        if ((xmlhttp.status == 200) && (xmlhttp.readyState == 4))
        {
            eval(xmlhttp.responseText);
            mz_sendBackResult("mz_externalJSLoaded",'done');
        }
    };
    xmlhttp.send();
}
  
// fonction pour le retour au main.js
function mz_sendBackResult(mz_event, mz_data){
    self.port.emit(mz_event, mz_data); 
    console.log("Fin du script appelé");
}
    
// fonction permettant la récupération de tous les champs possédant une id dans une page
// sous la forme d'un tableau de {"id", "valeur"}  
function mz_getAllElementsWithId() {
    var arr = [].map.call(document.querySelectorAll('input[id]'), function(i){ return {id:i.id, v:i.value} })
    console.log("mzapi -> mz_getAllElementsWithId = " + JSON.stringify(arr));
    return arr;
}
  
// fonction pour récupérer l'url courante
function mz_getCurrentUrl(){
    var mz_currentStringUrl = window.location; 
    console.log('MzAPI -> mz_getCurrentUrl -> mz_currentStringUrl = ' + mz_currentStringUrl);  
    return mz_currentStringUrl;
}  

// fonction permettant de récupérer un des éléments d'une url
// une url est de la forme <protocol>//<hostname>/<pathname>?<search>
// on peut lui passer une url, sinon par défaut c'est l'url de la frame en cours
function mz_getUrlSection(section="pathname", mz_currentUrl = mz_getCurrentUrl()){ 
    var mz_currentSection=mz_currentUrl[section];
    console.log('MzAPI -> mz_getUrlSection -> mz_current' + section + ' = ' + mz_currentSection);  
    return  mz_currentSection;
}

// fonction qui vérifie la page sur laquelle on est. principalement pour les scripts externes, étant donné qu'en interne
// ça sera géré par un tableau
function mz_checkPage(mz_testUrl, mz_currentPathname = mz_getUrlSection("pathname")){    
    console.log('MzAPI -> mz_testUrl = ' + mz_testUrl); 
    console.log('MzAPI -> mz_currentPathname = ' + mz_currentPathname); 
    return (mz_testUrl === mz_currentPathname);
}

// fonction qui renvoie le nom du script en fonction de la page en cours
function mz_getScriptForPage(mz_pageName,mz_url_prefix){
    console.log('MzAPI -> mz_getScriptForPage ->  (mz_pageName,mz_url_prefix) = (' + mz_pageName + ',' + mz_url_prefix+')'); 

    var mz_scriptToGet = {
      '/MH_Play/PlayStart.php' : {'name' : 'tmp/externalScript.js', 'type' : 'external'},
      '/MH_Play/TurnStart.php' : '',
      '/MH_Play/Play_profil2.php' : {'name' : 'data/js/mz_profil.js', 'type' : 'internal'},                          // susceptible de changer
      '/MH_Play/Play_equipement.php' : '',
      '/MH_Play/Play_Ceinture.php' : '',
      '/MH_Play/Play_e_follo.php' : '',
      '/MH_Play/Liste_Vente/ListeVente_liste.php' : '',
      '/MH_Play/Liste_Vente/ListeVente_marche.php' : '', 
      '/MH_Play/Liste_Vente/ListeVente_recherche.php' : '',
      '/MH_Play/Liste_Vente/ListeVente_view.php' : '',
      '/MH_Play/Play_mouche.php' : '',
      '/MH_Play/Play_BM.php' : '',
      '/MH_Play/Play_evenement.php' : '',
      '/MH_Play/MH_Messagerie.php' : '',                                                           // ?cat=[1-9]
      '/MH_Play/Play_option.php' : '',  
      '/MH_Play/Play_action.php' : '',                                                             //?ai_ToDo=220&as_Action=ACTION!      <-- note : 2XX pour les sorts, 1XX pour les comps
      '/MH_Guildes/Guilde.php' : '',
      '/MH_Guildes/Guilde_Membres.php' : '',
      '/MH_Guildes/Guilde_NewMembres.php' : '',
      '/MH_Guildes/Guilde_Rangs.php' : '',
      '/MH_Guildes/Guilde_NoAcces.php' : '',
      '/MH_Guildes/Guilde_o_AmiEnnemi.php' : '',
      '/MH_Lieux/Lieu_Description.php' : '',
      '/MH_Missions/Mission_Liste.php' : '',    
      '/MH_Missions/Mission_Description.php' : '',                                                 //?ai_idMission=29898
      '/MH_Missions/Mission_Equipe.php' : '',                                                      //?ai_idMission=29898
      '/MH_Missions/Mission_Etape.php' : '',                                                       //?ai_idMission=29898
      '/MH_Missions/Mission_Recompense.php' : '',                                                  //?ai_idMission=29898
      '/MH_Missions/Mission_Abandon.php' : '',                                                     //?ai_idMission=29898
      '/MH_Missions/Mission_Aide.php' : '',                                                        //?ai_idMission=2989'
      '/MH_Comptoirs/.php' : '',
      '/MH_Comptoirs/Comptoir_PrixService.php' : '',
      '/MH_Comptoirs/Comptoir_Comptes.php' : '',
      '/MH_Play/Actions/Play_a_AmeliorationView.php' : '',
      '/View/DetailComp.php' : '',                                                                 //?ai_IDComp=1'
      '/View/DetailSort.php' : '',                                                                 //?ai_IDSort=20
      '/MH_Play/Play_action.php' : '',                                                             //?ai_ToDo=220&as_Action=ACTION!
    } ; 
    var mz_cleanedPage = mz_pageName.split(mz_url_prefix);    
    console.log('MzAPI -> mz_getScriptForPage -> mz_cleanedPage = ' + mz_cleanedPage[1]);             
    
    var mz_returnScript = mz_scriptToGet[mz_cleanedPage[1]];     
    console.log('MzAPI -> mz_getScriptForPage -> mz_returnScript = ' + JSON.stringify(mz_returnScript));
    
    return mz_returnScript;  
}