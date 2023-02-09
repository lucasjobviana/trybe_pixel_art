const corPadrao = ['#000000','#808080','#FFFF00','#FF0000'];
const corFundo = '#FFFFFF';

var pattern = {
    corPincel : '#000000',
    row: 5,
    collum: 5,
}


function generateColor(){
    const letters = '0123456789ABCDEF';
    let color;

    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 15)];
        }
    }while(color === '#0000000' || color === '#FFFFFF');
      
    return color;
}

function saveLStorage(name, data) {
    localStorage.setItem(name,data);
    console.info(localStorage);
}

function alterColor() {
    let colorOfPalette = document.getElementById('color-palette');
    let localStorageColors = '';
    colorOfPalette = colorOfPalette.children;

    for ( let i = 1; i < colorOfPalette.length; i += 1 ) {
        let corHexa = generateColor();
        colorOfPalette[i].style.backgroundColor  = corHexa;
        localStorageColors += corHexa + '&'
    }
    
    saveLStorage('colorPalette',localStorageColors);
}

function deselectOtherColors(indexSelected,paletteCollors){
    for ( let i=0; i < paletteCollors.length; i +=1) {
        if (i != indexSelected) {
            console.info( paletteCollors[i].classList);
            paletteCollors[i].classList.remove('selected');   
        }
    }
}

function updateColorPencil(cor) {
    let pixelBoard = document.getElementsByClassName('pixel');
    pattern.corPincel = cor;

    for (let i = 0; i < pixelBoard.length; i += 1 ){
        pixelBoard[i].addEventListener('click', function(){
            pixelBoard[i].style.backgroundColor = cor;
        });
    }
}

function definirClick(){
    let paletteCollors = document.getElementById('color-palette').children;

    for ( let i=0; i < paletteCollors.length; i +=1) {
        paletteCollors[i].addEventListener('click',function(event){
        let cor = paletteCollors[i].style.backgroundColor;console.log('esta é a cor do fundo: ',cor);
        paletteCollors[i].classList.add('selected');
        deselectOtherColors(i,paletteCollors);
        pattern.corPencil = cor;
        updateColorPencil(cor);
        console.log('Alteri patternPincel: ',pattern.corPincel);    
        });

    }
}




function pixelAdd(qtdPixel, row, matrizColor,orderPixel) {

    for(let i=0; i< qtdPixel; i +=1){
        let pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.style.backgroundColor = Array.isArray( matrizColor)  ?   matrizColor[orderPixel] : corFundo ;
        pixel.textContent = orderPixel-1;
        row.append(pixel);
        orderPixel++;
    }
    return orderPixel;
}

function pixelRowAdd(qtdRows,collum, matrizColor) {
    let pixelBoard = document.getElementById('pixel-board');
    let orderPixel = 2;
    for (let i = 0; i < qtdRows; i += 1){
        let row = document.createElement('div');
        row.className = 'row';
        pixelBoard.append(row);       
        orderPixel = pixelAdd(collum,row,matrizColor,orderPixel);
    }   
}

function createPixelMatriz(row, collum, matrizColor) {
    pixelRowAdd(row, collum, matrizColor);
}

function populaMatriz(isSave) {
    let args =  isSave.split('&');
    pattern.row = args[0];
    pattern.collum = args[1];
    console.info('Meu array salvo é:',args);

    createPixelMatriz(args[0],args[1],args);
}

window.onbeforeunload = function () {
    let matriz = analisarMatriz();
        saveLStorage('pixelBoard', matriz);
        let value = document.getElementById('board-size').value;     
 }

window.onload = function(){
    let a = localStorage.getItem('boardSize');
    let widthSave = localStorage.getItem('boardSize')==null? 5 : localStorage.getItem('boardSize') ;
    document.getElementsByClassName('color-paint')[0].style.width = (40 * widthSave)+'px';
    document.getElementsByClassName('color-paint')[0].style.height = (40 * widthSave)+'px';
    let isSave = localStorage.getItem('pixelBoard');

    if(isSave) {
        populaMatriz(isSave);
    }else {
        createPixelMatriz(pattern.row,pattern.collum);
        let value = document.getElementById('board-size').value;
        localStorage.setItem('boardSize',value);
    }
    
    updateColorPencil('#000000');
    let colors = localStorage.getItem('colorPalette');
    let colorOfPalette = document.getElementById('color-palette').children;
    /*verifica se ja tem cores salvas no storage*/
    if(colors){
        let cor = colors.split('&');
        for ( let i = 1; i < colorOfPalette.length; i += 1 ) {
            let corHexa = generateColor();
            colorOfPalette[i].style.backgroundColor  = cor[i-1];
        }
    }else{//console.info('Nao tem storage',localStorage);
        for ( let i = 0; i < colorOfPalette.length; i += 1 ) {
            let corHexa = generateColor();
            colorOfPalette[i].style.backgroundColor  = corPadrao[i];
        }
    }

    let btnClean = document.getElementById('clean-board').addEventListener('click',function(){
        updateColorPencil('#FFFFFF')
    });

    let btnClear = document.getElementById('clear-board').addEventListener('click',function(){
        document.getElementById('pixel-board').innerHTML = '';
       pixelRowAdd(pattern.row, pattern.collum);
    });

    let btnRandomColor = document.getElementById('button-random-color');
    btnRandomColor.addEventListener('click',function(){
        alterColor();
    });

    let btnPatterColor = document.getElementById('button-pattern-color');
    btnPatterColor.addEventListener('click',function(){
        localStorage.removeItem('colorPalette');
        let colorOfPalette = document.getElementById('color-palette').children;

        for ( let i = 0; i < colorOfPalette.length; i += 1 ) {
            let corHexa = generateColor();
            colorOfPalette[i].style.backgroundColor  = corPadrao[i];
        }
    });

    let btnSalvar = document.getElementById('save');
    btnSalvar.addEventListener('click',function(){
        let matriz = analisarMatriz();
        saveLStorage('pixelBoard', matriz);
    });

    let btnGerarGrid = document.getElementById('generate-board');
    btnGerarGrid.addEventListener('click',function(){
        let value = document.getElementById('board-size').value;
        if(Number.parseInt(value) > 0) {   
            if(Number.parseInt(value) <5)
             value =5;
            if(Number.parseInt(value) >50)
             value =50;
            document.getElementById('pixel-board').innerHTML = '';
            pattern.row = value;
            pattern.collum = value;
            localStorage.removeItem('pixelBoard');
            localStorage.setItem('pixelBoard',`${value}&${value}&`);
            localStorage.setItem('boardSize',value);
            createPixelMatriz(pattern.row,pattern.collum);
        }
        else {
            alert('Board inválido!');
            console.log(document.getElementById('board-size').value );
        }
    });

    definirClick();
}

function analisarMatriz() {
    let resolutin = pattern.row.toString()  + '&' + pattern.collum.toString() +'&';
    let pixels = document.getElementsByClassName('pixel');

    for( let i = 0; i < pixels.length; i += 1) {
        if(pixels[i].style.backgroundColor) {
            resolutin += pixels[i].style.backgroundColor+'&';
        }
        else {
            resolutin += '_&';
        }
    }
    console.log(resolutin);
    return resolutin;
}




