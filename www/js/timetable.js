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

var url = 'http://localhost/smartunimobile/student/';

var formatTime = function(time){
    time=time.substring(0,5);
    return time+" "+(parseInt(time.charAt(0)+time.charAt(1))>12?"PM":"AM")
}

var formatYS= function(n){
    n=parseInt(n);
    if(n==1) return (n+'<sup>st</sup>');
    if(n==2) return (n+'<sup>nd</sup>');
    if(n==3) return (n+'<sup>rd</sup>');
    if(n==4) return (n+'<sup>th</sup>');
};

var getToday = function(){
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];
    return dayName;
};



var freeHours= function(st,en){
   return (parseInt(en)-parseInt(st));
};


var messageLecturer=function(id,name){
    bootbox.confirm({
        message: "Do you want the start chat thread?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-primary'
            },
            cancel: {
                label: 'No',
                className: 'btn-default'
            }
        },
        callback: function (result) {
            if(result){
                window.location='chatthread.html#'+id+'|'+name;
            }
        }
    });
};


var loadTimeTable= function(){
    $('#timetabledata').html('<div id="preloader"></div>');
    var str='';
    var day=$('#jday').val();
    $.ajax({
        url : url+'timetable.php',
        type : 'get',
        dataType : 'json',
        sonp: 'callback',
        crossDomain:true,
        data :{
            'token' : 'dev20',
            'gettimetable' : '1',
            'student' : studentId,
            'day' : day
        },
        success : function(r){

            for(i=0; i<r.length;i++){
                el=r[i];



                elabel=el.is_extra=="1"?'<span class="label label-info">EXTRA</span>':'';
                var lecturers='';
                var lecarray=el.lecturers.split(',');
                for(j=0;j<lecarray.length;j++){
                    var info=lecarray[j].split('-');
                    lecturers+='<li data-id="'+info[0]+'"><span class="glyphicon glyphicon-user"></span> <a href="javascript:messageLecturer('+info[0]+',\''+info[1]+'\');">'+info[1]+'</a></li>';
                }

                str+=('<div class="slot">'+
                        '<div class="panel panel-default">'+
                            '<div class="panel-body">'+
                                '<div class="code">'+el.course_id+' '+elabel+'</div>'+
                                '<div class="name">'+el.coursename+'</div>'+
                                '<ul>'+
                                    '<li><span class="glyphicon glyphicon-time"></span> '+formatTime(el.start_time)+'-'+formatTime(el.end_time)+'</li>'+
                                     lecturers +
                                    '<li><span class="glyphicon glyphicon-map-marker"></span> '+el.hallname+'</li>'+
                                '</ul>'+
                            '</div>'+
                        '</div>'+
                    '</div>');

                if(i+1<r.length){
                    freehours=freeHours(el.end_time,r[i+1].start_time);
                    if(freehours>0) {
                        str += ('<div class="slot-free">' +
                            '<div class="panel panel-default">' +
                                '<div class="panel-body"><span class="label label-primary">' + freehours +'</span> hours FREE' +
                                '</div>' +
                            '</div>' +
                        '</div>');
                    }
                }



            }


            if(r.error=="nodata"){
                str+='<div class="alert alert-danger"> No lectures on this day.</div>';
            }



            $('#timetabledata').html(str);
        }
    });
};


var loader=function(){
    loadTimeTable();



};

$(document).ready(function(){
    $('#jday').change(function(){
        loadTimeTable();
    });

    $('#jback').click(function(){
        window.location='home.html';
    });


    $('#jday').val(getToday());

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