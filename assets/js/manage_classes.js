(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getClass(record_id){
    return $.get("http://localhost:1337/class/" + record_id, function(data){
      console.log("got class");
    })
  }



  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageClassForm = $("#manageClassForm");
    let addClassButton = $("#addClassButton");

    $('#classTable').DataTable( {

         dom: 'lBfrtip',
         buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
         colReorder: true,
         "scrollX": true

      }) ;

      var validator = $("#manageClassForm").validate({

        errorClass: "text-danger",
        rules: {
          instructor_id: {
            minlength: 1
          },
          subject: {
            required: true,
            minlength: 2,
            maxlength: 30
          },
          course: {
            required: true,
            minlength: 1
          }
        },
        messages: {
          instructor_id: {
            minlength: jQuery.validator.format("PICNIC ERROR: Please add at least 1 digit!") // Problem in chair, not in computer
          },
          subject: {
            required: "I pity the fool that leaves this blank",
            minlength: jQuery.validator.format("IBM ERROR: Please add at least two characters!"), // Problem in chair, not in computer
            maxlength: jQuery.validator.format("ID10T ERROR: Cannot exceed 30 characters!") // Problem in chair, not in computer
          },
          course: {
            required: "I pity the fool that leaves this blank",
            minlength: jQuery.validator.format("PEBKAC ERROR: Please add at least 1 digit!") // Problem in chair, not in computer
          }
        }

      });


    //add class button functionality
    addClassButton.click(function(){

      document.getElementById("manageClassForm").reset();

      manageClassForm.attr("action", "/create_class");
      manageClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageClassForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageClassForm.submit()
            validator.resetForm();
          }
        }
      });
    })

  	$("#classTable").on("click", "#editButton", function(e){
      document.getElementById("manageClassForm").reset();
      validator.resetForm();
      let recordId = $(this).data("classid")
      manageClassForm.find("input[name=class_id]").val(recordId);
      manageClassForm.attr("action", "/update_class");
      let currentClass = getClass(recordId);

      //populate form when api call is done (after we get class to edit)
      currentClass.done(function(data){
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

      manageClassForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageClassForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageClassForm.submit()
          }
        }
      });
    })


    $("#classTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
