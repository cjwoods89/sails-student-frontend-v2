(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of instructor id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=instructor_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getInstructor(record_id){
    return $.get("http://localhost:1337/instructor/" + record_id, function(data){
      console.log("got instructor");
    })
  }



  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageInstructorForm = $("#manageInstructorForm");
    let addInstructorButton = $("#addInstructorButton");

    $('#instructorTable').DataTable( {

         dom: 'lBfrtip',
         buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
         colReorder: true,
         "scrollX": true

      }) ;

      var validator = $("#manageInstructorForm").validate({

        errorClass: "text-danger",
        rules: {
          first_name: {
            required: true,
            minlength: 2
          },
          last_name: {
            required: true,
            minlength: 2
          },
          start_date: {
            required: true,
            dateISO: true
          },
          gpa: {
            min: 0,
            max: 4.0
          },
          sat: {
            min: 400,
            max: 1400
          }
        },
        messages: {
          first_name: {
            required: "I pity the fool that leaves this blank.",
            minlength: jQuery.validator.format("PICNIC ERROR: Please add at least two characters!") // Problem in chair, not in computer
          },
          last_name: {
            required: "I pity the fool that leaves this blank",
            minlength: jQuery.validator.format("PICNIC ERROR: Please add at least two characters!") // Problem in chair, not in computer
          },
          start_date: {
            required: "I pity the fool that leaves this blank",
            dateISO: "ID10T ERROR: You have to use YYYY-MM-DD format!" // Idiot error
          },
          gpa: {
            min: jQuery.validator.format("PEBKAC ERROR: Below the allowable limit!"), // Problem exists between keyboard and chair
            max: jQuery.validator.format("IBM ERROR: Above the allowable limit!") // Idiot Behind Machine
          },
          sat: {
            min: jQuery.validator.format("PEBKAC ERROR: Below the allowable limit!"), // Problem exists between keyboard and chair
            max: jQuery.validator.format("IBM ERROR: Above the allowable limit!") // Idiot Behind Machine
          }
        }

      });

    //add instructor button functionality
    addInstructorButton.click(function(){

      document.getElementById("manageInstructorForm").reset();

      manageInstructorForm.attr("action", "/create_instructor");
      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageInstructorForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageInstructorForm.submit()
            validator.resetForm();
          }
        }
      });
    })

  	$("#instructorTable").on("click", "#editButton", function(e){
      document.getElementById("manageInstructorForm").reset();
      validator.resetForm();
      let recordId = $(this).data("instructorid")
      manageInstructorForm.find("input[name=instructor_id]").val(recordId);
      manageInstructorForm.attr("action", "/update_instructor");
      let instructor = getInstructor(recordId);

      //populate form when api call is done (after we get instructor to edit)
      instructor.done(function(data){
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

      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageInstructorForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })


    $("#instructorTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("instructorid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Instructor": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
