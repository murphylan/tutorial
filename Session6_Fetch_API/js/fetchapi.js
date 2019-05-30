let studentsList = [];
const URL = 'http://localhost:3000/contacts';

const callRestAPI = async (url, opt = {}) => {
    return await fetch(url, opt).then(resp => {
        if (resp.ok) {
            return resp.json();
        }
        return Promise.reject(new Error('Dummy error from server'));
    });
};

const getStudents = () => callRestAPI(URL).then(resp => {
    studentsList = [...resp];
    showStudentsHTML();
    return resp;
}).catch(error => {
    return Promise.reject(Error(error.message));
});

const showStudentsHTML = async () => {
    let htmlString = '';
    studentsList.forEach(student => {
        htmlString += `
        <tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.contactno}</td>
            <td><button class='btn btn-primary' type='button' onclick='displayModal("${student.id}","${student.name}", "${student.email}","${student.contactno}")'>Update</button></td>
            <td ><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='deleteStudent(${student.id})'></i></td>       
        </tr>
		`;
    });
    let tableEle = document.getElementsByTagName('table')[0];
    let tbodyEle = tableEle.getElementsByTagName('tbody')[0];
    tbodyEle.innerHTML = htmlString;
}

function getStudentsByName(event) {
    event.preventDefault();
    let name = document.getElementById('name2').value;

    callRestAPI(URL).then(resp => {
        studentsList = [...resp];
        if (name) {
            studentsList = studentsList.filter(student => {
                return student.name.indexOf(name) > -1;
            });
        }
        showStudentsHTML();
        return resp;
    }).catch(error => {
        return Promise.reject(Error(error.message));
    });
}

// adding student to db
function addStudent(event) {
    event.preventDefault();
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let contactno = document.getElementById('contactno').value;

    let student = {
        name: name,
        email: email,
        contactno: contactno
    }

    callRestAPI(URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(student)
    }).then(resp => {
        console.log('addedStudent -->', resp);
        return resp;
    }).catch(error => {
        let errorEle = document.getElementById('errMessage');
        errorEle.innerText = error.message;
        return Promise.reject(Error(error.message));
    });

}

function deleteStudent(id) {
    studentsList = studentsList.filter(student => {
        return student.id !== id;
    });
    
    callRestAPI(URL + `/${id}`, {
        method: 'DELETE'
    }).then(resp => {
        console.log('result from delete', resp);
        return resp;
    }).catch(error => {
        return Promise.reject(Error(error.message));
    });

    showStudentsHTML();
}

function displayModal(id, name, email, contactno) {
    $('#myModal').modal();
    $('#id1').attr('value', id);
    $('#name1').attr('value', name);
    $('#email1').attr('value', email);
    $('#contactno1').attr('value', contactno);
}

function updateStudent(event) {
    event.preventDefault();
    let id = document.getElementById('id1').value;
    let name = document.getElementById('name1').value;
    let email = document.getElementById('email1').value;
    let contactno = document.getElementById('contactno1').value;

    let student = {
        name: name,
        email: email,
        contactno: contactno
    }
    callRestAPI(URL + `/${id}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(student)
    }).then(resp => {
        console.log('result from update', resp);
        getStudents();
        return resp;
    }).catch(error => {
        return Promise.reject(Error(error.message));
    });

}
