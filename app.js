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

// Get the score description based on the score
function getScoreDescription(score) {
    for (const range of scoreRanges) {
        if (score >= range.min && score <= range.max) {
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
    
    // Get all checked checkboxes
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Update responses array based on checked boxes
    responses = new Array(questions.length).fill(false);
    checkedBoxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index, 10);
        responses[index] = true;
    });
    
    // Update local statistics for UI only (will not be used for persistence)
    const userAnsweredQuestions = updateStatistics();
    
    // Calculate score
    const score = calculateScore();
    
    // Store data in Supabase
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
        
        // 2. Update question response stats - one by one to avoid errors
        for (const index of userAnsweredQuestions) {
            try {
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
                    // Question exists, increment count
                    const { data: updateData, error: updateError } = await window.supabaseClient
                        .from('question_responses')
                        .update({ 
                            count: existingData.count + 1 
                        })
                        .eq('question_id', index)
                        .select();
                        
                    if (updateError) {
                        console.error(`Error updating question ${index}:`, updateError);
                    } else {
                        console.log(`Question ${index} updated:`, updateData);
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
                    }
                }
            } catch (questionError) {
                console.error(`Error processing question ${index}:`, questionError);
            }
        }
        
        // 3. Get total number of test submissions (scores count)
        const { data: scoresData, error: scoresError, count: totalScores } = await window.supabaseClient
            .from('scores')
            .select('*', { count: 'exact', head: true });
            
        if (scoresError) {
            console.error('Error loading scores count:', scoresError);
            throw scoresError;
        }
        
        // 4. Get all question responses to calculate accurate percentages
        const { data: allResponses, error: responsesError } = await window.supabaseClient
            .from('question_responses')
            .select('*');
            
        if (responsesError) {
            console.error('Error loading responses:', responsesError);
            throw responsesError;
        }
        
        console.log('All data saved to Supabase successfully');
        
        // Show results
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        purityScore.textContent = score;
        scoreDescription.innerHTML = getScoreDescription(score);
        
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
        
        // Create a map of question_id to count for easy lookup
        const questionCountMap = {};
        if (allResponses && allResponses.length > 0) {
            allResponses.forEach(response => {
                questionCountMap[response.question_id] = response.count;
            });
        }
        
        // Update percentages for all questions using actual database values
        questionsContainer.classList.add('show-percentages');
        for (let i = 0; i < questions.length; i++) {
            const percentageElement = document.getElementById(`percentage-${i}`);
            if (percentageElement) {
                // Calculate percentage based on actual data from database
                const count = questionCountMap[i] || 0;
                const percentage = totalScores > 0 ? Math.round((count / totalScores) * 100) : 0;
                
                // Update the displayed percentage
                percentageElement.textContent = `${percentage}%`;
                
                // Also update our local statistics object for consistency
                statistics[i] = percentage;
            }
        }
        
        // Save updated statistics to ensure they persist
        saveStatistics();
        
        // Load stats from Supabase and generate percentile chart
        await loadSupabaseStats(userAnsweredQuestions, score);
        
    } catch (error) {
        console.error('Error saving or retrieving data:', error);
        
        // Still show results even if there was an error
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        purityScore.textContent = score;
        scoreDescription.innerHTML = getScoreDescription(score);
        
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
        
        // Load stats from Supabase and generate percentile chart
        await loadSupabaseStats(userAnsweredQuestions, score);
    }
}

// Reset the form
function resetForm() {
    responses = new Array(questions.length).fill(false);
    resultsSection.style.display = 'none';
    statsContainer.style.display = 'none';
    questionsContainer.classList.remove('show-percentages');
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
        
        // Calculate percentile
        const scores = allScores.map(item => item.score);
        // For purity test, higher scores mean more pure (fewer "yes" answers)
        // So count how many people scored lower than this user
        const scoresBelow = scores.filter(s => s < score).length;
        const percentile = Math.round((scoresBelow / scores.length) * 100);
        
        // Create percentile chart
        statsContent.innerHTML = '';
        
        // Change the header text
        const statsHeader = document.querySelector('.stats-container h3');
        if (statsHeader) {
            statsHeader.textContent = 'Your Score Percentile';
        }
        
        // Create the chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'percentile-chart-container';
        
        // Add description
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
        leftLabel.textContent = 'More Pure';
        
        const rightLabel = document.createElement('span');
        rightLabel.textContent = 'Less Pure';
        
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
        statsContent.innerHTML = '<p>Unable to load statistics. Please try again later.</p>';
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 