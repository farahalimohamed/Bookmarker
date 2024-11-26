function validateInput(inputElement, regex) {
    const value = inputElement.value;

    if (regex.test(value)) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
    } else {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
    }
}

const bookmarkInput = document.getElementById('bookmarkName');
function setupSiteNameValidation() {
    const nameRegex = /^[A-Z][a-z]*( [a-zA-Z]+)*$/;

    bookmarkInput.addEventListener('input', function () {
        validateInput(this, nameRegex);
    });
}

const urlInput = document.getElementById('bookmarkURL');
function setupSiteURLValidation() {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;

    urlInput.addEventListener('input', function () {
        validateInput(this, urlRegex);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupSiteNameValidation();
    setupSiteURLValidation();
});



var bookmarkList = [];

if (localStorage.getItem('bookmarker') !== null) {
    bookmarkList = JSON.parse(localStorage.getItem('bookmarker'));
    displayBookmark();
}

function addBookmark() {
    const alertDiv = document.querySelector('.alert-danger');
    const isNameValid = /^[A-Z][a-z]*( [a-zA-Z]+)*$/.test(bookmarkInput.value);
    const isUrlValid = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/.test(urlInput.value);

    if (isNameValid && isUrlValid) {
        let isDuplicate = false;

        for (let i = 0; i < bookmarkList.length; i++) {
            if (
                bookmarkList[i].bookmarkName.toLowerCase() === bookmarkInput.value.toLowerCase() ||
                bookmarkList[i].url === urlInput.value
            ) {
                isDuplicate = true;
                break;
            }
        }

        if (isDuplicate) {
            alertDiv.textContent = 'Bookmark already exists!';
            alertDiv.classList.remove('d-none');
        } else {
            alertDiv.classList.add('d-none');

            var bookMark = {
                bookmarkName: bookmarkInput.value,
                url: urlInput.value,
            };

            bookmarkList.push(bookMark);
            localStorage.setItem('bookmarker', JSON.stringify(bookmarkList));
            clearForm();
            displayBookmark();
        }
    } else {
        alertDiv.textContent = 'Invalid input! Please check your data.';
        alertDiv.classList.remove('d-none');
    }
}



function clearForm() {
    bookmarkInput.value = '';
    urlInput.value = '';

    bookmarkInput.classList.remove('is-valid', 'is-invalid');
    urlInput.classList.remove('is-valid', 'is-invalid');
}

function deleteBookmark(index) {
    bookmarkList.splice(index, 1);
    displayBookmark();
    localStorage.setItem('bookmarker', JSON.stringify(bookmarkList));
}

function visitBookmark(index){
    var site = bookmarkList[index].url;
    window.open(site, '_blank');
}

var submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', function () {
    addBookmark();
});

function displayBookmark() {
    var cartona = '';
    for (var i = 0; i < bookmarkList.length; i++) {
        cartona += `<tr>
                        <td>${i + 1}</td>
                        <td>${bookmarkList[i].bookmarkName}</td>
                        <td>
                            <button class="btn btn-visit" data-index="${i}">
                                <i class="fa-solid fa-eye pe-2"></i>Visit
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-delete pe-2" data-index="${i}">
                                <i class="fa-solid fa-trash-can"></i>
                                Delete
                            </button>
                        </td>
                    </tr>`;
    }
    document.getElementById('tableContent').innerHTML = cartona;

    var deleteBtns = document.querySelectorAll('.btn-delete');
    for(var j=0; j< deleteBtns.length; j++){
        deleteBtns[j].addEventListener('click', function(){
            var index = this.getAttribute('data-index');
            deleteBookmark(parseInt(index));
        });
    }

    var visitBtns = document.querySelectorAll('.btn-visit');
    for(var k=0; k < visitBtns.length; k++){
        visitBtns[k].addEventListener('click', function(){
            var index = this.getAttribute('data-index');
            visitBookmark(parseInt(index));
        })
    }
}
