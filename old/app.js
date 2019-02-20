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

.run(function($rootScope,$state)
{
$rootScope.$on('$stateChangeStart',function($ionicLoading)
{
  $rootScope.title=$state
  
})
})
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
  
  

  function checkAuth($q,$state,$timeout,jwtHelper,$localStorage)
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


  
.controller('richiesteAperte',function($scope,$http,decodeToken,$ionicLoading)
{
  $scope.richiesteAperte=[{}]
  
  $http.get('http://192.168.1.100:8080/richiesteAperte',{params:{id:decodeToken.getUser().id}}).then(function(listaRichiesteAperte)
{
  
  
  $scope.richiesteAperte=listaRichiesteAperte.data

})
})

.controller('richiesteChiuse',function($scope,$http,decodeToken)
{
  $scope.richiesteChiuse=[{}]
  $scope.getReport=function(id)
  {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    $http.get('http://192.168.1.100:8080/getReport',{params:({'idrichiesta':id})}).then(function(nomefile)
  {
    fileTransfer1 = new FileTransfer()
    fileTransfer1.download('http://192.168.1.100:8080/report/'+nomefile.data.file,cordova.file.externalRootDirectory+'download/'+nomefile.data.file,function(entry)
  {
    
  })
  })
      
     
    }
    
    
	

    
  
   
  }
  
  $http.get('http://192.168.1.100:8080/richiesteChiuse',{params:{id:decodeToken.getUser().id}}).then(function(listaRichiesteChiuse)
{
  
  $scope.richiesteChiuse=listaRichiesteChiuse.data
})

})
.controller('login',function($scope,$http,$localStorage,$window,$state,$location,$ionicPopup)
{
  $scope.sendCredential=function(user,password)
  {
    
    
    $http.get('http://192.168.1.100:8080/authentication',{params:({'user':user,'password':password})}).then(function(response)
  {
    
    localStorage.setItem('token',response.data.tkn);
    $state.go('main_page')
    
  },function()
{
  $ionicPopup.show({
    title: 'Enter Wi-Fi Password'
  })
})
  }
})
.controller('main',function($scope,$window)
{
  $scope.click=function()
  {
    $window.location.href='#/test'
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