# UNC Chapel Hill Purity Test Setup Notes

## Overview

The UNC Chapel Hill Purity Test has been redesigned to closely match the format of the original [Rice Purity Test](https://ricepuritytest.com/). It now features:

- A simpler, single-page interface
- All questions displayed on one screen
- A more traditional academic look
- A straightforward score calculation

## How to Use This Website

### Option 1: Run Directly in Browser (Simplest)

1. Navigate to the project directory
2. Double-click on `index.html` to open it in your browser
3. Check the boxes for experiences you've had
4. Click "Calculate My Score" at the bottom
5. View your results and optional statistics

Note: With this method, the statistics will be saved in your browser's local storage.

### Option 2: Run with Node.js (For Development)

If you have Node.js installed, you can run the application with a local server:

1. Navigate to the project directory in your terminal
2. Install dependencies with: `npm install`
3. Start the server with: `npm start`
4. Open your browser and navigate to: `http://localhost:3000`

### Option 3: Deploy to a Hosting Service

To make your UNC Purity Test available to everyone:

1. Sign up for a web hosting service (GitHub Pages works well for static sites)
2. Upload all files in this directory to your hosting service
3. Your site will be accessible to everyone, while statistics remain local to each visitor

## Customizing the UNC Purity Test

### Changing Questions

Open `questions.js` and modify the `questions` array. Each string in the array represents one question.

### Updating Styling

To make it look even more like the Rice Purity Test, you can modify `styles.css` to:
- Use a white background
- Simplify the header
- Adjust font sizes and spacing

### Adding a Real Logo

Replace the `unc-logo.png` file with an actual UNC Chapel Hill logo image. Make sure the image is appropriately sized and licensed for your use.

## Notes About Statistics

The current implementation:
- Stores statistics in the user's browser local storage
- Initializes with randomized fake data for demonstration
- Will reset if the user clears their browser data

Unlike the original Rice Purity Test, this implementation includes statistics showing which experiences are most common among test-takers.

## Known Limitations

- Statistics are only local to the user's browser, not across all users
- The test only includes 100 questions (can be expanded)
- Without server-side implementation, global statistics aren't available

## Need Help?

If you encounter any issues or need assistance customizing the UNC Purity Test, consult the README.md file or modify the code directly. 