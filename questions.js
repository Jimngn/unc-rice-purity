/**
 * UNC Chapel Hill Purity Test Questions
 * 
 * Each question represents a college experience that students may or may not have had.
 * The questions are specific to UNC Chapel Hill culture and campus life.
 */

const questions = [
    // Academic Life
    "Current student at UNC Chapel Hill?",
    "Thought about transferring to Duke?",
    "Applied to (or in) graduate school at UNC?",
    "Got locked in Davis after it closed?",
    "Camped a study room (6+ hours)?",
    "Forgotten to return a book from the library?",
    "Used AI tools like GPT to complete homework?",
    "Been late to class because of parking?",
    "Turned in an assignment at 11:59 PM?",
    "Cheated on an exam?",
    "Been caught cheating by a professor?",
    "Skipped a class?",
    "Skipped a whole class for the entire semester?",
    "Attended less than 5 lectures through a term?",
    "Had to carry a group project?",
    "Been the one carried in a group project?",
    "Placed a review on Rate My Professor?",
    "Failed a class?",
    "Retook a class?",
    "Changed your major?",
    "Had an 8 AM class?",
    "Had a class that ended later than 7 PM?",

    // Campus Life
    "Lived in a residence hall?",
    "Lived in Granville Towers?",
    "Lived on South Campus?",
    "Lived on North Campus?",
    "Complained about campus construction?",
    "Lost your OneCard?",
    "Had to get a replacement OneCard?",
    "Eaten at Lenoir Dining Hall?",
    "Gotten sick from dining hall food?",
    "Ordered food through delivery services to campus?",
    "Used the P2P bus after midnight?",
    "Missed the last P2P bus and had to walk back?",
    "Complained about the lack of parking on campus?",
    "Got a parking ticket?",
    "Got more than 5 parking tickets?",
    "Posted on the UNC subreddit?",
    "Worked out at the campus gym?",
    "Participated in intramural sports?",
    "Attended a UNC sporting event?",
    "Painted your face for a game?",
    "Rushed Franklin Street after beating Duke?",
    "Participated in the Pit Preacher debates?",
    "Taken a picture at the Old Well on the first day of classes?",
    "Drank from the Old Well on the first day of classes for good luck?",
    "Taken a graduation photo at the Old Well?",
    "Taken a photo with Rameses?",
    "Done the Tar Heel chant?",
    "Streaked from the top of Davis Library the night before finals?",

    // Social Life
    "Attended a frat party?",
    "Been to a party at a house on MLK?",
    "Been to a party at Shortbread Lofts?",
    "Been to Top of the Hill?",
    "Been to He's Not Here?",
    "Drank a Blue Cup at He's Not?",
    "Been to a bar on Franklin Street with a fake ID?",
    "Joined a fraternity or sorority?",
    "Rushed for Greek life?",
    "Joined a cultural organization?",
    "Joined a club or student organization?",
    "Held a leadership position in a club?",
    "Organized an event on campus?",
    "Attended a protest on campus?",
    "Used the phrase 'What is it that binds us to this place'?",
    "Called NC State students 'farmers without land'?",
    "Chanted 'Don't give a damn about Duke University'?",
    "Said 'Chew tobacco, chew tobacco, chew tobacco, spit. If you ain't a Tar Heel, you ain't shit'?",

    // Relationships & Personal
    "Held hands romantically on campus?",
    "Kissed someone on campus?",
    "Hooked up on campus?",
    "Hooked up in a campus building?",
    "Hooked up in Davis Library?",
    "Hooked up in the Arboretum?",
    "Hooked up using Yik Yak (UNC After Dark)?",
    "Been in a relationship with another UNC student?",
    "Been in a relationship with a TA?",
    "Been in a relationship with a professor?",
    "Kicked a roommate out to commit a sexual act?",
    "Been walked in on while engaging in a sexual act?",
    "Had a pregnancy scare with another UNC student?",

    // Substances & Risky Behavior
    "Drank alcohol on campus?",
    "Been drunk at a UNC sporting event?",
    "Smoked on campus?",
    "Vaped in class?",
    "Used marijuana on campus?",
    "Used a drug stronger than marijuana on campus?",
    "Gone to class drunk/high?",
    "Had severe memory loss due to alcohol at a campus event?",
    "Passed out at a party?",
    "Had the police called on you at a party?",
    "Run from campus police?",
    "Been questioned by campus police?",
    "Been handcuffed by campus police?",
    "Been arrested on or near campus?",
    "Been sent to the Dean of Students for a disciplinary infraction?",
    "Been put on academic or disciplinary probation?",
    "Committed an act of vandalism on campus?",
    "Stolen something from campus (signs, equipment, etc.)?",
    "Broken into a campus building after hours?",
];

// Score ranges and descriptions for interpreting results
const scoreRanges = [
    { min: 0, max: 20, title: "True Blue Tar Heel", description: "You've fully embraced the UNC experience! You've done almost everything there is to do at Carolina and have the stories (and possibly academic probation) to prove it." },
    { min: 21, max: 40, title: "Chapel Thrill Seeker", description: "You've had your fair share of Carolina experiences, balancing fun and academics. You've definitely made the most of your time on campus!" },
    { min: 41, max: 60, title: "Moderate Heel", description: "You've participated in many UNC traditions but still have some experiences to check off your Carolina bucket list." },
    { min: 61, max: 80, title: "Cautious Carolina", description: "You're focused more on academics than the full college experience. Try stepping out of your comfort zone to embrace more UNC traditions!" },
    { min: 81, max: 100, title: "Pristine Purity", description: "You're keeping it very clean at UNC! While your GPA probably thanks you, college is about more than just classes. Don't forget to have some fun!" }
];

// Initial fake statistics data (will be replaced with real data as users take the test)
const initialStatistics = {};

// Initialize each question with a random percentage between 20% and 70%
questions.forEach((question, index) => {
    initialStatistics[index] = Math.floor(Math.random() * 50) + 20; // Random number between 20 and 70
});

// Export the data so it can be used in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { questions, scoreRanges, initialStatistics };
} 