//https://stackoverflow.com/questions/5796718/html-entity-decode
//turns html symbols to the actual symbol
function decodeHTMLEntities(text) {
    var entities = [
        ["amp", "&"],
        ["apos", "'"],
        ["#x27", "'"],
        ["#x2F", "/"],
        ["#39", "'"],
        ["#47", "/"],
        ["lt", "<"],
        ["gt", ">"],
        ["nbsp", " "],
        ["quot", '"'],
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(
            new RegExp("&" + entities[i][0] + ";", "g"),
            entities[i][1]
        );

    return text;
}

//this code came with the bulma blog template for the hamburger menu on mobile devices
document.addEventListener("DOMContentLoaded", () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
    );

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach((el) => {
            el.addEventListener("click", () => {
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle("is-active");
                $target.classList.toggle("is-active");
            });
        });
    }
});
