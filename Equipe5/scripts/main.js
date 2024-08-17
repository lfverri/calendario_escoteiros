// variaveis globais

let nav = 0;
let clicked = null;
let events = localStorage.getItem('events_5') ? JSON.parse(localStorage.getItem('events_5')) : [];

// variavel do modal:
const newEvent = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

// --------
const calendar = document.getElementById('calendar'); // div calendar:
const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']; //array with weekdays:

//funções

function openModal(date) {
    clicked = date;
    const eventDay = events.find((event) => event.date === clicked);

    if (eventDay) {
        document.getElementById('eventText').innerText = eventDay.title;
        deleteEventModal.style.display = 'block';
    } else {
        const today = new Date();
        const selectedDate = new Date(clicked.split('/').reverse().join('-'));

        if (selectedDate >= today.setHours(0, 0, 0, 0)) {
            newEvent.style.display = 'block';
        } else {
            alert('Não é possível criar eventos em datas passadas.');
        }
    }

    backDrop.style.display = 'block';

}

//função load() será chamada quando a pagina carregar:

function load() {
    const date = new Date();

    //mudar titulo do mês:
    if (nav !== 0) {
        date.setMonth(new Date().getMonth() + nav);
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const daysMonth = new Date(year, month + 1, 0).getDate();
    const firstDayMonth = new Date(year, month, 1);

    const dateString = firstDayMonth.toLocaleDateString('pt-br', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const paddinDays = weekdays.indexOf(dateString.split(', ')[0]);

    //mostrar mês e ano:
    document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br', { month: 'long' })}, ${year}`;

    calendar.innerHTML = '';

    // criando uma div com os dias:

    for (let i = 1; i <= paddinDays + daysMonth; i++) {
        const dayS = document.createElement('div');
        dayS.classList.add('day');

        const dayString = `${String(i - paddinDays).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;

        //condicional para criar os dias de um mês:

        if (i > paddinDays) {
            dayS.innerText = i - paddinDays;

            const eventDay = events.find(event => event.date === dayString);

            if (i - paddinDays === day && nav === 0) {
                dayS.id = 'currentDay';
            }

            if (eventDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventDay.title;
                dayS.appendChild(eventDiv);
            }

            dayS.addEventListener('click', () => openModal(dayString));

        } else {
            dayS.classList.add('padding');
        }

        calendar.appendChild(dayS);
    }
}

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEvent.style.display = 'none';
    backDrop.style.display = 'none';
    deleteEventModal.style.display = 'none';

    eventTitleInput.value = '';
    clicked = null;
    load();
}

function saveEvent() {
    document.getElementById('passwordModal').style.display = 'block';
}

const passwordModal = document.getElementById('passwordModal');
const passwordInput = document.getElementById('passwordInput');
const passwordSubmitButton = document.getElementById('passwordSubmitButton');
const closePasswordModal = document.getElementById('closePasswordModal');

// Senha pré-definida (por exemplo)
const correctPassword = '123';

passwordSubmitButton.addEventListener('click', function () {
    if (passwordInput.value === correctPassword) {
        if (eventTitleInput.value) {
            eventTitleInput.classList.remove('error');

            const newEvent = {
                date: clicked,
                title: eventTitleInput.value
            };

            events.push(newEvent);
            localStorage.setItem('events_5', JSON.stringify(events));

            addEventToList(newEvent);
            closePasswordModal.click(); // Fecha o modal de senha
            closeModal(); // Fecha o modal de adicionar evento

        } else {
            eventTitleInput.classList.add('error');
        }
    } else {
        alert('Senha incorreta. Tente novamente.');
    }
});

closePasswordModal.addEventListener('click', function () {
    passwordModal.style.display = 'none';
    passwordInput.value = ''; // Limpa o campo de senha
});

function deleteEvent() {
    document.getElementById('passwordModal').style.display = 'block';

    passwordSubmitButton.addEventListener('click', function () {
        if (passwordInput.value === correctPassword) {
            events = events.filter(event => event.date !== clicked);
            localStorage.setItem('events_5', JSON.stringify(events));
            closeModal();
        } else {
            alert('Senha incorreta. Tente novamente.');
        }
    });
}

// botões 

function buttons() {
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', () => saveEvent());

    document.getElementById('cancelButton').addEventListener('click', () => closeModal());

    document.getElementById('deleteButton').addEventListener('click', () => deleteEvent());

    document.getElementById('closeButton').addEventListener('click', () => closeModal());
}

function addEventToList(event) {
    const eventList = document.getElementById('eventList');

    const listItem = document.createElement('li');
    listItem.innerText = `${event.title} - ${event.date}`;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Excluir';
    deleteButton.addEventListener('click', function () {
        deleteEventFromList(event, listItem);
    });

    listItem.appendChild(deleteButton);
    eventList.appendChild(listItem);



    closePasswordModal.click(); // Fecha o modal de senha
    closeModal(); // Fecha o modal de adicionar evento

}

function deleteEventFromList(event, listItem) {
    document.getElementById('passwordModal').style.display = 'block';

    passwordSubmitButton.addEventListener('click', function () {
        if (passwordInput.value === correctPassword) {
            events = events.filter(e => e.date !== event.date || e.title !== event.title);
            localStorage.setItem('events_5', JSON.stringify(events));

            listItem.remove(); // Remove o item da lista
            load(); // Recarrega o calendário
            closePasswordModal.click(); // Fecha o modal de senha
            closeModal(); // Fecha o modal de adicionar evento
        } else {
            alert('Senha incorreta. Tente novamente.');
        }
    });


}

function loadEventsList() {
    events.forEach(event => addEventToList(event));
}

loadEventsList();

buttons();
load();
