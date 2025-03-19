/**
 * UNC Chapel Hill Purity Test Questions
 * 
 * Each question represents a college experience that students may or may not have had.
 * The questions are specific to UNC Chapel Hill culture and campus life.
 */

const questions = [
    // Campus Traditions & Locations
    "Drank from the Old Well on the first day of classes for good luck?";
    "Stepped on the UNC seal in front of Wilson Library despite the superstition?";
    "Climbed to the top of the Bell Tower?";
    "Taken a photo at the Old Well in graduation regalia?";
    "Visited the Ackland Art Museum?";
    "Attended a performance at Memorial Hall?";
    "Studied in the Arboretum?";
    "Had a picnic in the Coker Arboretum?";
    "Studied at Davis Library until closing time?";
    "Completed an all-nighter at the Undergraduate Library (UL)?";
    "Watched the sunset from the steps of Wilson Library?";
    "Visited the Morehead Planetarium?";

    // Sports & School Spirit
    "Attended a UNC basketball game at the Dean Dome?";
    "Painted your face Carolina blue for a sports event?";
    "Rushed Franklin Street after beating Duke?";
    "Attended a Duke vs. UNC game in person?";
    "Taken a photo with Rameses (the mascot)?";
    "Skipped class to watch a UNC basketball game?";
    "Attended a UNC football game at Kenan Stadium?";
    "Booed Duke players during a basketball game?";
    "Worn Duke blue on campus accidentally?";
    "Participated in the Tar Heel Marathon?";
    "Owned five or more items of UNC merchandise?";
    "Defended UNC during a sports scandal conversation?";

    // Academic Life
    "Changed your major at UNC?";
    "Failed a class at UNC?";
    "Had a class with over 300 students?";
    "Fallen asleep during a lecture in a large auditorium?";
    "Had a class canceled because the professor didn't show up?";
    "Used a previous student's notes or test materials?";
    "Used AI tools like ChatGPT to complete homework?";
    "Been caught for academic dishonesty?";
    "Pulled an all-nighter to finish a project or study for an exam?";
    "Turned in an assignment at 11:59 PM?";
    "Had to carry a group project by yourself?";
    "Been the one who needed carrying in a group project?";
    "Placed a review on Rate My Professor?";
    "Skipped a whole class for the entire semester?";
    "Attended less than 5 lectures for a course in a single term?";
    "Completed the Carolina Campus Life Experience (CLE) requirements?";

    // Campus Dining & Franklin Street
    "Eaten at Lenoir Dining Hall?";
    "Eaten at Chase Dining Hall?";
    "Got sick from dining hall food?";
    "Used your meal swipes to feed a friend?";
    "Ordered Time-Out chicken and cheese biscuits after midnight?";
    "Been to He's Not Here bar?";
    "Received a 'Blue Cup' from He's Not Here?";
    "Visited four or more restaurants on Franklin Street in one day?";
    "Eaten at Top of Lenoir during finals week when it's particularly crowded?";
    "Been to Med Deli on Franklin Street?";

    // Residence Life
    "Lived in South Campus dorms?";
    "Lived in North Campus dorms?";
    "Lived in Granville Towers?";
    "Been written up by an RA?";
    "Locked yourself out of your dorm room?";
    "Gotten noise complaints in university housing?";
    "Had roommate drama serious enough to involve housing staff?";
    "Snuck a pet into dorms against housing policy?";
    "Hosted a party in your dorm that got shut down?";
    "Kicked your roommate out for a hook-up?";
    "Been kicked out by your roommate for their hook-up?";
    "Lived off-campus in Chapel Hill?";

    // Social Life
    "Attended Fall Fest?";
    "Participated in Dance Marathon?";
    "Attended LDOC (Last Day of Classes) celebrations?";
    "Joined a fraternity or sorority?";
    "Attended a fraternity or sorority party?";
    "Been to three or more parties in one night?";
    "Joined a UNC club or organization?";
    "Been involved with cultural organizations on campus?";
    "Participated in a Black Student Movement (BSM) event?";
    "Attended a student protest or demonstration on campus?";
    "Been in a picture on the official UNC social media?";
    "Met the UNC Chancellor in person?";

    // Romance & Personal Life
    "Had a romantic relationship with another UNC student?";
    "Kissed someone in the Arboretum?";
    "Hooked up with someone in a study room?";
    "Had a one-night stand with a fellow UNC student?";
    "Hooked up with someone from a rival school (Duke, NC State)?";
    "Had a romantic encounter in a UNC dorm room?";
    "Felt a spark with a teaching assistant?";
    "Had a crush on a professor?";
    "Used a dating app while on campus?";
    "Broken up or been broken up with on campus?";

    // Breaking the Rules
    "Used a fake ID at a Chapel Hill bar?";
    "Snuck into Kenan Stadium after hours?";
    "Broken into a campus pool after hours?";
    "Climbed onto a campus roof?";
    "Explored the underground tunnels connecting buildings on campus?";
    "Stolen something from campus (signs, banners, etc.)?";
    "Been questioned by campus police?";
    "Received a parking ticket on campus?";
    "Been towed from a campus parking spot?";
    "Been sent to the Dean of Students for disciplinary reasons?";
    "Used drugs in your dorm room?";
    "Drank alcohol on campus against policy?";
    "Damaged property during Franklin Street celebrations?";
    "Been to the UNC Hospital for an alcohol-related incident?";
    "Been arrested in Chapel Hill?";
    "Been placed on academic probation?";
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