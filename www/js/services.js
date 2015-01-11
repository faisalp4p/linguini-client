angular.module('starter.services',["pubnub.angular.service"])
.factory('CommonServices',function($compile,$http,$state, PubNub){
	var self={};
        self.messageListener = null;
	self.chat_message_count;
	self.hardwareBack=function(){
	      navigator.app.exitApp();
	};
	self.getLocalStorage=function(key){
      var item = localStorage.getItem(key);
      data = JSON.parse(item);
      return data;
    };

    self.setLocalStorage=function(key, value){
      localStorage.setItem(key, JSON.stringify(value));
    };
    //self.networkStatusOffline=function(offlineActivity){
    	//checks if the phone is connected to internet
    //	document.addEventListener("offline",offlineActivity, false);
    //};
    self.createElement= function(ele){
    	return document.createElement(ele);
    }
    self.setAttributes= function(el, attrs) {
	  for(var key in attrs) {
	    el.setAttribute(key, attrs[key]);
	  }
	}
    //self.networkStatusOnline=function(onlineActivity){
    //	document.addEventListener("online",onlineActivity, false);
    //};
    //self.activateSettings=function(){
    //	$state.go('settings');
    //}


    self.connect_to_server=function(uid,name, lang){
	console.log("kooooooooooooool")
        url = "http://mashapelinguini.herokuapp.com/";
    	$http.post(url+'login/',{"id":uid,"name":name, "lang": lang})
			.success(function(data, status, headers, config) {
				//self.setLocalStorage("fb_uid",uid);
				//self.setLocalStorage("fb_accessToken",access_token);
				PubNub.init({
  					publish_key:'pub-c-287cdce8-3958-499e-82c8-85c830e981b0',
  					subscribe_key:'sub-c-c44a92f0-98df-11e4-91be-02ee2ddab7fe'
  					//uuid:'an_optional_user_uuid'
				});
				PubNub.ngSubscribe({ channel: uid })
				$rootScope.$on(PubNub.ngMsgEv(uid), function(event, payload) {
    					// payload contains message, channel, env...
    					console.log('got a message event:', payload);
					message = payload.message;
					current_chat = self.getLocalStorage('active_chat');
					if(current_chat.uid == message['from']) {
						msg = self.make_message(message['message'], true);
						self.messageListener(msg);
						return;
					}
					contacts = self.getLocalStorage('contacts');
					for(var i=0; i<contacts.length; i++) {
						if(contacts[i].uid == message['from']) {
							msg = self.make_message(message['message'], true);
							messages = self.getLocalStorage('chat-'+msg['from']);
							messages.push(msg)
							self.setLocalStorage('chat-'+message['from'], messages)
							return
						}
					}
					contacts.push({'uid': message['from'], 'name': message['name']})
					msg = self.make_message(message['message'], true);
					message_list = [msg];
					self.setLocalStorage('chat-'+message['from'], message_list)
  				})
				$state.go('home');
				
		  	})
		  	.error(function(data, status, headers, config) {
		  		console.log("error");
		  		console.log(status);
		  		console.log(data);
		  	});
    }

    self.select_language = function(id, name, lang) {
	self.setLocalStorage("lang",lang);
	self.connect_to_server(id, name, lang)
	
    }
    self.facebookConnect=function(){
	facebookConnectPlugin.getLoginStatus(function(response){
    		if (response.status === 'connected') { //tested working
    			//connected and authorized
    			//go to timer page
    			//get uid and access token from response
    			//resource:https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
    			//set localstorage
    			console.log("connected in login status");
    			console.log(response.authResponse.userID);
    			console.log("\n"+response.authResponse.accessToken);
    			//self.connect_to_server(response.authResponse.userID,response.authResponse.accessToken);
                        self.setLocalStorage("fb_uid",response.authResponse.userID);
			self.setLocalStorage("fb_accessToken",response.authResponse.accessToken);
			$state.go('language');
    			
    		}
    		else if(response.status === 'not_authorized'){
    			//logged in but not authorized
    			console.log("not authorized");
    		}
    		else{
    			// the user isn't logged in to Facebook.
    			console.log("not logged");
    		}

    	},function(){
		console.log("in login status callback");

	});
    	
    };
    self.facebookLogin=function(){
    	facebookConnectPlugin.login(["email","public_profile","user_friends"], function(response){
    		if (response.authResponse) {
				self.setLocalStorage("fb_uid",response.authResponse.userID);
				self.setLocalStorage("fb_accessToken",response.authResponse.accessToken);
				$state.go('language');
				//self.connect_to_server(response.authResponse.userID,response.authResponse.accessToken);

	    	}

    	}, function(response){
    		console.log(response);
    	});

    };
    self.convert_hm=function(time_s){
    	var hours=Math.floor(time_s/3600);
    	var minutes=Math.floor((time_s%3600)/60);
    	if(minutes<10){
    		minutes='0'+minutes;
    	}
    	if(hours<10){
    		hours='0'+hours;
    	}
    	
    	return hours+":"+minutes;
    };

    self.getContacts = function() {
	contacts = self.getLocalStorage("contacts");
	return contacts
    }

    self.make_message = function(txt, dir) {
	message = {};
	message['text'] = txt;
	message['dir'] = dir;
	return message
    }

    self.getMessages = function() {
	
	active_chat = self.getLocalStorage('active_chat');
	messages = self.getLocalStorage('chat-'+active_chat.uid);
	return messages;
    }

    self.updateMessageList = function(messages) {
	active_chat = self.getLocalStorage('active_chat');
	self.setLocalStorage('chat-'+active_chat.uid, messages)
    }

    self.registerMessageListener = function(listener) {
	self.messageListener = listener;
    }

    self.updateContacts = function(data) {
	contacts = self.getLocalStorage("contacts");
	contacts.push(data);
	self.setLocalStorage(contacts);
    }

    return self;
	
})
