// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
  .state('richiesteaperte', {
    url: '/richiesteaperte',
    templateUrl: 'richiesteaperte.html',
    controller:'richiesteAperte'
  })
  .state('richiestechiuse', {
    url: '/richiestechiuse',
    templateUrl: 'richiestechiuse.html',
    controller:'richiesteChiuse'
  })
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


  
.controller('richiesteAperte',function($scope,$http)
{
  $scope.richiesteAperte=[{}]
  
  $http.get('http://172.23.1.18:8080/richiesteAperte').then(function(listaRichiesteAperte)
{
  
  $scope.richiesteAperte=listaRichiesteAperte.data
})
})

.controller('richiesteChiuse',function($scope,$http)
{
  $scope.richiesteChiuse=[{}]
  $scope.getReport=function(id)
  {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    $http.get('http://172.23.1.18:8080/getReport',{params:({'idrichiesta':id})}).then(function(nomefile)
  {
    fileTransfer1 = new FileTransfer()
    console.log(nomefile.data.file)
    fileTransfer1.download('http://172.23.1.18:8080/report/'+nomefile.data.file,cordova.file.externalRootDirectory+'download/'+nomefile.data.file,function(entry)
  {
    
  })
  })
      
     
    }
    
    
	

    
  
   
  }
  
  $http.get('http://172.23.1.18:8080/richiesteChiuse').then(function(listaRichiesteChiuse)
{
  
  $scope.richiesteChiuse=listaRichiesteChiuse.data
})

})
.controller('login',function($scope,$http,$localStorage)
{
  $scope.sendCredential=function(user,password)
  {
    $http.get('http://172.23.1.182:8080/authentication',{params:({'user':user,'password':password})}).then(function(response)
  {
    localStorage.setItem('token',response.data.tkn);
    alert(localStorage.getItem('token'))
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