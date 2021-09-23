const router = require("express").Router();
const { Feeds, Users, FeedSources, Comments } = require("../models");
// const twitterClient = require("../config/twitter-connection");
const twitterHelpers = require("../utils/twitterHelpers");

router.get("/:id", async (req, res) => {
    const feedData = await Feeds.findOne({
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: Users,
                attributes: { exclude: ["password"] },
            },
            {
                model: FeedSources,
            },
        ],
    });
    const feed = feedData.get({ plain: true });
    var tweetArray = [];
    var tweetCount = 2;
    for (let j = 0; j < feed.feed_sources.length; j++) {
        const ele = feed.feed_sources[j];
        var params = { screen_name: ele.source, count: tweetCount };
        var twitterFeed = await twitterHelpers.getTweets(params);
        for (let k = 0; k < twitterFeed.length; k++) {
            const el = twitterFeed[k];
            el.text = twitterHelpers.wrapURL(el.text);
            tweetArray.push(el);
        }
    }
    twitterHelpers.sortTweetArray(tweetArray);
    feed.tweetFeed = tweetArray;
    const commentData = await Comments.findAll({
        where: {
            feed_id: req.params.id,
        },
        include: [
            {
                model: Users,
                attributes: { exclude: ["password"] },
            },
        ],
    });
    const comments = commentData.map((post) => post.get({ plain: true }));
    console.log(feed);
    res.render("feed", {
        loggedIn: req.session.loggedIn,
        loggedInUserData: req.session.loggedInUserData,
        currentFeed: feed,
        feedComments: comments,
    });
});

module.exports = router;
