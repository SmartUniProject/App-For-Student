/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var url = 'http://localhost/smartunimobile/';
//window.location='home.html';
var loader=function(){
    $('#loginbutton').click(function(){
        var activation=$('#jactivation').val();
        if(activation==""){
            navigator.notification.alert(
                'Please enter activation code!.',
                function(){},
                'Login',
                'Okay'
            );
        }
        else {
            $.ajax({
                url: url + 'login.php',
                type: 'get',
                data: {
                    'token': 'dev20',
                    'activation' : activation
                },
                dataType : 'json',
                success : function(r){
                    if(r.error=="notfound"){
                        navigator.notification.alert(
                            'Invalid activation code. Please enter the correct activation code again.',
                            function(){},
                            'Login',
                            'Okay'
                        );
                    }
                    else{
                        localStorage.setItem ("userId",r.id);
                        window.location='home.html#new';
                    }
                }
            });
        }
    });
};

$(document).ready(function(){
    loader();
});


var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
		
        this.receivedEvent('deviceready');



    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();