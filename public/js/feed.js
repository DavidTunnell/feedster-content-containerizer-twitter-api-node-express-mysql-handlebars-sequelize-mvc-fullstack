const submit = document.getElementById("postBtn");

// Event listener for submit comment button
if (submit) {
    submit.addEventListener("click", async (event) => {
        event.preventDefault();
        const commentInput = document
            .querySelector(".comment-input")
            .value.trim();
        const loggedInUserId = event.target.getAttribute(
            "data-logged-in-user-id"
        );
        const currentFeedId = event.target.getAttribute("data-current-feed-id");
        //post to our api
        if (commentInput && loggedInUserId && currentFeedId) {
            const response = await fetch("/api/comments/", {
                method: "POST",
                body: JSON.stringify({
                    comment: commentInput,
                    user_id: loggedInUserId,
                    feed_id: currentFeedId,
                }),
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                document.location.replace(
                    "/feed/" + currentFeedId + "#comment-section"
                );
                document.location.reload();
            } else {
                alert(
                    "Failed to follow feed." +
                        response.status +
                        ": " +
                        response.statusText
                );
            }
        } else {
            alert("Please enter a comment before submitting.");
        }
    });
}

//event action function for following a feed button 
const followFeedHandler = async (event) => {
    event.preventDefault();

    const feed_id = event.currentTarget.getAttribute("data-feed-id");
    const user_following_id = event.currentTarget.getAttribute(
        "data-logged-in-user-id"
    );
    const user_created_id = event.currentTarget.getAttribute(
        "data-user-created-id"
    );
    if (feed_id && user_following_id && user_created_id) {
        const response = await fetch("/api/feedfollowers/", {
            method: "POST",
            body: JSON.stringify({
                feed_id,
                user_following_id,
                user_created_id,
            }),
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            event.target.style.display = "none";
        } else {
            alert(
                "Failed to follow feed." +
                    response.status +
                    ": " +
                    response.statusText
            );
        }
    } else {
        alert("Error");
    }
};

//decode tweet contents and add links to urls and hashtags
const tweetTexts = document.querySelectorAll(".timeline-Tweet-text");
tweetTexts.forEach((el) => (el.innerHTML = decodeHTMLEntities(el.innerHTML)));

//Get the last tweets in each container and style them
var lastTweet = Array.from(
    document
        .querySelector(".card-content")
        .querySelectorAll(".timeline-TweetList-tweet")
).pop();
lastTweet.classList.add("round-bottoms");

//follow a feed when logged in
const followFeedButtons = document.querySelectorAll(".follow-feed-button");
followFeedButtons.forEach((el) =>
    el.addEventListener("click", (event) => followFeedHandler(event))
);
