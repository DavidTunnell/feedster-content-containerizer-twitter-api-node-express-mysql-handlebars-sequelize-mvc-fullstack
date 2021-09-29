//follow a feed logged in
const followFeedHandler = async (event) => {
    event.preventDefault();

    const feed_id = event.target.getAttribute("data-feed-id");
    const user_following_id = event.target.getAttribute(
        "data-logged-in-user-id"
    );
    const user_created_id = event.target.getAttribute("data-user-created-id");

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

//create feed: http://localhost:3001/api/feeds/
/*
{
   "title":"Node.js Programming",
   "user_id":"1",
   "sources":[
      {
         "source":"@nodejs"
      },
      {
         "source":"@trott"
      },
      {
         "source":"@adamzdanielle"
      }
   ]
}
*/
const submitNewFeed = async (event) => {
    event.preventDefault();
    const feedTitle = document.querySelector("#feedTitle").value;
    const elements = document.querySelectorAll(".feed-sources");
    const loggedInUserId = event.target.getAttribute("data-logged-in-user-id");
    const sourceArray = [];
    elements.forEach((element) => {
        sourceArray.push(element.value);
    });
    let json = `
        {
        "title":"${feedTitle}",
        "user_id":"${loggedInUserId}",
        "sources":[`;
    let sourcesJson = "";
    sourceArray.forEach((element) => {
        sourcesJson += `{"source":"${element}"},`;
    });
    sourcesJson = sourcesJson.substring(0, sourcesJson.length - 1);
    let endOfJson = "]}";
    const combinedJson = json + sourcesJson + endOfJson;
    console.log(combinedJson);
    if (loggedInUserId && feedTitle && sourceArray) {
        const response = await fetch("/api/feeds/", {
            method: "POST",
            body: combinedJson,
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            document.location.replace("/profile/" + loggedInUserId);
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

//add a new source to feed modal
const addFeedSource = async (event) => {
    event.preventDefault();
    const feedEntryContainer = document.querySelector(".feed-sources");
    if (feedEntryContainer.childElementCount <= 5) {
        const html = `<div class="control feed-inputs"><input class="input" type="text" placeholder="@twitter" required></div>`;
        feedEntryContainer.innerHTML += html;
    } else {
        alert("You have reached the max amount of feeds that can be added.");
    }
};

//hide add button if it's not current logged in users own profile
function toggleAddButton() {
    const loggedInUserId =
        document.querySelector(".logged-in-user-id").innerHTML;
    const profileId = document.querySelector(".current-profile-id").innerHTML;
    if (loggedInUserId !== profileId) {
        document
            .querySelector(".new-feed-button") //needs to be the container/card
            .classList.add("is-invisible");
    }
}

//run on page load
toggleAddButton();

//add click events for each follow feed button
const followFeedButtons = document.querySelectorAll(".follow-feed-button");
followFeedButtons.forEach((el) =>
    el.addEventListener("click", (event) => followFeedHandler(event))
);

document
    .querySelector(".add-feed-button")
    .addEventListener("click", addFeedSource);

// document.querySelector(".submit-feed").addEventListener("click", submitNewFeed);

//decode tweet contents and add links to urls and hashtags
const tweetTexts = document.querySelectorAll(".timeline-Tweet-text");
tweetTexts.forEach((el) => {
    el.innerHTML = decodeHTMLEntities(el.innerHTML);
    if (el.innerHTML.length < 140) {
        el.classList.add("tw-short-text");
    }
});

//create click event for exit create feed modal
document.querySelector(".close-modal").addEventListener("click", function () {
    document.querySelector(".create-feed-modal").classList.remove("is-active");
});

//create click event for create new feed button
document
    .querySelector(".new-feed-button")
    .addEventListener("click", function () {
        document.querySelector(".create-feed-modal").classList.add("is-active");
    });
