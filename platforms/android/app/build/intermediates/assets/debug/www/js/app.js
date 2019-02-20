// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngStorage','angular-jwt'])

.service('decodeToken',function(jwtHelper,$localStorage)
{
  this.getUser=function()
  {
    return jwtHelper.decodeToken(localStorage.getItem('token'))
  }
})

.run(function($rootScope,$state,$localStorage,$http)
{
$http.defaults.headers.common.Authorization = localStorage.getItem('token');
$rootScope.$on('$stateChangeStart',function()
{
  $rootScope.title=$state
})
})

//inizializzazione e definizione delle rotte del modul ui-router di angularj, la proprieta resolve viene utilizzata per richiamare la funzione checkauth
// e verificare la validita del token

.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
  .state('richiesteaperte', {
    url: '/richiesteaperte',
    templateUrl: 'richiesteaperte.html',
    resolve:{check:checkAuth},
    controller:'richiesteAperte',
    data:{title:'Lista Richieste Aperte'}
  })
  .state('richiestechiuse', {
    url: '/richiestechiuse',
    templateUrl: 'richiestechiuse.html',
    resolve:{check:checkAuth},
    controller:'richiesteChiuse',
    data:{title:'Lista Richieste Chiuse'}

    
  })
  .state('main_page',{
    url:'/mainpage',
    templateUrl:'main_page.html',
    resolve:{check:checkAuth},
    controller:'main',
    data:{title:'Gestione Analisi di Laboratorio'}

  })
  .state('login',{
    url:'/login',
    templateUrl:'login.html',
    controller:'login',
    data:{title:'Log In'}

  })
  
  
  // definizione del Promise da utilizzare come "middleware" per verificare la validita del token e quindi permettere l'accesso alle rotte
  function checkAuth($q,$state,$timeout,jwtHelper,$localStorage,$ionicLoading)
  {
    
    var defer = $q.defer()
    var tokenExpired = (jwtHelper.isTokenExpired(localStorage.getItem('token')))
    
    if (!tokenExpired)
      {
        $ionicLoading.show({
          
              template: '<ion-spinner icon="spiral"></ion-spinner>',
              duration: 2000
              
            })
        
        defer.resolve()
        
      }
      else
        { 
          $timeout(function () {
          $state.go('login'); 
        })
          defer.reject()
        }
        return defer.promise
  }

})
    
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
  
})


 // controller per visualizzare e gestire le richieste di analisi ancora aperte  
.controller('richiesteAperte',function($scope,$http,decodeToken)
{
  $scope.richiesteAperte=[{}]
  
  $http.get('http://192.168.5.1:8080/richiesteAperte',{params:{id:decodeToken.getUser().id}}).then(function(listaRichiesteAperte)
{
  
  $scope.richiesteAperte=listaRichiesteAperte.data
})
})

// controller per gestire le richieste di analisi completate ed il download del report di richieste chiuse
.controller('richiesteChiuse',function($scope,$http,decodeToken)
{
  $scope.richiesteChiuse=[{}]
  $scope.getReport=function(id)
  {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    $http.get('http://192.168.5.1:8080/getReport',{params:({'idrichiesta':id})}).then(function(nomefile)
  {

    // l'oggetto fileTransfer di cordova viene utilizzato per effettuare il download di un report di analisi dal server Node alla memoria interna del dispositivo mobile
    fileTransfer1 = new FileTransfer()
    fileTransfer1.download('http://192.168.5.1:8080/report/'+nomefile.data.file,cordova.file.externalRootDirectory+'download/'+nomefile.data.file,function(entry)
  {
    
  })
  })
      
     
    }
    
    
	

    
  
   
  }
  
  $http.get('http://192.168.5.1:8080/richiesteChiuse',{params:{id:decodeToken.getUser().id}}).then(function(listaRichiesteChiuse)
{
  
  $scope.richiesteChiuse=listaRichiesteChiuse.data
})

})

//controller per gestire il login all'apllicazione e per la memorizzazione del token generato da Node sullo storage locale del dispositivo mobile
.controller('login',function($scope,$http,$localStorage,$window,$state,$location,$ionicPopup)
{
  $scope.sendCredential=function(user,password)
  {
    
    
    $http.get('http://192.168.5.1:8080/authentication',{params:({'user':user,'password':password})}).then(function(response)
  {
    
    localStorage.setItem('token',response.data.tkn);
    $state.go('main_page')
    
  },function()
{
  $ionicPopup.alert({
    title: 'ATTENZIONE!',
    template: 'Email o Password Errati'
  })
  
})
  }
})

// controller per la gestione della pagina principale dell'applicazione

.controller('main',function($scope,$window,decodeToken,$http,$state,$ionicHistory)
{
  var data=new Date()
  $scope.dataCorrente= data.getDate()+'/'+data.getMonth()+1+'/'+data.getFullYear()
  $scope.email=decodeToken.getUser().email
  $scope.nome=decodeToken.getUser().nome+' '+decodeToken.getUser().cognome
  $http.get('http://192.168.5.1:8080/numRichiesteAperte',{params:{id:decodeToken.getUser().id}}).then(function(response)
{
  
  $scope.numRichiesteAperte=response.data
})
  
  $scope.goToRichiesteAperte=function()
  {
    $ionicHistory.clearCache().then(function()
    {
    $state.go('richiesteaperte')
    })
  }

  $scope.goToRichiesteChiuse=function()
  {
    $ionicHistory.clearCache().then(function()
    {
    $state.go('richiestechiuse')
    })
  }
})
.controller('login2',function($scope,$state,$timeout,$localStorage,$ionicHistory)
{
 $scope.loadLogin=function()
 {
   
   $state.go('login')
 }
 $scope.goToRichiesteAperte=function()
 {
  $ionicHistory.clearCache().then(function()
  {
  $state.go('richiesteaperte')
  })
 }

 $scope.goToMain=function()
 {
  $ionicHistory.clearCache().then(function()
  {
  $state.go('main_page')
  })
 }

 $scope.goToRichiesteChiuse=function()
 {
  $state.go('richiestechiuse')
 }
 $scope.logout=function()
 {
  localStorage.removeItem('token')
  $ionicHistory.clearCache().then(function()
{
  $state.go('login')
})
  
 }
})