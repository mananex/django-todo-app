// using Jquery
function getCookie (name) 
{
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') 
    {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) 
        {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) 
            {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//

let overlay = document.querySelector('.overlay');
let modals = document.querySelector('.modals');
let modal_close_buttons = document.querySelectorAll('.modal__footer__button_close');
let modal_submit_buttons = document.querySelectorAll('.modal__footer__button_submit');
let load_more_tasks_button = document.querySelector('.app__task__list-task_load__more');
let scrollable_tasks_list = document.querySelector('.app__task__list > .scrollable');

// interaction interface elements
let add_task_button = document.querySelector('#add__task__button');
let complete_task_button = document.querySelector('#delete__task__button');
let task_information_title = document.querySelector('.app__interaction__tab__info__title');
let task_information_short_description = document.querySelector('.app__interaction__tab__info__short__description');
let task_information_description = document.querySelector('.app__interaction__tab__info__description');

let visible_task_count = 0;
let task_number_increase = 5;
let current_selected_task_element = null; 
let csrf_token = getCookie('csrftoken')

/* interaction with API */ 

function API_get_task_count () 
{
    let get_task_count_xhr = new XMLHttpRequest();
    get_task_count_xhr.open('GET', 'http://127.0.0.1:8000/api/get_task_count/', false)
    get_task_count_xhr.setRequestHeader('X-CSRFToken', csrf_token);
    get_task_count_xhr.send();
    return parseInt(get_task_count_xhr.responseText);
}

function API_get_task (id)
{
    let xhttp = new XMLHttpRequest();
    task_object = {};

    xhttp.open('GET', `http://127.0.0.1:8000/api/tasks/${id}/`, false);
    xhttp.setRequestHeader('X-CSRFToken', csrf_token);
    xhttp.send();

    return JSON.parse(xhttp.responseText);
}

function API_add_task (task_name, short_description, description)
{
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', `http://127.0.0.1:8000/api/add_task/`, false);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('X-CSRFToken', csrf_token);

    const data = {
        "task_name": task_name,
        "short_description": short_description,
        "description": description
    };
    
    xhttp.send(JSON.stringify(data));
    if (xhttp.responseText !== '')
    {
        return parseInt(xhttp.responseText);
    }
}

function API_delete_task(task_id) 
{
    xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://127.0.0.1:8000/api/delete_task/', false);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('X-CSRFToken', csrf_token);
    xhttp.send(JSON.stringify({'task_id': task_id}));
}

function API_get_tasks () 
{
    let task_count = API_get_task_count();
    let get_tasks_xhr = new XMLHttpRequest();
    
    if (visible_task_count != task_count)
    {
        if (task_number_increase + visible_task_count <= task_count) 
        {
            get_tasks_xhr.open('GET', `http://127.0.0.1:8000/api/get_tasks/?minimal_number=${visible_task_count}&maximal_number=${visible_task_count + task_number_increase}`, false);
            visible_task_count += task_number_increase;
        }
        else 
        {
            get_tasks_xhr.open('GET', `http://127.0.0.1:8000/api/get_tasks/?minimal_number=${visible_task_count}&maximal_number=${task_count}`, false);
            visible_task_count = task_count;
        }

        get_tasks_xhr.setRequestHeader('X-CSRFToken', csrf_token);
        get_tasks_xhr.send();

        return JSON.parse(get_tasks_xhr.responseText);
    }
}

/* end interaction with API */

function clear_modal_inputs (modal_element) 
{
    modal_input_fields = modal_element .querySelectorAll('.value__input');
    modal_input_fields.forEach((element) => { element.value = null; });
}

function reset_interaction_tab_information () 
{
    task_information_title.innerHTML = '<span>Hmmm</span>...';
    task_information_short_description.innerHTML = '<span>Short description:</span> No task has been selected...';
    task_information_description.innerHTML = '<span>Description:</span> It seems you haven\'t selected any task yet. Anyway, you can load them by clicking on "Load more", or create a new one!';
}

function add_task_handler (element, id) 
{
    element.addEventListener('click', (e) => 
    {
        task_object = API_get_task(id);
        task_information_title.innerHTML = '<span>Task name:</span> ' + task_object.task_name;
        task_information_short_description.innerHTML = '<span>Short description:</span> ' + task_object.short_description;
        task_information_description.innerHTML = '<span>Description:</span> ' + task_object.description;
        current_selected_task_element = element;
    });
}

function add_visible_task (id, task_name)
{
    let new_task_element = document.createElement('div');
    new_task_element.classList.add('app__task__list-task', 'text', 'get-task');
    new_task_element.setAttribute('task_id', id);
    new_task_element.innerHTML = task_name;

    scrollable_tasks_list.insertBefore(new_task_element, load_more_tasks_button);
    add_task_handler(new_task_element, id);
}

load_more_tasks_button.addEventListener('click', (e) => 
{
    let tasks = API_get_tasks();

    if (tasks != undefined)
    {
        for (const [id, task_object] of Object.entries(tasks)) add_visible_task(id, task_object.task_name);
    }
});

add_task_button.addEventListener('click', (e) => 
{
    modals.style.display = 'flex';
    overlay.style.display = 'block';
});

modal_close_buttons.forEach((element) => 
{
    element.addEventListener('click', (e) => 
    {
        modals.style.display = 'none';
        overlay.style.display = 'none';

        clear_modal_inputs(element.parentElement.parentElement);
    });
});

modal_submit_buttons.forEach((element) => 
{
    element.addEventListener('click', (e) => 
    {
        let continue_execution = true;

        modal_input_fields = element.parentElement.parentElement.querySelectorAll('.value__input');
        modal_input_fields.forEach((element) => 
        {
            let input_label = element.previousElementSibling;
            if (element.value == '' || element.value.length < 5)
            {
                console.log(1);
                input_label.classList.add('label__alert')
                continue_execution = false;
            }
            else 
            {
                input_label.classList.remove('label__alert')
            }
        })

        if (continue_execution)
        {
            let task_name = modal_input_fields[0].value;
            let short_description = modal_input_fields[1].value;
            let description = modal_input_fields[2].value;
    
            let added_task_id = API_add_task(task_name,         /* task name */
                                             short_description, /* short description */
                                             description        /* description */);
            
            if (typeof(added_task_id) == 'number')
            {
                modals.style.display = 'none';
                overlay.style.display = 'none';
                visible_task_count++;
                add_visible_task(added_task_id, task_name);
                clear_modal_inputs(element.parentElement.parentElement);
            }
            else 
            {
                console.log('error', typeof(add_task_result), added_task_id)
            }
        }
        
    });
});

complete_task_button.addEventListener('click', (e) => 
{
    current_element_id = current_selected_task_element.getAttribute('task_id');
    API_delete_task(current_element_id);
    reset_interaction_tab_information();
    current_selected_task_element.remove();
    current_selected_task_element = null;
    visible_task_count--;
});