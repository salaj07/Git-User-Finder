let usernameinp = document.querySelector(".usernameinp");
let search = document.querySelector(".search");
let card = document.querySelector(".card");

//  fetch function for user data with better error handling
function getUser(username) {
    return fetch(`https://api.github.com/users/${username}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-User-Finder'
        }
    }).then((response) => {
        if (response.status === 404) {
            throw new Error("User not found");
        }
        if (response.status === 403) {
            throw new Error("Too many requests. Please try again later");
        }
        if (!response.ok) {
            throw new Error("Something went wrong. Please try again");
        }
        return response.json();
    }).catch((error) => {
        console.error('Error fetching user:', error);
        throw error;
    });
}


//  fetch function for repositories
function getRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-User-Finder'
        }
    }).then((response) => {
        if (response.status === 403) {
            throw new Error("Too many requests. Please try again later");
        }
        if (!response.ok) {
            throw new Error("Failed to fetch repositories");
        }
        return response.json();
    }).catch((error) => {
        console.error('Error fetching repos:', error);
        throw error;
    });
}

function details(data) {
    console.log(data);
    
    // Profile details
    let profile = `
        <div class="flex flex-col items-center space-y-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-8 mb-8">
            <div class="relative flex-shrink-0">
                <div class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600 overflow-hidden">
                    <img src="${data.avatar_url}" alt="${data.login}" class="w-full h-full object-cover">
                </div>
                <div class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-gray-800 flex items-center justify-center shadow-lg">
                    <i class="fas fa-check text-white text-xs"></i>
                </div>
            </div>
            
            <div class="flex-1 text-center sm:text-left">
                <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">${data.name || data.login}</h3>
                <p class="text-gray-300 mb-4 text-base sm:text-lg">@${data.login}</p>
                <p class="text-gray-400 mb-4 leading-relaxed text-sm sm:text-base">${data.bio || "No bio available"}</p>
                <div class="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                    ${data.location ? `
                        <span class="bg-gray-700 text-gray-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm border border-gray-600">
                            <i class="fas fa-map-marker-alt mr-1 sm:mr-2"></i>
                            ${data.location}
                        </span>
                    ` : ''}
                    ${data.blog ? `
                        <span class="bg-gray-700 text-gray-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm border border-gray-600">
                            <i class="fas fa-link mr-1 sm:mr-2"></i>
                            Website
                        </span>
                    ` : ''}
                    <span class="bg-gray-700 text-gray-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm border border-gray-600">
                        <i class="fas fa-calendar-alt mr-1 sm:mr-2"></i>
                        Joined ${new Date(data.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div class="bg-gray-900/50 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border border-gray-700 hover:bg-gray-900/70 hover:border-gray-600 transition-all duration-300">
                <div class="text-2xl sm:text-3xl font-bold text-white mb-2">${data.public_repos}</div>
                <div class="text-gray-300 font-medium text-xs sm:text-sm">Repositories</div>
                <i class="fas fa-folder-open text-gray-500 mt-2 text-sm sm:text-base"></i>
            </div>
            <div class="bg-gray-900/50 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border border-gray-700 hover:bg-gray-900/70 hover:border-gray-600 transition-all duration-300">
                <div class="text-2xl sm:text-3xl font-bold text-white mb-2">${data.followers}</div>
                <div class="text-gray-300 font-medium text-xs sm:text-sm">Followers</div>
                <i class="fas fa-users text-gray-500 mt-2 text-sm sm:text-base"></i>
            </div>
            <div class="bg-gray-900/50 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border border-gray-700 hover:bg-gray-900/70 hover:border-gray-600 transition-all duration-300">
                <div class="text-2xl sm:text-3xl font-bold text-white mb-2">${data.following}</div>
                <div class="text-gray-300 font-medium text-xs sm:text-sm">Following</div>
                <i class="fas fa-user-plus text-gray-500 mt-2 text-sm sm:text-base"></i>
            </div>
            <div class="bg-gray-900/50 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border border-gray-700 hover:bg-gray-900/70 hover:border-gray-600 transition-all duration-300">
                <div class="text-2xl sm:text-3xl font-bold text-white mb-2">${data.public_gists}</div>
                <div class="text-gray-300 font-medium text-xs sm:text-sm">Public Gists</div>
                <i class="fas fa-code text-gray-500 mt-2 text-sm sm:text-base"></i>
            </div>
        </div>
    `;
    
    card.innerHTML = profile;
}

function repos(repoArray) {
    if (!repoArray || repoArray.length === 0) {
        const noReposHTML = `
            <div class="mb-6 sm:mb-8">
                <h4 class="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Recent Repositories</h4>
                <div class="text-center py-6 sm:py-8">
                    <p class="text-gray-400 text-sm sm:text-base">No repositories found</p>
                </div>
            </div>
        `;
        card.innerHTML += noReposHTML;
        return;
    }
    
    const reposToShow = repoArray.slice(0, 5);
    let repoCardsHTML = '';
    
    reposToShow.forEach(repo => {
        repoCardsHTML += `
            <div class="bg-gray-900/40 border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 hover:bg-gray-900/60 transition-all duration-300">
                <h5 class="text-base sm:text-lg font-semibold text-white mb-2">
                    <a href="${repo.html_url}" target="_blank" class="hover:underline">
                        ${repo.name}
                    </a>
                </h5>
                <p class="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    ${repo.description || 'No description available'}
                </p>
            </div>
        `;
    });
    
    let repoDetails = `
        <div class="mb-6 sm:mb-8">
            <h4 class="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Recent Repositories</h4>
            <div class="space-y-3 sm:space-y-4">
                ${repoCardsHTML}
            </div>
        </div>
    `;
    
    card.innerHTML += repoDetails;
}

// Search functionality
search.addEventListener("click", async function() {
    const username = usernameinp.value.trim();
    
    if (!username) {
        alert("Please enter a username");
        return;
    }
    
    // Show loading state
    card.innerHTML = `
        <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            <p class="text-gray-400 mt-2">Loading...</p>
        </div>
    `;
    
    try {
        // Fetch user data and repositories
        const [userData, reposData] = await Promise.all([
            getUser(username),
            getRepos(username)
        ]);
        
        // Display user details
        details(userData);
        
        // Display repositories
        repos(reposData);
        
    } catch (error) {
        // Show error message
        card.innerHTML = `
            <div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-red-900/20 rounded-full mb-4 border border-red-800">
                    <i class="fas fa-exclamation-triangle text-3xl text-red-400"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Error</h3>
                <p class="text-gray-400 text-sm px-4">${error.message}</p>
            </div>
        `;
    }
});

// Allow Enter key to trigger search
usernameinp.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        search.click();
    }
});
