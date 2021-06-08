

console.log("Hello")

// async function login (event){
//      // TODO do something here to show user that form is being submitted
// 	 fetch(event.target.action, {
//         method: 'POST',
//         body: new URLSearchParams(new FormData(event.target)) // event.target is the form
//     }).then((resp) => {
//         return resp.json(); // or resp.text() or whatever the server sends
//     })
// 	// .then((body) => {
//     //     // TODO handle body
// 	// 	console.log(body)
// 	// 	const jwt= body.token
// 	// 	fetch("/userhome",{
// 	// 		headers:{
// 	// 			Authorization: `Bearer ${body.token}`,
// 	// 			'Content-Type': 'application/json'
// 	// 		},
// 	// 		method: "GET"
// 	// 	}).catch(err=> console.error(err))
//  	// })
// 	.catch(er=>{
//         // TODO handle error
// 		console.error(er)
//     });

// }



function logSubmit() {
    console.log('Login Button Clicked');
  }
  

window.addEventListener('DOMContentLoaded', function() {
    const form= document.getElementById("loginForm");
    form.addEventListener("submit",async (event) =>{
		// event.preventDefault();
		// TODO do something here to show user that form is being submitted
		fetch(event.target.action, {
			method: 'POST',
			body: new URLSearchParams(new FormData(event.target)) // event.target is the form
		}).then((resp) => {
			return resp.json(); // or resp.text() or whatever the server sends
		}).then((body) => {
			// TODO handle body
			console.log(body)
			console.log(body.token)
			document.cookie = body.cookie     //Storing the response JWT as cookie
	
			// fetch("/userhome",{
			// 	headers:{
			// 		Authorization: `Bearer ${body.token}`,
			// 		'Content-Type': 'application/json'
			// 	},
			// 	method: "GET"
				// ,body: JSON.stringify({
				// 	"emp_id": 1234,
				// 	"tts_code":"TRG"
				// })
			}).catch(err=> console.error(err))
		
			
			
			.catch(er=>{
			// TODO handle error
			console.error(error)
		});
});

});

