//This file can be deleted
const bcrypt=require("bcrypt")

myPlaintextPassword="passwordgokul"
saltRounds=10
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash)
});

hash1="$2b$10$GsD4F.sDZZpJyRFQIzQ2tOhe0DfLmJnT/zOtEtx2i9q9KYXCAFvH."
myPlaintextPassword1="passwordgokul"
bcrypt.compare(myPlaintextPassword1, hash1, function(err, result) {
    // result == true
    console.log(result)
});
