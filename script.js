const corPadrao = ['#000000','#808080','#FFFF00','#FF0000'];
const corFundo = '#FFFFFF';

var pattern = {
    corPincel : '#000000',
    row: 5,
    collum: 5,
}

function generateColor(){//String - Retorna uma cor hexadecimal.
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

function saveLStorage(name, data) {//Null - Salva (name = data) no localStorage.
    localStorage.setItem(name,data);//console.info(localStorage);
}

function alterColor() {// Null - Coloca cores aleatórias nas três ultimas palhetas e salva no localStorage.
    let colorOfPalette = document.getElementById('color-palette').children;
    let localStorageColors = '';

    for ( let i = 1; i < colorOfPalette.length; i += 1 ) {
        let corHexa = generateColor();
        colorOfPalette[i].style.backgroundColor  = corHexa;
        localStorageColors += corHexa + '&'
    }
    
    saveLStorage('colorPalette',localStorageColors);
}

function deselectOtherColors(indexSelected,paletteCollors){//Null - Remove selected das tres cores não selecionadas.
    for ( let i=0; i < paletteCollors.length; i +=1) {
        if (i != indexSelected) {//console.info( paletteCollors[i].classList);
            paletteCollors[i].classList.remove('selected');   
        }
    }
}

function updateColorPencil(cor) {//Null - (addEventClick) - Altera a cor pixel para a cor selecionada na paleta.
    let pixelBoard = document.getElementsByClassName('pixel');//pattern.corPincel = cor;

    for (let i = 0; i < pixelBoard.length; i += 1 ){
        pixelBoard[i].addEventListener('click', function(){
            pixelBoard[i].style.backgroundColor = cor;
            if(cor == '#000000'){
               let a =  pixelBoard[i].classList.add('whiteCursor');
              
               console.info('class:');
                console.info(a);
                
            }
            //let matriz = analisarMatriz();
            //saveLStorage('pixelBoard', matriz);  
        });
    }
}

function pixelAdd(qtdPixel, htmlRow, matrizColor,orderPixel) {//Int - Adiciona (qtdPixel*)Pixel à htmlRow --------
    for(let i=0; i< qtdPixel; i +=1){
        let pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.style.backgroundColor = Array.isArray( matrizColor)  ?   matrizColor[orderPixel] : corFundo ;
        pixel.textContent = orderPixel-1;
        htmlRow.append(pixel);
        orderPixel++;
    }
    return orderPixel;
}

function pixelRowAdd(qtdRows,qtdCollums, matrizColor) {//Null - Adiciona (qtdRows*)Row  ao #pixel-board
    let pixelBoard = document.getElementById('pixel-board');
    let orderPixel = 2;
    for (let i = 0; i < qtdRows; i += 1){
        let row = document.createElement('div');
        row.className = 'row';
        pixelBoard.append(row);       
        orderPixel = pixelAdd(qtdCollums,row,matrizColor,orderPixel);
    }   
}

function createPixelMatriz(row, collum, matrizColor) {//Null - Cria matriz (row x collum) com matriz salva ou não
    pixelRowAdd(row, collum, matrizColor);
}

function populaMatriz(isSave) {//Null - Popula nova matriz com a matriz salva no local-storage
    let args =  isSave.split('&');
    pattern.row = args[0];
    pattern.collum = args[1];
    createPixelMatriz(args[0],args[1],args);
}

function analisarMatriz() {//String - Retorna ('rows')'&'('collums')'&'cores da matriz separado por '_');
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
   
    return resolutin;
}

window.onbeforeunload = function () {//Null - Salva a matriz atual no localStorage.pixelBoard
    let matriz = analisarMatriz();
    saveLStorage('pixelBoard', matriz);    
 }

function defineClickEvents() {// start - enventClicks
    
    document.getElementById('clean-board').addEventListener('click',function(){//Cor do pincel = branco.
        updateColorPencil('#FFFFFF')
    });

    document.getElementById('clear-board').addEventListener('click',function(){//Cria nova matriz com tudo branco.
        document.getElementById('pixel-board').innerHTML = '';
       pixelRowAdd(pattern.row, pattern.collum);
    });

    document.getElementById('button-random-color').addEventListener('click',function(){//Coloca tres novas cores na palheta e salva no local storage
        alterColor();
    });

    document.getElementById('button-pattern-color').addEventListener('click',function(){//Remove a paleta salva e coloca a paleta padrão.
        localStorage.removeItem('colorPalette');
        let colorOfPalette = document.getElementById('color-palette').children;

        for ( let i = 0; i < colorOfPalette.length; i += 1 ) {
            colorOfPalette[i].style.backgroundColor  = corPadrao[i];
        }
    });

    document.getElementById('save').addEventListener('click',function(){//Salva a matriz atual no localStorage
        let matriz = analisarMatriz();
        saveLStorage('pixelBoard', matriz);
    });

    document.getElementById('generate-board').addEventListener('click',function(){//Gera e salva uma nova matriz com um novo tamanho
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


    function defineClickDotColor(){//Null - (addEventClick) - Seleciona a cor da paleta, desceleciona as outras e seta a cor do pincel.
        let paletteCollors = document.getElementById('color-palette').children;
    
        for ( let i=0; i < paletteCollors.length; i +=1) {
            paletteCollors[i].addEventListener('click',function(event){
                let cor = paletteCollors[i].style.backgroundColor;
                paletteCollors[i].classList.add('selected');
                deselectOtherColors(i,paletteCollors);
                pattern.corPencil = cor;
                updateColorPencil(cor);  
            });
        }
    }
    defineClickDotColor();
}
//final - eventClicks
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

    defineClickEvents();
} 