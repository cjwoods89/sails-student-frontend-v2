(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of major_class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=major_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajor_Class(record_id){
    return $.get("http://localhost:1337/major_class/" + record_id, function(data){
      console.log("got major_class");
    })
  }



  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageMajor_ClassForm = $("#manageMajor_ClassForm");
    let addMajor_ClassButton = $("#addMajor_ClassButton");

    $('#major_classTable').DataTable( {

         dom: 'lBfrtip',
         buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
         colReorder: true,
         "scrollX": true

      }) ;

      var validator = $("#manageMajor_ClassForm").validate({

        errorClass: "text-danger",
        rules: {
          major_id: {
            min: 0
          },
          class_id: {
            min: 0
          }
        },
        messages: {
          major_id: {
            required: "I pity the fool that leaves this blank",
            minlength: jQuery.validator.format("IBM ERROR: Please add at least 1 digit!") // Problem in chair, not in computer
          },
          class_id: {
            required: "I pity the fool that leaves this blank",
            minlength: jQuery.validator.format("PEBKAC ERROR: Please add at least 1 digit!") // Problem in chair, not in computer
          }
        }

      });


    //add major_class button functionality
    addMajor_ClassButton.click(function(){

      document.getElementById("manageMajor_ClassForm").reset();

      manageMajor_ClassForm.attr("action", "/create_major_class");
      manageMajor_ClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageMajor_ClassForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageMajor_ClassForm.submit()
            validator.resetForm();
          }
        }
      });
    })

  	$("#major_classTable").on("click", "#editButton", function(e){
      document.getElementById("manageMajor_ClassForm").reset();
      validator.resetForm();
      let recordId = $(this).data("major_classid")
      manageMajor_ClassForm.find("input[name=major_class_id]").val(recordId);
      manageMajor_ClassForm.attr("action", "/update_major_class");
      let major_class = getMajor_Class(recordId);

      //populate form when api call is done (after we get major_class to edit)
      major_class.done(function(data){
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

      manageMajor_ClassForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageMajor_ClassForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageMajor_ClassForm.submit()
          }
        }
      });
    })


    $("#major_classTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("major_classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Major Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
