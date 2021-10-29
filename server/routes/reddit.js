const express = require("express");
const axios = require("axios");

const router = express.Router();
const cache = require("../utils");

router.get("/", (req, res) => {
    const query = req.query.q;
	const sort = req.query.sort;
	const limit = req.query.limit;
    
    if(query == undefined){
        return res.status(400).json({status: false});
    }
    
    if(query.length > 5) {
        return res.status(200).json({status: true,
        data: [
            `What has Donald Trump done to get the massive following he has?  \
\
I was in my early 20’s when he announced he would be running for president. All I ever saw was him just saying the stupidest things or making real poor decisions. But yet, almost half the country swore him a god. I just never understood it. And still don’t. People are STILL waving there Trump flags and “spitting the truth”. \
Now, I’m not saying I absolutely hate the guy like a lot of people. I’m quite an open minded person and always get both sides of a situation before making a solid opinion. But for me it was always hard it seemed to get the “good” side of Trump that apparently all these people see. Like from news articles or word of mouth. I know the news media played a part and only shit on him constantly, but I’d like to know what they didn’t cover. So that brings us to;\
\
What are some of the things Trump has done that was good? And could make him “the greatest president of all time” as some people claim.\
\
Why do these people basically base there personality and life on this guy?\
\
Edit - Okay guys, enough with the senseless insults and sarcastic reply’s. I’m looking for serious info and a decent discussion.\
\
Edit 2 - I like how I’m being downvoted for asking a legit question trying to further educate myself and not remain ignorant. Classic.`, 




        `I was hoping to leave this feedback through an official channel but can't for the life of me find the 2042 Beta feedback form so I'll leave it here and just pray that I'm heard...
Drone specialist ability feels lame, it can’t tag targets for extended times so it's not helpful for me or my team once I leave the drone view. I just doesn’t seem that useful overall compared to the turret or grapple hook or other specialist abilities.

Visibility outside of vehicles vs inside is night and day. Especially during night, rain, etc. I found this to be especially problematic flying the helicopter in the rain. There was a 0% chance i could spot an enemy from inside the cockpit, then I clicked to get the 3rd person view and it was clear as day! I think you need to tone down the water droplets and visual effects when in the helicopter and it provides a pretty unfair disadvantage to those who want to fly first-person! As someone who LOVES flying first-person in the vehicles in battlefield games this seemed almost game-breaking to me. LIke I had to almost constantly switch views to spot targets then switch back into the cockpit to aim/fire at them. It was quite frustrating.

Gun Mags and reloading doesn't seem to make sense to me. Extended mag stuck at 20 rounds and can’t reload it. Half the time I just switch mag sizes to reload or get more ammo when I appear to have run out. There’s something off with this or the UI doesn’t explain it well. I'm not sure, but I just assumed it was broken during beta.

These are things that I see you've addressed in your recent "Changes since beta" post so I'm very thankful!

    Can’t tag targets well with R1. It’s hard to tag a person vs saying “Go here”.

    It’s not clear who’s squad I’m in or how to move through squads. The UIUX Is bad around that.`,
        
        `IN DEFENSE OF CYBERPUNK 2077-OPINION OF A FAN
I have been having more fun with Cyberpunk 2077 than I've had with a new game in years. The studio that gave us the Witcher 3, with 40 hr dlc for $10 (HoS) and 70hr dlc for $20 (BaW), and was so good to its fans, has been literally abandoned by the entire gaming community worldwide. I am amazed that "gamers" can hate so passionately what hundreds of people spent years of their lives putting their energy into. The game is well-written, well-acted, gorgeous, filled with deep systems, a huge variety of items to loot/craft/buy, legendary/iconic armor and weapons, the sickest looking vehicles I've personally every seen in a game, and the city itself, as someone who has played AAA games seriously for 15 years, is an undeniable work of wonder. I barely fast-travel just to see as much of it as I can in the travel interim between missions. I am playing on Google Stadia, no lag or latency, some bugs but in the most ambitious open world map I've ever seen it comes with the territory. Why play games if you hate them all? A similar outpouring of hate and venom came streaming out of thousands of useless consumer-critics' accounts on gaming review aggregate sites all over the net when The Last Of Us Part ll came out, which polarized because it was literary in its ambition as a story; incorporating dark, explorative themes of vengeance and trauma into the narrative-fabric and using the unique "interactive-movie" potential of the video game medium to tell the story in a visceral way that makes the player almost complicit in the harrowing scenes taking place on screen. Never mind the journalists criticizing CP2077 for "not having trans characters play a large role" or "not letting V be trans"; that stems from a totally different, cultural issue bubbling to the surface today. What concerns me most, and should concern you as well because you are lucid enough to see the game for what it is despite the narrative spun by culture around it, is the viscousness of the gaming community in response to the game. Unfortunately, I think a lot of gamers who say negative things about it, haven't beaten the game, or couldn't beat it as it was unplayable for a lot of people on last gen consoles. The only thing I fault CD Projekt for is having released it at all on last gen hardware, that was a clear mistake. The game itself is phenomenal in my opinion. I predict that in several years it will be remembered as a masterpiece; especially after DLC, more patches, expansions etc.`
        ]});
    } else {
        return res.status(200).json({status: false});
    }
});

module.exports = router;


