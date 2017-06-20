(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student_class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=student_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudent_Class(record_id){
    return $.get("http://localhost:1337/student_class/" + record_id, function(data){
      console.log("got student_class");
    })
  }



  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageStudent_ClassForm = $("#manageStudent_ClassForm");
    let addStudent_ClassButton = $("#addStudent_ClassButton");

    $('#student_classTable').DataTable( {

         dom: 'lBfrtip',
         buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
         colReorder: true,
         "scrollX": true

      }) ;

      var validator = $("#manageStudent_ClassForm").validate({

        errorClass: "text-danger",
        rules: {
          student_class: {
            minlength: 2
          }
        },
        messages: {
          student_class: {
            required: "I pity the fool that leaves this blank",
            minlength: jQuery.validator.format("IBM ERROR: Please add at least two characters!"), // Problem in chair, not in computer
          }
        }

      });


    //add student_class button functionality
    addStudent_ClassButton.click(function(){

      document.getElementById("manageStudent_ClassForm").reset();

      manageStudent_ClassForm.attr("action", "/create_student_class");
      manageStudent_ClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageStudent_ClassForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageStudent_ClassForm.submit()
            validator.resetForm();
          }
        }
      });
    })

  	$("#student_classTable").on("click", "#editButton", function(e){
      document.getElementById("manageStudent_ClassForm").reset();
      validator.resetForm();
      let recordId = $(this).data("student_classid")
      manageStudent_ClassForm.find("input[name=student_class_id]").val(recordId);
      manageStudent_ClassForm.attr("action", "/update_student_class");
      let student_class = getStudent_Class(recordId);

      //populate form when api call is done (after we get student_class to edit)
      student_class.done(function(data){
        $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        });
      })

      manageStudent_ClassForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageStudent_ClassForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageStudent_ClassForm.submit()
          }
        }
      });
    })


    $("#student_classTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("student_classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Student Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
