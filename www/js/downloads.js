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

var studentId=localStorage.getItem ("userId");
var offset=0;
var runonce=false;


var url = 'http://localhost/smartunimobile/student/';

var loader=function(){

};


var loadDownloadFresh = function(){
    runonce=false;
    offset=0;
    $('#downloadsdata').html('');
    loadDownloads();
};

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(!runonce)
            loadDownloads();
    }
};





var loadDownloads = function(){
    $('#preloader').show();
    var elm=$('#jcourse');
    var course=$(elm).find(':selected').data('course');
    var degree=$(elm).find(':selected').data('degree');
    $.ajax({
        url : url + 'downloads.php',
        type : 'get',
        dataType : 'json',
        data : {
            'token' : 'dev20',
            'getdownloads' : '1',
            'degree' : degree,
            'course' : course,
            'offset'  :  offset

        },
        success : function(r){
            if(r.error=='notfound'){
                if(!runonce) {
                    if (offset > 0) {
                        $('#downloadsdata').append('<hr/><div class="alert alert-info">No more resources.</div>');
                    }
                    else {
                        $('#downloadsdata').html('<hr/><div class="alert alert-danger">No data found to display!</div>');
                    }
                    runonce=true;
                }
            }
            else {
                str='';

                r.forEach(function (el) {



                    str += '<div class="panel panel-primary" id="res_'+el.id+'">' +
                                '<div class="panel-body">' +
                                    '<b><span class="glyphicon glyphicon-time"></span> '+el.added_time+'</b><hr/>'+
                                    el.description+
                                    '<div><br/>'+
                                        '<button onclick="window.location=\''+el.downloadlink+'\'" class="btn btn-primary"><span class="glyphicon glyphicon-download-alt"></span> Download</button>' +
                                        '&nbsp;&nbsp;&nbsp;' +
                                        '<button onclick="window.plugins.socialsharing.share(\''+el.downloadlink+'\');" class="btn btn-default"><span class="glyphicon glyphicon-share"></span> Share</button>' +
                                    '</div>'+
                                '</div>' +
                            '</div>';
                });
                offset+=r.length;
                $('#downloadsdata').append(str);






            }
            $('#preloader').hide();
        }
    });
};

$(document).ready(function(){
    loader();
    $('#jback').click(function(){
        window.location='home.html';
    });

    $('#newbutton').click(function(){
        $('#newdownload').modal('show');
    });

    $('#adddownloadbutton').click(function(){
        addDownload();
    });

    $('#jfilter').click(function(){
        loadDownloadFresh();
    });



    $.ajax({
        url : url +'downloads.php',
        type : 'get',
        dataType : 'json',
        data : {
            'token' : 'dev20',
            'getcourses' : '1',
            'student' : studentId
        },
        success : function(r){
            var degree=document.getElementById('jcourse');
            r.forEach(function(el){
                var elm=document.createElement('option');
                elm.setAttribute('data-year',el.cyear);
                elm.setAttribute('data-semester',el.csemester);
                elm.setAttribute('data-degree',el.deg_id);
                elm.setAttribute('data-course',el.id);
                elm.textContent=el.id+' '+el.name;

                degree.appendChild(elm);
                loadDownloads();
            });
        }
    });


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