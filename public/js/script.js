document.addEventListener('DOMContentLoaded', function(){
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('.searchInput');
    const searchClose = document.getElementById('searchClose');
    for (var i = 0; i < allButtons.length; i++){
        allButtons[i].addEventListener(`click`, function(){
            searchBar.style.visibility = `visible`;
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        })
    }
    searchClose.addEventListener(`click`, function(){
        searchBar.style.visibility = `hidden`;
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
    });
   
})
let i = 0;
function register(){
    let register = document.getElementById('register');
    register.style.visibility ="visible";
    
    i = i+1;
    console.log(i)
    if (i==2){
        register.style.visibility ="hidden";
        i=0
    }
}