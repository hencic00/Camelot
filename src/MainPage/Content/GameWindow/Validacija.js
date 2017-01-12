var SIRINA = 14;

// ~~~ Class Decleration Begin

function Polje(nRow, nCol, deska){
    this.row = nRow;
    this.col = nCol;
    this.znak = deska.val[nRow*SIRINA + nCol];
};

function Figura(nRow,nCol,deska){
    Polje.call(this,nRow,nCol,deska);
    this.castle;
    if(this.znak == "A" || this.znak == "a")
    {
        this.castle = "+";
    }
    else
    {
        this.castle = "-";
    }
}

function Premik(vF,vP)
{
    this.figura = vF; //figura ki se premika
    this.skokNa = vP; //polje kamor hočemo skočit
}

// ~~~ Class Decleration End

function getJumpType(figura, preskocen)
{
    if(figura.castle=="+")
    {
        if(preskocen=="B" || preskocen=="b")
        {
            return "LEAP";
        }
        else if(preskocen=="A" || preskocen=="a")
        {
            return "CANTER";            
        }
    }
    else if (figura.castle=="-")
    {
        if(preskocen=="B" || preskocen=="b")
        {
            return "CANTER";
        }
        else if(preskocen=="A" || preskocen=="a")
        {
            return "LEAP";
        }
    }
    return null;
}

function izvediPremik(figura,target,deska,dolzina,type)
{
    if(dolzina==2) //dolzina premika
    {
        if(type=="LEAP")
        {//izbrisemo preskocenega
            var preskocenLocation = (figura.row + parseInt((target.row-figura.row)/2 , 10))*SIRINA + figura.col+parseInt((target.col-figura.col)/2 , 10);
            deska.val = deska.val.substr(0, preskocenLocation) + "O" + deska.val.substr(preskocenLocation+1);
        }
    }
    //figuro premaknemo na target lokacijo
    deska.val = deska.val.substr(0, target.row*SIRINA + target.col) + figura.znak + deska.val.substr(target.row*SIRINA + target.col + 1);
    if(figura.row == 1)
    {
        deska.val = deska.val.substr(0, figura.row*SIRINA + figura.col) + "+" + deska.val.substr(figura.row*SIRINA + figura.col + 1);
        // deska.val[figura.row*SIRINA + figura.col]="+";   
    }
    else if(figura.row == 16)
    {
        deska.val = deska.val.substr(0, figura.row*SIRINA + figura.col) + "-" + deska.val.substr(figura.row*SIRINA + figura.col + 1);
        // deska.val[figura.row*SIRINA + figura.col]="-";   
    }
    else
    {
        deska.val = deska.val.substr(0, figura.row*SIRINA + figura.col) + "O" + deska.val.substr(figura.row*SIRINA + figura.col + 1);
        // deska.val[figura.row*SIRINA + figura.col]="O";
    }
}

function dobiNapadanje(figura, deska) //vrne array polj ki predstavljajo prazna mesta za neposrednimi nasprotniki
{
    var napada = new Array();
    for (var i = -1; i <= 1; ++i)
        for (var j = -1; j <= 1; ++j)
            if(i!=0 || j != 0)    //sebe ne preverjaš
            {
                var sosed = deska.val[(figura.row+i)*SIRINA + figura.col+j];
                //poglej sosede če so nasprotniki in polja neposredno za njimi
                if((sosed == "A" || sosed == "a") && figura.castle=="-")
                {   
                    var zaNasprotnikom = deska.val[(figura.row+i*2)*SIRINA + figura.col+j*2];
                    if(zaNasprotnikom == "O" || zaNasprotnikom == "+" || zaNasprotnikom == "-")
                    {
                        napada.push(new Premik(figura,new Polje(figura.row+i*2, figura.col+j*2,deska)));
                    }
                }
                else if((sosed == "B" || sosed == "b") && figura.castle=="+")
                {
                    var zaNasprotnikom = deska.val[(figura.row+i*2)*SIRINA + figura.col+j*2];    
                    if(zaNasprotnikom == "O" || zaNasprotnikom == "+" || zaNasprotnikom == "-")
                    {
                        napada.push(new Premik(figura,new Polje(figura.row+i*2, figura.col+j*2,deska)));
                    }
                }
            }
    return napada;
}

//NEEDS WORK

function validiraj(premik, deska, prevMove,prevFig,player,details,castleMoves) // 13,2>4,5  format row,col
{
    var pozicija = premik.split('>'); // 13,2      4,5
    var zacetnaPozicija =  pozicija[0].split(',');
    var koncnaPozicija = pozicija[1].split(','); // 4  5

    //premikam isto figuro?
    if(pozicija[0] != prevFig.val && prevFig.val != null)
    {
        details.val = "Premikas razlicne figure";
        return false;
    }
    //sem out of bounds?
    if(parseInt(zacetnaPozicija[0],10)>16 || parseInt(zacetnaPozicija[1],10)>12 || parseInt(koncnaPozicija[0],10)>16 || parseInt(koncnaPozicija[1],10)>12)
    {
        details.val = "Prevelike vrednosti za row ali col.";
        return false;
    }
    //premikam sploh figuro?
    var zacetniZnak = deska.val[parseInt(zacetnaPozicija[0],10)*SIRINA + parseInt(zacetnaPozicija[1],10)];
    if(zacetniZnak =="O" || zacetniZnak == "X" || zacetniZnak == "+" || zacetniZnak =="-")
    {
        //nekak cudezno catcha negativne
        details.val = "Zacetni znak ni figura";
        return false;
    }
    //lokacija zeljene pozicije
    var figura = new Figura(parseInt(zacetnaPozicija[0],10),parseInt(zacetnaPozicija[1],10),deska);
    var poljeNew = new Polje(parseInt(koncnaPozicija[0],10),parseInt(koncnaPozicija[1],10),deska);
    //premikam svojo figuro?
    if(figura.castle != player)
    {
        details.val = "Premikas nasprotnikovo figuro.";
        return false;
    }
    var mojeFig = null;
    var castleRow = null;
    var enemyCastleRow = null;
    var dummy = new Premik(figura, poljeNew); //samo za comparison v arrayu pol
    var napadamo = new Array();
    if(player=="+")
        {
            mojeFig = ["a","A"];
            castleRow = 1;
            enemyCastleRow = 16;
        }
    else
        {
            mojeFig = ["b", "B"];
            castleRow = 16;
            enemyCastleRow = 1;
        }
    //preveri če imaš figuro v svojem castlu, pol jo moreš premaknit ven
    if(mojeFig.indexOf(deska.val[SIRINA*castleRow+6]) > -1 || mojeFig.indexOf(deska.val[SIRINA*castleRow+7]) > -1)
    {
        var napadCastle = dobiNapadanje(figura,deska);
        if(figura.row != castleRow ||  figura.row==castleRow && poljeNew.row==castleRow)
        {
            details.val = "Premakni figuro iz svojega castla";
            return false;
        }
        else if(napadCastle.length > 0) //napadamo nekoga
        {
            if(napadCastle.indexOf(dummy) == -1) //DANGER
            {
                details.val = "Nekoga napadas in ga mores pobrat";
                return false;
            }
        }
    } 
    else
    {
        //preveri napadanja
        for (var i=20; i < deska.val.length-20; ++i) //koncev ploskve neboš gledal
        {
            if(mojeFig.indexOf(deska.val[i]) > -1 && i < SIRINA*enemyCastleRow && i > SIRINA*(enemyCastleRow+1))  //poglej za vsako figuro če napada koga
            {                                                                                                   //iz enemy castle ne moreš pobirat
                napadamo = napadamo.concat(dobiNapadanje(new Figura(parseInt(i/14 ,10), i%14, deska),deska));
            }
        }
        if(napadamo.length > 0)
        {
            // console.log(napadamo);
            // console.log(dummy);
            var match = false;
            for(var j=0; j < napadamo.length; ++j)
            {
                if(JSON.stringify(napadamo[j]) === JSON.stringify(dummy))
                {
                    match=true;
                    break;
                } 
            }
            if(match == false)
            {
                details.val="Nekoga napadam in ga morem pobrat";
                return false;
            }
        }
    }
    //premikamo se na prazno mesto?
    if(poljeNew.znak!="O" && poljeNew.znak!="+" && poljeNew.znak!="-")
    {
        details.val = "Out of bounds / skok na drugo figuro";
        return false; //out of bounds / odrezan rob / skok na drugo figuro
    }
    //iz enemy castle ne morem ven
    if(figura.row == enemyCastleRow)
    {
        if(poljeNew.row == enemyCastleRow)
        {
            if(castleMoves.val>1) //naredli smo ze 2 castle mova
            {
                details.val = "Porabli ste vse castle move.";
                return false;
            }
            ++castleMoves.val;
            // console.log(castleMoves);
        }
        else
        {
            details.val = "Iz enemy castle ne mores ven";
            return false;
        }
    }
    //primerna razdalja premika
    var verPremik=poljeNew.row - figura.row;
    var horPremik=poljeNew.col - figura.col;
    var dolzina = Math.max(Math.abs(horPremik),Math.abs(verPremik));
    if(dolzina == 1) //premik za 1 mesto okrog initial kvadratka
    {
        if(prevMove.val != null)
        {
            details.val = "MOVE za LEAP / CANTER / MOVE";
            return false;
        }
        else if(poljeNew.znak==figura.castle)
        {
            details.val = "MOVE v svoj castle";
            return false; //premik v svoj castle
        }
        details.val = "PRAVILNO: MOVE v enemy castle ali 'O'";
        izvediPremik(figura,poljeNew,deska,dolzina,"MOVE"); //DANGER  added
        prevMove.val = "MOVE";
        prevFig.val = pozicija[1];
        return true; //premik v enemy castle / 'O'
    }
    else if(dolzina == 2)
    {
        var valid = Math.abs(Math.abs(horPremik) - Math.abs(verPremik)); //faster & cleaner kot ročno gledanje
        if(valid==0 || valid==2 && prevMove.val!="MOVE") //smo legitimni preskok naredili?
        {
            //pogledamo kaj smo preskočili
            var preskocen = deska.val[(figura.row + parseInt(verPremik/2 ,10))* SIRINA + figura.col+parseInt(horPremik/2 ,10)];
            if(preskocen == "O")
            {
                details.val = "Preskok praznega mesta";
                return false;
            }
            var jumpType = getJumpType(figura,preskocen);
            
///////////////////////////////////   VOLATILE ///////////////////////////////////////
            if(jumpType!="LEAP" && poljeNew.znak==figura.castle)
            {
                details.val = "Ne smes v svoj castle razn tak da nekoga poberes.";
                return false;
            }
///////////////////////////////////   VOLATILE ///////////////////////////////////////
            else if(prevMove.val == null)
            {
                details.val = "PRAVILNO: \"\" v CANTER ali LEAP";
                izvediPremik(figura,poljeNew,deska,dolzina,jumpType);
                prevMove.val = jumpType;
                prevFig.val = pozicija[1];
                return true;
            }
            else if(prevMove.val == jumpType)
            { //nadaljuj s tem kaj delas
                details.val = "PRAVILNO: Nadaljuje s tam kaj dela";
                izvediPremik(figura,poljeNew,deska,dolzina,jumpType);
                prevFig.val = pozicija[1];
                return true;
            }
            else if((prevMove.val == "CANTER"|| prevMove.val == "KCHARGE") && jumpType == "LEAP" && figura.znak.charCodeAt(0)<67) //ord=ASCII
            { //knights charge;
                izvediPremik(figura,poljeNew,deska,dolzina,jumpType);
                details.val = "PRAVILNO: Knight's Charge";
                prevMove.val = "KCHARGE";
                prevFig.val = pozicija[1];
                return true;
            }
        }
    }
    details.val = "MOVE cudnih dolzin / CANTER za LEAPOM / MOVE za LEAP ali CANTER";
    return false;
    //na samega sebe se ne moreš premaknit / za leapom ne sme bit canter        
}


//NEEDS WORK

// ~ ~ ~ Testiranje


const gameBoard ={ val:
 "XXXXXXXXXXXXXX"
+"XXXXXX+bXXXXXX"
+"XXXOOOOaOOOXXX"
+"XXOOOOOOOOOOXX"
+"XOOOOOOOOOOOOX"
+"XOOOOOOOOOOOOX"
+"XOOAaaaaaaAOOX"
+"XOOOAaaaaAOOOX"
+"XOOOOOOOOOOOOX"
+"XOOOOOOOOOOOOX"
+"XOOOBbbbbBOOOX"
+"XOOBbbbbbbBOOX"
+"XOOOOOOOOOOOOX"
+"XOOOOOOOOOOOOX"
+"XXOOOOOOOOOOXX"
+"XXXOOOOOOOOXXX"
+"XXXXXX--XXXXXX"
+"XXXXXXXXXXXXXX"};
var prevMove = {val: null}; 
var prevFig = {val: null};
var details = {val: ""};
var castleMoves = {val: 1};
var result = validiraj("2,7>2,8", gameBoard, prevMove,prevFig,"+",details,castleMoves)


console.log(result +": "+details.val);
// var tmpText = gameBoard.val[0];

// for(var a=1; a<gameBoard.val.length; a++)
// {
//     if(a%14==0)
//     {
//         tmpText +="\n";
//     }
//     tmpText+=gameBoard.val[a];

// }
// console.log(tmpText);

// document.getElementById('app').innerHTML=parsedToHJN;

// document.getElementById('secondDiv').innerHTML="asd";