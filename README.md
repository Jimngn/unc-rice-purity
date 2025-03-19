# UNC Chapel Hill Purity Test

A web application that recreates the concept of a "purity test" specifically for UNC Chapel Hill students, styled after the original [Rice Purity Test](https://ricepuritytest.com/). The app allows users to answer questions about their college experiences, calculates a "purity score," and provides statistics on how their experiences compare to other students.

![UNC Chapel Hill Purity Test Screenshot](screenshot.png)

## Features

- 100 UNC-specific questions covering various aspects of student life
- Classic purity test format with a simple interface similar to the Rice Purity Test
- Calculates a purity score based on user responses
- Shows anonymous statistics to compare experiences with other students
- Saves aggregate data locally to show percentage of students who have had each experience
- Mobile-friendly responsive design
- UNC-themed color scheme

## How It Works

1. Users check boxes for UNC experiences they've had
2. The application calculates a "purity score" based on what percentage of experiences they haven't had
3. Results show the user's score and a personalized description
4. Users can view statistics about which experiences are most common

## Setup Instructions

### Option 1: Run Directly in Browser (Simplest)

1. Download the files
2. Open `index.html` in your browser
3. Start using the application!

### Option 2: Run with Node.js (For Development)

```bash
# Navigate to the directory
cd unc-purity-test

# Install dependencies
npm install

# Start the server
npm start

# Open in browser
open http://localhost:3000
```

### Option 3: Deploy to Web Hosting

Upload all files to your preferred web hosting service. The site is static and requires no server-side processing.

## Customization

- **Questions**: Edit the `questions.js` file to modify the questions
- **Styling**: Modify `styles.css` to change the appearance
- **Functionality**: Update `app.js` to change the behavior

## Privacy Notice

This application does not collect any personally identifiable information. All statistics are stored anonymously in local storage and only show aggregate percentages.

## Credits

- Directly inspired by the [Rice Purity Test](https://ricepuritytest.com/) format
- Questions inspired by UNC Chapel Hill student experiences
- Created for educational and entertainment purposes
- Not officially affiliated with the University of North Carolina at Chapel Hill

## License

MIT License 