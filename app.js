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
        
        const label = document.createElement('label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `q${index}`;
        checkbox.dataset.index = index;
        
        const questionText = document.createTextNode(question);
        
        label.appendChild(checkbox);
        label.appendChild(questionText);
        li.appendChild(label);
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
        
        console.log('All data saved to Supabase successfully');
    } catch (error) {
        console.error('Error saving data:', error);
    }
    
    // Show results
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    purityScore.textContent = score;
    scoreDescription.innerHTML = getScoreDescription(score);
    
    // Load stats from Supabase
    await loadSupabaseStats(userAnsweredQuestions);
}

// Reset the form
function resetForm() {
    responses = new Array(questions.length).fill(false);
    resultsSection.style.display = 'none';
    statsContainer.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle statistics display
function toggleStats() {
    if (statsContainer.style.display === 'none') {
        statsContainer.style.display = 'block';
        viewStatsButton.textContent = 'Hide Statistics';
    } else {
        statsContainer.style.display = 'none';
        viewStatsButton.textContent = 'View Statistics';
    }
}

// Load statistics from Supabase
async function loadSupabaseStats(userAnsweredQuestions) {
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
        
        // 2. For each question the user answered yes to, get the stats
        if (userAnsweredQuestions.length === 0) {
            statsContent.innerHTML = '<p>You didn\'t answer "yes" to any questions!</p>';
            return;
        }
        
        // Get all responses to calculate percentages
        const { data: responsesData, error: responsesError } = await window.supabaseClient
            .from('question_responses')
            .select('*')
            .in('question_id', userAnsweredQuestions);
            
        if (responsesError) {
            console.error('Error loading responses:', responsesError);
            throw responsesError;
        }
        
        if (!responsesData || responsesData.length === 0) {
            statsContent.innerHTML = '<p>No statistics available for your selections yet.</p>';
            return;
        }
        
        // Format and display stats
        statsContent.innerHTML = '';
        
        const formattedStats = responsesData.map(stat => ({
            index: stat.question_id,
            question: stat.question_text || questions[stat.question_id],
            percentage: Math.round((stat.count / totalSubmissions) * 100),
            count: stat.count
        })).sort((a, b) => b.percentage - a.percentage);
        
        formattedStats.slice(0, 10).forEach(stat => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            
            const questionSpan = document.createElement('span');
            questionSpan.className = 'stat-question';
            questionSpan.textContent = stat.question;
            
            const percentageSpan = document.createElement('span');
            percentageSpan.className = 'stat-percentage';
            percentageSpan.textContent = `${stat.percentage}% (${stat.count})`;
            
            statItem.appendChild(questionSpan);
            statItem.appendChild(percentageSpan);
            statsContent.appendChild(statItem);
        });
        
        console.log('Statistics loaded successfully');
    } catch (error) {
        console.error('Error loading statistics:', error);
        statsContent.innerHTML = '<p>Unable to load statistics. Please try again later.</p>';
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init); 