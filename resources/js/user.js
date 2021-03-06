jQuery(document).ready(function() {   
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    }); 

    $(".role").change(function(){
        if( $(this).val() == 2 ){
            $(".type_role").show();
        }else{
           $(".type_role").hide();
        }
    });

    $("#add_user").on('click', function(e){
        e.preventDefault();

        if ($('.register-form').validate({          
            rules : {
                'email': {
                    email:true
                },
                'password' : {
                    minlength : 8
                },
                'password_confirmation' : {
                    minlength : 8,
                    equalTo : "#password"
                }
            }
        }).form()) {
           
        }else{
            console.log("eeee");
            return false;
        }

        $username = $(this).find('input[name="username"]');

        var url = '/register_nl';

        $.ajax({
            type: "post",
            url: url,
            data: $(this).closest("form.register-form").serialize()+ '&_token=' +  $("input[name='_token']").val(),
            dataType: "json",
            success: function(res){
                console.log(res);
                if(res.success){
                    toastr["success"]("更新されました", "成功!")
                    window.location.reload();
                } else {
                    toastr["error"]("失敗した!", "失敗!")
                }
            }
        });
        return false;
    });

    $("#edit_user").on('click', function(e){
        e.preventDefault();

        if ($('.register-form').validate({          
            rules : {
                'email': {
                    email:true
                }
            }
        }).form()) {
           
        }else{
            console.log("edit");
            return false;
        }

        $username = $(this).find('input[name="username"]');

        var url = '/user/edit';

        $.ajax({
            type: "post",
            url: url,
            data: $(this).closest("form.edit-form").serialize() + '&_token=' +  $("input[name='_token']").val(),
            dataType: "json",
            success: function(res){
                console.log(res);
                if(res.success){
                    toastr["success"]("更新されました", "成功!")
                    window.location.reload();
                } else {
                    toastr["error"]("失敗した!", "失敗!")
                }
            }
        });
        return false;
    });

    $(".usertype").change(function(e){
        e.preventDefault();
        if( $(this).val() ){
            var the = $(this);
            swal({
                title: "",
                text: "更新しますか？",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "確認",
                cancelButtonText: "キャンセル",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm) {
                if (isConfirm) {
                   $.ajax({
                        type: "post",
                        url: '/user/change_usertype',
                        data: {user_type: the.val(), user_id: the.attr('user-id'), _token: $("input[name='_token']").val()},
                        dataType: "json",
                        success: function(res){
                            console.log(res);
                            if(res.success){
                                toastr["success"]("更新されました", "成功!")                                
                            } else {                                
                                toastr["error"]("失敗した!", "失敗!")
                            }
                        }
                    });                     
                }             
            });
        }
        return false;           
    });

    $("#user_table").on('click', '.edit', function (e) {
        e.preventDefault();

        var nRow = $(this).parents('tr');
        var data_id = $(nRow).attr("data-id") ;

        $.ajax({
            type: "post",
            url: '/user/info',
            data: {'user_id': data_id, _token: $("input[name='_token']").val()},
            dataType: "json",
            success: function(res){                            
                if(res.success){      
                    $("#edit_role_modal").find("input[name='user_id']").val(data_id);            
                    $("#edit_role_modal").find("input[name='email']").val(res.user[0].email);
                    $("#edit_role_modal").find("input[name='username']").val(res.user[0].username);
                    $("#edit_role_modal").find("select[name='user_type']").val(res.user[0].user_type);
                    $("#edit_role_modal").find("input[name='first_name']").val(res.user[0].first_name);
                    $("#edit_role_modal").find("input[name='last_name']").val(res.user[0].last_name);
                    $("#edit_role_modal").find("input[name='position']").val(res.user[0].position);
                    $("#edit_role_modal").find("input[name='phone']").val(res.user[0].phone);
                    $("#edit_role_modal").find("input[name='company']").val(res.user[0].company);                                        
                }
            }
        });
    });  

    $("#user_table").on('click', '.delete', function (e) {
            e.preventDefault();

            var nRow = $(this).parents('tr');
            var data_id = $(nRow).attr("data-id") ;

            swal({
                title: "",
                text: "削除しますか？",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "確認",
                cancelButtonText: "キャンセル",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm) {
                if (isConfirm) {

                    $.ajax({
                        type: "post",
                        url: '/user/delete',
                        data: {'user_id': data_id, _token: $("input[name='_token']").val()},
                        dataType: "json",
                        success: function(res){                            
                            if(res.success){
                                toastr["success"](res.msg, "成功!")
                                window.location.reload();
                            } else {
                                toastr["error"](res.msg, "失敗!")
                            }
                        }
                    });
                } 
            });
        });

});