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
//var studentId='UWU/CST/16/0001';
var intervalTimer;
var activeMinutes=2;
var activeFound=false;
var formId=0;


var url = 'http://localhost/smartunimobile/student/';

var loader=function(){
    getActiveFeedbackForm();
    window.setInterval(function(){
        getActiveFeedbackForm();
    },5000);
};



var getActiveFeedbackForm = function(){
    if(!activeFound)
        $('#feedback').html('<div id="preloader"></div>');
    $.ajax({
        url: url + 'feedback.php',
        type: 'get',
        dataType: 'json',
        data: {
            'token': 'dev20',
            'getactivefeedback': '1',
            'student': studentId
        },
        success: function (r) {
            if (r.error == 'notfound') {
                /* ------- no active feedbacks --------- */
                $('#feedback').html('<div class="alert alert-info">No active feedback form</div>');
                activeFound=false;
            }
            else if(r.submitted){
                $('#feedback').html('<div class="alert alert-info">You already responded to feedback form of '+r.result[0].course_id+'.</div>');
                activeFound=false;
            }
            else {

                if(!activeFound){

                    formId=r.result[0].id;
                    str='<div ><h3 id="ftitle"></h3><h4 id="ftitle2"></h4><br/>';

                    str+='<ul class="list-group feedbackquestions">';
                    for(i=1; i<=Object.keys(r.questions).length; i++){
                        str+='<li class="list-group-item">' +
                                '<div>'+r.questions['q'+i]+'</div>' +
                                '<div><br/>' +
                                    '<select class="form-control">' +

                                            '<option value="5">Strongly agree</option>'+
                                            '<option value="4">Agree</option>'+
                                            '<option value="3">Neither agree nor disagree</option>'+
                                            '<option value="2">Disagree</option>'+
                                            '<option value="1">Strongly disagree</option>'+

                                    '</select>'+
                                '</div>'+
                            '</li>';
                    }
                    str+='</ul>';

                    str+='<textarea id="jcomment" class="form-control"></textarea>';

                    str+='</div>';

                    str+='<br/s><button class="btn btn-primary" onclick="submitFeedbackForm();"> Submit Form</button><br/><br/s>';
                    $('#feedback').html(str);
                }
                $('#ftitle').html('Feedback form for '+r.result[0].course_id);
                var remMin=(Math.round(r.result[0].seconds/60));
                if(remMin==0)
                    $('#ftitle2').html('finishing soon!!');
                else
                    $('#ftitle2').html(remMin+' minutes remaining');
                activeFound=true;
            }

        }
    });

};




var submitFeedbackForm=function(){
    bootbox.confirm({
        message: "Are you sure you want to submit?",
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

                var comment=$('#jcomment').val();
                var scores=new Array();

                $('.feedbackquestions li').each(function(index,el){
                    scores.push($(el).find('select').val());
                });

                $('#feedback').html('<div id="preloader"></div>');


                $.ajax({
                    url : url + 'feedback.php',
                    type : 'get',
                    dataType : 'json',
                    data :{
                        'token' : 'dev20',
                        'submitfeedbackform' : '1',
                        'student' : studentId,
                        'score' : scores,
                        'comment' : comment,
                        'id' : formId
                    },
                    success : function(r){
                        getActiveFeedbackForm();
                    }
                });
            }
        }
    });
};


$(document).ready(function(){
    loader();
    $('#jback').click(function(){
        window.location='home.html';
    });

    $('#jstartnew').click(function(){
        startFeedbackForm();
    });

    $('#activeminutes li').click(function(){
        activeMinutes= parseInt($(this).text());
        $('#activeminutes li').removeClass('active');
        $(this).addClass('active');
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