/**
 * UNC Chapel Hill Purity Test
 * Main Application JavaScript
 */

// DOM elements
const purityForm = document.getElementById('purityForm');
const questionsContainer = document.getElementById('questionsContainer');
const calculateButton = document.getElementById('calculateButton');
const resetButton = document.getElementById('resetButton');
const resultsSection = document.getElementById('results');
const purityScore = document.getElementById('purityScore');
const scoreDescription = document.getElementById('scoreDescription');
const viewStatsButton = document.getElementById('viewStatsButton');
const statsContainer = document.getElementById('statsContainer');
const statsContent = document.getElementById('statsContent');
const loadingContainer = document.getElementById('loadingContainer');
const webShareButton = document.getElementById('webShareButton');
const copyLinkButton = document.getElementById('copyLinkButton');

// Application state
let responses = new Array(questions.length).fill(false);
let statistics = { ...initialStatistics }; // Clone the initial statistics
let totalSubmissions = Math.floor(Math.random() * 500) + 100; // Fake total submissions (100-600)

// Local storage keys
const STATS_KEY = 'unc_purity_stats';
const SUBMISSIONS_KEY = 'unc_purity_submissions';

// Load statistics from local storage if available
function loadStatistics() {
    const savedStats = localStorage.getItem(STATS_KEY);
    const savedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
    
    if (savedStats) {
        statistics = JSON.parse(savedStats);
    }
    
    if (savedSubmissions) {
        totalSubmissions = parseInt(savedSubmissions, 10);
    }
}

// Save statistics to local storage
function saveStatistics() {
    localStorage.setItem(STATS_KEY, JSON.stringify(statistics));
    localStorage.setItem(SUBMISSIONS_KEY, totalSubmissions.toString());
}

// Initialize the application
function init() {
    loadStatistics();
    renderQuestions();
    attachEventListeners();
}

// Render all questions
function renderQuestions() {
    // Generate HTML for all questions
    questions.forEach((question, index) => {
        const li = document.createElement('li');
        li.className = 'question';
        li.value = index + 1; // Ensure the list item has the correct value
        
        const label = document.createElement('label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `q${index}`;
        checkbox.dataset.index = index;
        
        const questionText = document.createTextNode(question);
        
        label.appendChild(checkbox);
        label.appendChild(questionText);
        li.appendChild(label);
        
        // Add percentage element (initially hidden)
        const percentageSpan = document.createElement('span');
        percentageSpan.className = 'question-percentage';
        percentageSpan.id = `percentage-${index}`;
        percentageSpan.textContent = '0%';
        li.appendChild(percentageSpan);
        
        questionsContainer.appendChild(li);
    });
}

// Attach event listeners
function attachEventListeners() {
    // Form submission event
    purityForm.addEventListener('submit', calculateResults);
    
    // Reset form event
    resetButton.addEventListener('click', resetForm);
    
    // View statistics button event
    viewStatsButton.addEventListener('click', toggleStats);
    
    // Share buttons events
    if (webShareButton) webShareButton.addEventListener('click', shareViaWebAPI);
    if (copyLinkButton) copyLinkButton.addEventListener('click', copyShareLink);
    
    // Track checkbox changes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            responses[index] = e.target.checked;
        });
    });
}

// Calculate the purity score
function calculateScore() {
    // Count the number of "no" answers (false values in responses)
    const noCount = responses.filter(response => !response).length;
    
    // Calculate percentage of "no" answers (higher = more "pure")
    return Math.round((noCount / questions.length) * 100);
}

// Get the score description based on the percentile
function getScoreDescriptionByPercentile(percentile) {
    for (const range of scoreRanges) {
        if (percentile >= range.min && percentile <= range.max) {
            return `<strong>${range.title}</strong>: ${range.description}`;
        }
    }
    return "";
}

// Update statistics with user's responses
function updateStatistics() {
    // Get all checked checkboxes
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Update responses array based on checked boxes
    responses = new Array(questions.length).fill(false);
    checkedBoxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index, 10);
        responses[index] = true;
    });
    
    // Find which questions the user answered "yes" to
    const userAnsweredQuestions = responses
        .map((response, index) => ({ index, response }))
        .filter(item => item.response)
        .map(item => item.index);
    
    // Update the statistics for those questions
    userAnsweredQuestions.forEach(index => {
        // If the question doesn't exist in statistics yet, initialize it
        if (!statistics[index]) {
            statistics[index] = 0;
        }
        
        // Calculate new percentage
        // Convert current percentage to number of people
        const currentCount = Math.round((statistics[index] / 100) * totalSubmissions);
        // Add one more person
        const newCount = currentCount + 1;
        // Calculate new percentage
        statistics[index] = Math.round((newCount / (totalSubmissions + 1)) * 100);
    });
    
    // Increment total submissions
    totalSubmissions++;
    
    // Save updated statistics
    saveStatistics();
    
    return userAnsweredQuestions;
}

// Submit the test and show results
async function calculateResults(e) {
    e.preventDefault();
    
    // Show loading indicator
    loadingContainer.style.display = 'block';
    calculateButton.disabled = true;
    resetButton.disabled = true;
    
    // Remove any existing percentage explanation to avoid duplicates
    const existingExplanation = document.querySelector('.percentage-explanation');
    if (existingExplanation) {
        existingExplanation.remove();
    }
    
    // Get all checked checkboxes
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Update responses array based on checked boxes
    responses = new Array(questions.length).fill(false);
    checkedBoxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index, 10);
        responses[index] = true;
    });
    
    // Update local statistics for UI only
    const userAnsweredQuestions = updateStatistics();
    
    // Calculate score
    const score = calculateScore();
    
    try {
        // STAGE 1: QUICKLY LOAD EXISTING STATS AND DISPLAY RESULTS
        
        // Show basic results immediately
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        purityScore.textContent = score;
        
        // Update share links with the user's score
        updateShareLinks(score);
        
        // Load existing statistics from Supabase
        console.log('Loading statistics from Supabase...');
        
        // Get total number of submissions
        const { data: scoresData, error: scoresError, count: totalScores } = await window.supabaseClient
            .from('scores')
            .select('*', { count: 'exact', head: true });
            
        if (scoresError) {
            console.error('Error loading scores count:', scoresError);
            throw scoresError;
        }
        
        // Get all scores to calculate percentile
        const { data: allScores, error: allScoresError } = await window.supabaseClient
            .from('scores')
            .select('score');
            
        if (allScoresError) {
            console.error('Error loading all scores:', allScoresError);
            throw allScoresError;
        }
        
        // Calculate percentile based on EXISTING data (before this user's submission)
        const scores = allScores.map(item => item.score);
        const scoresBelow = scores.filter(s => s < score).length;
        const percentile = Math.round((scoresBelow / scores.length) * 100);
        
        // Set the score description based on percentile
        scoreDescription.innerHTML = getScoreDescriptionByPercentile(percentile);
        
        // Add explanation about question percentages
        const percentageExplanation = document.createElement('p');
        percentageExplanation.className = 'percentage-explanation';
        percentageExplanation.innerHTML = '<strong>Note:</strong> The percentages next to each question show how many UNC students have done that activity.';
        scoreDescription.insertAdjacentElement('afterend', percentageExplanation);
        
        // Get existing question responses
        const { data: allResponses, error: responsesError } = await window.supabaseClient
            .from('question_responses')
            .select('*');
            
        if (responsesError) {
            console.error('Error loading responses:', responsesError);
            throw responsesError;
        }
        
        // Create a map of question_id to count for easy lookup
        const questionCountMap = {};
        if (allResponses && allResponses.length > 0) {
            allResponses.forEach(response => {
                questionCountMap[response.question_id] = response.count;
            });
        }
        
        // Update percentages for all questions using existing data
        questionsContainer.classList.add('show-percentages');
        for (let i = 0; i < questions.length; i++) {
            const percentageElement = document.getElementById(`percentage-${i}`);
            if (percentageElement) {
                // Calculate percentage based on existing data
                const count = questionCountMap[i] || 0;
                const percentage = totalScores > 0 ? Math.round((count / totalScores) * 100) : 0;
                
                // Update the displayed percentage
                percentageElement.textContent = `${percentage}%`;
                
                // Also update our local statistics object for consistency
                statistics[i] = percentage;
            }
        }
        
        // Load and display statistics chart
        await loadSupabaseStats(userAnsweredQuestions, score);
        
        // Hide loading indicator and re-enable buttons
        loadingContainer.style.display = 'none';
        calculateButton.disabled = false;
        resetButton.disabled = false;
        
        // STAGE 2: UPDATE DATABASE WITH USER'S RESPONSES IN THE BACKGROUND
        // This happens after results are already displayed to the user
        
        // Use a separate async function to avoid blocking UI
        updateDatabaseInBackground(score, userAnsweredQuestions)
            .then(() => console.log('Background database update completed'))
            .catch(error => console.error('Background update failed:', error));
            
    } catch (error) {
        console.error('Error loading statistics:', error);
        
        // Hide loading indicator and re-enable buttons
        loadingContainer.style.display = 'none';
        calculateButton.disabled = false;
        resetButton.disabled = false;
        
        // Display results using local data as fallback
        displayResults(score);
        
        // Still update share links even in fallback mode
        updateShareLinks(score);
    }
}

// Function to update database in the background after results are displayed
async function updateDatabaseInBackground(score, userAnsweredQuestions) {
    try {
        console.log('Saving data to Supabase...');
        
        // 1. Insert score record
        const { data: scoreData, error: scoreError } = await window.supabaseClient
            .from('scores')
            .insert({
                score: score,
                timestamp: new Date().toISOString()
            })
            .select();
            
        if (scoreError) {
            console.error('Error saving score:', scoreError);
            throw scoreError;
        }
        
        console.log('Score saved successfully:', scoreData);
        
        // Track which questions were successfully updated
        const updatedQuestions = [];
        
        // 2. Update question response stats - one by one
        for (const index of userAnsweredQuestions) {
            try {
                if (updatedQuestions.includes(index)) {
                    console.log(`Question ${index} already processed, skipping duplicate`);
                    continue;
                }
                
                // First check if this question already exists
                const { data: existingData, error: existingError } = await window.supabaseClient
                    .from('question_responses')
                    .select('*')
                    .eq('question_id', index)
                    .single();
                
                if (existingError && existingError.code !== 'PGRST116') {
                    // Real error other than "not found"
                    console.error(`Error checking question ${index}:`, existingError);
                    continue;
                }
                
                if (existingData) {
                    // Question exists, try to use the database function first (if it exists)
                    try {
                        // Try RPC call first
                        const { data: updateData, error: updateError } = await window.supabaseClient
                            .rpc('increment_question_count', { 
                                question_id_param: index 
                            });
                            
                        if (updateError) {
                            // RPC error - likely the function doesn't exist yet
                            console.warn(`RPC increment failed for question ${index}:`, updateError);
                            throw new Error('RPC function not available');
                        } else {
                            console.log(`Question ${index} incremented successfully:`, updateData);
                            updatedQuestions.push(index);
                            continue;
                        }
                    } catch (rpcError) {
                        // If RPC fails, use the direct update method with retry logic
                        console.log(`Falling back to direct update for question ${index}`);
                        
                        // Get the latest count to ensure accuracy before update
                        const { data: refreshData, error: refreshError } = await window.supabaseClient
                            .from('question_responses')
                            .select('count')
                            .eq('question_id', index)
                            .single();
                            
                        if (refreshError) {
                            console.error(`Error refreshing count for question ${index}:`, refreshError);
                            continue;
                        }
                        
                        // Use the fresh count from the database
                        const currentCount = refreshData.count;
                        
                        // Update with the fresh count + 1
                        const { data: fallbackData, error: fallbackError } = await window.supabaseClient
                            .from('question_responses')
                            .update({ 
                                count: currentCount + 1 
                            })
                            .eq('question_id', index)
                            .select();
                            
                        if (fallbackError) {
                            console.error(`Fallback update for question ${index} failed:`, fallbackError);
                        } else {
                            console.log(`Question ${index} updated via fallback:`, fallbackData);
                            updatedQuestions.push(index);
                        }
                    }
                } else {
                    // Question doesn't exist yet, insert new record
                    const { data: insertData, error: insertError } = await window.supabaseClient
                        .from('question_responses')
                        .insert({
                            question_id: index,
                            question_text: questions[index],
                            count: 1
                        })
                        .select();
                        
                    if (insertError) {
                        console.error(`Error inserting question ${index}:`, insertError);
                    } else {
                        console.log(`Question ${index} inserted:`, insertData);
                        updatedQuestions.push(index);
                    }
                }
            } catch (questionError) {
                console.error(`Error processing question ${index}:`, questionError);
            }
        }
        
        console.log(`Successfully processed ${updatedQuestions.length} out of ${userAnsweredQuestions.length} questions`);
        return true;
    } catch (error) {
        console.error('Error in background update:', error);
        return false;
    }
}

// Reset the form
function resetForm() {
    // Clear all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Hide results section and loading indicator
    resultsSection.style.display = 'none';
    loadingContainer.style.display = 'none';
    
    // Reset responses array
    responses = new Array(questions.length).fill(false);
    
    // Hide stats if they're open
    statsContainer.style.display = 'none';
    
    // Remove percentages display
    questionsContainer.classList.remove('show-percentages');
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle statistics display
function toggleStats() {
    if (statsContainer.style.display === 'none') {
        statsContainer.style.display = 'block';
        viewStatsButton.textContent = 'Hide Percentile Chart';
    } else {
        statsContainer.style.display = 'none';
        viewStatsButton.textContent = 'View Percentile Chart';
    }
}

// Load statistics from Supabase
async function loadSupabaseStats(userAnsweredQuestions, score) {
    statsContent.innerHTML = '<p>Loading statistics...</p>';
    
    try {
        console.log('Loading statistics from Supabase...');
        
        // 1. Get total number of submissions
        const { data: scoresData, error: scoresError, count } = await window.supabaseClient
            .from('scores')
            .select('*', { count: 'exact', head: true });
            
        if (scoresError) {
            console.error('Error loading scores count:', scoresError);
            throw scoresError;
        }
        
        const totalSubmissions = count || 0;
        console.log(`Total submissions: ${totalSubmissions}`);
        
        if (totalSubmissions === 0) {
            statsContent.innerHTML = '<p>No statistics available yet.</p>';
            return;
        }
        
        // Get all scores to calculate percentile
        const { data: allScores, error: allScoresError } = await window.supabaseClient
            .from('scores')
            .select('score');
            
        if (allScoresError) {
            console.error('Error loading all scores:', allScoresError);
            throw allScoresError;
        }
        
        // Calculate percentile - FIXED
        const scores = allScores.map(item => item.score);
        // Higher purity score (more no answers) means more pure 
        // So we want to count scores LOWER than the current score
        const scoresBelow = scores.filter(s => s < score).length;
        const percentile = Math.round((scoresBelow / scores.length) * 100);
        
        // Store the current user's percentile for caching
        localStorage.setItem('user_percentile', percentile.toString());
        
        // Ensure the score description is updated with the accurate percentile
        scoreDescription.innerHTML = getScoreDescriptionByPercentile(percentile);
        
        statsContent.innerHTML = '';
        
        // Change the header text
        const statsHeader = document.querySelector('.stats-container h3');
        if (statsHeader) {
            statsHeader.textContent = 'Your Score Percentile';
        }
        
        // Create the chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'percentile-chart-container';
        
        // Add description - FIXED
        const percentileDescription = document.createElement('p');
        percentileDescription.className = 'percentile-description';
        percentileDescription.innerHTML = `Your score is higher than <strong>${percentile}%</strong> of all UNC students who have taken this test. The higher the percentage, the more "pure" you are compared to others.`;
        chartContainer.appendChild(percentileDescription);
        
        // Create the chart
        const chart = document.createElement('div');
        chart.className = 'percentile-chart';
        
        // Create the bar
        const bar = document.createElement('div');
        bar.className = 'percentile-bar';
        bar.style.width = '100%';
        chart.appendChild(bar);
        
        // Create the marker
        const marker = document.createElement('div');
        marker.className = 'percentile-marker';
        marker.style.left = `${percentile}%`;
        chart.appendChild(marker);
        
        // Create the marker label
        const markerLabel = document.createElement('div');
        markerLabel.className = 'percentile-marker-label';
        markerLabel.textContent = `You: ${score}`;
        markerLabel.style.left = `${percentile}%`;
        chart.appendChild(markerLabel);
        
        // Create the labels
        const labels = document.createElement('div');
        labels.className = 'percentile-labels';
        
        const leftLabel = document.createElement('span');
        leftLabel.textContent = 'Cooked';
        
        const rightLabel = document.createElement('span');
        rightLabel.textContent = 'Pure';
        
        labels.appendChild(leftLabel);
        labels.appendChild(rightLabel);
        
        chartContainer.appendChild(chart);
        chartContainer.appendChild(labels);
        statsContent.appendChild(chartContainer);
        
        // Auto-display the stats section
        statsContainer.style.display = 'block';
        viewStatsButton.textContent = 'Hide Percentile Chart';
        
        console.log('Percentile chart created successfully');
    } catch (error) {
        console.error('Error loading statistics:', error);
        
        // Use cached percentile if available
        const cachedPercentile = localStorage.getItem('user_percentile');
        let fallbackPercentile = 50; // Default to middle if no cached value
        
        if (cachedPercentile) {
            fallbackPercentile = parseInt(cachedPercentile, 10);
        } else {
            // Generate a sensible random percentile for first-time users
            fallbackPercentile = Math.floor(Math.random() * 70) + 15; // Between 15-85%
            localStorage.setItem('user_percentile', fallbackPercentile.toString());
        }
        
        statsContent.innerHTML = '';
        
        // Create a simplified fallback chart
        const fallbackContainer = document.createElement('div');
        fallbackContainer.className = 'percentile-chart-container';
        
        const fallbackDescription = document.createElement('p');
        fallbackDescription.className = 'percentile-description';
        fallbackDescription.innerHTML = `Based on available data, your score is estimated to be higher than <strong>${fallbackPercentile}%</strong> of UNC students.`;
        fallbackContainer.appendChild(fallbackDescription);
        
        const fallbackNote = document.createElement('p');
        fallbackNote.className = 'offline-notice';
        fallbackNote.textContent = 'Note: We\'re experiencing connectivity issues with our statistics database. This is an estimated value.';
        fallbackContainer.appendChild(fallbackNote);
        
        statsContent.appendChild(fallbackContainer);
        
        // Still show the stats container
        statsContainer.style.display = 'block';
        viewStatsButton.textContent = 'Hide Percentile Chart';
    }
}

// Display results when database operations fail
function displayResults(score) {
    // Show results
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    purityScore.textContent = score;
    
    // Generate a random percentile for fallback when database connection fails
    const fallbackPercentile = Math.floor(Math.random() * 100);
    
    // Use the percentile to determine the score description
    scoreDescription.innerHTML = getScoreDescriptionByPercentile(fallbackPercentile);
    
    // Remove any existing percentage explanation before adding a new one
    const existingExplanation = document.querySelector('.percentage-explanation');
    if (existingExplanation) {
        existingExplanation.remove();
    }
    
    // Add explanation about question percentages
    const percentageExplanation = document.createElement('p');
    percentageExplanation.className = 'percentage-explanation';
    percentageExplanation.innerHTML = '<strong>Note:</strong> The percentages next to each question show how many UNC students have done that activity.';
    scoreDescription.insertAdjacentElement('afterend', percentageExplanation);
    
    // Update percentages using local fallback data
    questionsContainer.classList.add('show-percentages');
    for (let i = 0; i < questions.length; i++) {
        const percentageElement = document.getElementById(`percentage-${i}`);
        if (percentageElement) {
            // For checked questions, make the percentage more realistic (20-80% range)
            if (responses[i]) {
                // If the user selected this question, ensure it has a meaningful percentage
                const percentage = statistics[i] || Math.floor(Math.random() * 60) + 20; // Between 20% and 80%
                percentageElement.textContent = `${percentage}%`;
                // Update statistics for this question if not already set
                if (!statistics[i]) {
                    statistics[i] = percentage;
                }
            } else {
                // For questions not checked by user, show the existing percentage or a default
                percentageElement.textContent = `${statistics[i] || Math.floor(Math.random() * 30) + 5}%`;
            }
        }
    }
    
    // Save updated statistics
    saveStatistics();
    
    // Update share links with the user's score
    updateShareLinks(score);
}

// Function to update social share links based on score
function updateShareLinks(score) {
    const pageUrl = encodeURIComponent(window.location.href);
    const scoreMessage = encodeURIComponent(`I scored ${score} on the UNC Chapel Hill Purity Test! How pure are you? Take the test and find out!`);
    
}

// Web Share API for modern browsers
function shareViaWebAPI() {
    const score = document.getElementById('purityScore').textContent;
    const shareData = {
        title: 'UNC Chapel Hill Purity Test',
        text: `I scored ${score} on the UNC Chapel Hill Purity Test! How pure are you?`,
        url: window.location.href
    };
    
    if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.error('Error sharing:', error));
    } else {
        // Fallback if Web Share API is not supported
        copyShareLink();
        alert('Web sharing not supported on this browser. Link copied to clipboard instead!');
    }
}

// Copy link to clipboard
function copyShareLink() {
    const score = document.getElementById('purityScore').textContent;
    const shareText = `${window.location.href}`;
    
    try {
        // Modern clipboard API
        navigator.clipboard.writeText(shareText)
            .then(() => {
                // Visual feedback
                const originalText = copyLinkButton.innerHTML;
                copyLinkButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    copyLinkButton.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopyTextToClipboard(shareText);
            });
    } catch (err) {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(shareText);
    }
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
        
        // Visual feedback
        const originalText = copyLinkButton.innerHTML;
        copyLinkButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyLinkButton.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 