//logout user from client to api
const logout = async () => {
    const response = await fetch("/api/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        alert("Failed to log out. Are you currently logged in?");
    }
};

//automatically logout when the user hits the page
logout();
