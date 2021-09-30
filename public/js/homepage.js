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

//follow a feed when logged in
const followFeedButtons = document.querySelectorAll(".follow-feed-button");
followFeedButtons.forEach((el) =>
    el.addEventListener("click", (event) => followFeedHandler(event))
);

//decode tweet contents and add links to urls and hashtags
const tweetTexts = document.querySelectorAll(".timeline-Tweet-text");
tweetTexts.forEach((el) => {
    el.innerHTML = decodeHTMLEntities(el.innerHTML);
    if (el.innerHTML.length < 130) {
        el.classList.add("tw-short-text");
    }
});

//Get the last tweets in each container and style them
const feedContainers = document.querySelectorAll(".card-content");
feedContainers.forEach((el) => {
    var lastTweet = Array.from(el.querySelectorAll(".tw-block-parent")).pop();
    lastTweet.classList.add("round-bottoms");
});
