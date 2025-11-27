export function createField(label, type, placeholder, text = '') {
    const field = document.createElement('div');
    field.className = 'form-field';
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    const helper = document.createElement('span');
    helper.className = 'helper-text';
    helper.textContent = text;
    field.append(labelEl, input, helper);
    return { field, input, helper };
}