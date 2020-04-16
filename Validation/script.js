    function validation() {
        var fName = document.getElementById('fName').value;
        var lName = document.getElementById('lName').value;
        var email = document.getElementById('email').value;
        var age = document.getElementById('age').value;

        if(fName=='' || lName=='' || email=='' || age==''){
            document.getElementById("eresult").innerHTML = "Täyttää kaikki paikat";
            return false;
        }else {
            return true;
        }
    }