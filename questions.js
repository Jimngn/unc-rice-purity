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
    "Got locked inside Davis after it closed?",
    "Camped a study room (6+ hours)?",
    "Forgotten to return a book from the library?",
    "Used AI tools like GPT to complete homework?",
    "Been late to class because of parking?",
    "Turned in an assignment at 11:59 PM?",
    "Cheated on an exam?",
    "Been caught cheating by a professor or TA?",
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
    "Had to get a replacement key or fob?",
    "Eaten at Lenoir or Chase?",
    "Gotten sick from dining hall food?",
    "Used your meal swipes to feed a friend?",
    "Ordered food through delivery services to campus?",
    "Used the P2P bus after midnight?",
    "Missed the last P2P bus and had to walk back?",
    "Complained about the lack of parking on campus?",
    "Got a parking ticket?",
    "Got more than 5 parking tickets?",
    "Posted on the UNC subreddit or Yik Yak?",
    "Been in a picture on the official UNC social media or Barstool?",
    "Worked out at the campus gym?",
    "Participated in intramural sports?",
    "Attended a UNC sporting event?",
    "Painted your face for a game?",
    "Rushed Franklin Street after beating Duke?",
    "Participated in the Pit Preacher debates?",
    "Taken a picture at the Old Well on the first day of classes?",
    "Drank from the Old Well on the first day of classes for good luck?",
    "Taken a photo with Rameses?",
    "Done the Tar Heel chant?",
    "Streaked from the top of Davis Library the night before finals?",

    // Social Life
    "Attended a frat party?",
    "Been to a party at a house on MLK?",
    "Been to a party at Shortbread Lofts?",
    "Been to Top of the Hill?",
    "Hosted a party at your house or dorm?",
    "Drank a Blue Cup at He's Not Here?",
    "Got into a bar/club on Franklin Street with a fake ID?",
    "In a fraternity or sorority?",
    "Rushed for Greek life?",
    "Joined a club or student organization?",
    "Held a leadership position in a club?",
    "Organized an event on campus?",
    "Attended a protest on campus?",
    "Soaked up booze at Cosmic Catina or Time Out?",
    "Went to Crumbl Cookies at 2 AM to use the free throw code?",
    "Threw hands with Duke students?",

    // Relationships & Personal
    "Held hands romantically on campus?",
    "Kissed someone on campus?",
    "Hooked up on campus?",
    "Hooked up in a campus building?",
    "Hooked up in a Library?",
    "Hooked up in the Arboretum?",
    "Hooked up using Yik Yak (After Dark)?",
    "Hooked up with a frat brother to avoid getting kicked out of the party?",
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
    "Woke up in a stranger's bed after a night out?",
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
    { min: 0, max: 20, title: "Carolina Legend", description: "Your liver deserves a separate diploma. You've experienced everything Chapel Hill has to offer and might have invented a few new traditions along the way." },
    { min: 21, max: 40, title: "Ram Rampager", description: "You've mastered the art of balancing hangovers with homework. Your parents would be equally proud and horrified." },
    { min: 41, max: 60, title: "Red Cup Collector", description: "You've dabbled in the Carolina experience but still have a few unexplored corners of campus. Your liver functions at approximately 75% capacity." },
    { min: 61, max: 80, title: "Library Dweller", description: "You've heard rumors of this thing called 'fun' but can't find it in the course catalog. Your GPA is inversely proportional to your social life." },
    { min: 81, max: 100, title: "Franklin Street Virgin", description: "You think Top of the Hill is just a geographical location. Your dorm room has seen more of you than the entire campus combined." }
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