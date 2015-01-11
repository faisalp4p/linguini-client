angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})



.controller('LoginController',function($scope,$state,$ionicPlatform,CommonServices){
	//pressing hardware back from login page kills the app without returning to landing
	console.log("in login view");
	$ionicPlatform.onHardwareBackButton(CommonServices.hardwareBack);
	$scope.$on('$destroy', function(){
		$ionicPlatform.offHardwareBackButton(CommonServices.hardwareBack);
	});
		CommonServices.facebookConnect();
	$scope.facebook_login=function(){
		console.log("fb login button pressed");
		CommonServices.facebookLogin();
	};
})

.controller('LanguageController',function($scope,$state,$ionicPlatform,CommonServices){
	//pressing hardware back from login page kills the app without returning to landing
	console.log("in login view");
	window.focus();
	$ionicPlatform.onHardwareBackButton(CommonServices.hardwareBack);
	$scope.$on('$destroy', function(){
		$ionicPlatform.offHardwareBackButton(CommonServices.hardwareBack);
	});
	$scope.username = "";
	$scope.name = "";
	$scope.lang = "";
	//CommonServices.facebookConnect();
	$scope.click_lang=function(){
		console.log("selecting language");
		CommonServices.select_language($scope.username, $scope.name, $scope.lang);
	};
})

.controller('HomeController',function($scope,$state,$ionicPlatform,CommonServices){
	//pressing hardware back from login page kills the app without returning to landing
	console.log("in home view");
	$ionicPlatform.onHardwareBackButton(CommonServices.hardwareBack);
	$scope.$on('$destroy', function(){
		$ionicPlatform.offHardwareBackButton(CommonServices.hardwareBack);
	});
	//CommonServices.facebookConnect();
	$scope.contacts = CommonServices.getContacts();
	
	$scope.open_chat = function(contact) {
	
		CommonServices.setLocalStorage("active_chat", contact);
		$state.go('chat');
	
	}
	$scope.search = function() {
		$state.go('search');
	}

})

.controller('SearchController',function($scope,$http,$state,$ionicPlatform,CommonServices){
	//pressing hardware back from login page kills the app without returning to landing
	console.log("in home view");
	$ionicPlatform.onHardwareBackButton(CommonServices.hardwareBack);
	$scope.$on('$destroy', function(){
		$ionicPlatform.offHardwareBackButton(CommonServices.hardwareBack);
	});
	//CommonServices.facebookConnect();
	$scope.contacts = CommonServices.getContacts();
	$scope.search_quey = "";
	$scope.sss = function() {
		$http.get("http://mashapelinguini.herokuapp.com/search?q="+$scope.search_query)
		.success(function(data, status) {
			for(i=0;i<data.length;i++) {
				data[i]['uid'] = data[i]['id'];
			}
			//data['uid'] = data['id'];
			$scope.search_results = data;
			//CommonServices.updateContacts(data);
			//CommonServices.setLocalStorage("active_chat", data);
			//$state.go('app.chat');
		})
	}
	$scope.search_click = function(d) {
		
		CommonServices.setLocalStorage("active_chat", d);
		CommonServices.setLocalStorage("chat-"+d['id'], []);
		$state.go('chat');
		
	
	}
})

.controller('ChatController',function($scope,$http,$state,$ionicPlatform,CommonServices){
	//pressing hardware back from login page kills the app without returning to landing
	console.log("in chat view");
	$ionicPlatform.onHardwareBackButton(CommonServices.hardwareBack);
	$scope.$on('$destroy', function(){
		$ionicPlatform.offHardwareBackButton(CommonServices.hardwareBack);
	});
	//CommonServices.facebookConnect();
	
	$scope.register_for_message = function(msg) {
		$scope.messages.push(msg);
		CommonServices.updateMessageList(msg);
 	}
	CommonServices.registerMessageListnener($scope.register_for_message);

	
	$scope.current_text = "";
	$scope.messages = CommonServices.getMessages();

	$scope.send_message = function() {
		msg = CommonServices.make_message($scope.current_message, false);
		CommonServices.updateMessageList(msg);
		$scope.messages.push(msg);
		$http.post('http://mashapelinguini.herokuapp.com/publish/',{'from': CommonServices.getLocalStorage('fb_uid'), 'message': $scope.current_message})
		
	}

})


.controller('LandingController', function($scope, $stateParams,$ionicSlideBoxDelegate) {
});

/*.controller('LandingController', function($scope, $stateParams,$ionicSlideBoxDelegate) {
});*/
