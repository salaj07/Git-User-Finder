
let usernameinp=document.querySelector(".usernameinp")
let search=document.querySelector(".search")
let card=document.querySelector(".card")

//data fetching
function getUser(username){
    return  fetch(`http://api.github.com/users/${username}`).then(
        (raw) => {if (!raw.ok) throw new Error("user not found");
            return raw.json()

        })
}
function getRepos(username){
    return fetch(`http://api.github.com/users/${username}/repos?sort=updated&per_page=5`).then((raw) => 
    
        {if(!raw.ok) throw new Error("failed to fetch repos");
            return raw.json()


        }
    ) 
}


function details(data){

console.log(data);
       //profile details
    let profile=` <div class="flex flex-col items-center space-y-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-8 mb-8">
                            <div class="relative flex-shrink-0">
                                <div class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600">
                                  <img src="${data.avatar_url}" class="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600" alt="">
                                </div>
                                <div class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-gray-800 flex items-center justify-center shadow-lg">
                                    <i class="fas fa-check text-white text-xs"></i>
                                </div>
                            </div>
                            
                            <div class="flex-1 text-center sm:text-left">
                                <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">${data.name}</h3>
                                <p class="text-gray-300 mb-4 text-base sm:text-lg">@${data.login}</p>
                                <p class="text-gray-400 mb-4 leading-relaxed text-sm sm:text-base">${data.bio ? data.bio : ""}</p>
                                <div class="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                                    <span class="bg-gray-700 text-gray-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm border border-gray-600">
                                        <i class="fas fa-map-marker-alt mr-1 sm:mr-2"></i>
                                        ${data.location}
                                    </span>
                                   
                                    <span class="bg-gray-700 text-gray-200 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm border border-gray-600">
                                        <i class="fas fa-calendar-alt mr-1 sm:mr-2"></i>
                                        ${data.created_at.substring(0, 10)}
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

                        <!-- Recent Repositories -->
                       `



        card.innerHTML=profile;
                                }
function repos(repoArray) {
    console.log(repoArray);
 
    // If no repositories found
    if (!repoArray || repoArray.length === 0) {
        const noReposHTML = `
            <div class="mb-8">
                <h4 class="text-lg font-semibold text-white mb-4">Recent Repositories</h4>
                <div class="text-center py-8">
                    <p class="text-gray-400">No repositories found</p>
                </div>
            </div>
        `;
        card.innerHTML += noReposHTML;
        return;
    }
    
    // Show maximum 5 repositories
    const reposToShow = repoArray.slice(0, 5);
    
    let repoCardsHTML = '';
    
    reposToShow.forEach(repo => {
        repoCardsHTML += `
            <div class="bg-gray-900/40 border border-gray-700 rounded-lg p-4 mb-4 hover:bg-gray-900/60 transition-all duration-300">
                <h5 class="text-lg font-semibold text-white mb-2">
                    <a href="${repo.html_url || '#'}" target="_blank" class="hover:underline">
                        ${repo.name || 'Unnamed Repository'}
                    </a>
                </h5>
                <p class="text-gray-400 text-sm leading-relaxed">
                    ${repo.description || 'No description available'}
                </p>
            </div>
        `;
    });
    
    // Complete HTML structure
    let repoDetails = `
        <div class="mb-8">
            <h4 class="text-lg font-semibold text-white mb-4">Recent Repositories</h4>
            <div class="space-y-4">
                ${repoCardsHTML}
            </div>
        </div>
    `;
    
    card.innerHTML += repoDetails;
}


search.addEventListener("click" , function() {
    username=usernameinp.value.trim();
    if(username.length> 0){
    let data=  getUser(username).then(function(data){
         details(data)
          })
    let repo= getRepos(username).then(function(repo){
            // console.log(repo);
            repos(repo)
            
           })
    }
}
)



