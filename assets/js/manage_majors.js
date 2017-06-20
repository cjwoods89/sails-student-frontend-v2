(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of major id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=major_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajor(record_id){
    return $.get("http://localhost:1337/major/" + record_id, function(data){
      console.log("got major");
    })
  }



  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageMajorForm = $("#manageMajorForm");
    let addMajorButton = $("#addMajorButton");

    $('#majorTable').DataTable( {

         dom: 'lBfrtip',
         buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
         colReorder: true,
         "scrollX": true

      }) ;

      var validator = $("#manageMajorForm").validate({

        errorClass: "text-danger",
        rules: {
          major: {
            minlength: 2
          },
          sat: {
            min: 400,
            max: 1400
          }
        },
        messages: {
          major: {
            required: "I pity the fool that leaves this blank",
            minlength: jQuery.validator.format("IBM ERROR: Please add at least two characters!"), // Problem in chair, not in computer
          },
          sat: {
            min: jQuery.validator.format("PEBKAC ERROR: Below the allowable limit!"), // Problem exists between keyboard and chair
            max: jQuery.validator.format("IBM ERROR: Above the allowable limit!") // Idiot Behind Machine
          }
        }

      });


    //add major button functionality
    addMajorButton.click(function(){

      document.getElementById("manageMajorForm").reset();

      manageMajorForm.attr("action", "/create_major");
      manageMajorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageMajorForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageMajorForm.submit()
            validator.resetForm();
          }
        }
      });
    })

  	$("#majorTable").on("click", "#editButton", function(e){
      document.getElementById("manageMajorForm").reset();
      validator.resetForm();
      let recordId = $(this).data("majorid")
      manageMajorForm.find("input[name=major_id]").val(recordId);
      manageMajorForm.attr("action", "/update_major");
      let major = getMajor(recordId);

      //populate form when api call is done (after we get major to edit)
      major.done(function(data){
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

      manageMajorForm.dialog({
        title: "Update Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            document.getElementById("manageMajorForm").reset();
            validator.resetForm();
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageMajorForm.submit()
          }
        }
      });
    })


    $("#majorTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("majorid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Major": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
