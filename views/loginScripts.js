

console.log("LoginScript Running")


function logSubmit() {
    console.log('Login Button Clicked');
  }
  
  window.addEventListener('DOMContentLoaded', function() {
    const form= document.getElementById("loginForm");
    form.addEventListener("submit",async (event) =>{
		//event.preventDefault();
		fetch(event.target.action, {
			method: 'POST',
			body: new URLSearchParams(new FormData(event.target)) // event.target is the form
		}).then((resp) => {
			return resp.json(); // or resp.text() or whatever the server sends
		}).then((body) => {
			document.cookie = body.cookie     //Storing the response JWT as cookie
	
		}).catch(err=>{ console.error(err)
		document.getElementById("res").innerHTML=err
		})
});

});

