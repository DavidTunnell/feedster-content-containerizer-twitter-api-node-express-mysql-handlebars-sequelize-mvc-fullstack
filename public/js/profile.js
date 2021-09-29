//https://dev.to/ara225/how-to-use-bootstrap-modals-without-jquery-3475
//open create feed modal
function openModal() {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("createFeedModal").style.display = "block";
    document.getElementById("createFeedModal").classList.add("show");
}
//close create feed modal
function closeModal() {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("createFeedModal").style.display = "none";
    document.getElementById("createFeedModal").classList.remove("show");
}
//open create feed modal event function
const openCreateFeedModal = async (event) => {
    event.preventDefault();
    openModal();
};

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

//add a new source to feed modal
const addFeedSource = async (event) => {
    event.preventDefault();
    const feedEntryContainer = document.querySelector(".feed-entries");
    const html =
        "<label for='feedTitle'>Enter a Feed Source:</label><input type='text' class='form-control feed-sources' placeholder='@twitter'>";
    feedEntryContainer.innerHTML += html;
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

//hide add button if it's not current logged in users own profile
function toggleAddButton() {
    const loggedInUserId =
        document.querySelector(".logged-in-user-id").innerHTML;
    const profileId = document.querySelector(".current-profile-id").innerHTML;
    if (loggedInUserId !== profileId) {
        document
            .querySelector(".new-feed-button")
            .classList.add("is-invisible");
    }
}

//run on page load
toggleAddButton();

//create click event for create feed button
document
    .querySelector(".new-feed-button")
    .addEventListener("click", openCreateFeedModal);

//add click events for each follow feed button
const followFeedButtons = document.querySelectorAll(".follow-feed-button");
followFeedButtons.forEach((el) =>
    el.addEventListener("click", (event) => followFeedHandler(event))
);

document
    .querySelector(".add-feed-button")
    .addEventListener("click", addFeedSource);

document.querySelector(".submit-feed").addEventListener("click", submitNewFeed);

//decode tweet contents and add links to urls and hashtags
const tweetTexts = document.querySelectorAll(".timeline-Tweet-text");
tweetTexts.forEach((el) => {
    el.innerHTML = decodeHTMLEntities(el.innerHTML);
    if (el.innerHTML.length < 140) {
        el.classList.add("tw-short-text");
    }
});
