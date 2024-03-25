const cursor_effect_element = document.getElementById('cursor__effect');
const button_area_effect_elements = document.querySelectorAll('.button__area__effect');

let effect_area_distance = 100;

function cursor_effect(e) {
    element_width = cursor_effect_element.offsetWidth;
    element_height = cursor_effect_element.offsetHeight;
    cursor_effect_element.style.left = e.pageX - element_width / 2 + 'px';
    cursor_effect_element.style.top = e.pageY - element_height / 2 + 'px';
}

function button_area_effect (e) {
    button_area_effect_elements.forEach(function(element)
    {
        const rect = element.getBoundingClientRect()
        
        element_width = element.offsetWidth;
        element_height = element.offsetHeight;

        console.log(e.pageX, rect.left)
        
        if ((e.pageX > rect.left && e.pageX < rect.left + element_width) &&
                 (e.pageY > rect.top && e.pageY < rect.top + element_height)) {
            element.style.backgroundColor = "rgb(255, 255, 255)";
        }
        else if ((e.pageX + effect_area_distance > rect.left && e.pageX - effect_area_distance < rect.left + element_width) &&
            (e.pageY + effect_area_distance > rect.top && e.pageY - effect_area_distance < rect.top + element_height)) {
            element.style.backgroundColor = "rgb(131, 65, 65)";
        }
        else {
            element.style.backgroundColor = "rgb(58, 28, 28)";
        }
    });
}

document.addEventListener('mousemove', (e) => {
    cursor_effect(e);
    button_area_effect(e);
});