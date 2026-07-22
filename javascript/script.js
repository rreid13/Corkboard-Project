fetch("JSONfiles/reminders.json")
    .then(response => {
        console.log("Response:", response);
        return response.json();
    })
    .then(data => {
        console.log("Data:", data);
    })
    .catch(error => {
        console.error(error);
    });