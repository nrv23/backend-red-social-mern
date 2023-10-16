const barajar = (array) => {
    let posicionActual = array.length;

    while (0 !== posicionActual) {
        const posicionAleatoria = Math.floor(Math.random() * posicionActual);
        posicionActual--;
        //"truco" para intercambiar los valores sin necesidad de una variable auxiliar
        [array[posicionActual], array[posicionAleatoria]] = [
            array[posicionAleatoria], array[posicionActual]];
    }
    return array;
}

const generarAleatorios = (cantidad) => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
    barajar(caracteres);
    return caracteres.slice(0, cantidad).join("").toUpperCase();
}

module.exports = {
    generarAleatorios
}