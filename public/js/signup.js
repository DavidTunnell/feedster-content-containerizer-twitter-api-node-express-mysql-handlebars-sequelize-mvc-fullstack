//sign the user up with data provided by them in inputs
const signupFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector(".username-input").value.trim();
    const email = document.querySelector(".email-input").value.trim();
    const password = document.querySelector(".password-input").value.trim();
    //new accounts by default are not admins
    const is_admin = false;
    if (password.length < 6) {
        alert("The minimum password length is 6 characters.");
    } else if (username && email && password) {
        const response = await fetch("/api/users/", {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
                is_admin,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            document.location.replace("/");
        } else {
            // need to convert this alert to modal: https://kanecohen.github.io/modal-vanilla/
            alert(
                "Failed to sign up. " +
                    response.status +
                    ": " +
                    response.statusText
            );
        }
    } else {
        alert("Please fill out all fields.");
    }
};

//add a click event to the signup form button
document
    .querySelector(".signup-button")
    .addEventListener("click", signupFormHandler);
