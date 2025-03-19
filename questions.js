/**
 * UNC Chapel Hill Purity Test Questions
 * 
 * Each question represents a college experience that students may or may not have had.
 * The questions are specific to UNC Chapel Hill culture and campus life.
 */

const questions = [
    // Academics
    "Have you ever skipped a class to sleep in?",
    "Have you ever attended class hungover?",
    "Have you ever pulled an all-nighter to study for an exam?",
    "Have you ever fallen asleep during a lecture?",
    "Have you ever asked ChatGPT to write a paper for you?",
    "Have you ever had a class in the Pit?",
    "Have you ever rushed Franklin Street after a Duke basketball game?",
    "Have you ever witnessed the UNC-Duke rivalry in person?",
    "Have you ever had a class with more than 300 students?",
    "Have you ever changed your major?",
    
    // Campus Life
    "Have you ever lived in a dorm?",
    "Have you ever gotten lost on campus?",
    "Have you ever studied in Davis Library past midnight?",
    "Have you ever been to the Silent Sam memorial site?",
    "Have you ever taken the P2P bus after 2 AM?",
    "Have you ever had a meal at Lenoir Dining Hall?",
    "Have you ever taken a nap on the quad?",
    "Have you ever been caught in a torrential downpour without an umbrella on campus?",
    "Have you ever used the UNC tunnel system?",
    "Have you ever attended a UNC basketball game?",
    
    // Franklin Street & Chapel Hill
    "Have you ever participated in Halloween on Franklin Street?",
    "Have you ever eaten at Top of the Hill?",
    "Have you ever ordered Time-Out chicken at 2 AM?",
    "Have you ever eaten at Sup Dogs?",
    "Have you ever ordered a blue cup at He's Not Here?",
    "Have you ever had to wait more than 30 minutes for a table at Sunrise Biscuit Kitchen?",
    "Have you ever eaten at Med Deli?",
    "Have you ever bar-hopped on Franklin Street?",
    "Have you ever had IP3's pizza after midnight?",
    "Have you ever walked from South Campus to Franklin Street?",
    
    // Traditions & Spirit
    "Have you ever rubbed the Davie Poplar tree for good luck?",
    "Have you ever taken a sip from the Old Well on the first day of classes?",
    "Have you ever sung the alma mater at a sporting event?",
    "Have you ever worn Carolina Blue to a UNC game?",
    "Have you ever painted your face for a sporting event?",
    "Have you ever participated in Dance Marathon?",
    "Have you ever attended a UNC football game?",
    "Have you ever participated in a UNC flash mob?",
    "Have you ever done the Tar Heel chant?",
    "Have you ever taken a graduation photo at the Old Well?",
    
    // Social Life
    "Have you ever joined a fraternity or sorority?",
    "Have you ever attended a fraternity/sorority party?",
    "Have you ever dated someone from Duke?",
    "Have you ever been rejected from a party?",
    "Have you ever tailgated before a game?",
    "Have you ever attended Jubilee?",
    "Have you ever been to a party at Shortbread Lofts?",
    "Have you ever been to a club meeting just for the free food?",
    "Have you ever had a crush on a TA?",
    "Have you ever made friends with someone from your dorm floor?",
    
    // Risky Behavior
    "Have you ever been kicked out of a campus building?",
    "Have you ever streaked across campus?",
    "Have you ever been to a party that got shut down by the police?",
    "Have you ever climbed the Bell Tower?",
    "Have you ever skinny-dipped in the campus fountains?",
    "Have you ever snuck into Kenan Stadium after hours?",
    "Have you ever broken into the Arboretum after dark?",
    "Have you ever used a fake ID on Franklin Street?",
    "Have you ever been on academic probation?",
    "Have you ever been caught by an RA for breaking dorm rules?",
    
    // Specific to UNC
    "Have you ever beaten Duke in a game of pickup basketball?",
    "Have you ever spotted Roy Williams on campus?",
    "Have you ever participated in FDOC (First Day of Classes) celebrations?",
    "Have you ever participated in LDOC (Last Day of Classes) celebrations?",
    "Have you ever taken a class with a well-known professor?",
    "Have you ever seen the campus ghost, Gimghoul?",
    "Have you ever visited the Gimghoul Castle?",
    "Have you ever searched for the secret UNC societies?",
    "Have you ever been to the Morehead Planetarium?",
    "Have you ever participated in Holi Moli?",
    
    // Food & Drink
    "Have you ever had a Carolina Brewery beer?",
    "Have you ever tried every food option at the Bottom of Lenoir?",
    "Have you ever had coffee at the Student Stores Starbucks?",
    "Have you ever eaten at Ram's Head Dining Hall?",
    "Have you ever used dining dollars to buy snacks before they expired?",
    "Have you ever ordered food delivery to the library?",
    "Have you ever tried the ice cream at Maple View Farm?",
    "Have you ever had a cookie from Insomnia Cookies after midnight?",
    "Have you ever been to Al's Burger Shack?",
    "Have you ever had a meal at Sutton's Drug Store?",
    
    // Miscellaneous
    "Have you ever attended a protest on campus?",
    "Have you ever voted in a student government election?",
    "Have you ever cried over a midterm?",
    "Have you ever been on campus during a snowstorm?",
    "Have you ever used the campus mental health services?",
    "Have you ever had a class canceled due to a sports championship?",
    "Have you ever worked an on-campus job?",
    "Have you ever witnessed a campus controversy?",
    "Have you ever attended a UNC concert?",
    "Have you ever been featured in the Daily Tar Heel?"
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