/*
    rps.js by Bill Weinman  <http://bw.org/contact/>
    created 2011-07-12
    updated 2012-07-28

    Copyright (c) 2011-2012 The BearHeart Group, LLC
    This file may be used for personal educational purposes as needed. 
    Use for other purposes is granted provided that this notice is
    retained and any changes made are clearly indicated as such. 
*/

var dndSupported;    // verdadeiro se "drag and drop" for suportado
var dndEls = new Array();
var draggingElement;
var winners = { 			// diz que para cada jogada, qual é a jogada adversária que ganha.
    Rock: 'Paper',
    Paper: 'Scissors',
    Scissors: 'Rock'
};

var hoverBorderStyle = '2px dashed #999';
var normalBorderStyle = '2px solid white';

function detectDragAndDrop() {			// deteta se o browser suporta "drag and drop"
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat( RegExp.$1 );
            if(rv >= 6.0) return true;
            }
        return false;
    }
    if ('draggable' in document.createElement('span')) return true;
    return false;
}

// DnD support

function handleDragStart(e) {			// trata do inicio do "drag and drop", muda o status da imagem para "a arrastar"
    var rpsType = getRPSType(this);
    draggingElement = this;
    draggingElement.className = 'moving';
    statusMessage('Drag ' + rpsType);
    this.style.opacity = '0.4';
    this.style.border = hoverBorderStyle;
    e.dataTransfer.setDragImage(getRPSImg(this), 120, 120); // pôr a imagem a arrastar

}

function handleDragEnd(e) {			// trata do final do "drag and drop"
    this.style.opacity = '1.0';

    // repor o estilo do elemento
    draggingElement.className = undefined;
    draggingElement = undefined;

    // repor todos os elementos
    for(var i = 0; i < dndEls.length; i++) {
        dndEls[i].style.border = normalBorderStyle;
    }
}

function handleDragOver(e) {
    if(e.preventDefault) e.preventDefault();
    this.style.border = hoverBorderStyle;

    return false;   // alguns browsers podem necessitar disto para prevenir ação predefinida
}

function handleDragEnter(e) {
    if(this !== draggingElement) statusMessage('Hover ' + getRPSType(draggingElement)    + ' over ' + getRPSType(this));
    this.style.border = hoverBorderStyle;
}

function handleDragLeave(e) {
    this.style.border = normalBorderStyle;
}

function handleDrop(e) {
    if(e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
    if(e.preventDefault) e.preventDefault();
    if(this.id === draggingElement.id) return;
    else isWinner(this, draggingElement);
}

// funções utilidade
function isWinner(under, over) {
    var underType = getRPSType(under);
    var overType = getRPSType(over);
    if(overType == winners[underType]) {
        statusMessage(overType + ' beats ' + underType);
        swapRPS(under, over);
    } else {
        statusMessage(overType + ' does not beat ' + underType);
    }
}

function getRPSFooter(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'footer' ) return children[i];
    }
    return undefined;
}

function getRPSImg(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'img' ) return children[i];
    }
    return undefined;
}

function getRPSType(e) {
    var footer = getRPSFooter(e);
    if(footer) return footer.innerHTML;
    else return undefined;
}

function swapRPS(a, b) {
    var holding = Object();

    holding.img = getRPSImg(a);
    holding.src = holding.img.src;
    holding.footer = getRPSFooter(a);
    holding.type = holding.footer.innerHTML;
    
    holding.img.src = getRPSImg(b).src;
    holding.footer.innerHTML = getRPSType(b);

    getRPSImg(b).src = holding.src;
    getRPSFooter(b).innerHTML = holding.type;
}

// funções de utilidade

var elStatus;
function element(id) { return document.getElementById(id); }

function statusMessage(s) {
    if(!elStatus) elStatus = element('statusMessage');
    if(!elStatus) return;
    if(s) elStatus.innerHTML = s;
    else elStatus.innerHTML = '&nbsp;';
}

// suporte vitalicio da aplicação

function init() {
    if((dndSupported = detectDragAndDrop())) {					// Se "drag and drop" for suportado, avisa que o HTML5 o irá utilizar, se não avisa que não é suportado
        statusMessage('Using HTML5 Drag and Drop');
        dndEls.push(element('rps1'), element('rps2'), element('rps3'));
        for(var i = 0; i < dndEls.length; i++) {
            dndEls[i].addEventListener('dragstart', handleDragStart, false);
            dndEls[i].addEventListener('dragend', handleDragEnd, false);
            dndEls[i].addEventListener('dragover', handleDragOver, false);
            dndEls[i].addEventListener('dragenter', handleDragEnter, false);
            dndEls[i].addEventListener('dragleave', handleDragLeave, false);
            dndEls[i].addEventListener('drop', handleDrop, false);
        }
    } else {
        statusMessage('This browser does not support Drag and Drop');
    }
}

window.onload = init;
