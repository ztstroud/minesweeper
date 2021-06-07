export function shuffle(array) {
    for(let index = 0; index < array.length; index++) {
        const endIndex = array.length - (index + 1);
        const randomIndex = Math.floor(Math.random() * (array.length - index));

        const temp = array[endIndex];
        array[endIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }

    return array;
}

export function listOfNotUndefined(array) {
    return array.filter(element => element !== undefined);
}

export function dom(tag, attributes, children) {
    const element = document.createElement(tag);

    if(attributes.id)
        element.id = attributes.id;

    if(attributes.classes)
        for(const c of listOfNotUndefined(attributes.classes))
            element.classList.add(c);

    for(const child of listOfNotUndefined(children))
        element.append(child);

    return element;
}