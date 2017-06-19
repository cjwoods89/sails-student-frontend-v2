(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of assignment id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=assignment_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getAssignment(record_id){
    return $.get("http://localhost:1337/assignment/" + record_id, function(data){
      console.log("got assignment");
    })
  }



  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageAssignmentForm = $("#manageAssignmentForm");
    let addAssignmentButton = $("#addAssignmentButton");

    $('#assignmentTable').DataTable( {

         dom: 'lBfrtip',
         buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
         colReorder: true,
         "scrollX": true

      }) ;

      var validator = $("#manageAssignmentForm").validate({

        errorClass: "text-danger",
        rules: {
          student_id: {
            min: 1
          },
          assignment_nbr: {
            required: true,
            min: 0
          },
          grade_id: {
            min: 0
          },
          class_id: {
            min: 0
          }
        },
        messages: {
          student_id: {
            min: jQuery.validator.format("IBM ERROR: Below the allowable limit!") // Problem in chair, not in computer
          },
          assignment_nbr: {
            required: "I pity the fool that leaves this blank",
            min: jQuery.validator.format("ID10T ERROR: Below the allowable limit!") // Problem in chair, not in computer
          },
          grade_id: {
            min: jQuery.validator.format("PICNIC ERROR: Below the allowable limit!") // Problem in chair, not in computer
          },
          class_id: {
            min: jQuery.validator.format("PEBKAC ERROR: Below the allowable limit!"), // Problem exists between keyboard and chair
          }
        }

      });


    //add assignment button functionality
    addAssignmentButton.click(function(){

      document.getElementById("manageAssignmentForm").reset();

      manageAssignmentForm.attr("action", "/create_assignment");
      manageAssignmentForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageAssignmentForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageAssignmentForm.submit()
            validator.resetForm();
          }
        }
      });
    })

  	$("#assignmentTable").on("click", "#editButton", function(e){
      document.getElementById("manageAssignmentForm").reset();
      validator.resetForm();
      let recordId = $(this).data("assignmentid")
      manageAssignmentForm.find("input[name=assignment_id]").val(recordId);
      manageAssignmentForm.attr("action", "/update_assignment");
      let assignment = getAssignment(recordId);

      //populate form when api call is done (after we get assignment to edit)
      assignment.done(function(data){
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

      manageAssignmentForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageAssignmentForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageAssignmentForm.submit()
          }
        }
      });
    })


    $("#assignmentTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("assignmentid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Assignment": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
